<template>
  <h1 class="text-xl text-center">{{ state.session.name }}</h1>
  <div class="flex">
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
  <div class="flex gap-4">
    <button
      @click="newNumber"
      class="focus:outline-none bg-green-500 px-32 py-4 text-white rounded-xl"
    >
      Novo Número
    </button>
    <button
      @click="state.modal = true"
      class="focus:outline-none bg-green-500 px-32 py-4 text-white rounded-xl"
    >
      Gerar cartela
    </button>
    <button
      @click="handlePrintCards"
      class="focus:outline-none bg-green-500 px-32 py-4 text-white rounded-xl"
    >
      Gerar Cartelas Impressas
    </button>
  </div>
  <section>
    <h1>Cartelas Registradas</h1>
    <div class="flex flex-wrap gap-1">
      <article v-for="card in state.cards" :key="card.id">
        <h1 class="text-sm">{{ card.owner }}</h1>
        <div class="grid grid-cols-5 w-max">
          <template v-for="row in card.numbers">
            <div
              :data-number="col"
              class="square"
              :class="{
                active: state.session.sortedNumbers.find((n) => n === col),
                free: col === 0,
              }"
              v-for="col in row"
              :key="col"
            ></div>
          </template>
        </div>
      </article>
    </div>
  </section>
  <!-- <section id="generatedCards" class="grid grid-cols-2 gap-1 w-max">
    <article v-for="card in state.generatedCards" :key="card.id">
      <div>
        <p>Bingo</p>
        <img src="../assets/qr.jpeg" />
      </div>
      <div class="bg-black px-1 py-1 gap-0.5 grid grid-cols-5 w-max text-xs">
        <template v-for="row in card.numbers">
          <div
            class="bg-white print-square"
            v-for="number in row"
            :key="number"
          >
            {{ number }}
          </div>
        </template>
      </div>
    </article>
  </section> -->
  <ModalCard v-model:visibility="state.modal" />
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { useSocket } from "../socket";
import { ICard, Session } from "../store";
import { jsPDF } from "jspdf";
import QrCode from "qrcode";
import ModalCard from "../components/ModalCard.vue";

const AdminSession = defineComponent({
  name: "AdminSession",

  components: { ModalCard },

  setup() {
    const store = useStore();
    const socket = useSocket();
    const state = reactive({
      session: store.getters.session as Session,
      generatedCards: [] as ICard[],
      cards: [] as ICard[],
      modal: false,
    });

    const useHeaders = () => {
      return {
        headers: { session: state.session.id },
      };
    };

    socket.emit("connect-session", state.session.id);

    socket.on("generated-card", (card) => state.cards.push(card));

    axios
      .get("http://localhost:8080/sessions/cards", useHeaders())
      .then((response) => (state.cards = response.data));

    const newNumber = async () => {
      const { data: number } = await axios.patch(
        "http://localhost:8080/sessions/sort",
        {},
        useHeaders()
      );

      store.commit("newSortedNumber", number);
    };

    const handlePrintCards = async () => {
      const response = await axios.post("http://localhost:8080/cards", {
        amount: 9,
      });
      state.generatedCards = response.data;
      const doc = new jsPDF("portrait", "cm", "a4");
      var iframe = document.createElement("iframe");
      doc.setLineWidth(0.01);
      doc.setFontSize(30);
      let cardPosition = 0;
      state.generatedCards.forEach((card): void => {
        let cardIndex = cardPosition++;
        const newPage = cardPosition === 5;

        if (newPage) {
          console.log("nova pagina");
          doc.addPage();
          doc.setLineWidth(0.01);
          doc.setFontSize(30);
          cardPosition = cardIndex = 0;
          cardPosition++;
        }

        const row = Math.floor(cardIndex / 2) * 10 + 2;
        const column = Math.round(cardIndex % 2) * 10 + 0.5;

        Array.from({ length: 6 }, (_, i) => i * 2).forEach((e) => {
          // Horizontal lines
          const y = row + e;
          doc.line(column, y, column + 10, y);
          // Vertical lines
          const x = column + e;
          doc.line(x, row, x, row + 10);
        });

        card.numbers.forEach((line, lineIndex) => {
          line.forEach((number, numberIndex) => {
            if (number === 0) {
              QrCode.toDataURL(card.numbers.toString(), (err, url) =>
                doc.addImage(
                  url,
                  "jpeg",
                  column + numberIndex * 2.01,
                  row + lineIndex * 2.01,
                  1.95,
                  1.95
                )
              );
            } else {
              doc.text(
                number.toString(),
                column + numberIndex * 2 + 1,
                row + lineIndex * 2 + 1.5,
                {
                  align: "center",
                }
              );
            }
          });
        });
      });
      iframe.setAttribute(
        "style",
        "position:absolute;right:0; top:0; bottom:0; height:100%; width:1000px"
      );
      document.body.appendChild(iframe);
      iframe.src = doc.output("datauristring");
      // console.log(response.data);
    };

    return { state, newNumber, handlePrintCards };
  },
});

export default AdminSession;
</script>

<style scoped>
.caraio {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
}

.square {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  margin-bottom: 2px;
  margin-right: 2px;
  width: 13px;
  height: 13px;
}

.square.free {
  background: transparent;
}

.square.active {
  @apply bg-green-600;
}

.print-square {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
