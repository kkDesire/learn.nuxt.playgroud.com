<script lang="ts" setup>
const { x, y } = useMouse();
const color = useColorMode();

function toggleDark() {
  color.value = color.value === "dark" ? "light" : "dark";
}
</script>
<template>
  <div class="text-red">
    Hello World: {{ x }}, {{ y }}
    <button @click="toggleDark">{{ color.value }}</button>
  </div>
</template>
