<template>
  <div class="sidebar" v-if="show">
    <h1 style="color: white">Меню</h1>
    <router-link to="documents">Документы</router-link>
  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["hide"],
  methods: {
    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style scoped>
.sidebar {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 15rem; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  /* z-index: 1; */ /* Stay on top */
  left: 0;
  display: block;
  background-color: #002979; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  /* padding-top: 1.25rem; */
}
</style>
