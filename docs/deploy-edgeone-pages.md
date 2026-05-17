# EdgeOne Pages 适配说明

本项目现在有两套彼此独立的服务端实现：

- Vercel 使用 [api/receipt-almanac/generate.js](/E:/receipt-almanac/api/receipt-almanac/generate.js:1)
- EdgeOne Pages 使用 [edge-functions/api/receipt-almanac/generate.js](/E:/receipt-almanac/edge-functions/api/receipt-almanac/generate.js:1)

前端仍然统一请求：

- `/api/receipt-almanac/generate`

这样做的好处是：

- 不需要改前端业务逻辑
- Vercel 和 EdgeOne 各自走各自的平台约定
- 一边部署调整不会影响另一边

## EdgeOne Pages 目录约定

根据 EdgeOne Pages 官方文档，`/edge-functions/api/...` 会映射为站点下的 `/api/...` 路由。

本项目对应关系：

- `edge-functions/api/receipt-almanac/generate.js`
- 映射到 `/api/receipt-almanac/generate`

## EdgeOne Pages 控制台配置

在 EdgeOne Pages 项目里添加环境变量：

- `DEEPSEEK_API_KEY`
- 可选：`DEEPSEEK_MODEL=deepseek-v4-flash`

注意：

- 必须配置在 EdgeOne Pages Functions 可读取的环境变量里
- 不是只配静态站点构建变量
- 配置后需要重新部署，使函数拿到新变量

## 部署步骤

1. 将当前仓库连接到 EdgeOne Pages。
2. 保持前端构建输出为 Vite 默认静态站点。
3. 确保仓库包含 `edge-functions/api/receipt-almanac/generate.js`。
4. 在 EdgeOne Pages 项目中配置 `DEEPSEEK_API_KEY`。
5. 重新触发部署。
6. 部署完成后，验证：
   - 首页能打开
   - `POST /api/receipt-almanac/generate` 返回 JSON

## 排错

如果页面能打开但 AI 不生效，优先检查：

- `POST /api/receipt-almanac/generate` 是否返回 200
- 返回体里是否包含 `warning`
- EdgeOne Functions 日志里是否有 DeepSeek 请求失败信息
- 环境变量是否配置在函数可读环境中

如果返回：

- `warning: DEEPSEEK_API_KEY is missing, fallback to mock.`

说明函数已运行，但没读到密钥；这通常不是前端问题，而是 EdgeOne 环境变量位置或部署刷新问题。

