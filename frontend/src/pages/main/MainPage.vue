<template>
  <the-header></the-header>
  <div class="workingarea">
    <base-card><h1>Начальная страница</h1></base-card>
    <el-button @click="logout()" type="primary">I am ElButton</el-button>
    <el-button @click="test()">I am working ElButton</el-button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref } from "vue";

import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  components: { TheHeader },
  methods: {
    test() {
      this.$store.dispatch("logout");
      this.$router.push("/auth");
    }
  },
  setup() {
    const store = useStore();
    const router = new useRouter();
    const showSidebar = ref(false);

    const logout = () => {
      store.dispatch("logout");
      router.push("/auth");
    }

    return {
      logout,
      showSidebar
    }
  }
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
