<template>
  <el-container>
    <el-main style="border-right: none">
      <el-scrollbar>
        <el-table :data="tableData" border stripe highlight-current-row style="width: 120%" :max-height=maxHeight>
          <el-table-column v-for="column in columns" :key="column.prop" :fixed="column.fixed" sortable :prop="column.prop" :label="column.label" :width="column.label" />
          <el-table-column fixed="left" sortable prop="date" label="Date" width="140" />
          <el-table-column sortable prop="name" label="Name" width="120" />
          <el-table-column sortable prop="address" label="Address" width="1920" />
          <el-table-column sortable prop="button" label="Button"></el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default>
              <el-button type="text" size="small" @click="handleClick">Detail</el-button>
              <el-button type="text" size="small">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    columns: {
      type: Object,
      required: true
    },
    tableData: {
      type: Array,
      required: false
    },
    maxHeight: {
      type: Number,
      required: false,
      default: null
    }
  },
  setup() {

  }
}
</script>

<style scoped></style>
