import axios from "../axios.js";

const store = {
  state: {
    UserName: undefined
  },
  getters: {
    getUserName(state) {
      return {
        UserName: state.UserName
      };
    }
  },
  mutations: {
    setUserName(state, payload) {
      state.UserName = payload.name;
    },
    getUserName(state) {
      axios
        .get("/api/v1/user")
        .then((data) => {
          state.UserName = data.data._name;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  actions: {
    logout() {
      axios({
        method: "get",
        url: "/api/v1/auth/logout"
      });
    },
    getUserName(context) {
      context.commit("getUserName");
    },
    setUserName(context, payload) {
      context.commit("setUserName", payload);
    }
  }
};

export default store;
