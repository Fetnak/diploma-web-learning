import axios from "../../axios.js"

let timer;

export default {
  async check() {
    console.log(JSON.stringify(localStorage.getItem("authData")))
    await axios({
      method: "post",
      url: "/api/v1/auth/check",
      data: {
        authData: JSON.parse(localStorage.getItem("authData"))
      }
    }).then(function (response) {
        console.log("TEST" + JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("TEST e" + error);
      });
  },
  async login(context, payload) {
    return context.dispatch("auth", payload);
  },
  async auth(context, payload) {
    await axios({
      method: "post",
      url: "/api/v1/auth",
      data: {
        email: payload.email,
        password: payload.password,
      },
    })
      .then(async function (response) {
        console.log("FUUUUCK" + JSON.stringify(response.data));
        if (response.data.error) 
          throw new Error();

        localStorage.setItem("authData", JSON.stringify({
          token: response.data.token,
          userId: response.data.id,
          tokenExpiration: response.data.tokenExpiration,
          role: response.data.role,
          isAuth: response.data.isAuth
        }));

        context.commit("setUser", {
          token: response.data.token,
          userId: response.data.token,
        });
      })
      .catch(function (error) {
        console.log("UNIQUE ID 1234" + error);
        error = new Error(
          error.message || "Failed to authenticate. Check your login data."
        );
        throw error;
      });
  },
  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);

    if (token && userId) {
      context.commit("setUser", {
        token: token,
        userId: userId,
      });
    }
  },
  logout(context) {
    localStorage.removeItem("authData");

    clearTimeout(timer);

    context.commit("setUser", {
      token: null,
      userId: null,
    });
  },
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },
};
