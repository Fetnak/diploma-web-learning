<template>
  <base-form header="Авторизация">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Логин" prop="login">
        <el-input v-model="form.login" :disabled="disable.login" maxlength="255" clearable></el-input>
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <el-input v-model="form.password" :disabled="disable.password" maxlength="128" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button type="primary" :loading="disable.submit" @click="submitForm()">Войти</el-button>
          <router-link to="/register" custom v-slot="{ navigate }">
            <el-button @click="navigate">Зарегистрироваться</el-button>
          </router-link>
        </div>
      </el-form-item>
    </el-form>
  </base-form>
</template>

<script>
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import BaseForm from "../../components/ui/BaseForm.vue";

import axios from "../../store/axios.js";

export default {
  components: { BaseForm },
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
          message: "Логин обязателен",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "Пароль обязателен",
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
        error;
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
