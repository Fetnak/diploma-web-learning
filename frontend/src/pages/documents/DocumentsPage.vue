<template>
  <the-header></the-header>
  <div class="workingarea">
    <base-button type="button" @click="getDocuments"
      >Загрузить документы</base-button
    >
    <base-card
      ><ul>
        <li v-for="item in documents" :key="item">Идентификатор: {{ item._id }}. <br> Название документа: {{ item._name }}.</li>
      </ul></base-card
    >
  </div>
</template>

<script>
import axios from "../../store/axios.js";

import TheHeader from "../../components/layuot/TheHeader.vue";

export default {
  data() {
    return {
      showSidebar: false,
      documents: [],
    };
  },
  components: { TheHeader },
  methods: {
    getDocuments() {
      axios({
        method: "get",
        url: "/api/v1/documents/read",
      })
        .then((response) => {
          console.log(response.data);
          this.documents = response.data
        })
        .catch((error) => {
          console.log("ERROR 123" + error);
        });
    },
  },
};
</script>

<style>
body {
  background-color: #e8eff6;
}
.workingarea {
  justify-content: center;
}
</style>
