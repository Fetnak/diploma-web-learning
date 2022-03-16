import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      currentLink: "/"
    }
  },
  mutations: {
    changeLink(state, payload) {
      state.currentLink = payload;
    }
  },
  actions: {
    changeLink(context, payload) {
      context.commit('changeLink', payload);
    }
  },
  getters: {
    currentLink(state) {
      return state.currentLink;
    }
  }
});

export default {
  store
}
