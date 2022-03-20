<template>
  <the-header header="Файлы"></the-header>
  <label style="margin-left: 1.2rem; margin-top: 1.125rem">
    Выберите файл
    <input type="file" id="file" ref="file" style="margin-left: 1.2rem; margin-top: 1.125rem" @change="onChangeFileUpload()" />
  </label>
  <el-button type="primary" style="margin-left: 1.2rem" @click="submitUpload">Загрузить файл</el-button>
  <el-drawer v-model="drawer" title="Загрузить файл" :with-header="false">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Название файла" prop="name">
        <el-input v-model="form.name" :disabled="disable.name" maxlength="255" clearable></el-input>
      </el-form-item>
      <el-switch
        v-model="form.public"
        size="large"
        active-text="Сделать файл общедоступным"
        style="margin-left: 1rem; margin-top: 1rem"
      />
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
            <el-table-column fixed="left" sortable prop="_name" label="Название файла" />
            <el-table-column prop="_public" label="Доступность" width="200">
              <template #default="scope">
                <el-tag :type="scope.row._public ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row._public ? "Открыт" : "Закрыт" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150ch">
              <template #header>
                <el-input v-model="search" placeholder="Поиск" />
              </template>
              <template #default="scope">
                <el-button type="success" :icon="Download" circle @click="DownloadFile(scope.row)" />
                <el-button type="primary" :icon="Edit" circle @click="submitEdit(scope.row)" />
                <el-popconfirm
                  confirm-button-text="Да"
                  cancel-button-text="Нет"
                  title="Вы хотите удалить файл?"
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
import { Download, Edit, Delete } from "@element-plus/icons-vue";
import axios from "../../store/axios.js";
//import originAxios from "axios";
import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  data() {
    return {
      file: ""
    };
  },
  methods: {
    submitUpload() {
      const formData = new FormData();
      formData.append("file", this.file);
      axios
        .post("/api/v1/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          ElMessage.success("Файл успешно загружен!");
        })
        .catch(() => {
          ElMessage.error("Не удалось загрузить файл!");
        });
    },
    onChangeFileUpload() {
      this.file = this.$refs.file.files[0];
    }
  },
  components: { TheHeader },
  setup() {
    const form = reactive({
      id: null,
      name: "",
      public: false
    });
    const disable = reactive({
      name: false,
      public: false,
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
        .get("/api/v1/files")
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
    const DownloadFile = (fileInfo) => {
      axios({ method: "post", url: "/api/v1/file/download", data: { id: fileInfo._id }, responseType: "blob" })
        .then((res) => {
          ElMessage.success("Файл загружается");
          const blob = new Blob([res.data], { type: fileInfo.mimetype });
          const docUrl = document.createElement("a");
          docUrl.href = URL.createObjectURL(blob);
          docUrl.setAttribute("download", fileInfo._name);
          document.body.appendChild(docUrl);
          docUrl.click();
          URL.revokeObjectURL(docUrl.href);
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            ElMessage.error("Не удалось загрузить файл");
            return;
          }
          ElMessage.error("Неизвестная ошибка!");
        });
    };
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
      sendData("post", "/api/v1/file/delete", { id: id }, "Удалить не удалось!", "Файл удален!");
    };
    const submitEdit = (data) => {
      form.id = data._id;
      form.name = data._name;
      form.public = data._public;
      drawer.value = true;
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAllOff();
          sendData("patch", "/api/v1/file", form, "Введены некорректные данные!", "Данные изменены!");
          toggleAll();
          return true;
        }
        return false;
      });
    };
    const search = ref("");
    const filterTableData = computed(() =>
      tableData.value.filter((data) => !search.value || data._key.toLowerCase().includes(search.value.toLowerCase()))
    );
    onBeforeMount(() => {
      loadData();
    });

    return {
      loadData,
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
      submitEdit,
      Download,
      Edit,
      Delete,
      DownloadFile
    };
  }
};
</script>

<style>
.workingarea {
  justify-content: center;
}
</style>
