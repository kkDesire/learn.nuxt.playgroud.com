<!-- eslint-disable no-console -->
<script setup lang="ts">
// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'

const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()
const stream = ref<ReadableStream>()
const isDragging = usePanelDragging()
const panelSizeEditor = useLocalStorage('nuxt-playground-panel-editor', 30)
const panelSizeFrame = useLocalStorage('nuxt-playground-panel-frame', 30)
const panelSizeTerminal = useLocalStorage('nuxt-playground-panel-terminal', 30)

async function startDevServer() {
  const tree = globalFilesToWebcontainerFs(
    '../templates/basic/',
    import.meta.glob([
      '../templates/basic/**/*.*',
      '!**/node_modules/**',
    ], {
      query: 'raw',
      eager: true,
      import: 'default',
    }),
  )

  const wc = await useWebContainer()

  wc.on('server-ready', (port, url) => {
    status.value = 'ready'
    wcUrl.value = url
  })

  wc.on('error', (err) => {
    status.value = 'error'
    error.value = err
  })

  status.value = 'mount'

  await wc.mount(tree)

  status.value = 'install'

  const installProcess = await wc.spawn('pnpm', ['install'])
  stream.value = installProcess.output
  const installExitCode = await installProcess.exit

  if (installExitCode !== 0) {
    status.value = 'error'
    error.value = {
      message: `Unable to run npm install, exit as ${installExitCode}`,
    }
    throw new Error('Unable to run npm install')
  }

  status.value = 'start'
  const devProcess = await wc?.spawn('pnpm', ['run', 'dev'])
  stream.value = devProcess.output

  // In dev, when doing HMR, we kill the previous process reussing same WebConatiner
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      devProcess.kill()
    })
  }
}

watchEffect(() => {
  if (iframe.value && wcUrl.value)
    iframe.value.src = wcUrl.value
})

function startDragging() {
  isDragging.value = true
}

function endDragging(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEditor.value = e[0].size
  panelSizeFrame.value = e[1].size
  panelSizeTerminal.value = e[2].size
}

onMounted(startDevServer)
</script>

<template>
  <Splitpanes
    horizontal
    max-h-full
    w-full
    of-hidden
    relative
    @resize="startDragging"
    @resized="endDragging"
  >
    <Pane :size="panelSizeEditor" min-size="10">
      [This is the editor]
    </Pane>
    <Pane :size="panelSizeFrame" min-size="10">
      <iframe
        v-show="status === 'ready'"
        ref="iframe"
        w-full h-full
        :class="{
          'pointer-events-none': isDragging,
        }"
      />
      <div
        v-if="status !== 'ready'"
        flex="~ col items-center justify-center"
        h-full
        capitalize
        text-lg
      >
        <div i-svg-spinners-tadpole />
        {{ status }}ing...
      </div>
    </Pane>

    <Pane :size="panelSizeTerminal">
      <TerminalOutput :stream="stream" />
    </Pane>
  </Splitpanes>
</template>
