# 项目 README

这是一个空的新项目。本 README 文件将用于记录所有项目需求和变更。

## 项目信息

- 项目名称：Admin Gateway System
- 创建日期：2025年
- 开发环境：前端Vue3, 后端NestJS, 数据库PostgreSQL, 缓存Redis

## 目录结构

```
.
├── admin-frontend/        # Vue3 管理前台
│   └── src/               # 前端源码目录
│       ├── assets/        # 静态资源
│       ├── components/    # 公共组件
│       ├── pages/         # 页面组件
│       ├── router/        # 路由配置
│       ├── store/         # 状态管理
│       ├── utils/         # 工具函数
│       └── views/         # 视图组件
├── admin-gateway/         # NestJS 后台网关服务
│   └── src/               # 后端源码目录
│       ├── modules/       # 功能模块
│       │   ├── auth/      # 认证模块
│       │   ├── user/      # 用户模块
│       │   ├── role/      # 角色模块
│       │   └── product-style/ # 产品款式模块
│       ├── controllers/   # 控制器
│       ├── services/      # 服务层
│       ├── models/        # 数据模型
│       └── main.ts        # 应用入口文件
├── product-service/       # 产品服务
├── order-service/         # 订单服务
└── docker-compose.yml     # Docker编排文件
```

## 技术栈详情

### 核心技术栈
- 前端：Vue3 + Apollo Client + TailwindCSS
- 后端：NestJS + GraphQL + TypeORM
- 数据库：PostgreSQL
- 缓存：Redis
- 消息队列：RabbitMQ
- 任务队列：BullMQ
- 容器化：Docker + Docker Compose
- 日志系统：Winston

### 微服务架构
- admin-gateway：管理后台网关服务
- product-service：产品管理服务
- order-service：订单管理服务

## 需求记录

### 初始需求
- 这是一个空的新项目，需要创建一个 readme 文件记录所有的需求和变化。
- 实现一个基于 Vue3 的管理前台界面
- 实现一个基于 NestJS 的后端服务，提供 RESTful API 接口
- 使用 PostgreSQL 作为主要数据存储
- 使用 Redis 作为缓存系统
- 实现管理员登录接口（使用 GraphQL）

## 变更历史

### v0.1.0 (初始版本)
- 创建了 README.md 文件
- 记录了初始需求

### v0.2.0 (目录结构调整)
- 添加了 admin-frontend 目录，用于存放 Vue3 管理前台代码
- 添加了 admin-gateway 目录，用于存放 NestJS 服务端代码
- 更新了目录结构说明

### v0.3.0 (NestJS 模块结构优化)
- 在 admin-gateway 中按照功能划分了 modules/controllers/services/models 目录结构
- 创建了基础的 app.module.ts 和 main.ts 入口文件

### v0.4.0 (添加GraphQL登录接口)
- 在 admin-gateway 中添加了基于 GraphQL 的登录接口
- 创建了认证模块 (auth module)，包含服务和解析器
- 用户名和密码均为 "admin" 时登录成功
- 在 README 中添加了 GraphQL 接口文档

### v0.5.0 (用户管理和角色管理功能)
- 在 admin-gateway 中添加了用户管理模块
- 在 admin-gateway 中添加了角色管理模块
- 实现了用户的增删改查功能
- 实现了角色的增删改查功能
- 在 admin-frontend 中添加了对应的用户和角色管理界面

### v0.6.0 (产品款式管理功能)
- 在 admin-gateway 中添加了产品款式管理模块
- 实现了产品款式的增删改查功能
- 在 admin-frontend 中添加了对应的产品款式管理界面

### v0.7.0 (多因素认证MFA功能)
- 在 admin-gateway 中增强了认证模块，添加了MFA支持
- 实现了登录时的MFA验证流程
- 实现了MFA设置和绑定功能
- 在 admin-frontend 中添加了MFA设置界面
- 修复了MFA验证中的一些问题

### v0.7.1 (MFA功能完善)
- 修复了MFA设置页面的多语言支持问题
- 完善了登录流程，支持MFA验证
- 更新了相关API文档

### v0.8.0 (消息队列系统集成)
- 集成RabbitMQ用于服务间异步通信
- 集成BullMQ用于任务队列处理
- 在order-service中实现基于BullMQ的任务处理机制
- 在admin-gateway中实现基于RabbitMQ的事件发布机制
- 更新了项目技术栈和架构说明

### v0.9.0 (日志系统集成)
- 集成Winston日志框架，提供统一的日志记录能力
- 在order-service中实现完整的日志配置，包括控制台输出和文件记录
- 支持日志级别控制、文件轮转和错误日志分离
- 更新了项目技术栈和架构说明