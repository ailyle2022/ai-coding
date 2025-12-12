import { createI18n } from 'vue-i18n'

// 定义语言包
const messages = {
  en: {
    message: {
      hello: 'Hello World',
      language: 'Language',
      switchLanguage: 'Switch Language'
    },
    sidebar: {
      dashboard: 'Dashboard',
      userManagement: 'User Management',
      roleManagement: 'Role Management',
      productStyles: 'Product Styles',
      logs: 'Logs',
      admin: 'Admin'
    },
    login: {
      username: 'Username',
      password: 'Password',
      login: 'Login',
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password'
    },
    users: {
      userList: 'User List',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      username: 'Username',
      email: 'Email',
      role: 'Role',
      actions: 'Actions',
      searchPlaceholder: 'Search username/email...',
      totalUsers: 'Total Users',
      onlineUsers: 'Online Users'
    },
    roles: {
      roleList: 'Role List',
      addRole: 'Add Role',
      editRole: 'Edit Role',
      deleteRole: 'Delete Role',
      roleName: 'Role Name',
      permissions: 'Permissions',
      rolesCount: 'User Roles'
    },
    productStyles: {
      productStyleList: 'Product Style List',
      addProductStyle: 'Add Product Style',
      editProductStyle: 'Edit Product Style',
      deleteProductStyle: 'Delete Product Style',
      name: 'Name',
      description: 'Description',
      status: 'Status'
    },
    dashboard: {
      recentActivity: 'Recent Activity',
      adminLogin: 'Admin user logged in',
      timeAgo: '{time} ago'
    }
  },
  zh: {
    message: {
      hello: '你好世界',
      language: '语言',
      switchLanguage: '切换语言'
    },
    sidebar: {
      dashboard: '仪表板',
      userManagement: '用户管理',
      roleManagement: '角色管理',
      productStyles: '产品样式',
      logs: '日志查看',
      admin: '超级管理员'
    },
    login: {
      username: '用户名',
      password: '密码',
      login: '登录',
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码'
    },
    users: {
      userList: '用户列表',
      addUser: '添加用户',
      editUser: '编辑用户',
      deleteUser: '删除用户',
      username: '用户名',
      email: '邮箱',
      role: '角色',
      actions: '操作',
      searchPlaceholder: '搜索 用户名/邮箱...',
      totalUsers: '总用户数',
      onlineUsers: '在线用户'
    },
    roles: {
      roleList: '角色列表',
      addRole: '添加角色',
      editRole: '编辑角色',
      deleteRole: '删除角色',
      roleName: '角色名称',
      permissions: '权限',
      rolesCount: '用户角色'
    },
    productStyles: {
      productStyleList: '产品样式列表',
      addProductStyle: '添加产品样式',
      editProductStyle: '编辑产品样式',
      deleteProductStyle: '删除产品样式',
      name: '名称',
      description: '描述',
      status: '状态'
    },
    dashboard: {
      recentActivity: '最近活动',
      adminLogin: '用户 Admin 登录系统',
      timeAgo: '{time}前'
    }
  }
}

// 获取浏览器语言
const getBrowserLocale = () => {
  const locale = navigator.language ? navigator.language.split('-')[0] : 'en' // 获取语言代码，例如'en'或'zh'
  return ['en', 'zh'].includes(locale) ? locale : 'en'
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用Composition API模式
  locale: localStorage.getItem('locale') || getBrowserLocale() || 'en', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages // 语言包
})

export default i18n