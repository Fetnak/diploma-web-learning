<template>
  <the-header></the-header>
  <div class="workingarea">
    <base-card><h1>Начальная страница</h1></base-card>
    <el-button>I am ElButton</el-button>
  </div>
</template>

<script>
import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  data() {
    return {
      showSidebar: false,
    };
  },
  components: { TheHeader },
};
</script>

<style>
body {
  /* background-color: #e8eff6; */
}
.workingarea {
  justify-content: center;
}
</style>
