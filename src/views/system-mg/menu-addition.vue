<template>
  <div class="menu-addition-container">
    <div class="content">
      <div class="header">新增菜单</div>
      <div class="main">
        <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" type="text" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="上一级菜单" prop="pid">
            <el-cascader
              v-model="form.pid"
              :options="form.pOptions"
              :props="{ checkStrictly: true, label: 'name', value: 'id'}"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="菜单地址" prop="url">
            <el-input v-model="form.url" type="text" placeholder="请输入菜单地址" />
          </el-form-item>
          <el-form-item label="唯一标识" prop="code">
            <el-input v-model="form.code" type="text" placeholder="请输入唯一标识" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type.label" placeholder="请选择" style="width: 100%;" @change="(data) => handleSelectChange('type', data)">
              <el-option
                v-for="item in form.typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Icon" prop="icon.label">
            <el-select v-model="form.icon.label" placeholder="请选择" style="width: 442px;" @change="(data) => handleSelectChange('icon', data)">
              <el-option
                v-for="item in form.iconOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
                <span style="float: left"><i :class="item.label" /></span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <div v-if="form.icon.label" style="display: inline-block">
              <el-tag><i :class="form.icon.label" /></el-tag>
            </div>
            <div v-else style="display: inline-block">
              <el-tag>无</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="排序号" prop="note">
            <el-input v-model="form.note" type="text" placeholder="请输入菜单地址" />
          </el-form-item>
          <el-form-item label="操作" prop="functions">
            <el-select v-model="form.functions" multiple placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in form.funsOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="padding-bottom: 16px;">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchMenuList, addMenu, getMenuDetail, fetchFunctionList } from '@/api/system-mg'
import { Message } from 'element-ui'
export default {
  name: '',
  data: function() {
    return {
      form: {
        name: '',
        pid: [],
        pOptions: [],
        url: '',
        code: '',
        type: {
          label: '',
          value: ''
        },
        typeOptions: [{
          label: '父级节点',
          value: 0
        }, {
          label: '叶子节点',
          value: 1
        }],
        icon: {
          label: '',
          value: ''
        },
        iconOptions: [{
          label: 'el-icon-setting',
          value: 'el-icon-setting'
        }, {
          label: 'el-icon-user',
          value: 'el-icon-user'
        }, {
          label: 'el-icon-document',
          value: 'el-icon-document'
        }, {
          label: 'el-icon-truck',
          value: 'el-icon-truck'
        }],
        note: '',
        functions: [],
        funsOptions: []
      },
      formRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] }],
        url: [{ required: true, message: '请输入菜单地址', trigger: ['blur'] }],
        code: [{ required: true, message: '请输入唯一标识', trigger: ['blur'] }],
        'type.label': [{ required: true, message: '请选择类型', trigger: ['blur'] }],
        note: [{ required: true, message: '请输入排序号', trigger: ['blur'] }]
      },
      pageIndex: 1,
      pageSize: 1000
    }
  },
  computed: {},
  created() {
    console.log('menu-addition.vue created', this.$route)
    const dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    const p1 = fetchMenuList(dataTemp).then(res => {
      console.log('menu-addition.vue created fetchMenuList success', res)
      const temp = this._.cloneDeep(res.data.data)
      this.handleMenuList(temp, temp)
      this.form.pOptions.push(...temp)
      return res.data.data
    }).catch(err => {
      console.log('menu-addition.vue created fetchMenuList failure', err)
    })
    const p2 = fetchFunctionList(dataTemp).then(res => {
      console.log('function.vue mounted fetchFunctionList success', res)
      const temp = res.data.data.map(item => ({
        label: item.name,
        value: item.id
      }))
      this.form.funsOptions.push(...temp)
      return res.data.data
    }).catch(err => {
      console.log('function.vue mounted fetchFunctionList failure', err)
    })
    if (this.$route.query.action === 'edit') {
      Promise.all([p1, p2]).then(([res1, res2]) => {
        getMenuDetail({ id: this.$route.query.id }).then(res => {
          console.log('menu-addition.vue created getMenuDetail success', res)
          const tempType = this.form.typeOptions.find(item => item.value === res.data.is_menu)
          this.form = Object.assign(this.form, {
            id: res.data.id,
            status: res.data.status,
            name: res.data.name,
            pid: this.getCascaderList(res1, res.data.pid),
            url: res.data.url,
            code: res.data.code,
            type: {
              label: tempType.label,
              value: tempType.value
            },
            icon: {
              label: res.data.icon,
              value: res.data.icon
            },
            note: res.data.note,
            functions: this.getMultiSelectList(res.data.functions)
          })
        }).catch(err => {
          console.log('menu-addition.vue created getMenuDetail failure', err)
        })
      })
    }
  },
  mounted() {},
  methods: {
    getMultiSelectList(targetStr) {
      if (!targetStr) return []
      return JSON.parse(targetStr).map(item => item.label)
    },
    getCascaderList(data, targetId) {
      const result = []
      while (targetId !== 0) {
        result.unshift(targetId)
        const target = data.find(item => item.id === targetId)
        if (target && target.id !== target.pid) {
          targetId = target.pid
        } else {
          return result
        }
      }
      return result
    },
    handleMenuList(target, data) {
      if (target && target.length > 0) {
        for (let i = 0; i < target.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].pid === target[i].id) { // 找到目标元素的children
              if (!target[i].children) {
                target[i].children = []
              }
              target[i].children.push(data[j])
              data.splice(j, 1)
              j--
            }
          }
          if (target[i].children && target[i].children.length === 0) {
            delete target[i].children
          } else {
            this.handleMenuList(target[i].children, data)
          }
        }
        return data
      } else {
        return []
      }
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
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', { name: 'Application' })
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect/system-mg/menu'
        })
      })
    },
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.closeSelectedTag()
        this.$router.go(-1)
      }
    },
    onSubmit() {
      console.log('menu-addition.vue methods onSubmit', this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = {
            pid: this.form.pid.length > 0 ? this.form.pid[this.form.pid.length - 1] : 0,
            code: this.form.code,
            name: this.form.name,
            url: this.form.url,
            icon: this.form.icon.value,
            note: this.form.note,
            status: 1,
            is_menu: this.form.type.value,
            functions: this.form.functions.length > 0 ? JSON.stringify(this.form.functions) : ''
          }
          if (this.$route.query.action === 'edit') {
            tempData.id = this.form.id
            tempData.status = this.form.status
          }
          console.log('menu-addition.vue methods onSubmit temp', tempData)
          addMenu(tempData).then(res => {
            console.log('menu-addition.vue mounted addMenu success', res)
            if (res.code === 0) {
              Message({
                message: res.message,
                type: 'success',
                duration: 5 * 1000
              })
              this.closeSelectedTag()
              this.refreshView()
            } else {
              Message({
                message: res.message,
                type: 'warning',
                duration: 5 * 1000
              })
            }
          }).catch(err => {
            console.log('menu-addition.vue mounted addMenu failure', err)
            Message({
              message: '操作失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
          return true
        } else {
          return false
        }
      })
    },
    showMenuList() {
      console.log('menu-addition.vue methods showMenuList')
    },
    handleSelectChange(type, data) {
      console.log('menu-addition.vue methods handleSelectChange', type, data)
      this.form[type].label = data.label
      this.form[type].value = data.value
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-addition-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .content{
    background-color: #ffffff;
    padding-top: 16px;
    // padding-right: 40%;
    margin-top: 10px;
    .header{
      padding: 0 16px 16px 16px;
    }
    .main{
      max-width: 600px;
      padding-left: 20px;
    }
  }
}
</style>
