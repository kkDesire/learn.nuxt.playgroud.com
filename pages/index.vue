<script lang="ts" setup>
// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'

const isDragging = usePanelDragging()
const leftSize = useLocalStorage('nuxt-playground-panel-left', 30)

function start() {
  isDragging.value = true
}

function end(e: { size: number }[]) {
  isDragging.value = false
  leftSize.value = e[0].size
}
</script>

<template>
  <Splitpanes class="h-full of-hidden" @resize="start" @resized="end">
    <Pane :size="leftSize" min-size="10">
      <article class="p4 prose">
        <ContentDoc />
      </article>
    </Pane>
    <Pane>
      <ThePlayground />
    </Pane>
  </Splitpanes>
</template>
