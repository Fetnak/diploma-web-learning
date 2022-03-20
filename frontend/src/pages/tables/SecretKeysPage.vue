<template>
  <the-header header="Секретные ключи"></the-header>
  <el-button type="primary" style="margin-left: 1.2rem; margin-top: 1.125rem" @click="submitAdd()">Добавить ключ</el-button>

  <el-drawer v-model="drawer" title="Добавить ключ" :with-header="false">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Ключ" prop="key">
        <el-input v-model="form.key" :disabled="disable.key" maxlength="255" clearable></el-input>
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
            <el-table-column fixed="left" sortable prop="_key" label="Ключ" />
            <el-table-column align="center" width="150ch">
              <template #header>
                <el-input v-model="search" placeholder="Поиск" />
              </template>
              <template #default="scope">
                <el-button type="primary" :icon="Edit" circle style="margin-left: auto" @click="submitEdit(scope.row)" />
                <el-popconfirm
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
import { Edit, Delete } from "@element-plus/icons-vue";
import axios from "../../store/axios.js";
import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  components: { TheHeader },
  setup() {
    const form = reactive({
      id: null,
      key: ""
    });
    const disable = reactive({
      key: false,
      submit: false
    });
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
    const tableData = ref([]);
    const formRef = ref(null);
    const drawer = ref(false);
    const loadData = () =>
      axios
        .get("/api/v1/secret_keys")
        .then((data) => {
          tableData.value = data.data;
        })
        .catch(() => {
          ElMessage.error("Неизвестная ошибка!");
        });
    const rules = reactive({
      key: [
        {
          required: true,
          message: "Секретный ключ обязателен",
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
    const deleteRecord = (id) => {
      sendData("post", "/api/v1/secret_keys/delete", { id: id }, "Удалить не удалось!", "Запись удалена!")
    }
    const submitAdd = () => {
      form.id = null;
      form.key = "";
      drawer.value = true;
    };
    const submitEdit = (data) => {
      form.id = data._id;
      form.key = data._key;
      drawer.value = true;
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAllOff();
          if (form.id) {
            sendData("patch", "/api/v1/secret_keys", form, "Введены некорректные данные!", "Данные изменены!");
          } else {
            sendData("post", "/api/v1/secret_keys", form, "Введены некорректные данные!", "Данные добавлены!");
          }
          toggleAll();
          return true;
        }
        return false;
      });
    };
    const search = ref("");
    const filterTableData = computed(() =>
      tableData.value.filter(
        (data) => !search.value || data._key.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    onBeforeMount(() => {
      loadData();
    });

    return {
      tableData,
      drawer,
      form,
      rules,
      submitForm,
      disable,
      formRef,
      search,
      filterTableData,
      deleteRecord,
      submitAdd,
      submitEdit,
      Edit,
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
