<template>
  <div class="app-container">
    <aside>指南页对于一些第一次进入项目的人是有用的。你可以简单介绍一下这个项目的特点。</aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">打开指南</el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver({
      doneBtnText: '结束',
      closeBtnText: '关闭', // Text on the close button for this step
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步'
    })
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
