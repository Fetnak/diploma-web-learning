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
    <el-sub-menu index="Other">
      <template #title>Прочее</template>
      <el-menu-item index="/groups">
        <template #title>
          <el-icon><avatar /></el-icon>
          <span>Группы</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/subjects">
        <template #title>
          <el-icon><management /></el-icon>
          <span>Дисциплины</span>
        </template>
      </el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
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
import { HomeFilled, List, Avatar, Management, UserFilled } from "@element-plus/icons-vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { HomeFilled, List, Avatar, Management, UserFilled },
  props: ["header"],
  emits: [],
  methods: {},
  setup() {
    const activeIndex = computed(() => router.currentRoute.value.path);
    const router = useRouter();
    const store = useStore();

    const UserName = computed(() => {
      if (store.getters.getUserName) {
        store.dispatch("getUserName");
      }
      return store.getters.getUserName.UserName;
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
