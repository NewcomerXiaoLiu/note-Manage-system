# 个人笔记管理系统 — 后端

NestJS + Cloudflare D1 构建的后端服务。

## 技术栈

- **框架**: NestJS 11
- **数据库**: Cloudflare D1（SQLite 兼容，通过 HTTP REST API 连接）
- **验证**: class-validator + class-transformer
- **API 文档**: @nestjs/swagger（Swagger UI）
- **部署**: Vercel

## 目录结构

```
src/
├── main.ts                       # 入口（CORS、全局管道、Swagger）
├── app.module.ts                 # 根模块（@Global D1Service、全局拦截器/过滤器）
├── common/
│   ├── d1/d1.service.ts          # Cloudflare D1 HTTP API 封装
│   ├── filters/http-exception.filter.ts   # 全局异常过滤器
│   └── interceptors/response.interceptor.ts # 统一响应格式拦截器
├── modules/
│   ├── auth/                     # 登录 / 退出登录
│   ├── groups/                   # 笔记分组 CRUD
│   ├── notes/                    # 笔记 CRUD、分组筛选
│   └── dashboard/                # 工作台统计
└── database/
    └── schema.sql                # 建表语句（groups + notes）
```

## 快速开始

```bash
pnpm install
pnpm start:dev    # 启动开发服务（端口 3000）
pnpm build        # 编译
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `CLOUDFLARE_D1_DATABASE_ID` | D1 数据库 ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `PORT` | 服务端口（默认 3000） |

## API 接口

启动后访问 `http://localhost:3000/api-docs/` 查看 Swagger 文档。

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/login` | 用户登录（admin/123456） |
| POST | `/logout` | 退出登录 |
| GET | `/groups` | 全部分组（含笔记数） |
| GET | `/groups/:id` | 单个分组详情 |
| POST | `/groups` | 新增分组 |
| PUT | `/groups/:id` | 编辑分组 |
| DELETE | `/groups/:id` | 删除分组 |
| GET | `/notes` | 笔记列表（?groupId= 筛选） |
| GET | `/notes/:id` | 笔记详情 |
| POST | `/notes` | 新建笔记 |
| PUT | `/notes/:id` | 编辑笔记 |
| DELETE | `/notes/:id` | 删除笔记 |
| GET | `/dashboard/stats` | 工作台统计 |

## 统一响应格式

所有接口返回 `{code, msg, data}`：

```json
// 成功
{ "code": 200, "msg": "成功", "data": {...} }

// 失败
{ "code": 401, "msg": "账号或密码错误", "data": null }
```

- 正常响应由 `ResponseInterceptor` 自动包装
- 异常由 `AllExceptionsFilter` 统一捕获

## 认证

- 当前为硬编码验证：admin / 123456
- 登录成功返回 `{accessToken, name}`
- 无实际 Token 校验中间件

## 数据库

### 建表

在 Cloudflare Dashboard 中创建 D1 数据库后，执行 schema.sql：

```bash
wrangler d1 execute note-manage-db --file=src/database/schema.sql
```

### 表结构

**groups（分组）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键（nanoid） |
| name | TEXT | 分组名称 |
| sort_order | INTEGER | 排序序号 |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

**notes（笔记）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键（nanoid） |
| group_id | TEXT | 外键 → groups.id |
| title | TEXT | 笔记标题 |
| content | TEXT | 笔记内容（HTML） |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |
