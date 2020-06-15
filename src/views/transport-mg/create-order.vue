<template>
  <div class="create-order-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="类型">
          <el-radio-group v-model="conditionForm.category" size="small" @change="(val) => handleRadioGroupChange(val, 'category')">
            <el-radio v-for="(item, index) in conditionForm.categoryList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌">
          <el-radio-group v-model="conditionForm.brand" size="small" @change="(val) => handleRadioGroupChange(val, 'brand')">
            <el-radio v-for="(item, index) in conditionForm.brandList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格区间">
          <el-radio-group v-model="conditionForm.price" size="small" @change="(val) => handleRadioGroupChange(val, 'price')">
            <el-radio v-for="(item, index) in conditionForm.priceList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="display: flex;">
          <el-form-item label="取还门店">
            <el-select v-model="conditionForm.store" placeholder="请选择">
              <el-option-group v-for="group in conditionForm.storeList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="用车时间" style="margin-left: 40px;">
            <span>{{ time_start }} 至 {{ time_end }} 共{{ duration }}天</span>
          </el-form-item>
          <el-form-item style="margin-left: -45px;">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
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
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item label="车型">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="排量">
                  <span>{{ props.row.let_litre }}T</span>
                </el-form-item>
                <el-form-item label="座位数">
                  <span>{{ props.row.seat_count }}做</span>
                </el-form-item>
                <el-form-item label="油耗">
                  <span>{{ props.row.oil_litre }}L</span>
                </el-form-item>
                <el-form-item label="租金">
                  <span>{{ props.row.standard_price }}元/日均</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="图片"
            prop="image"
            align="center"
          >
            <template slot-scope="scope">
              <el-avatar shape="square" style="width: 180px; height: 100px;" :src="'https://www.901fan.com' + scope.row.image" />
            </template>
          </el-table-column>
          <el-table-column
            label="车型"
            prop="name"
            align="center"
          />
          <el-table-column
            label="价格"
            prop="standard_price"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.standard_price }}/日均</span>
            </template>
          </el-table-column>
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
import { fetchStore, fetchCategory, fetchBrand, fetchModal } from '@/api/transport-mg'
export default {
  name: 'CreateOrder',
  data: function() {
    return {
      conditionForm: {
        category: '-1',
        categoryList: [{
          label: '-1',
          value: '全部'
        }],
        brand: '-1',
        brandList: [{
          label: '-1',
          value: '全部'
        }],
        price: '-1',
        priceList: [{
          label: '-1',
          value: '全部',
          priceLower: '',
          priceUpper: ''
        }, {
          label: '0',
          value: '0-150',
          priceLower: '0',
          priceUpper: '150'
        }, {
          label: '1',
          value: '150-200',
          priceLower: '150',
          priceUpper: '200'
        }, {
          label: '2',
          value: '200-250',
          priceLower: '200',
          priceUpper: '250'
        }, {
          label: '3',
          value: '250-300',
          priceLower: '250',
          priceUpper: '300'
        }, {
          label: '4',
          value: '300-350',
          priceLower: '300',
          priceUpper: '350'
        }, {
          label: '5',
          value: '350-400',
          priceLower: '350',
          priceUpper: '400'
        }],
        store: '',
        storeList: []
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
    },
    duration: function() {
      const startDate = new Date(this.$route.query.time_start).getTime()
      const endDate = new Date(this.$route.query.time_end).getTime()
      return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24)
    }
  },
  created() {
    console.log('create-order.vue created', this.$route)
  },
  mounted() {
    const dataTemp = {
      sortField: 'create_time',
      sortOrder: 'desc'
    }
    fetchStore(dataTemp).then(res => {
      console.log('create-order.vue mounted fetchStore success', res)
      this.conditionForm.storeList = res.data.map(item => ({
        label: item.city_name + item.county_name,
        options: item.stores.map(obj => ({
          label: obj.name,
          value: obj.id
        }))
      }))
    }).catch(err => {
      console.log('create-order.vue mounted fetchStore failure', err)
    })
    fetchCategory().then(res => {
      console.log('create-order.vue mounted fetchCategory success', res)
      this.conditionForm.categoryList.push(...res.data.map(item => ({
        label: item.id,
        value: item.name
      })))
    }).catch(err => {
      console.log('create-order.vue mounted fetchCategory failure', err)
    })
    fetchBrand().then(res => {
      console.log('create-order.vue mounted fetchBrand success', res)
      this.conditionForm.brandList.push(...res.data.map(item => ({
        label: item.id,
        value: item.name
      })))
    }).catch(err => {
      console.log('create-order.vue mounted fetchBrand failure', err)
    })
  },
  methods: {
    handleRadioGroupChange(val, type) {
      console.log('create-order.vue methods handleRadioGroupChange', val, type)
      if (!this.conditionForm.store) {
        this.$message('请选择门店')
        return
      }
      const dataTemp = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        store_id: this.conditionForm.store,
        time_start: this.time_start,
        time_end: this.time_end
      }
      let temp = null
      temp = this.conditionForm.priceList.find(item => item.label === this.conditionForm.price)
      if (this.conditionForm.brand !== '-1') {
        dataTemp['brand_id'] = this.conditionForm.brand
      }
      if (this.conditionForm.category !== '-1') {
        dataTemp['category_id'] = this.conditionForm.category
      }
      if (this.conditionForm.store !== '-1') {
        dataTemp['store_id'] = this.conditionForm.store
      }
      if (temp.label !== '-1') {
        dataTemp['price_lower'] = temp.priceLower
        dataTemp['price_high'] = temp.priceUpper
      }
      switch (type) {
        case 'category':
          if (val !== '-1') {
            dataTemp['category_id'] = val
          }
          break
        case 'brand':
          if (val !== '-1') {
            dataTemp['brand_id'] = val
          }
          break
        case 'price':
          temp = this.conditionForm.priceList.find(item => item.label === val)
          if (temp.label !== '-1') {
            dataTemp['price_lower'] = temp.priceLower
            dataTemp['price_high'] = temp.priceUpper
          }
          break
      }
      fetchModal(dataTemp).then(res => {
        console.log('create-order.vue onSubmit handleRadioGroupChange success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data)
        // this.total = res.data.total
      }).catch(err => {
        console.log('create-order.vue onSubmit handleRadioGroupChange failure', err)
      })
    },
    handleRent(index, item) {
      const temp = {
        time_start: this.time_start,
        time_end: this.time_end,
        days: this.duration,
        model_id: item.id,
        store_pick_up: this.conditionForm.store
      }
      console.log('create-order.vue methods handleRent', index, item, temp)
      this.$store.dispatch('order/setSubmitForm', temp)
      this.$router.push({ path: '/transport-mg/pre-order-detail' })
    },
    onSubmit() {
      console.log('create-order.vue methods onSubmit')
      if (!this.conditionForm.store) {
        this.$message('请选择门店')
        return
      }
      const temp = this.conditionForm.priceList.find(item => item.label === this.conditionForm.price)
      const dataTemp = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        time_start: this.time_start,
        time_end: this.time_end
      }
      if (this.conditionForm.brand !== '-1') {
        dataTemp['brand_id'] = this.conditionForm.brand
      }
      if (this.conditionForm.category !== '-1') {
        dataTemp['category_id'] = this.conditionForm.category
      }
      if (this.conditionForm.store !== '-1') {
        dataTemp['store_id'] = this.conditionForm.store
      }
      if (temp.label !== '-1') {
        dataTemp['price_lower'] = temp.priceLower
        dataTemp['price_high'] = temp.priceUpper
      }
      fetchModal(dataTemp).then(res => {
        console.log('create-order.vue onSubmit fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data)
        // this.total = res.data.total
      }).catch(err => {
        console.log('create-order.vue onSubmit fetchEnterpriseList failure', err)
      })
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
