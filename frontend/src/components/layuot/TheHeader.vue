<template>
  <base-control-dialog
    :show="showLogoutDialog"
    title="Выход из аккаунта!"
    @okay="logout"
    @cancel="switchLogoutDialog"
  >
    <p>{{ "Вы уверены что хотите выйти из аккаунта?" }}</p>
  </base-control-dialog>
  <header>
    <img
      src="../../../public/menu.svg"
      alt="menu"
      class="menu"
      @click="switchSidebar"
    />
    <nav>
      <!-- <h1>
        <router-link to="/">Find a Coach</router-link>
      </h1>
      <ul>
        <li>
          <router-link to="/coaches">All Coaches</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/requests">Requests</router-link>
        </li>
        <li v-else>
          <router-link to="/auth">Login</router-link>
        </li>
        <li v-if="isLoggedIn">
          <base-button @click="logout">Logout</base-button>
        </li>
      </ul> -->
    </nav>
    <div>
      <img
        src="../../../public/user.svg"
        alt="user"
        class="user"
        @click="switchLogoutDialog"
      />
    </div>
  </header>
  <the-menu :show="showSidebar"></the-menu>
</template>

<script>
import TheMenu from "./TheMenu.vue";

export default {
  data() {
    return {
      showLogoutDialog: false,
      showSidebar: false,
    };
  },
  components: { TheMenu },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/auth");
    },
    switchLogoutDialog() {
      this.showLogoutDialog = !this.showLogoutDialog;
    },
    switchSidebar() {
      this.showSidebar = !this.showSidebar;
    },
  },
};
</script>

<style scoped>
.user {
  border-radius: 25%;
  height: 3.5rem;
  background-color: #e7e8eb;
  fill: #ff0000;
  margin-right: 1.5rem;
  padding: 0.75rem;
}
.menu {
  height: 1.5rem;
  margin-left: 1.5rem;
}
header {
  width: 100%;
  height: 5rem;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

header a {
  text-decoration: none;
  /* color: #f391e3; */
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 0.0625rem solid transparent;
}

a:active,
a:hover,
a.router-link-active {
  border: 0.0625rem solid;
}

h1 {
  margin: 0;
}

h1 a {
  /* color: white; */
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>
