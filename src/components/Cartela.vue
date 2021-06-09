<template>
  <div class="container">
    <div class="row">
      <p class="item" v-for="number in data" :key="number">{{ number }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const Cartela = defineComponent({
  name: "Cartela",

  setup() {
    const data = [
      23,
      47,
      72,
      46,
      65,
      92,
      54,
      63,
      93,
      17,
      89,
      40,
      0,
      75,
      91,
      24,
      37,
      88,
      87,
      52,
      26,
      51,
      29,
      97,
      74,
    ];

    return { data };
  },
});

export default Cartela;
</script>

<style lang="scss" scoped>
.container {
  border: 1px solid #ccc;
  border-bottom: transparent;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.item {
  margin: 0;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
</style>
