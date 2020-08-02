<template>
  <div class="pre-order-detail-container">
    <div class="item-content">
      <div class="content-container">
        <div class="left">
          <div>
            <el-avatar shape="square" style="width: 180px; height: 100px; vertical-align: middle;" :src="detail && detail.model && 'https://www.901fan.com' + detail.model.image" />
          </div>
          <div>
            <div style="margin-left: 10px;">{{ detail && detail.model && detail.model.name }}</div>
            <div style="margin-left: 10px; margin-top: 10px;">
              <span>{{ detail && detail.model && detail.model.let_litre }}</span>
              <el-divider direction="vertical" />
              <span>{{ detail && detail.model && detail.model.seat_count }}座</span>
              <el-divider direction="vertical" />
              <span>油耗{{ detail && detail.model && detail.model.oil_litre }}L</span></div>
          </div>
        </div>
        <div class="right">
          <span>{{ detail && detail.model && detail.model.standard_price }}</span>
          <span>元</span>
          <span>/天</span>
        </div>
      </div>
    </div>
    <div class="item-content">
      <div class="content-container">
        <div class="right">
          <span>{{ detail && detail.order && detail.order.time_start }}</span>
        </div>
        <div class="duration-container">{{ detail && detail.order && detail.order.days }}天</div>
        <div class="right">
          <span>{{ detail && detail.order && detail.order.time_end }}</span>
        </div>
      </div>
    </div>
    <div class="item-content">
      <div class="content-container">取车门店：{{ detail && detail.model && detail.model.store_name }}</div>
    </div>
    <div class="item-content">
      <div class="content-container">
        <div style="width: 100%;">
          <div class="li-container">
            <div>车辆租金</div>
            <div>￥{{ detail && detail.fee_list && detail.fee_list.rental_fee }}</div>
          </div>
          <!-- <div class="li-container">
            <div>基础保障服务费</div>
            <div>￥{{ detail && detail.fee_list && detail.fee_list.service_fee }}</div>
          </div> -->
          <div class="li-container">
            <div>保险费</div>
            <div>￥{{ detail && detail.fee_list && detail.fee_list.insurance_fee }}</div>
          </div>
          <div class="li-container">
            <div>合计</div>
            <div>￥{{ detail && detail.order && detail.order.price_total }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="item-content">
      <div class="content-container">
        <div style="width: 100%;">
          <div>
            <el-alert
              title="取车须知"
              type="warning"
              show-icon
              :closable="false"
            >
              <div>1、需下单会员本人取车</div>
              <div>2、取车时请携带：二代身份证、驾驶证</div>
            </el-alert>
          </div>
          <div style="padding: 20px 0;">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title"><span style="padding-left: 20px;">2020年第一次招商会议用车</span></template>
                <div style="padding-left: 10px;">
                  <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                  <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div style="padding: 0 10px; margin-top: 20px;">
            <el-button type="primary" style="width: 100%;" @click="handleReserveClick">立即预定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { preview, create } from '@/api/transport-mg'
export default {
  name: 'PreOrderDetail',
  data: function() {
    return {
      activeNames: [],
      detail: null
    }
  },
  computed: {},
  created() {
    console.log('pre-order-detail.vue created', this.$store.state.order.submitForm)
    preview(this.$store.state.order.submitForm).then(res => {
      console.log('pre-order-detail.vue created preview success', res)
      if (res.code !== 0) {
        this.$message({
          message: res.message,
          type: 'warning'
        })
        return
      }
      this.detail = res.data
    }).catch(err => {
      console.log('pre-order-detail.vue created preview failure', err)
    })
  },
  mounted() {},
  methods: {
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', { name: 'Order' })
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect/transport-mg/order'
        })
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag() {
      const view = this.$route
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    handleReserveClick() {
      create(this.$store.state.order.submitForm).then(res => {
        console.log('pre-order-detail.vue methods create success', res)
        if (res.code !== 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return
        }
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.$router.push({ path: '/transport-mg/order' })
        this.closeSelectedTag()
        this.refreshView()
      }).catch(err => {
        console.log('pre-order-detail.vue methods create failure', err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pre-order-detail-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .item-content{
      background-color: #ffffff;
      display: flex;
      &:not(:last-child){
          margin-bottom: 1px
      }
      .content-container{
          width: 590px;
          padding: 20px 0;
          margin: auto;
          display: flex;
          justify-content: space-between;
          .left{
              display: flex;
          }
          .right{
              align-self: center;
          }
          .duration-container{
              width: 50px;
              height: 50px;
              line-height: 50px;
              text-align: center;
              border: 1px solid #999;
              border-radius: 4px;
              position: relative;
              &::before{
                  content: '';
                  width: 60px;
                  height: 1px;
                  background-color: #999;
                  position: absolute;
                  left: -61px;
                  top: 25px;
              }
              &::after{
                  content: '';
                  width: 60px;
                  height: 1px;
                  background-color: #999;
                  position: absolute;
                  left: 49px;
                  top: 25px;
              }
          }
          .li-container{
              display: flex;
              justify-content: space-between;
              &:not(:last-child){
                  margin-bottom: 10px;
              }
          }
          .el-collapse{
              border: none;
              /deep/.el-collapse-item__header{
                  border: none;
                  background-color: #f6f6f6;
              }
              /deep/.el-collapse-item__wrap{
                  border: none;
              }
          }
      }
  }
}
</style>
