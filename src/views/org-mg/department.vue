<template>
  <div class="department-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="部门名称">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="onSubmit">+新增部门</el-button></div>
    <div class="content">
      <div class="tree-header">
        <div>部门树</div>
        <div>状态</div>
        <div>操作</div>
      </div>
      <el-tree :data="data" show-checkbox node-key="id" :expand-on-click-node="false" style="margin-top: 5px;">
        <span slot-scope="{ node, item }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>已启用</span>
          <span>
            <el-button type="text" size="mini" @click="() => handleEdit(item)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="() => handleBlockUp(node, item)">
              停用
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
let id = 1000
export default {
  name: 'Department',
  components: {},
  data: function() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      conditionForm: {
        statusList: [{
          label: '-1',
          value: '全部'
        }, {
          label: '0',
          value: '已停用'
        }, {
          label: '1',
          value: '已启用'
        }],
        status: '0',
        name: ''
      },
      data: JSON.parse(JSON.stringify(data))
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      console.log('department.vue methods onSubmit')
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>
<style lang='scss' scoped>
.department-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .header{
    background-color: #ffffff;
    padding-top: 22px;
    padding-left: 22px;
    .other-container{
      display: flex;
      .el-form-item:not(:first-child){
        margin-left: 40px;
      }
      .el-form-item:last-child{
        margin-left: 0;
      }
    }
  }
  .content{
    background-color: #ffffff;
    margin-top: 10px;
    padding: 16px;
    .tree-header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #909399;
      font-size: 14px;
      padding: 10px 27px;
      background-color: #f9f9f9;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
}
</style>
