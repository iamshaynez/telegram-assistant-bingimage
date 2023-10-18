# TA - Bing Image 基于 Bing Image Creator 的 DALLE3 作图

基于 Bing Web Image Creator 的 DALLE3 作图。集成与[TG-Assistant](https://github.com/iamshaynez/telegram-assistant)架构下。

## 说明

需要配置的变量：

- BING_TOKEN：bing.com cookie 中的_U的值。
- BING_COOKIE: 如果 TOKEN 不工作，返回「Cannot create image」这样的信息，尝试使用完整的 COOKIE

上述二选一，如果都配置，优先用 COOKIE。

```
BING_TOKEN=
BING_COOKIE=
```

