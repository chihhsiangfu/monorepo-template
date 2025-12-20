# AGENTS.md

## 專案用途

本專案是一個現代化、高效能的 Monorepo 模板，專為可擴展的 Web 開發而設計。它強調開發者體驗、類型安全（Type Safety）以及高效的構建流水線（Build Pipelines）。

## 重要指示

- 請**使用繁體中文回應**，但程式碼內容除了註解使用繁體中文之外，其他都使用英文
- 修改程式碼時，**確保專案遵循 Ultracite 編碼標準**（參見 .claude/CLAUDE.md）
- 當修改完程式碼後，**一定要使用 `pnpm check-types`** 來確定是否有錯誤

## 架構與技術棧

### 核心技術

- **套件管理器**: `pnpm`（使用 workspaces 和 catalogs 進行依賴管理）
- **Monorepo 工具**: [Turborepo](https://turbo.build/)
- **前端框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **樣式方案**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI 組件**: [Radix UI](https://www.radix-ui.com/) primitives
- **程式碼檢查與格式化**: [Biome](https://biomejs.dev/)
- **套件打包 (Packages)**: [tsdown](https://github.com/egoist/tsdown)
- **驗證工具**: [Zod](https://zod.dev/)
- **測試框架**: [Vitest](https://vitest.dev/)

### 專案結構

```text
.
├── apps/
│   └── web/                # 主要 Next.js 應用程式
├── packages/
│   ├── _pkg/               # 共用邏輯套件 (@repo/pkg)
│   ├── _pkg-ui/            # 共用 UI 組件套件 (@repo/pkg-ui)
│   ├── _template/          # 新邏輯套件的模板
│   ├── _template-ui/       # 新 UI 套件的模板
│   └── typescript-config/  # 共用的 TypeScript 配置
├── biome.json              # Biome 配置文件
├── package.json            # 根目錄 package.json (指令腳本與 devDependencies)
├── pnpm-workspace.yaml     # pnpm workspace 配置文件
└── turbo.json              # Turborepo 配置文件
```

## 內部架構細節

### 依賴管理

專案使用 **pnpm catalogs**（定義於 `pnpm-workspace.yaml`）來管理 Monorepo 中的共用依賴。這確保了版本的一致性並簡化了版本更新。

- 在 `package.json` 中的用法：`"dependency": "catalog:"`

### 構建系統

使用 [Turborepo](https://turbo.build/) 來協調構建流程。

- **`turbo build`**: 依據正確的依賴順序構建所有應用程式與套件。
- **`turbo dev`**: 啟動所有開發伺服器。
- **`turbo check-types`**: 在整個工作區執行類型檢查。

### 套件腳手架 (Scaffolding)

- **`@repo/pkg`**: 使用 `tsdown` 進行打包的標準 TypeScript 套件模板。
- **`@repo/pkg-ui`**: 使用 Radix UI 與 Tailwind CSS 4 的 React 組件庫模板。

## 開發流程

### 前置作業

- Node.js (建議使用最新 LTS 版本)
- [pnpm](https://pnpm.io/)

### 開始使用

1. 安裝依賴：
   ```bash
   pnpm install
   ```
2. 啟動開發模式：
   ```bash
   pnpm dev
   ```
3. 構建專案：
   ```bash
   pnpm build
   ```

### 程式碼品質

- **檢查與格式化**：由 Biome 處理。
  ```bash
  pnpm check
  ```
- **Git Hooks**：使用 [Husky](https://typicode.github.io/husky/) 與 [lint-staged] 確保提交前的程式碼品質。

## AI 代理注意事項

- **路徑引用**：在引用工作區文件時，請始終使用絕對路徑。
- **工作區界限**：請注意 `apps/` 與 `packages/` 的界限。如果是可重複使用的組件，通常應放在 `@repo/pkg-ui` 中。
- **Tailwind 4**：請注意本專案使用的是 Tailwind CSS 4，其配置模式可能與 v3 不同。
