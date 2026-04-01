# 个人工作站网站设计

## 概述

个人浏览器起始页，帮助用户快速访问常用网站。

## 视觉设计

### 布局结构
- **侧边栏**（左侧，可折叠）
  - 显示分类列表
  - 每个分类显示名称和颜色指示
  - 支持创建、编辑、删除、重排序分类
  - 折叠时显示为图标栏

- **主区域**（右侧）
  - 网格布局展示网站卡片
  - 响应式：列数根据宽度自适应（1-6列）

### 卡片设计
- 网站图标（自动获取favicon，失败时显示占位图）
- 网站名称（显示在图标下方）
- 用户自定义背景色（可选，默认为透明）
- 悬停时显示编辑/删除按钮
- 点击跳转到对应网站

### 配色方案
- 背景色：#1a1a2e（深色主题）
- 侧边栏背景：#16213e
- 卡片背景：#0f3460
- 强调色：#e94560
- 文字色：#eaeaea

## 数据模型

### JSON 文件结构
```json
{
  "categories": [
    { "id": "uuid", "name": "分类名称", "color": "#hex" }
  ],
  "sites": [
    {
      "id": "uuid",
      "name": "网站名称",
      "url": "https://example.com",
      "icon": "https://example.com/favicon.ico",
      "categoryId": "uuid",
      "bgColor": "#hex"
    }
  ]
}
```

### 初始数据
首次使用时，创建默认分类"未分类"（id: default）和一个示例网站。

## 功能

### 文件操作
- 使用 File System Access API 读写本地 JSON 文件
- 首次使用引导用户选择/创建 JSON 文件
- 检测外部文件变更，提示用户重新加载
- 支持导出/另存为新文件

### 分类管理
- 添加分类：输入名称和颜色
- 编辑分类：修改名称和颜色
- 删除分类：确认后删除，关联网站移至"未分类"
- 拖拽排序分类

### 网站管理
- 添加网站：输入名称、URL，自动获取favicon，失败时手动输入图标URL
- 编辑网站：修改任意字段
- 删除网站：确认后删除
- 拖拽排序网站
- 分类移动：将网站移至其他分类
- 点击卡片：新窗口/标签页打开网站（可配置）

### 设置
- 卡片列数配置
- 新窗口/当前窗口打开配置
- 侧边栏折叠状态

## 技术方案

### 技术栈
- 纯前端：HTML + CSS + JavaScript
- 无框架，原生实现
- 模块化组织代码

### 文件结构
```
index.html          # 主页面
css/
  style.css         # 样式文件
js/
  app.js            # 主入口
  storage.js        # 文件读写
  renderer.js       # 界面渲染
  actions.js        # 用户操作处理
data/
  sites.json        # 数据文件（用户选择后加载）
```

### 图标获取
- 使用 Google Favicon API：`https://www.google.com/s2/favicons?domain=example.com&sz=64`
- 失败时显示默认占位图

### 浏览器兼容
- 需要支持 File System Access API 的浏览器：Chrome、Edge、Opera
- Firefox、 Safari 不支持，显示兼容提示
