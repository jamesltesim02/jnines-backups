<template>
  <modal
    :title="(roleData || {}).name"
    :open="!!roleData"
    class="role-dialog"
    @close="$emit('close')"
    @ok="submit"
  >
    <div
      v-for="item in resources"
      :key="item._id"
      class="block resource-block"
    >
      <div class="block-header">
        <h3 class="block-title">
          <label class="css-input css-checkbox css-checkbox-info">
            <input
              type="checkbox"
              :value="item._id"
              v-model="selectedResources"
            />
            <span></span> {{item.resourceName}}
          </label>
        </h3>
      </div>
      <div
        v-if="item.nextResourceList && item.nextResourceList.length"
        class="block-content"
      >
        <div class="row">
          <div
            v-for="sitem in item.nextResourceList"
            :key="sitem._id"
            class="col-xs-6"
          >
            <label class="css-input css-checkbox css-checkbox-info">
              <input
                type="checkbox"
                :value="sitem._id"
                v-model="selectedResources"
              />
              <span></span> {{sitem.resourceName}}
            </label>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import difference from 'lodash/difference'
import { getAllResource, setRoleResource } from "@/api/role";

export default {
  props: ['roleData'],
  data() {
    return {
      resources: [],
      resourceMap: {},
      selectedResources: []
    }
  },
  watch: {
    /**
     * 当角色数据发生变化时 重新计算已选中的回显值
     */
    roleData (n) {
      if (!n || !n.roleResource) {
        this.selectedResources = []
        return
      }

      const selectedIds = n.roleResource.map(({_id, nextResourceList}) => {
        return [_id, ...(nextResourceList || []).map(({_id}) => _id)]
      })

      this.selectedResources = selectedIds.flat()
    },
    /**
     * 当选项发生变化时处理层级事件
     */
    selectedResources (n, o) {
      // 如果新数组多则表示为 添加选中, 否则删除选中
      const isAdd = n.length > o.length
      // 获取变化值的id
      const operIds = (
        isAdd
        ? difference(n, o)
        : difference(o, n)
      )

      // 如果变化的不是1个,则表示不是人为的, 则忽略本次事件
      if (operIds.length !== 1) {
        return
      }

      // 获取到映射中的对象
      const operItem = this.resourceMap[operIds[0]]

      // 判断是否不需要处理事件
      if (
        // 如果是一级菜单 并且为选中操作
        (isAdd && operItem.parentId === 'root')
        ||
        // 如果是二级菜单并且为取消操作
        (!isAdd && operItem.parentId !== 'root')
      ) {
        return
      }

      // 如果为取消操作
      if (!isAdd) {
        // 则将一级菜单下的所有二级菜单取消
        this.selectedResources = difference(n, (operItem.nextResourceList || []).map(({ _id }) => _id))
        return
      }

      // 否则将二级菜单的parentId添加为选中
      if (!n.includes(operItem.parentId)) {
        this.selectedResources.push(operItem.parentId)
      }
    },
  },
  async created() {
    this.resources = await getAllResource()
    // 将查询到的数据扁平化到map
    this.resources.forEach(res => {
      this.resourceMap[res._id] = res
      if (res.nextResourceList && res.nextResourceList.length) {
        res.nextResourceList.forEach(sres => {
          this.resourceMap[sres._id] = sres
        })
      }
    })
  },
  methods: {
    async submit () {
      try {
        this.$loading(`保存中...`)
        const result = await setRoleResource(this.roleData._id, this.selectedResources)
        this.$toast.center(`保存成功`)
        this.$emit('saveSource')
      } catch (e) {
        // if(e.code === '1111') {
        // TODO 特殊业务处理
        // }
      } finally {
        this.$loading.close();
      }
    }
  }
}
</script>
<style>
.role-dialog .modal-content > .block > .block-content {
  background-color: #f5f5f5;
}
.role-dialog .resource-block {
  padding: 15px 0;
}
.role-dialog .resource-block .block-header {
  padding: 0 20px;
}
.role-dialog .resource-block .block-header label {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
}
.role-dialog .col-xs-6 {
  width: 50%;
}
</style>
