<template>
  <div>
    <base-dialog :show="!!error" title="Ошибка!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Авторизация..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <h2>Войти в аккаунт</h2>
        <div class="form-control">
          <label for="login">Имя пользователя</label>
          <input type="login" id="login" v-model.trim="login" />
        </div>
        <div class="form-control">
          <label for="password">Пароль</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">Неверно введен логин или пароль.</p>
        <base-button type="button" @click="submitForm">Войти</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import axios from "../../store/axios.js"

export default {
  data() {
    return {
      login: "",
      password: "",
      formIsValid: true,
      isLoading: false,
      error: null,
    };
  },
  computed: {},
  methods: {
    async submitForm() {
      this.formIsValid = true;
      if (
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;

      const actionPayload = {
        login: this.login,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", actionPayload);
        this.$router.replace("/");
      } catch (err) {
        this.error = err.message || "Failed to authenticate, try later.";
      }

      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  beforeMount() {
    try {
      axios({
        method: "get",
        url: "/api/v1/auth/check"
      }).then((data) => {
        if (data.data.authorized) {
        this.$router.replace("/");
      }
    });
    }
    catch (error) {
      console.log(error);
    }
      
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  /* background-color: #faf6ff; */
  outline: none;
}
</style>
