import axios from "axios";
import { createStore } from "vuex";

export interface Store {
  session?: Session;
}

export interface Session {
  id?: string;
  name: string;
  sortedNumbers: Array<number>;
  active: boolean;
}

export interface ICard {
  id: string;
  numbers: number[][];
  owner: string;
}

const keySession = (session: Session): string => `bingo::${session.name}`;

export const store = createStore<Store>({
  state() {
    return {
      session: undefined,
    };
  },

  mutations: {
    setSession(state, payload: Session) {
      if (payload.id) localStorage.setItem(keySession(payload), payload.id);

      state.session = payload;
    },

    newSortedNumber(state, payload: number) {
      state.session?.sortedNumbers.push(payload);
    },
  },

  actions: {
    GET_SESSION: async (
      context,
      payload: string
    ): Promise<Session | undefined> => {
      const { session } = context.state;
      if (session && session.name === payload) return session;

      try {
        const session: Session = (
          await axios.get(`http://localhost:8080/sessions/${payload}`)
        ).data;
        return session;
      } catch (err) {
        console.error(err);
        return;
      }
    },
  },

  getters: {
    session: (state): Session | undefined => {
      if (!state.session) {
        console.warn("Empty session");
        return;
      }

      const id =
        state.session.id ||
        localStorage.getItem(keySession(state.session)) ||
        undefined;

      return { ...state.session, id };
    },
  },
});
