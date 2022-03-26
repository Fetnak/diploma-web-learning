<template>
  <base-form header="Регистрация">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Логин" prop="login">
        <el-input v-model="form.login" :disabled="disable.login" maxlength="255" clearable></el-input>
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <el-input v-model="form.password" :disabled="disable.password" maxlength="128" type="password"></el-input>
      </el-form-item>
      <el-form-item label="Имя" prop="name">
        <el-input v-model="form.name" :disabled="disable.name" maxlength="255" clearable></el-input>
      </el-form-item>
      <el-form-item label="Электронная почта" prop="email">
        <el-input v-model="form.email" :disabled="disable.email" maxlength="255" clearable></el-input>
      </el-form-item>
      <el-form-item label="Группы" prop="group">
        <el-select v-model="form.group" placeholder="Выберите группу" :disabled="disable.group" clearable style="width: 100%">
          <el-option
            v-for="group in groups"
            :key="group._id"
            :label="group._name"
            :value="group._id"
            @click="selectGroup(group._id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Роль" prop="role">
        <el-select v-model="form.role" placeholder="Выберите роль" :disabled="disable.role" style="width: 100%">
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" @click="selectRole(role.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="Секретный ключ" prop="secret_key">
        <el-input v-model="form.secret_key" :disabled="disable.secret_key" maxlength="255" type="password" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div style="margin-left: 0; margin-right: auto">
          <el-button type="primary" :loading="disable.submit" @click="submitForm()">Зарегистрироваться</el-button>
          <router-link to="/auth" custom v-slot="{ navigate }">
            <el-button @click="navigate">Войти в аккаунт</el-button>
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
      password: "",
      name: "",
      email: "",
      group_id: "",
      role: "",
      secret_key: ""
    });
    const disable = reactive({
      login: false,
      password: false,
      name: false,
      email: false,
      group: false,
      role: false,
      secret_key: false,
      submit: false
    });
    const groups = ref([]);
    const roles = ref([
      { id: "administrator", name: "Администратор" },
      { id: "teacher", name: "Преподаватель" },
      { id: "student", name: "Студент" }
    ]);

    const loadGroups = () => {
      axios({ method: "get", url: "/api/v1/group" })
        .then((data) => {
          return (groups.value = data.data);
        })
        .catch((error) => {
          return error;
        });
    };
    const toggleAll = () => {
      Object.keys(disable).forEach((key) => {
        disable[key] = !disable[key];
      });
    };
    const sendData = () => {
      axios
        .post("/api/v1/signup", form)
        .then(() => {
          router.push("/auth");
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            ElMessage.error("Введены некорректные данные!");
            toggleAll();
            return;
          }
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const selectGroup = (group) => {
      form.group_id = group;
    };
    const selectRole = (role) => {
      form.role = role;
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
      login: [{ required: true, message: "Логин обязателен", trigger: "blur" }],
      password: [{ required: true, message: "Пароль обязателен", trigger: "blur" }],
      name: [{ required: true, message: "Имя обязателено", trigger: "blur" }],
      email: [{ required: true, message: "Электронная почта обязателена", trigger: "blur" }],
      role: [{ required: true, message: "Роль обязателена", trigger: "blur" }],
      secret_key: [{ required: true, message: "Секретный ключ обязателен", trigger: "blur" }]
    });

    onBeforeMount(() => {
      try {
        axios({
          method: "get",
          url: "/api/v1/auth/check"
        }).then((data) => {
          if (data.data.authorized) {
            router.replace("/");
          } else {
            loadGroups();
          }
        });
      } catch (error) { error }
    });
    return { formRef, form, rules, submitForm, sendData, toggleAll, disable, groups, roles, selectGroup, selectRole };
  }
};
</script>

<style scoped></style>
