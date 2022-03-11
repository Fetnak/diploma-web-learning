import axios from "../../axios.js"

export default {
  async login(context, payload) {
    return context.dispatch("auth", payload);
  },
  async auth(context, payload) {
    console.log("mishagay"+JSON.stringify(context))
    await axios({
      method: "post",
      url: "/api/v1/auth",
      data: {
        login: payload.login,
        password: payload.password,
      },
    })
      .then(async function (response) {
        if (response.data.error) 
          throw new Error();
      })
      .catch(function (error) {
        error = new Error(
          // error.message || "Не удалось войти в аккаунт. Проверьте введенные данные."
          "Не удалось войти в аккаунт. Проверьте введенные данные."
        );
        throw error;
      });
  },
  logout() {
    axios({
      method: "get",
      url: "/api/v1/auth/logout",
    })
  },
};
