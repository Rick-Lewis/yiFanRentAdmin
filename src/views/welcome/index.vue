<template>
  <div class="welcome-container">
    <div class="bg-container" />
    <div class="cover-container">
      <div class="header-container">
        <img src="@/assets/logo.jpg">
        <span>一帆租车企业管理平台</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Welcome',
  data: function() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.welcome-container{
  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../../assets/bg1.jpg) no-repeat;
    background-size: 100%;
    filter: blur(2px);
  }
  .cover-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .header-container {
      height: 100%;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 48px;
        height: 48px;
        border-radius: 3px;
      }

      span {
        font-size: 30px;
        font-weight: bold;
        margin-left: 20px;
        color: #333;
      }
    }
  }
}
</style>
