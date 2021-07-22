<template>
  <modal
    :title="`方案跟单列表`"
    :open="!!id"
    @close="$emit('close')"
  >
   <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">方案跟单列表 <small></small></h3>
      </div>
        <table class="table table-bordered table-striped js-dataTable-full">
          <thead>
            <tr>
               <th class="text-center"></th>
              <th class="text-center">注单号</th>
              <th class="text-center">用户id</th>
              <th class="text-center">跟单金额</th>
              <th class="text-center">结算金额</th>
              <th class="text-center">所付佣金</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in list">
            <tr :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="text-center">{{item.ticketId}}</td>
              <td class="text-center">{{item.userId}}</td>
              <td class="text-center">{{item.betAmount}}</td>
              <td class="text-center">{{item.settlement}}</td>
              <td class="text-center">{{item.payCommission}}</td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer"></div>
    <!-- END Dynamic Table Full -->
  </modal>
</template>

<script>
import {planFollows } from '@/api/plan';

const initData = {
  list: []
}

export default {
  props: ['id'],
  data () {
    return {
      list: {...initData}
    };
  },
  watch: {
    id (n) {
      console.log(n)
      if (n) {
        this.queryData(n)
      } else {
        this.list = []
      }
    }
  },
  methods: {
    async queryData(id) {
      this.list = await planFollows(id);
    },
  }
}

</script>