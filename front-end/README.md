# 个人笔记管理系统 — 前端

Vue 3 + TypeScript + Vite 6 + Ant Design Vue 4 搭建的后台管理前端。

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **语言**: TypeScript ~5.6
- **构建工具**: Vite 6
- **UI 组件库**: Ant Design Vue 4
- **状态管理**: Pinia（pinia-plugin-persistedstate 持久化）
- **路由**: Vue Router 4
- **HTTP 请求**: Axios（请求去重/取消拦截器）
- **富文本**: @wangeditor/editor
- **CSS**: Tailwind CSS 4 + SCSS
- **图表**: ECharts 5
- **Mock**: Mock.js（vite-plugin-mock）

## 目录结构

```
src/
├── api/               # Axios 封装 + 请求方法 + 接口模块
├── assets/            # 样式、图片、字体、SVG
├── components/        # 通用组件（布局等）
├── config/            # 全局配置
├── directives/        # 自定义指令（权限/高亮/水波纹）
├── enums/             # HTTP 状态码枚举
├── hooks/             # 组合式函数（useEcharts）
├── mock/              # Mock 数据
├── router/            # 路由 + 守卫
├── store/             # Pinia 状态管理
├── types/             # TS 类型定义
├── utils/             # 工具函数
└── views/             # 页面组件
    ├── login/         # 登录页
    ├── home/          # 工作台统计
    ├── groups/        # 分组管理
    ├── notes/         # 笔记列表 + 编辑
    └── result/        # 403/404/500 错误页
```

## 常用命令

```bash
pnpm dev              # 启动开发服务器（端口 9527）
pnpm build:prod       # 生产构建
pnpm lint:ts          # TS 类型检查（vue-tsc --noEmit）
pnpm lint:eslint      # ESLint 修复
pnpm lint:prettier    # Prettier 格式化
pnpm commit           # commitizen 交互式提交
```

## 页面功能

| 路由 | 页面 | 功能 |
|------|------|------|
| `/login` | 登录页 | 账号密码 + 验证码登录 |
| `/home` | 工作台 | 笔记/分组统计卡片、近期新增列表 |
| `/groups` | 分组管理 | 表格 CRUD、排序 |
| `/notes` | 笔记列表 | 左右分栏：列表 + 详情 |
| `/notes/edit/:id?` | 编辑笔记 | 富文本编辑器（新增/编辑） |

## 开发联调

1. 启动后端（端口 3000）
2. 执行 `pnpm dev`（端口 9527）
3. Vite 自动代理 `/api` → `http://localhost:3000`
4. 登录账号 admin / 123456

## 环境变量

| 文件 | 用途 |
|------|------|
| `.env` | 通用配置 |
| `.env.development` | 开发环境 |
| `.env.test` | 测试环境 |
| `.env.production` | 生产环境 |

## 代码规范

- ESLint（单引号、分号、import 排序、未使用导入删除）
- Prettier + Stylelint
- Husky + commitlint + lint-staged
