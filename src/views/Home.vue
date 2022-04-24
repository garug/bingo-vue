<template>
  <div class="min-h-screen flex justify-center items-center flex flex-col">
    <img src="../assets/logo-site.png" style="width:300px" class="mb-8" />
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Nome da sua sala"
        v-model="state.name"
        class="rounded px-4 py-3"
      />
      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-4 rounded-lg"
        >
          Iniciar Sorteio
        </button>
        <button
          type="button"
          class="bg-green-500 text-white px-4 py-4 rounded-lg"
        >
          Conectar a Sala
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const Home = defineComponent({
  name: "Home",

  setup() {
    const state = reactive({ name: "" });
    const router = useRouter();
    const store = useStore();

    const useHeaders = () => {
      return {
        headers: { session: store.getters.session.id },
      };
    };

    const handleSubmit = async () => {
      const { data: session } = await axios.post(
        "http://localhost:8080/sessions",
        {
          name: state.name,
        }
      );
      store.commit("setSession", session);
      router.push(`/sessions/${state.name}`);
    };

    const handleGenerateCard = async () => {
      const response = await axios.post(
        "http://localhost:8080/sessions/cards",
        {
          owner: 'abc',
        },
        useHeaders()
      );
      console.log(response.data);
    };

    return { handleSubmit, state };
  },
});

export default Home;
</script>
