# City Forge Studio

一个未来城市数字孪生设计台。你可以在网页里添加建筑模块、移动中心建筑、切换天气，并实时查看造价、能耗、生态值和结构强度。

## 它有什么用

- 做未来城市 / 智慧建筑的 3D 概念演示。
- 做数字孪生、城市规划、能源模拟的前端原型。
- 做路演 Demo，展示「模块化建筑 + 实时数据看板 + 3D 可视化」。
- 后续可继续接入真实建筑模型、城市数据、AI 生成模型或物理模拟。

## 技术栈

- React
- Vite
- Tailwind CSS
- Three.js
- React Three Fiber
- Drei

## 本地运行

先安装依赖：

```powershell
npm install
```

启动本地网页：

```powershell
npm run dev -- --host 0.0.0.0 --port 5173
```

然后打开：

```text
http://localhost:5173/
```

成功标志：

- 页面出现 `City Forge Studio` 顶部状态栏。
- 中间显示 3D 未来城市沙盘。
- 左侧点击模块后，中间会生成建筑。
- 右侧可以切换天气、移动建筑、查看实时数据。

## 常见排查

如果网页打不开：

```powershell
npm run dev -- --host 0.0.0.0 --port 5173
```

如果提示依赖缺失：

```powershell
npm install
```

如果端口被占用：

```powershell
npm run dev -- --host 0.0.0.0 --port 5174
```

然后访问：

```text
http://localhost:5174/
```

## 构建生产版本

```powershell
npm run build
```

成功标志：

- 终端显示 `built` 或 `✓ built`。
- 项目根目录生成 `dist/` 文件夹。

## 开源说明

本项目使用 MIT License。你可以自由学习、修改和二次开发。

注意：正式开源前，请不要提交 `.env`、密钥、账号信息、私有模型文件或未授权素材。
