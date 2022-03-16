<template>
  <the-header></the-header>
  <div class="workingarea">
    <base-card><h1>Начальная страница</h1></base-card>
    <el-button @click="test()">I am working ElButton</el-button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";

import axios from "../../store/axios.js"

import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  components: { TheHeader },
  setup() {
    const store = useStore();
    const showSidebar = ref(false);

    const test = () => {
      console.log(store.getters.getUserName);
      axios
        .get("/api/v1/user")
        .then((data) => {
          console.log("asdasdasd" + JSON.stringify(data));
        })
        .catch((error) => {
          console.log(error)
          }
        );
    }

    return {
      showSidebar,
      test
    };
  }
};
</script>

<style>
.workingarea {
  justify-content: center;
}
</style>
