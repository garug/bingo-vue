<template>
  <teleport to="body">
    <div
      v-if="visibility"
      class="w-screen h-screen flex justify-center items-center block fixed top-0"
    >
      <div class="relative z-10 bg-white rounded px-4 py-4">
        <form @submit.prevent="handleGenerateCard" class="flex flex-col gap-2">
          <input
            type="text"
            required
            placeholder="Dono da cartela"
            v-model="state.owner"
            class="rounded px-4 py-3"
          />
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-4 rounded-lg"
          >
            Gerar card
          </button>
        </form>
      </div>
      <div
        @click="$emit('update:visibility', false)"
        class="absolute z-0 bg-black bg-opacity-10 w-full h-full"
      ></div>
    </div>
  </teleport>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";

const ModalGenerateCard = defineComponent({
  name: "ModalGenerateCard",

  props: {
    visibility: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const store = useStore();
    const state = reactive({
      owner: "",
    });

    const useHeaders = () => {
      return {
        headers: { session: store.getters.session.id },
      };
    };

    const handleGenerateCard = async () => {
      const response = await axios.post(
        "http://localhost:8080/sessions/cards",
        {
          owner: state.owner,
        },
        useHeaders()
      );
      console.log(response.data);
    };

    return { state, handleGenerateCard };
  },
});

export default ModalGenerateCard;
</script>
