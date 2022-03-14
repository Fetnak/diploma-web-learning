<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="/"
      ><template #title>
        <el-icon><home-filled /></el-icon>
        <span>Информация</span>
      </template></el-menu-item
    >
    <el-menu-item index="/documents"
      ><template #title>
        <el-icon><list /></el-icon>
        <span>Задания</span>
      </template></el-menu-item
    >
    <el-sub-menu index="Other">
      <template #title>
        Прочее</template
      >
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
  </el-menu>
</template>

<script>
// import { ref } from "vue";
/* eslint-disable */
import {
  HomeFilled,
  List,
  Avatar,
  Management,
  Document,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

export default {
  components: { HomeFilled, List, Avatar, Management, Document },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: [],
  methods: {

  },
  setup() {
    const router = useRouter();

    const handleSelect = (key, keyPath) => {
      console.log("KEY"+ key, "KEYPATH" + keyPath);
      router.push(key);
    };

    return {
      handleSelect,
    }
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
