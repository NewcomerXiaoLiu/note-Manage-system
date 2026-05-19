# Note-Manage-System 个人笔记管理系统

轻量化个人笔记管理平台，支持笔记分类分组、笔记编辑管理、数据统计看板。

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite 6 + Ant Design Vue 4 + Pinia + Tailwind CSS 4
- **后端**: NestJS 11 + Cloudflare D1（SQLite 兼容）
- **部署**: Vercel 前后端分离部署

## 项目结构

```
note-Manage-system/
├── front-end/    # 前端项目（详见 front-end/README.md）
└── back-end/     # 后端项目（详见 back-end/README.md）
```

## 快速开始

### 后端

```bash
cd back-end
pnpm install
# 配置 .env 环境变量（参考 .env.example）
pnpm start:dev    # 启动开发服务（端口 3000）
```

Swagger 文档地址：`http://localhost:3000/api-docs/`

### 前端

```bash
cd front-end
pnpm install
pnpm dev          # 启动开发服务器（端口 9527），自动代理 /api → 后端
pnpm build:prod   # 生产构建
```

### 本地联调

1. 启动后端 `pnpm start:dev`（端口 3000）
2. 启动前端 `pnpm dev`（端口 9527）
3. 访问 `http://localhost:9527`，登录账号 admin / 123456

## 环境变量

### 后端（back-end/.env）

| 变量 | 说明 |
|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `CLOUDFLARE_D1_DATABASE_ID` | D1 数据库 ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `PORT` | 服务端口（默认 3000） |

### 前端（front-end/.env）

| 变量 | 说明 |
|------|------|
| `VITE_APP_API_HOST` | API 地址（开发环境使用本地代理不需要修改） |
| `VITE_APP_API_PREFIX` | API 前缀（默认 /api） |
| `VITE_PORT` | 开发端口（默认 9527） |

## 功能模块

| 模块 | 说明 |
|------|------|
| 工作台 | 笔记总数、分组总数、今日新增统计 |
| 分组管理 | 笔记分组 CRUD，支持排序 |
| 笔记管理 | 笔记 CRUD，富文本编辑，分组筛选 |

## API 文档

后端提供 Swagger 文档，启动后访问：
- 开发环境：`http://localhost:3000/api-docs/`

## 功能需求

详见 [requirements.md](./requirements.md)。
