import axios from "../axios.js";

const store = {
  state: {
    UserName: null,
    UserRole: null
  },
  getters: {
    getUserData(state) {
      return {
        UserName: state.UserName,
        UserRole: state.UserRole
      };
    }
  },
  mutations: {
    getUserData(state) {
      axios
        .get("/api/v1/user")
        .then((data) => {
          state.UserName = data.data._name;
          state.UserRole = data.data.role;
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
    getUserData(context) {
      context.commit("getUserData");
    },
  }
};

export default store;
