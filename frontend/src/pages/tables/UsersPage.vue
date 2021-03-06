<template>
  <the-header header="Пользователи"></the-header>
  <el-button type="primary" style="margin-left: 1.2rem; margin-top: 1.125rem" @click="submitAdd()">
    Добавить пользователя
  </el-button>
  <el-switch
    v-model="activated"
    size="large"
    active-text="Отобразить отключенные аккаунты"
    style="margin-left: 1rem; margin-top: 1rem"
    @click="loadData()"
  />
  <el-drawer v-model="drawer" title="Добавить пользователя" :with-header="false">
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
      <el-form-item label="Группы" prop="group_id">
        <el-select
          v-model="form.group_id"
          placeholder="Выберите группу"
          :disabled="disable.group_id"
          clearable
          style="width: 100%"
        >
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
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button type="primary" :loading="disable.submit" @click="submitForm()">Подтвердить</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-container>
    <el-container>
      <el-main style="border-right: none">
        <el-scrollbar>
          <el-table :data="filterTableData" border stripe highlight-current-row style="width: 100%">
            <el-table-column fixed="left" sortable prop="_login" label="Логин" />
            <el-table-column sortable prop="_name" label="Имя пользователя" />
            <el-table-column sortable prop="email" label="Электронная почта" />
            <el-table-column sortable prop="group" label="Группа" />
            <el-table-column sortable prop="role" label="Роль">
              <template #default="scope">
                <el-tag :type="success" disable-transitions>
                  {{
                    scope.row.role === "administrator"
                      ? "Администратор"
                      : scope.row.role === "teacher"
                      ? "Преподаватель"
                      : "Студент"
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150ch">
              <template #header>
                <el-input v-model="search" placeholder="Поиск" />
              </template>
              <template #default="scope">
                <el-button type="primary" :icon="Edit" circle style="margin-left: auto" @click="submitEdit(scope.row)" />
                <el-popconfirm
                  confirm-button-text="Да"
                  cancel-button-text="Нет"
                  :title="deactivateMessage()"
                  @confirm="deactivateRecord(scope.row._id)"
                >
                  <template #reference>
                    <el-button type="warning" :icon="Switch" circle style="margin-rightleft: auto" />
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-if="activated"
                  confirm-button-text="Да"
                  cancel-button-text="Нет"
                  title="Вы хотите удалить запись?"
                  @confirm="deleteRecord(scope.row._id)"
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" circle style="margin-rightleft: auto" />
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { Edit, Switch, Delete } from "@element-plus/icons-vue";
import axios from "../../store/axios.js";
import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  components: { TheHeader },
  setup() {
    const activated = ref(false);
    const form = reactive({
      id: null,
      login: "",
      password: "",
      name: "",
      email: "",
      group_id: "",
      group: "",
      role: "",
      activated: !activated.value
    });
    const disable = reactive({
      login: false,
      password: false,
      name: false,
      email: false,
      group_id: false,
      role: false,
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
    const toggleAllOff = () => {
      Object.keys(disable).forEach((key) => {
        disable[key] = false;
      });
    };
    const deactivateMessage = () => {
      return activated.value ? `Вы хотите активировать запись?` : `Вы хотите отключить запись?`;
    };
    const tableData = ref([]);
    const formRef = ref(null);
    const drawer = ref(false);
    const loadData = () =>
      axios
        .post("/api/v1/users/read", { activated: !activated.value })
        .then((data) => {
          tableData.value = data.data;
        })
        .catch(() => {
          ElMessage.error("Неизвестная ошибка!");
        });
    const rules = reactive({
      login: [
        {
          required: true,
          message: "Логин обязателен",
          trigger: "blur"
        }
      ],
      name: [
        {
          required: true,
          message: "Имя пользователя обязательно",
          trigger: "blur"
        }
      ],
      email: [
        {
          required: true,
          message: "Электронная почта обязательно",
          trigger: "blur"
        }
      ],
      group_id: [
        {
          required: true,
          message: "Группа обязательна",
          trigger: "blur"
        }
      ],
      role: [
        {
          required: true,
          message: "Роль обязательна",
          trigger: "blur"
        }
      ]
    });
    const sendData = (method, url, data, errorMSG, success) => {
      axios({ method: method, url: url, data: data })
        .then(() => {
          ElMessage.success(success);
          loadData();
          toggleAll();
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            ElMessage.error(errorMSG);
            return;
          }
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const deactivateRecord = (id) => {
      sendData(
        "post",
        "/api/v1/user/deactivate",
        { id: id, activated: activated.value },
        "Отключить не удалось!",
        activated.value ? "Запись активирована!" : "Запись отключена!"
      );
    };
    const deleteRecord = (id) => {
      sendData("post", "/api/v1/user/delete", { id: id }, "Удалить не удалось!", "Запись удалена!");
    };
    const submitAdd = () => {
      if (groups.value.length == 0) loadGroups();
      toggleAllOff();
      form.id = null;
      form.login = "";
      form.password = "";
      form.name = "";
      form.email = "";
      form.group_id = "";
      form.role = "";
      drawer.value = true;
    };
    const submitEdit = (data) => {
      if (groups.value.length == 0) loadGroups();
      console.log(data);
      form.id = data._id;
      form.login = data._login;
      disable.login = true;
      form.password = "";
      form.name = data._name;
      form.email = data.email;
      form.group_id = data.group_id;
      form.role = data.role;
      drawer.value = true;
    };
    const selectGroup = (group_id) => {
      form.group_id = group_id;
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAllOff();
          if (form.id) {
            sendData("patch", "/api/v1/user", form, "Введены некорректные данные!", "Данные изменены!");
          } else {
            sendData("post", "/api/v1/user", form, "Введены некорректные данные!", "Данные добавлены!");
          }
          toggleAll();
          return true;
        }
        return false;
      });
    };
    const search = ref("");
    const filterTableData = computed(() =>
      tableData.value.filter((data) => {
        return (
          !search.value ||
          data._login.concat(data._name, data.email, data.group, data.role).toLowerCase().includes(search.value.toLowerCase())
        );
      })
    );
    onBeforeMount(() => {
      loadData();
    });

    return {
      groups,
      roles,
      tableData,
      drawer,
      form,
      activated,
      rules,
      deactivateMessage,
      selectGroup,
      submitForm,
      disable,
      formRef,
      search,
      filterTableData,
      loadData,
      deactivateRecord,
      deleteRecord,
      submitAdd,
      submitEdit,
      Edit,
      Switch,
      Delete
    };
  }
};
</script>

<style>
.workingarea {
  justify-content: center;
}
</style>
