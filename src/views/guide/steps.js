const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: '侧边栏开关',
      description: '开 和 关闭侧边栏',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '面包屑',
      description: '指示当前的页面位置',
      position: 'bottom'
    }
  },
  {
    element: '#header-search',
    popover: {
      title: '搜索',
      description: '页面搜索，快速导航',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏',
      description: '设置页面全屏',
      position: 'left'
    }
  },
  {
    element: '#size-select',
    popover: {
      title: '字体大小',
      description: '改变系统字体大小',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '标签',
      description: '访问过的历史页面',
      position: 'bottom'
    },
    padding: 0
  }
]

export default steps
