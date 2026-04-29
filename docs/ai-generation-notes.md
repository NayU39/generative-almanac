# AI Generation Notes

## 从旧项目迁移的 AI 资产

本项目只迁移了旧项目里与 AI 文本生成直接相关的资产，没有迁移任何旧前端页面、CSS 或 A4 海报模块。

保留的做法包括：

- `DeepSeek` 的服务端代理调用方式
- 使用 `DEEPSEEK_API_KEY` 与 `DEEPSEEK_MODEL` 的 env 约定
- 通过 Vite dev server 插件挂载本地 API 路由
- 前端调用本地 `/api/...` 路由，避免在浏览器暴露 API key
- AI 输出失败时走 mock fallback
- 对 AI 返回内容做结构化字段校验与归一化

## 保留的 prompt 规则

旧项目中关于“黄历内容应短、可执行、与用户当天输入相关”的规则被保留，并重写为更适合小票格式的版本：

- 输出必须是结构化 JSON
- 今日判断要简短明确
- `yi` 与 `ji` 各输出 3 到 5 条
- 内容优先贴合用户输入，不写空泛玄学套话
- meta 字段保持简洁，服务于 receipt 排版

## 新项目 AI 输出结构

当前项目目标结构为 `ReceiptAlmanac`：

```ts
type ReceiptAlmanac = {
  title: string
  subtitle: string
  issueCode: string
  serialNo: string
  date: {
    solar: string
    year: string
    month: string
    day: string
    weekdayZh: string
    weekdayEn: string
    lunar: string
    ganzhi: string
  }
  stateLabel: string
  headline: string
  yi: string[]
  ji: string[]
  meta: {
    auspiciousTime: string
    direction: string
    luckyColor: string
    energy: string
    memo: string
  }
  printedAt: string
  barcodeValue: string
}
```

## Mock Fallback 策略

- 当前前端默认可在 API 不可用时退回 mock
- 若本地未配置 `DEEPSEEK_API_KEY`，开发体验不会被阻塞
- mock 内容保持“安静午后 / 冷静执行”方向，保证 MVP 可演示

## API Key / Env 说明

- 在 `receipt-almanac/.env.local` 中配置：
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_MODEL`
- 示例变量保存在 `receipt-almanac/.env.example`
- API key 只在 Vite dev server 的服务端插件里读取，不进入浏览器端代码
