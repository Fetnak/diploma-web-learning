<template>
  <the-header header="Учебные материалы"></the-header>
  <el-button v-if="backButtonVisible()" :icon="Back" type="primary" style="margin-left: 1.2rem; margin-top: 1.125rem" @click="selectPreviousFolder()">
    Назад
  </el-button>
  <el-button v-if="Role !== 'student'" type="primary" style="margin-left: 1.2rem; margin-top: 1.125rem" @click="submitAdd()">
    Добавить документ
  </el-button>
  <el-drawer v-model="drawer" title="Добавить документ" :with-header="false">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Название документа" prop="name">
        <el-input v-model="form.name" :disabled="disable.name" maxlength="255" clearable></el-input>
      </el-form-item>
      <el-form-item label="Дисциплина" prop="subject_id">
        <el-select
          v-model="form.subject_id"
          placeholder="Выберите дисциплину"
          :disabled="disable.subject_id"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="subject in subjects"
            :key="subject._id"
            :label="subject._name"
            :value="subject._id"
            @click="selectSubject(subject._id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Группа" prop="group_id">
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
      <el-form-item label="Файл" prop="file_id">
        <el-select v-model="form.file_id" placeholder="Выберите файл" :disabled="disable.file_id" clearable style="width: 100%">
          <el-option v-for="file in files" :key="file._id" :label="file._name" :value="file._id" @click="selectFile(file._id)" />
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
          <el-table
            :data="filterTableData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            table-layout="auto"
            @cell-dblclick="selectFolder"
          >
            <el-table-column fixed="left" sortable prop="_name" label="Название документа" />
            <el-table-column sortable prop="subject_name" label="Дисциплина" />
            <el-table-column sortable prop="group_name" label="Группа" />
            <el-table-column align="center" width="150ch">
              <template #header>
                <el-input v-model="search" placeholder="Поиск" />
              </template>
              <template #default="scope">
                <el-button
                  v-if="scope.row.file_id"
                  type="success"
                  :icon="Download"
                  circle
                  style="margin-left: auto"
                  @click="DownloadFile(scope.row)"
                />
                <el-button
                  v-if="Role !== 'student'"
                  type="primary"
                  :icon="Edit"
                  circle
                  style="margin-rightleft: auto"
                  @click="submitEdit(scope.row)"
                />
                <el-popconfirm
                  v-if="Role !== 'student'"
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
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { Download, Edit, Delete, Back } from "@element-plus/icons-vue";
import axios from "../../store/axios.js";
import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  components: { TheHeader },
  setup() {
    const store = new useStore();
    const form = reactive({
      id: null,
      name: "",
      document_id: null,
      subject_id: null,
      group_id: null,
      file_id: null
    });
    const disable = reactive({
      name: false,
      document_id: false,
      subject_id: false,
      group_id: false,
      file_id: false,
      submit: false
    });
    const Role = computed(() => {
      if (store.getters.getUserData) {
        store.dispatch("getUserData");
      }
      return store.getters.getUserData.UserRole;
    });
    const groups = ref([]);
    const loadGroups = () => {
      axios({ method: "get", url: "/api/v1/group" })
        .then((data) => {
          return (groups.value = data.data);
        })
        .catch((error) => {
          return error;
        });
    };
    const subjects = ref([]);
    const loadSubjects = () => {
      axios({ method: "get", url: "/api/v1/subjects" })
        .then((data) => {
          return (subjects.value = data.data);
        })
        .catch((error) => {
          return error;
        });
    };
    const files = ref([]);
    const loadFiles = () => {
      axios({ method: "get", url: "/api/v1/files" })
        .then((data) => {
          return (files.value = data.data);
        })
        .catch((error) => {
          return error;
        });
    };
    const DownloadFile = (fileInfo) => {
      axios({ method: "post", url: "/api/v1/file/download", data: { id: fileInfo.file_id }, responseType: "blob" })
        .then((res) => {
          ElMessage.success("Файл загружается");
          const blob = new Blob([res.data], { type: fileInfo.mimetype });
          const docUrl = document.createElement("a");
          docUrl.href = URL.createObjectURL(blob);
          console.log(fileInfo);
          docUrl.setAttribute("download", fileInfo.file_name);
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
        .post("/api/v1/documents/read", { document_id: choosenDocument.value })
        .then((data) => {
          tableData.value = data.data;
        })
        .catch(() => {
          ElMessage.error("Неизвестная ошибка!");
        });
    const choosenDocument = ref("");
    const selectFolder = async (data) => {
      choosenDocument.value = data._id;
      await loadData();
    };
    const selectPreviousFolder = async () => {
      await axios
        .post("/api/v1/documents/read/root", { id: choosenDocument.value })
        .then(async (data) => {
          console.log(data.data.document_id);
          choosenDocument.value = data.data.document_id ? data.data.document_id : "";
          await loadData();
        })
        .catch(() => {
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const rules = reactive({
      name: [
        {
          required: true,
          message: "Имя пользователя обязательно",
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
      sendData("post", "/api/v1/documents/delete", { id: id }, "Удалить не удалось!", "Запись удалена!");
    };
    const submitAdd = () => {
      if (groups.value.length == 0) loadGroups();
      if (subjects.value.length == 0) loadSubjects();
      if (files.value.length == 0) loadFiles();
      toggleAllOff();
      form.id = null;
      form.name = "";
      form.document_id = (choosenDocument.value === "" ? null : choosenDocument.value);
      form.subject_id = null;
      form.group_id = null;
      form.file_id = null;
      drawer.value = true;
    };
    const submitEdit = (data) => {
      if (groups.value.length == 0) loadGroups();
      if (subjects.value.length == 0) loadSubjects();
      if (files.value.length == 0) loadFiles();
      console.log(data);
      form.id = data._id;
      form.name = data._name;
      form.document_id = data.document_id;
      form.subject_id = data.subject_id;
      form.group_id = data.group_id;
      form.file_id = data.file_id;
      drawer.value = true;
    };
    const selectGroup = (id) => {
      form.group_id = id;
    };
    const selectSubject = (id) => {
      form.subject_id = id;
    };
    const selectFile = (id) => {
      form.file_id = id;
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAllOff();
          if (form.id) {
            sendData("patch", "/api/v1/documents", form, "Введены некорректные данные!", "Данные изменены!");
          } else {
            sendData("post", "/api/v1/documents", form, "Введены некорректные данные!", "Данные добавлены!");
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
        return !search.value || data._name.concat(data.subject_name, data.group_name).toLowerCase().includes(search.value.toLowerCase());
      })
    );
    const backButtonVisible = () => {
      return choosenDocument.value === "" || choosenDocument.value === null ? false : true
    }
    onBeforeMount(() => {
      loadData();
    });
    return {
      backButtonVisible,
      selectPreviousFolder,
      selectFolder,
      DownloadFile,
      groups,
      subjects,
      files,
      tableData,
      drawer,
      form,
      rules,
      selectGroup,
      selectSubject,
      selectFile,
      submitForm,
      disable,
      formRef,
      search,
      filterTableData,
      loadData,
      deleteRecord,
      submitAdd,
      submitEdit,
      Edit,
      Download,
      Delete,
      Back,
      Role
    };
  }
};
</script>

<style>
.workingarea {
  justify-content: center;
}
</style>
