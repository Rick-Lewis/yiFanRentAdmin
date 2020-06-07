<template>
  <div class="create-order-container">
    <div class="header">
      <el-form ref="form" :inline="true" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="取还门店">
          <el-select v-model="conditionForm.store" multiple collapse-tags placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in conditionForm.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用车时间">
          <span>{{ time_start }} 至 {{ time_end }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="车型">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="排量">
                  <span>{{ props.row.shop }}</span>
                </el-form-item>
                <el-form-item label="座位数">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="油耗">
                  <span>{{ props.row.shopId }}</span>
                </el-form-item>
                <el-form-item label="租金">
                  <span>{{ props.row.shopId }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="图片"
            prop="id"
            align="center"
          />
          <el-table-column
            label="车型"
            prop="name"
            align="center"
          />
          <el-table-column
            label="价格"
            prop="desc"
            align="center"
          />
          <el-table-column prop="action" label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleRent(scope.$index, scope.row)">租车</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>
<script>
// import { fetchStore } from '@/api/transport-mg'
export default {
  name: 'CreateOrder',
  data: function() {
    return {
      conditionForm: {
        store: '',
        options: []
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  computed: {
    time_start: function() {
      return this.$route.query.time_start
    },
    time_end: function() {
      return this.$route.query.time_end
    }
  },
  created() {
    console.log('create-order.vue created', this.$route)
  },
  mounted() {
    // const dataTemp = {
    //   pageIndex: 1,
    //   pageSize: 1000,
    //   sortField: 'create_time',
    //   sortOrder: 'desc'
    // }
    // fetchStore(dataTemp).then(res => {
    //   console.log('create-order.vue mounted fetchStore success', res)
    // }).catch(err => {
    //   console.log('create-order.vue mounted fetchStore failure', err)
    // })
  },
  methods: {
    handleRent() {
      console.log('create-order.vue methods handleRent')
    },
    onSubmit() {
      console.log('create-order.vue methods onSubmit')
    },
    handleSizeChange(val) {
      console.log('enterprise.vue methods handleSizeChange', val, this.pageIndex)
      this.pageSize = val
    //   const dataTemp = {
    //     status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
    //     pageIndex: this.pageIndex,
    //     pageSize: this.pageSize
    //   }
    //   fetchEnterpriseList(dataTemp).then(res => {
    //     console.log('enterprise.vue handleSizeChange fetchEnterpriseList success', res)
    //     this.tableData.length = 0
    //     this.tableData.push(...res.data.data)
    //     this.total = res.data.total
    //   }).catch(err => {
    //     console.log('enterprise.vue handleSizeChange fetchEnterpriseList failure', err)
    //   })
    },
    handleCurrentChange(val) {
      console.log('enterprise.vue methods handleCurrentChange', val)
      this.pageIndex = val
    //   const dataTemp = {
    //     status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
    //     pageIndex: this.pageIndex,
    //     pageSize: this.pageSize
    //   }
    //   fetchEnterpriseList(dataTemp).then(res => {
    //     console.log('enterprise.vue handleSizeChange fetchEnterpriseList success', res)
    //     this.tableData.length = 0
    //     this.tableData.push(...res.data.data)
    //     this.total = res.data.total
    //   }).catch(err => {
    //     console.log('enterprise.vue handleSizeChange fetchEnterpriseList failure', err)
    //   })
    }
  }
}
</script>
<style lang="scss" scoped>
.create-order-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .header{
    background-color: #ffffff;
    padding-top: 22px;
    padding-left: 22px;
  }
  .content{
    background-color: #ffffff;
    margin-top: 10px;
    padding: 16px;
    .pagination-cocntainer{
      text-align: right;
      margin-top: 16px;
      & > div{
        padding: 0;
      }
    }
  }
}
</style>
