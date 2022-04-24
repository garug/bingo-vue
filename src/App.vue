<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #e0dcdc;
}

.number-block {
  @apply text-white;
  @apply bg-green-600;
  @apply rounded-full;
  @apply items-center;
  @apply justify-center;
  @apply font-bold;
  font-size: calc(1vmax + 16px);
  width: 10vmin;
  height: 10vmin;
  min-width: 80px;
  min-height: 80px;
  display: flex;
}

.number-container:first-of-type .number-block {
  width: 20vmin;
  height: 20vmin;
  font-size: calc(2vmax + 16px);
}

.individual-number {
  @apply px-4;
  @apply py-2;
  @apply text-white;
  @apply text-xl;
  @apply bg-gray-700;
  @apply rounded;
  @apply font-bold;
  @apply flex;
  @apply justify-center;
  @apply items-center;
}

.individual-number.active {
  @apply bg-green-600;
}
</style>
