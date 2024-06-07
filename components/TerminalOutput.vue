<script setup lang="ts">
import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'

const props = defineProps<{
  stream?: ReadableStream
}>()

const root = ref<HTMLDivElement>()
const terminal = new Terminal()
const fiAddon = new FitAddon()
terminal.loadAddon(fiAddon)

watch(
  () => props.stream,
  (s: any) => {
    if (!s)
      return
    const reader = s.getReader()
    function read() {
      reader.read().then(({ done, value }: any) => {
        terminal.write(value)
        if (!done)
          read()
      })
    }
    read()
  },
  { flush: 'sync', immediate: true },
)
onMounted(
  () => {
    terminal.open(root.value!)
  },
)
</script>

<template>
  <div ref="root" />
</template>

<style scoped></style>
