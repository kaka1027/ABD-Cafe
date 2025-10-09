# ABD-Cafe 后端阿里云 Docker 部署指南

## 📦 需要打包的文件

将以下文件上传到阿里云服务器：

```
Backend/
├── src/                    # 源代码
├── config/                 # 配置文件
├── Dockerfile              # Docker 镜像构建文件
├── .dockerignore           # Docker 忽略文件
├── docker-compose.yml      # Docker Compose 配置
├── .env.example            # 环境变量示例
├── package.json            # 依赖配置
├── yarn.lock               # 依赖锁定文件
├── .yarnrc.yml             # Yarn 配置
├── .yarn/                  # Yarn 文件
└── tsconfig.json           # TypeScript 配置
```

---

## 🚀 部署步骤

### **步骤 1：准备阿里云服务器**

```bash
# SSH 登录到阿里云服务器
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
apt install docker-compose -y

# 验证安装
docker --version
docker-compose --version
```

---

### **步骤 2：上传代码到服务器**

**方法 A：使用 Git（推荐）**

```bash
# 在服务器上克隆仓库
cd /var/www
git clone https://github.com/your-username/ABD-Cafe.git
cd ABD-Cafe/Backend
```

**方法 B：使用 SCP 上传**

```bash
# 在本地电脑运行
scp -r D:\Maggie\Github\ABD-Cafe\Backend root@your-server-ip:/var/www/abd-cafe-backend
```

---

### **步骤 3：配置环境变量**

```bash
# 进入后端目录
cd /var/www/ABD-Cafe/Backend  # 或 /var/www/abd-cafe-backend

# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量
nano .env
```

**`.env` 文件配置：**

```env
NODE_ENV=production
PORT=3001

# 生成强随机 JWT 密钥
JWT_SECRET=your-super-secret-jwt-key-CHANGE-THIS-12345678

JWT_EXPIRES_IN=7d

# 前端域名（重要！）
FRONTEND_URL=https://kaka2772.cc
```

**生成随机 JWT 密钥：**

```bash
# 方法 1：使用 openssl
openssl rand -base64 32

# 方法 2：使用 node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### **步骤 4：构建并启动 Docker 容器**

```bash
# 构建 Docker 镜像
docker-compose build

# 启动容器（后台运行）
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

---

### **步骤 5：配置 Nginx 反向代理**

安装 Nginx：

```bash
apt install nginx -y
```

创建 Nginx 配置文件：

```bash
nano /etc/nginx/sites-available/abd-cafe
```

**配置内容：**

```nginx
server {
    listen 80;
    server_name kaka2772.cc www.kaka2772.cc;

    # 强制 HTTPS（稍后配置 SSL 后启用）
    # return 301 https://$server_name$request_uri;

    # ABD-Cafe 后端 API 反向代理
    location /ABD-Cafe/api {
        proxy_pass http://localhost:3001/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
# 创建软链接
ln -s /etc/nginx/sites-available/abd-cafe /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

### **步骤 6：配置 SSL 证书（HTTPS）**

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx -y

# 自动获取并配置 SSL 证书
certbot --nginx -d kaka2772.cc -d www.kaka2772.cc

# 测试自动续期
certbot renew --dry-run
```

---

### **步骤 7：验证部署**

```bash
# 检查后端健康状态
curl http://localhost:3001/health

# 检查 Nginx 反向代理
curl http://kaka2772.cc/ABD-Cafe/api

# 检查 HTTPS（配置 SSL 后）
curl https://kaka2772.cc/ABD-Cafe/api/auth/login
```

---

## 🔧 常用管理命令

### Docker 容器管理

```bash
# 查看运行中的容器
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 重启容器
docker-compose restart backend

# 停止容器
docker-compose stop

# 删除容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 代码更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 清理旧镜像
docker image prune -a
```

---

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs backend

# 检查端口占用
netstat -tulpn | grep 3001

# 检查环境变量
docker-compose config
```

### CORS 错误

检查 `.env` 文件中的 `FRONTEND_URL` 是否正确：

```env
FRONTEND_URL=https://kaka2772.cc
```

### Nginx 502 错误

```bash
# 检查后端是否运行
docker-compose ps

# 检查 Nginx 配置
nginx -t

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

---

## 📊 监控和日志

### 查看系统资源

```bash
# 查看 Docker 资源使用
docker stats

# 查看磁盘空间
df -h

# 查看内存使用
free -h
```

### 日志管理

```bash
# 实时查看日志
docker-compose logs -f backend

# 查看最近 100 行日志
docker-compose logs --tail=100 backend

# 清理日志
docker-compose logs --no-log-prefix backend > /dev/null
```

---

## 🎯 完整部署流程速查

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh

# 2. 克隆代码
git clone https://github.com/your-repo/ABD-Cafe.git
cd ABD-Cafe/Backend

# 3. 配置环境变量
cp .env.example .env
nano .env  # 修改 JWT_SECRET 和 FRONTEND_URL

# 4. 启动容器
docker-compose up -d

# 5. 安装 Nginx
apt install nginx -y

# 6. 配置 Nginx（见上面步骤 5）

# 7. 配置 SSL
apt install certbot python3-certbot-nginx -y
certbot --nginx -d kaka2772.cc

# 8. 验证
curl https://kaka2772.cc/ABD-Cafe/api/health
```

---

## ✅ 部署完成检查清单

- [ ] Docker 和 Docker Compose 已安装
- [ ] 后端代码已上传到服务器
- [ ] `.env` 文件已配置（JWT_SECRET、FRONTEND_URL）
- [ ] Docker 容器正常运行（`docker-compose ps`）
- [ ] Nginx 已配置反向代理
- [ ] SSL 证书已配置（HTTPS）
- [ ] API 可以正常访问（`curl https://kaka2772.cc/ABD-Cafe/api`）
- [ ] 前端可以正常调用后端 API
- [ ] 防火墙已开放 80、443 端口

---

## 🆘 需要帮助？

如果遇到问题，检查：

1. **容器日志**：`docker-compose logs -f backend`
2. **Nginx 日志**：`tail -f /var/log/nginx/error.log`
3. **环境变量**：确保 `FRONTEND_URL` 正确
4. **网络连接**：`curl http://localhost:3001/health`

Happy Deploying! 🚀
