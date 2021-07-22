<template>
  <div class="row">
    <div class="col-sm-6">
      <div class="dataTables_info" id="DataTables_Table_1_info" role="status" aria-live="polite">
        第<strong>{{index}}/{{pageInfo.totalPages}}</strong>页,
        共<strong>{{totalRows}}</strong>条记录,
        当前页显示<strong>{{pageInfo.start}}</strong>-<strong>{{pageInfo.end}}</strong>条
      </div>
    </div>
    <div class="col-sm-6">
      <div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_1_paginate">
        <ul class="pagination">
          <li
            :class="{
              'paginate_button previous': true,
              disabled: index <= 1
            }"
            @click="setPage(index - 1)"
          >
            <a><i class="fa fa-angle-left"></i></a>
          </li>

          <li
            v-for="num in pageInfo.nums"
            :key="num"
            :class="{
              paginate_button: true,
              active: num === index
            }"
            @click="setPage(num)"
          >
            <a>{{num}}</a>
          </li>

          <li
            :class="{
              'paginate_button next': true,
              disabled: index >= pageInfo.totalPages
            }"
            @click="setPage(index + 1)"
          >
            <a><i class="fa fa-angle-right"></i></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['totalRows', 'perPage', 'index'],
  model: {
    prop: 'index',
    event: 'change'
  },
  computed: {
    pageInfo() {
      const {
        totalRows,
        perPage,
        index
      } = this

      const totalPages = parseInt((totalRows + perPage - 1) / perPage)
      const nums = [];
      for (let i = 1; i <= totalPages; i++) {
        nums.push(i);
      }

      return {
        start: (index - 1) * perPage + 1,
        end: index * perPage,
        totalPages,
        nums
      }
    }
  },
  methods: {
    setPage(newIndex) {
      if (newIndex < 1 || newIndex > this.pageInfo.totalPages) {
        return
      }
      this.$emit('change', newIndex)
    }
  }
}
</script>
<style scoped>
.pagination .paginate_button {
  cursor: pointer;
}
</style>
