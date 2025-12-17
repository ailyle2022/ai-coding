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

## API 接口文档

### GraphQL 登录接口

URL: `/graphql`

Mutation:
```
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
    }
    isSuccess
    message
    mfaChallengeId
  }
}
```

变量:
```json
{
  "input": {
    "username": "admin",
    "password": "admin"
  }
}
```

成功响应(未启用MFA):
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.5fF9f2vYHQVyzmy6K0sJiMS7qNgqMV7w",
      "user": {
        "id": 1,
        "username": "admin"
      },
      "isSuccess": true,
      "message": "",
      "mfaChallengeId": ""
    }
  }
}
```

MFA验证响应(启用MFA):
```json
{
  "data": {
    "login": {
      "token": "",
      "user": null,
      "isSuccess": false,
      "message": "MFA_REQUIRED",
      "mfaChallengeId": "challenge-id-string"
    }
  }
}
```

### GraphQL MFA验证接口

URL: `/graphql`

Mutation:
```
mutation VerifyMFA($input: MFAVerifyInput!) {
  verifyMFA(input: $input) {
    token
    user {
      id
      username
    }
    isSuccess
    message
  }
}
```

变量:
```json
{
  "input": {
    "mfaChallengeId": "challenge-id-string",
    "mfaCode": "123456"
  }
}
```

成功响应:
```json
{
  "data": {
    "verifyMFA": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.5fF9f2vYHQVyzmy6K0sJiMS7qNgqMV7w",
      "user": {
        "id": 1,
        "username": "admin"
      },
      "isSuccess": true,
      "message": ""
    }
  }
}
```

### GraphQL MFA设置接口

URL: `/graphql`

Mutation:
```
mutation SetupMFA($userId: Int!) {
  setupMFA(userId: $userId) {
    secret
    uri
    mfaChallengeId
  }
}
```

变量:
```json
{
  "userId": 1
}
```

成功响应:
```json
{
  "data": {
    "setupMFA": {
      "secret": "MFA_SECRET_KEY",
      "uri": "otpauth://totp/AdminGateway:1?secret=MFA_SECRET_KEY&issuer=AdminGateway",
      "mfaChallengeId": "challenge-id-string"
    }
  }
}
```

### GraphQL MFA确认接口

URL: `/graphql`

Mutation:
```
mutation ConfirmMFA($input: MFAVerifyInput!) {
  confirmMFA(input: $input) {
    isSuccess
    message
  }
}
```

变量:
```json
{
  "input": {
    "mfaChallengeId": "challenge-id-string",
    "mfaCode": "123456"
  }
}
```

成功响应:
```json
{
  "data": {
    "confirmMFA": {
      "isSuccess": true,
      "message": "MFA setup completed successfully"
    }
  }
}
```

## 日志系统

项目使用 Winston 作为日志框架，结合 nest-winston 实现 NestJS 与 Winston 的无缝集成。日志系统具有以下特点：

### 功能特性
- 多级别日志记录（error、warn、info、debug）
- 控制台彩色输出（开发环境）
- 文件日志记录，支持按天轮转
- 错误日志单独存储，包含完整堆栈信息
- JSON 格式日志，便于集中收集和分析
- 可配置的日志级别

### 配置详情
- 日志目录：`logs/`（自动创建）
- 错误日志文件：`error-%DATE%.log`
- 综合日志文件：`combined-%DATE%.log`
- 日志文件轮转：按天轮转，保留最近2个文件
- 文件大小限制：每个日志文件最大1KB
- 默认日志级别：info（可通过LOG_LEVEL环境变量调整）

### 使用方式
在服务中注入日志记录器：
```typescript
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class MyService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  myMethod() {
    this.logger.info('This is an info message');
    this.logger.error('This is an error message', { trace: 'some error trace' });
  }
}
```

## 消息队列系统

### RabbitMQ
- 用于服务间异步通信
- 实现事件发布/订阅模式
- 支持广播消息到多个服务

### BullMQ
- 用于任务队列处理
- 支持延迟任务、重试机制
- 提供任务监控和管理界面

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