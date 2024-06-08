<!-- eslint-disable no-console -->
<script setup lang="ts">
const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()
const stream = ref<ReadableStream>()

async function startDevServer() {
  const tree = globalFilesToWebcontainerFs(
    '../templates/nitro/',
    import.meta.glob([
      '../templates/nitro/**/*.*',
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
  console.log('Treeeeeee', tree)

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

onMounted(startDevServer)
</script>

<template>
  <div max-h-full w-full grid="~ rows-[3fr_1fr]" of-hidden relative>
    <iframe v-show="status === 'ready'" ref="iframe" w-full h-full />
    <div
      v-if="status !== 'ready'"
      flex="~ col items-center justify-center "
      capitalize
      text-lg
    >
      <div i-svg-spinners-tadpole />
      {{ status }}ing...
    </div>
    <TerminalOutput :stream="stream" />
  </div>
</template>
