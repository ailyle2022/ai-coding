# Admin Frontend

基于Vue.js 3的管理后台前端应用程序，具有以下功能：

## 功能特性

1. 用户登录页面
2. 登录成功后跳转到主页
3. 登录失败时显示错误信息
4. 主页包含基本布局和用户信息展示
5. 登出功能

## 技术栈

- Vue.js 3
- Vue Router 4
- JavaScript (ES6+)

## 项目结构

```
src/
├── views/
│   ├── Login.vue     # 登录页面
│   └── Home.vue      # 主页
├── router/
│   └── index.js      # 路由配置
└── App.vue           # 根组件
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run serve
```

默认情况下，应用将在 http://localhost:8081 上运行。

### 构建生产版本

```bash
npm run build
```

## 登录测试

使用以下凭据进行测试：
- 用户名: admin
- 密码: admin

## 路由保护

主页路由(/home)受到保护，只有在用户登录并拥有有效token时才能访问。如果用户未登录，则会被重定向到登录页面。

## 本地存储

认证信息（token和用户信息）存储在浏览器的localStorage中：
- `authToken`: 用户认证token
- `user`: 用户信息对象

## 组件说明

### Login.vue
登录页面组件，包含：
- 用户名和密码输入框
- 登录按钮
- 错误信息显示
- 表单验证

### Home.vue
主页组件，包含：
- 顶部导航栏（显示用户名和登出按钮）
- 欢迎区域
- 数据统计卡片

## 注意事项

1. 当前实现使用模拟数据进行登录验证
2. 实际项目中应替换为真实的API调用
3. 为了安全起见，生产环境中不应将敏感信息存储在localStorage中