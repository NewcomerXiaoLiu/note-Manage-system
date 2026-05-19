# CLAUDE.md

个人笔记管理系统前端项目，基于 Vue 3 + TypeScript + Vite 6 + Ant Design Vue 4。

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **语言**: TypeScript ~5.6
- **构建工具**: Vite 6
- **组件库**: Ant Design Vue 4
- **状态管理**: Pinia (with pinia-plugin-persistedstate)
- **路由**: Vue Router 4
- **HTTP**: Axios（请求去重/取消、统一拦截）
- **富文本**: @wangeditor/editor（非 Vue 封装版，DOM 初始化）
- **CSS**: Tailwind CSS 4 + SCSS
- **图表**: ECharts 5
- **Mock**: Mock.js（vite-plugin-mock）

## 设计主题

- **风格**: "Crisp White" 清爽留白
- **主色**: Teal `#3D9B8F`
- **背景**: 白色 + 浅灰 `#F8F9FA`
- **字体**: DM Sans（本地 woff2）
- **侧边栏**: 白色，无深色背景
- **Token**: Ant Design ConfigProvider 统一管理
- **CSS 变量**: `theme.scss` 定义全局设计 Token

## 常用命令

```bash
pnpm dev              # 启动开发服务器（端口 9527）
pnpm build:prod       # 生产构建
pnpm lint:ts          # TypeScript 类型检查 (vue-tsc --noEmit)
pnpm lint:eslint      # ESLint 修复
pnpm lint:prettier    # Prettier 格式化
pnpm commit           # commitizen 交互式提交
```

## 项目结构

```
src/
├── api/               # Axios 封装 + 请求方法 + 接口模块
│   ├── index.ts       # 实例创建、请求/响应拦截
│   ├── methods.ts     # get/post/put/patch/del/download/upload
│   ├── helper.ts      # 请求去重（cancelToken）
│   └── modules/       # auth / groups / notes / dashboard
├── assets/
│   ├── styles/        # theme.scss / common.scss / reset.scss / app.scss
│   ├── fonts/         # DM Sans woff2
│   └── img/           # favicon、project.png
├── components/
│   └── core/
│       └── layout/    # 布局组件（sidebar、header、logo、menu）
├── config/            # 全局常量配置
├── directives/        # auth / highlight / ripple 指令
├── enums/             # HTTP 状态码枚举
├── hooks/             # useEcharts 等组合式函数
├── mock/              # Mock 数据
├── router/            # 路由配置
│   ├── index.ts       # 路由实例
│   ├── routes/        # 静态 + 动态路由定义
│   ├── modules/       # home / groups / notes（按业务拆分）
│   └── guards/        # beforeEach 路由守卫
├── store/             # Pinia 状态管理
│   └── modules/       # user / menu / setting / keepAlive
├── types/             # TS 类型声明
├── utils/             # 工具函数（路由、版本检查、存储等）
└── views/             # 页面组件
    ├── login/         # 登录页
    ├── home/          # 工作台（统计看板）
    ├── groups/        # 分组管理
    ├── notes/         # 笔记列表 + 笔记编辑
    └── result/        # 403 / 404 / 500 错误页
```

## 核心架构

### 路由
- **静态路由**: 登录页 `/login`、错误页、布局容器
- **动态路由**: `router/modules/` 中导出，路由守卫动态注册到 layout 下
- 路由组件路径使用字符串（如 `'/notes/index'`），`generateRouter()` 通过 `import.meta.glob` 解析

### API 层
- Axios baseURL 为 `/api`，开发环境由 Vite 代理转发到 `localhost:3000`
- 响应拦截接受 HTTP 200/201 + 业务 code 0/200 为成功
- 401 自动触发登出
- `config.isNotIntercept` 可跳过响应拦截

### 错误处理
- 使用 `await-to-js`：`const [err, res] = await to(fn())`
- 组件内仅处理 err 判断，不包裹 try/catch

### 状态管理
- **userStore**: 登录状态、用户信息、退出登录
- **menuStore**: 菜单列表、动态路由生成
- **settingStore**: 系统设置（持久化）
- **keepAliveStore**: 缓存路由组件

## 页面列表

| 路由 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录页 | 品牌区 + 表单，验证码 |
| `/home` | 工作台 | 统计卡片 + 近期笔记 |
| `/groups` | 分组管理 | 表格 CRUD |
| `/notes` | 笔记列表 | 左右分栏，列表 + 详情 |
| `/notes/edit/:id?` | 笔记编辑 | 富文本编辑器（wangEditor） |

## 代码规范
- ESLint: 单引号、分号结尾、import 自动排序
- commitlint: conventional commits
- Husky: pre-commit lint-staged + commit-msg commitlint
