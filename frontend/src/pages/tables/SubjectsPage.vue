<template>
  <the-header header="Дисциплины"></the-header>
  <el-button type="primary" style="margin-left: 1.2rem; margin-top: 1.125rem" @click="submitAdd()">Добавить дисциплину</el-button>

  <el-drawer v-model="drawer" title="Добавить дисциплину" :with-header="false">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Название дисциплины" prop="name">
        <el-input v-model="form.name" :disabled="disable.name" maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item label="Короткое название" prop="short_name">
        <el-input v-model="form.short_name" :disabled="disable.short_name" maxlength="255" clearable></el-input>
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
            <el-table-column fixed="left" sortable prop="_name" label="Дисциплина" />
            <el-table-column sortable prop="short_name" label="Короткое название" />
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
      name: "",
      short_name: ""
    });
    const disable = reactive({
      name: false,
      short_name: false,
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
        .get("/api/v1/subjects")
        .then((data) => {
          tableData.value = data.data;
        })
        .catch(() => {
          ElMessage.error("Неизвестная ошибка!");
        });
    const rules = reactive({
      name: [
        {
          required: true,
          message: "Название дисциплины обязательно",
          trigger: "blur"
        }
      ],
      short_name: [
        {
          required: true,
          message: "Коротное название дисциплины обязательно",
          trigger: "blur"
        }
      ]
    });
    const sendData = () => {
      axios
        .post("/api/v1/subjects", {
          name: form.name,
          short_name: form.short_name
        })
        .then(() => {
          ElMessage.success("Данные добавлены!");
          loadData();
          toggleAll();
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            ElMessage.error("Введены некорректные данные!");
            return;
          }
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const submitAdd = () => {
      form.id = null;
      drawer.value = true;
    };
    const submitEdit = (data) => {
      form.id = data._id;
      form.name = data._name;
      form.short_name = data.short_name;
      drawer.value = true;
    };
    const editRecord = () => {
      axios
        .patch("/api/v1/subjects", {
          id: form.id,
          name: form.name,
          short_name: form.short_name
        })
        .then(() => {
          ElMessage.success("Данные изменены!");
          loadData();
          toggleAll();
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            ElMessage.error("Введены некорректные данные!");
            return;
          }
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const deleteRecord = (id) => {
      axios
        .post("/api/v1/subjects/delete", { id: id })
        .then((error) => {
          if (error.response?.status === 400) {
            ElMessage.error("Удалить не удалось!");
            return;
          }
          ElMessage.success("Запись удалена!");
          loadData();
        })
        .catch(() => {
          ElMessage.error("Неизвестная ошибка!");
        });
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAllOff();
          if (form.id) {
            editRecord();
          } else {
            sendData();
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
        (data) => !search.value || data._name.concat(data.short_name).toLowerCase().includes(search.value.toLowerCase())
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
