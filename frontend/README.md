# DIP Frontend

DIP 企业级 AI 应用平台的前端项目。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Rsbuild
- **UI 组件库**: Ant Design 6
- **路由**: React Router DOM
- **状态管理**: Zustand
- **富文本编辑器**: TipTap
- **样式**: Tailwind CSS + Less
- **代码规范**: Biome + Stylelint + Prettier
- **微前端**: qiankun

## 快速开始

### 安装依赖

```bash
yarn install
```

### 启动开发服务器

```bash
yarn run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 环境变量配置

如需本地调试后端 API，在 `.env.local` 中配置：

```bash
DEBUG_ORIGIN=https://your-backend-origin
PUBLIC_TOKEN=your_access_token
PUBLIC_REFRESH_TOKEN=your_refresh_token
```

开发模式下，前端优先读取 Cookie 进行认证；如果没有 Cookie，则使用 `PUBLIC_TOKEN` 和 `PUBLIC_REFRESH_TOKEN`。

### 生产构建

```bash
yarn run build
```

### 本地预览构建结果

```bash
yarn run preview
```

## 代码规范

### 代码检查与格式化

```bash
# 检查并自动修复 TypeScript/JavaScript 代码
yarn check

# 检查 TypeScript/JavaScript 代码（不自动修复）
yarn check:dry

# 格式化样式文件
yarn check:styles

# 运行所有检查
yarn check:all
```

### 提交前检查

提交代码前请确保：
- 所有代码检查通过
- 没有 lint 错误
- 构建成功

## 项目结构

```
frontend/
├── src/              # 源代码
├── public/           # 静态资源
├── charts/           # 图表相关
├── ci/               # CI 配置
├── biome.json        # Biome 配置
├── tailwind.config.ts # Tailwind CSS 配置
├── rsbuild.config.ts # Rsbuild 配置
└── package.json      # 项目依赖
```

## 更多信息

- [Rsbuild 文档](https://rsbuild.rs)
- [项目根目录 README](../README.md)
- [贡献指南](../CONTRIBUTING.md)

