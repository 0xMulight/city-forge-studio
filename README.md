# 🏙️ City Forge Studio

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/React-18-61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Three.js-r184-000000" alt="Three.js">
  <img src="https://img.shields.io/badge/Vite-5-646CFF" alt="Vite">
</p>

<p align="center">
  <b>未来城市数字孪生设计台 — 在 3D 沙盘里自由搭建模块化建筑，实时查看造价、能耗、生态值和结构强度。</b>
</p>

---

## 这是什么

一个基于 React + Three.js 的未来城市 3D 搭建工具。你可以在左侧选择建筑模块，在中间的 3D 沙盘中自由组合，右侧实时显示城市的四项核心指标。支持五种天气切换、霓虹强度调节、空中交通模拟和电影视角。

### 功能一览

| 功能 | 说明 |
|---|---|
| 🧱 9 种建筑模块 | 光伏冠层、居住环舱、生态核心、交通节点、承重框架、数据尖塔、无人机港、空中花园、聚变能源核 |
| 📊 实时数据看板 | 总造价、总能耗、生态值、结构强度，每添加一个模块即时刷新 |
| 🌤️ 5 种天气 | 晴天、雨天、雾天、雪天、风暴，含粒子特效和闪电 |
| 🎮 建筑定位 | 前后左右移动中心建筑，坐标实时显示 |
| 🌃 世界设定 | 城市密度、霓虹强度、空中交通、地面网格、扫描光环、自动巡航 |
| 📷 双镜头 | 自由探索 / 电影视角 |
| 💻 City OS 界面 | 霓虹科幻风格的 HUD 叠加层和系统状态面板 |

### 建筑模块详情

| # | 模块 | 造价 | 能耗 | 生态 | 强度 | 特点 |
|---|---|---|---|---|---|---|
| S | 光伏冠层 | 42 | -28 | 34 | 12 | 反向发电，太阳能板 |
| H | 居住环舱 | 58 | 18 | 12 | 28 | 环状居住区 |
| E | 生态核心 | 50 | 8 | 46 | 18 | 高生态值绿化 |
| T | 交通节点 | 36 | 12 | 8 | 22 | 双翼交通枢纽 |
| F | 承重框架 | 30 | 6 | 4 | 44 | 最高结构强度 |
| D | 数据尖塔 | 64 | 24 | 10 | 24 | 六角数据塔 |
| P | 无人机港 | 48 | 16 | 14 | 20 | 四角停机坪 |
| G | 空中花园 | 46 | 4 | 55 | 16 | 最高生态值 |
| R | 聚变能源核 | 72 | -42 | 18 | 30 | 最高发电量 |

## 快速开始

```bash
# 克隆
git clone https://github.com/0xMulight/city-forge-studio.git
cd city-forge-studio

# 安装
npm install

# 启动
npm run dev -- --host 0.0.0.0 --port 5173
```

打开 http://localhost:5173

## 操作指南

| 操作 | 方式 |
|---|---|
| 添加建筑 | 左侧面板点击模块 |
| 旋转视角 | 左键拖拽 |
| 平移视角 | 右键拖拽 |
| 缩放 | 滚轮 |
| 移动建筑 | 右侧"移动中心建筑"方向按钮 |
| 切换天气 | 右侧"天气系统"点击切换 |
| 清空重建 | 中间面板"清空建筑"按钮 |

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18 |
| 构建 | Vite 5 |
| 3D 引擎 | Three.js r184 |
| React 3D 绑定 | @react-three/fiber 8 |
| 3D 辅助 | @react-three/drei 9 |
| 样式 | Tailwind CSS 3 |
| 语言 | JavaScript (JSX) |

## 项目结构

```
city-forge-studio/
├── index.html                    # 入口 HTML
├── package.json                  # 依赖和脚本
├── vite.config.js                # Vite 配置
├── tailwind.config.js            # Tailwind 配置
├── postcss.config.js             # PostCSS 配置
├── src/
│   ├── main.jsx                  # React 挂载点
│   ├── App.jsx                   # 主应用（54KB，全部组件内联）
│   └── styles.css                # 全局样式 + 科幻 UI 主题
├── .github/workflows/
│   └── deploy.yml               # 🆕 自动部署到 GitHub Pages
└── README.md
```

## 部署

### 构建生产版本

```bash
npm run build
```

产物在 `dist/` 目录，可部署到任何静态托管。

### GitHub Pages（自动）

推送 `main` 分支自动触发构建和部署。在仓库 Settings → Pages 中启用 GitHub Actions 作为 Source。

## 用途

- 未来城市 / 智慧建筑的 3D 概念演示
- 数字孪生、城市规划、能源模拟的前端原型
- 路演 Demo："模块化建筑 + 实时数据看板 + 3D 可视化"
- 后续可接入真实建筑模型、城市数据、AI 生成模型或物理模拟

## 贡献

欢迎 PR 添加新的建筑模块、天气效果或城市元素。详见 `CONTRIBUTING.md`。

## 许可

MIT © 2026 [0xMulight](https://github.com/0xMulight)
