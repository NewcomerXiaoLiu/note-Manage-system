# CLAUDE.md

# 个人笔记管理系统 Note-Manage-System

## 项目简介
个人笔记管理系统，基于前后端分离架构，实现笔记分组管理、笔记编辑、工作台数据统计等核心功能。
后端使用 NestJS 11 + Cloudflare D1 无服务数据库，前端使用 Vue 3 + Vite 6 + Ant Design Vue 4。

## 技术栈
- **前端**：Vue 3 + TypeScript + Vite 6 + Ant Design Vue 4 + Pinia + Tailwind CSS 4
- **后端**：NestJS 11 + class-validator + @nestjs/swagger
- **数据库**：Cloudflare D1（SQLite 兼容，通过 REST API 连接）
- **部署**：Vercel 前后端分离部署

## 项目结构
```
note-Manage-system/
├── front-end/          # 前端项目
│   └── README.md       # 前端说明文档
├── back-end/           # 后端项目
│   ├── README.md       # 后端说明文档
│   └── src/
│       ├── common/     # 公共模块（D1 服务、过滤器、拦截器）
│       ├── modules/    # 业务模块（auth/groups/notes/dashboard）
│       └── main.ts     # 入口（含 Swagger 文档配置）
├── README.md           # 项目总说明
├── requirements.md     # 项目功能需求文档
└── CLAUDE.md           # 当前文件（AI 项目级指引）
```

## 后端核心约定

### 统一响应格式
所有接口返回统一格式：
```json
{ "code": 200, "msg": "成功", "data": ... }
```
- 正常响应由 `ResponseInterceptor` 自动包装为 `{code:200, msg:"成功", data}`
- 异常响应由 `AllExceptionsFilter` 捕获为 `{code:status, msg:错误信息, data:null}`

### API 前缀规则
- 后端路由无全局前缀
- 前端通过 Vite 代理 `/api` → `http://localhost:3000`（开发环境）
- 前端 Axios baseURL 固定为 `/api`

### 认证方式（硬编码）
- 仅支持预设账号登录验证，无用户表
- 登录成功返回 `{accessToken, name}`，无实际 Token 校验

### 数据库
- Cloudflare D1，通过 `D1Service` 封装 HTTP REST API
- 表结构：`groups`（分组）、`notes`（笔记，外键关联 groups）
- `nanoid` 生成主键 ID

### Swagger 文档
- 启动后访问 `http://localhost:3000/api-docs/`
- 所有接口已标注 `@ApiTags`、`@ApiOperation`、DTO 属性描述

## 前端核心约定

### 设计主题：Warm Walnut（暖胡桃）
- 温暖质感风格，主色 Terracotta `#C1694F`，暖白背景 + 暖灰底色
- 页面背景 `#F5F0EB`，卡片背景 `#FFFAF5`
- Ant Design ConfigProvider 统一管理主题 Token（`App.vue`）
- SCSS 自定义属性（`theme.scss`）全局设计 Token
- 衬线字体 Newsreader（标题）+ DM Sans（正文）搭配

### 主题切换（Layout 模式）
- Layout 支持两种模式：`system`（系统菜单）和 `notes`（笔记菜单）
- 由 `settingStore.menuMode` 控制，持久化存储
- Header 折叠按钮旁有切换按钮（BookOutlined / AppstoreOutlined）
- 笔记模式侧边栏显示分组树（`sidebar-groups.vue`），内容区显示笔记列表+详情（`notes-content.vue`）
- 模式切换纯组件级渲染，不涉及路由改动

### 路由
- 静态路由：登录页、错误页、布局容器
- 动态路由：`router/modules/` 按业务拆分，路由守卫中动态注册到 layout
- 路由组件路径使用字符串形式，由 `import.meta.glob` 解析

### API 层
- Axios 实例统一管理请求/响应拦截
- 响应拦截器接受 HTTP 200/201，业务 code 0/200
- `await-to-js` 错误处理模式：`const [err, res] = await to(fn())`

### 富文本编辑器
- 使用 `@wangeditor/editor`（非 Vue 封装版）
- DOM 方式初始化，`onChange` 同步 HTML 内容到表单
