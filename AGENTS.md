# AGENTS.md — City Forge Studio

未来城市 3D 数字孪生搭建工具。React + Three.js + Vite + Tailwind CSS。

## 项目概述

在 3D 沙盘中自由搭建模块化未来城市建筑。左侧选模块，中间 3D 预览，右侧实时数据看板。

## 快速启动

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## 构建

```bash
npm run build     # 输出到 dist/
npm run preview   # 预览构建产物
```

## 架构

- 单文件组件架构 — `src/App.jsx` 包含所有 UI 和 3D 逻辑（约 54KB）
- Three.js 通过 @react-three/fiber 集成
- 所有 3D 模型用基础几何体程序化生成（无外部模型文件）
- Tailwind CSS 负责 UI 样式，科幻霓虹主题

## 关键文件

| 文件 | 内容 |
|---|---|
| `src/App.jsx` | 全部组件：CityWorld、BuildingScene、WeatherSystem、各模块 Mesh、HUD |
| `src/styles.css` | 科幻 UI 主题、扫描线、霓虹光晕、动画 |
| `index.html` | 入口，lang="zh-CN" |

## 添加新建筑模块

1. 在 `availableModules` 数组中添加 `modulePreset(...)` 调用
2. 创建对应的渲染函数（如 `SolarCrown`）
3. 在 `ArchitecturalModule` 的 switch 中添加 case

模块参数：`modulePreset(id, name, icon, cost, energy, eco, structure, tailwindColor, threeColor, modelKey)`

## 添加新天气

1. 在 `weatherOptions` 中添加条目
2. 在 `weatherProfiles` 中添加光照/雾参数
3. 在 `WeatherSystem` 中添加渲染逻辑
