<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="/">
      <template #title>
        <el-icon><home-filled /></el-icon>
        <span>Информация</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/documents">
      <template #title>
        <el-icon><list /></el-icon>
        <span>Задания</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/files">
      <template #title>
        <el-icon><document /></el-icon>
        <span>Файлы</span>
      </template>
    </el-menu-item>
    <el-sub-menu index="Other">
      <template #title>Прочее</template>
      <el-menu-item index="/groups">
        <template #title>
          <el-icon><document-copy /></el-icon>
          <span>Группы</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/subjects">
        <template #title>
          <el-icon><management /></el-icon>
          <span>Дисциплины</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/users">
        <template #title>
          <el-icon><avatar /></el-icon>
          <span>Пользователи</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/secretkeys">
        <template #title>
          <el-icon><key /></el-icon>
          <span>Секретные ключи</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
    <h2 style="margin: auto auto">{{ header }}</h2>
    <el-sub-menu style="margin-left: auto; margin-right: 0" index="user">
      <template #title>
        <span style="padding-right: 1rem">{{ UserName }}</span>
        <el-avatar shape="square">
          <el-icon style="margin: auto"><user-filled /></el-icon>
        </el-avatar>
      </template>
      <el-menu-item index="/settings">Настройки</el-menu-item>
      <el-popconfirm confirm-button-text="Да" cancel-button-text="Нет" title="Вы хотите выйти из аккаунта?" @confirm="logout()">
        <template #reference>
          <el-menu-item index="">Выйти из аккаунта</el-menu-item>
        </template>
      </el-popconfirm>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { HomeFilled, List, Avatar, Management, UserFilled, Key, DocumentCopy, Document } from "@element-plus/icons-vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { HomeFilled, List, Avatar, Management, UserFilled, Key, DocumentCopy, Document },
  props: ["header"],
  emits: [],
  methods: {},
  setup() {
    const activeIndex = computed(() => router.currentRoute.value.path);
    const router = useRouter();
    const store = useStore();

    const UserName = computed(() => {
      if (store.getters.getUserData) {
        store.dispatch("getUserData");
      }
      return store.getters.getUserData.UserName;
    });

    const handleSelect = (key) => {
      router.push(key);
    };

    const logout = () => {
      store.dispatch("logout");
      router.push("/auth");
    };

    return {
      activeIndex,
      handleSelect,
      logout,
      UserName
    };
  }
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-vertical-demo {
  min-height: 100%;
  position: fixed;
}
</style>
