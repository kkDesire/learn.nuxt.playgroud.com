<template>
  <nav px6 py3 text-lg border="b base" flex="~ gap-2 items-center">
    <NuxtLink to="/" flex="~ gap-2 items-center">
      <NuxtLogo h-1.3em mt--1.8 />
      <span text-xl>Playground</span>
    </NuxtLink>
    <div flex-auto />
    <ColorShemaToggle />
    <NuxtLink
      href="https://github.com/nuxt/learn.nuxt.com"
      target="_blank" p2
      rounded
      hover="bg-active"
      text-2xl
    >
      <div i-carbon-logo-github />
    </NuxtLink>
  </nav>
</template>
