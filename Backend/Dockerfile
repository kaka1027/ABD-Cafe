# ABD-Cafe 后端 Dockerfile
# 使用多阶段构建优化镜像大小

# 阶段 1: 构建阶段
FROM docker-pull.ygxz.in/library/node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 Yarn 4.x
RUN corepack enable && corepack prepare yarn@4.10.1 --activate

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./
COPY .yarnrc.yml .yarnrc.yml

# 复制 .yarn 目录（如果使用 Yarn Berry）
COPY .yarn .yarn

# 安装依赖
RUN yarn install --immutable

# 复制源代码
COPY . .

# 构建 TypeScript 代码
RUN yarn build

# 阶段 2: 生产阶段
FROM docker-pull.ygxz.in/library/node:22-alpine

# 设置工作目录
WORKDIR /app

# 安装 Yarn 4.x
RUN corepack enable && corepack prepare yarn@4.10.1 --activate

# 只复制生产依赖
COPY package.json yarn.lock ./
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn .yarn

# 安装生产依赖
RUN yarn workspaces focus --production

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

# 复制环境变量示例文件（需要在运行时替换）
COPY .env.example .env.example

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 修改文件所有权
RUN chown -R nodejs:nodejs /app

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动命令
CMD ["yarn", "start"]
