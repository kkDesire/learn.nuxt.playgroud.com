<script lang="ts" setup>
const colorMode = useColorMode()

const toggleMode = () => colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
</script>

<template>
  <button class="p-2 rounded hover:bg-active">
    <div class="i-carbon-moon dark:i-carbon-sun" @click="toggleMode" />
  </button>
</template>
