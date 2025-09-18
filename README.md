# ☕ 咖啡厅点单系统需求文档

## 技术栈

* 前端：Vue.js
* 后端：Node.js（Express/Koa/Nest.js 可选）
* 数据库：MySQL / PostgreSQL / MongoDB（具体可再定）

---

## 系统功能需求

### 1. 用户端

* **用户登录/注册**

  * 使用账号 + 密码登录
  * 管理员可创建账号（见管理员功能）
* **点单功能**

  * 用户可选择饮品、数量，提交订单
  * 订单需扣减当月额度
  * 若余额不足，则提示无法下单
* **个人额度查看**

  * 显示剩余额度、当月累计消费、下次额度重置日

---

### 2. 管理员后台

* **账号管理**

  * 新建账号（用户名、初始密码、角色：普通用户/管理员）
  * 编辑账号信息（修改额度、角色）
  * 冻结/启用账号
  * 重置密码
* **额度管理**

  * 为每个账号分配额度（按月额度）
  * 支持设置全局重置日（例如每月 1 号，或 15 号）
  * 支持个别账号特殊额度配置（覆盖全局规则）
* **订单管理**

  * 查看所有订单记录（支持过滤：时间、用户、状态）
  * 导出报表（CSV/Excel）

---

### 3. 系统配置

* **额度重置**

  * 支持全局设置额度重置日（如每月 1 日）
  * 支持后台修改该重置日并立即生效
* **Hook 系统**

  * 在关键事件提供钩子，允许二次开发/扩展：

    * 订单提交成功后（`afterOrderCreated`）
    * 订单支付失败（`afterOrderFailed`）
    * 额度重置后（`afterQuotaReset`）
  * Hook 应该是可插拔的，开发者可通过注册接口添加第三方逻辑

---

## 接口设计（示例）

### 用户相关

```http
POST /api/auth/login
POST /api/auth/register
GET  /api/user/me           # 获取个人信息及额度
```

### 管理员相关

```http
POST   /api/admin/users        # 创建用户
PUT    /api/admin/users/:id    # 修改用户
DELETE /api/admin/users/:id    # 删除用户
PUT    /api/admin/users/:id/quota   # 修改用户额度
GET    /api/admin/orders       # 查询订单列表
```

### 订单相关

```http
POST /api/orders               # 创建订单
GET  /api/orders/:id           # 查看订单详情
GET  /api/orders/me            # 用户个人订单列表
```

### 系统配置

```http
GET  /api/admin/config
PUT  /api/admin/config/quota-reset-day   # 修改额度重置日
```

---

## Hook 设计（事件接口）

每个 Hook 可以暴露一个事件订阅接口，允许注册函数或调用外部服务。

### 事件列表

* `afterOrderCreated(order)`
* `afterOrderFailed(order, reason)`
* `afterQuotaReset(user)`

### 示例：注册一个 Hook

```js
// hooks.js
module.exports = {
  afterOrderCreated: async (order) => {
    console.log("订单已创建：", order);
    // 可添加第三方推送逻辑，例如企业微信通知
  }
};
```

---

## 权限模型

* **普通用户**

  * 登录、点单、查询个人额度和订单
* **管理员**

  * 拥有所有普通用户功能
  * 额外拥有账号管理、额度管理、订单管理、系统配置权限

---

## 非功能需求

* **安全性**

  * 所有接口需 JWT 鉴权
  * 密码需加盐存储
* **性能**

  * 系统需支持至少 100 并发点单请求
* **可扩展性**

  * Hook 系统保证后续集成第三方系统的灵活性
