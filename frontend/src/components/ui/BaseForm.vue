<template>
  <div class="container">
    <div v-if="header">
      <h1>{{ header }}</h1>
    </div>
    <div class="no-header" />
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["header"]
};
</script>

<style scoped>
.container {
  display: block;
  margin: 10vh auto;
  padding: 1.5rem;
  width: 30%;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 0rem 0.75rem 0.0625rem rgba(0, 0, 0, 0.3);
}
.no-header {
  margin: 0;
  margin-bottom: 1rem;
}
h1 {
  text-align: center;
}
@media only screen and (max-width: 78.125rem) {
  .container {
    width: 60%;
  }
}

@media only screen and (max-width: 53.125rem) {
  .container {
    width: 80%;
  }
}
</style>
