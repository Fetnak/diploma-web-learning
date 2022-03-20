<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  components: {},
  created() {
    document.title = "Дистанционное самообучение";
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap");

html {
  font-family: "Roboto", sans-serif;
}
</style>
