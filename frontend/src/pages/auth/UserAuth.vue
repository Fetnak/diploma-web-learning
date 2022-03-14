<template>
  <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
    <el-form-item label="Логин" prop="login">
      <el-input
        v-model="form.login"
        :disabled="disable.login"
        maxlength="32"
        show-word-limit
        clearable
        style="max-width: 132ch"
      ></el-input>
    </el-form-item>
    <el-form-item label="Пароль" prop="password">
      <el-input
        v-model="form.password"
        :disabled="disable.password"
        maxlength="32"
        type="password"
        show-password
        style="max-width: 132ch"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <div style="margin-left: 0; margin-right: auto">
        <el-button type="primary" :loading="disable.submit" @click="submitForm()">Войти</el-button>
        <router-link to="/register" custom v-slot="{ navigate }">
          <el-button @click="navigate">Зарегистрироваться</el-button>
        </router-link>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import axios from "../../store/axios.js";

export default {
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const form = reactive({
      login: "",
      password: ""
    });
    const disable = reactive({
      login: false,
      password: false,
      submit: false
    });
    const toggleAll = () => {
      Object.keys(disable).forEach((key) => {
        disable[key] = !disable[key];
      });
    };
    const sendData = () => {
      axios
        .post("/api/v1/auth", { login: form.login, password: form.password })
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            ElMessage.error("Введены некорректные данные!");
            toggleAll();
            return;
          }
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAll();
          sendData();
          return true;
        }
        return false;
      });
    };
    const rules = reactive({
      login: [
        {
          required: true,
          message: "Пожалуйста, укажите логин",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "Пожалуйста, укажите пароль",
          trigger: "blur"
        }
      ]
    });

    onBeforeMount(() => {
      try {
        axios({
          method: "get",
          url: "/api/v1/auth/check"
        }).then((data) => {
          if (data.data.authorized) {
            router.replace("/");
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
    return {
      formRef,
      form,
      rules,
      submitForm,
      sendData,
      toggleAll,
      disable
    };
  }
};
</script>

<style scoped></style>
