<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <div
      class="flex justify-between items-center px-4 py-4 flex-1"
      v-if="state.session"
    >
      <p class="text-center flex-1 text-2xl font-bold">Últimos números</p>
      <div
        class="number-container flex flex-1 items-center justify-center"
        v-for="number in 5"
        :key="number"
      >
        <p
          v-if="[...state.session.sortedNumbers].reverse()[number - 1]"
          class="number-block h-full"
        >
          {{ [...state.session.sortedNumbers].reverse()[number - 1] }}
        </p>
      </div>
    </div>
    <div class="bg-gray-600 px-4 py-4" v-if="state.session">
      <div
        class="numbers grid gap-2 grid-cols-9 h-full auto-rows-fr grid-flow-row"
      >
        <div
          v-for="number in 90"
          :key="number"
          class="individual-number"
          :class="{
            active: state.session.sortedNumbers.find((e) => e === number),
          }"
        >
          <p class="">{{ number }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { useSocket } from "../socket";

import { Session, Store } from "../store";

const Session = defineComponent({
  name: "Session",

  setup() {
    const store = useStore<Store>();

    const state = reactive({
      session: store.getters.session as Session,
    });

    const socket = useSocket();

    socket.emit("connect-session", state.session.name);

    socket.on("sorted-number", (number: number) =>
      state.session.sortedNumbers.push(number)
    );

    return { state };
  },
});

export default Session;
</script>
