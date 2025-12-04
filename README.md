# JSON 美容院 | JSON Salon

> [← 回到 Muripo HQ](https://tznthou.github.io/muripo-30days)

**TL;DR**: 貼上亂糟糟的 JSON，得到漂亮整齊的 JSON。特別適合編輯 MCP 設定檔！

## Demo

![JSON Salon Demo](assets/demo.png)

## 功能

- **即時美化**：貼上 JSON 立即看到美化結果
- **Keys 排序**：自動按字母排序所有 keys，方便閱讀和比對
- **語法檢查**：錯誤時告訴你哪一行出問題，還會猜測可能的原因
- **一鍵複製**：複製美化後的結果，直接貼回設定檔

## 使用場景

編輯 MCP 設定檔（`claude_desktop_config.json`）時：

1. 複製整個設定檔內容
2. 貼到 JSON 美容院
3. 確認格式正確、看看哪裡要改
4. 複製美化結果貼回去

從網路複製 JSON 片段時：

1. 複製 JSON 片段
2. 點「貼上剪貼簿」
3. 確認語法正確
4. 複製使用

## 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Cmd/Ctrl + Enter` | 複製結果 |
| `Cmd/Ctrl + Shift + V` | 貼上並處理 |

## 選項

- **排序 Keys**：開啟後會按字母順序排序所有物件的 keys
- **縮排**：可選擇 2 spaces、4 spaces 或 Tab

## 成就系統

使用過程中可能解鎖：

- 美容初體驗：第一次成功美化 JSON
- JSON 巨獸馴服師：美化超過 5000 字元的 JSON
- MCP 設定大師：美化包含 `mcpServers` 的設定檔

## 本地開發

```bash
# 直接用瀏覽器開啟
open index.html

# 或用任何靜態伺服器
npx serve .
```

## License

MIT

---

**Muripo Day 06** - 讓您的 JSON 煥然一新 ✨
