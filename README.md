# 街口全端團隊作業 - Auth 驗證系統伺服器

此為作業使用的 OAuth 伺服器專案，如同 [Shop 專案](https://github.com/lulu2002/jkopay-assignment-oauth-shop-app)，一樣分為前後端。

---

## 如何下載並在本地運行專案

以下是如何下載此專案並在本地環境運行的步驟：

### 前置需求

- **Node.js**：請確保已安裝 Node.js
- **npm 或 yarn**：Node.js 的套件管理工具。

### 下載專案

1. **複製此儲存庫**

   ```bash
   git clone https://github.com/lulu2002/simple-oauth-server
   ```
2. **進入專案目錄**

   ```bash
   cd simple-oauth-server
   ```

### 安裝後端依賴項

1. **進入後端目錄**

   ```bash
   cd backend   
   ```

2. **安裝依賴項**

   ```bash
   npm install   # 或者使用 yarn install
   ```
3. **填入環境變數**

   在根目錄下創建一個 `.env` 文件，並添加必要的配置，關於 OAUTH
   的設定，需要與 [OAuth伺服器](https://github.com/lulu2002/simple-oauth-server) 一致

   ```env
    JWT_SECRET=

    #測試用的 OAuth 帳號，會預設建立
    PREDEFINE_CLIENT_ID=
    PREDEFINE_CLIENT_NAME=
    PREDEFINE_CLIENT_SECRET=
    PREDEFINE_CLIENT_REDIRECT_URI=

    PORT=8081
    HOST=localhost
   ```

4. **運行後端服務**

   ```bash
   npm run start:local  # 開發模式下運行
   ```

### 安裝前端依賴項

1. **開啟一個新的終端並進入前端目錄**

   ```bash
   cd frontend   
   ```

2. **安裝依賴項**

   ```bash
   npm install   
   ```
3. 在根目錄下創建一個 `.env.development` 文件，並添加必要的配置，關於 OAUTH
   的設定，需要與 [OAuth伺服器](https://github.com/lulu2002/simple-oauth-server) 一致

   ```env
   VITE_API_URL=後端服務運行的 URL 和 PORT
   ```

4. **運行前端應用**

   ```bash
   npm run dev   # 開發模式下運行
   ```

### 測試應用

- 在瀏覽器中訪問 `http://localhost:5001`（或終端中顯示的前端運行地址），即可查看前端應用。
- 後端 API 默認運行在 `http://localhost:<環境變數設定的 PORT>`。

---

## 開發框架

### 後端

- **語言**：TypeScript
- **執行環境**：Node.js
- **Web 框架**：Fastify
- **資料庫 ORM**：TypeORM
- **資料庫**：SQLite（用於 Demo）
- **測試框架**：Jest

### 前端

- **語言**：TypeScript
- **框架**：React.js
- **建構工具**：Vite
- **測試框架**：Jest

---

## 心路歷程和開發選擇

關於開發方法和策略，統一寫在了 Shop 專案的 README.md 中，請參考 [專案連結](https://github.com/lulu2002/jkopay-assignment-oauth-shop-app?tab=readme-ov-file#%E9%96%8B%E7%99%BC%E6%96%B9%E6%B3%95)