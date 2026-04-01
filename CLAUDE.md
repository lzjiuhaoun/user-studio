# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概述

个人工作站 / 浏览器起始页。记录用户添加的网站和分类，支持点击卡片跳转。使用 File System Access API 将数据存储在本地 JSON 文件。

---

## 运行方式

双击scripts/下的start-service.bat即可运行（无需构建），双击scripts/下的stop-service.bat停止服务。
点击http://localhost:18080/访问服务。

---

## 技术栈

- 原生 HTML + CSS + JavaScript（无框架、无构建工具）
- ES Modules (`<script type="module">`)
- File System Access API（浏览器本地文件读写）

---

## 代码架构

```
js/
├── app.js       # 入口模块：初始化事件绑定、检查浏览器兼容性
├── storage.js   # 数据层：File System Access API 封装，CRUD 操作
├── renderer.js  # 视图层：渲染分类列表、网站卡片、模态框
└── actions.js   # 控制层：事件监听、表单处理、ID 生成
```

**模块依赖：**
- `app.js` 导入 `storage.js`（兼容性检测）、`renderer.js`（显示欢迎页）、`actions.js`（初始化）
- `renderer.js` 导入 `storage.js`（读取数据）
- `actions.js` 导入 `storage.js`（写入数据）、`renderer.js`（触发重渲染）

**数据流：** 用户操作 → actions.js → storage.js（持久化）→ renderer.js（更新 UI）→ storage.js.getData()（读取）

---

## 数据存储格式

```json
{
  "categories": [{ "id": "xxx", "name": "分类名", "color": "#hex" }],
  "sites": [{ "id": "xxx", "name": "名称", "url": "https://...", "icon": "url", "categoryId": "xxx", "bgColor": "#hex" }]
}
```

- `id: "default"` 为系统默认分类，不可删除
- 网站删除时不移除分类，只转移网站到默认分类

---

## 安全措施

- 所有用户输入通过 `escapeHtml()` 转义后渲染（防止 XSS）
- Google Favicon 代理：`https://www.google.com/s2/favicons?domain=${domain}&sz=64`

---

## 限制

- **仅 Chromium 浏览器支持**：File System Access API 仅在 Chrome/Edge/Opera 可用
- **首次使用需授权文件访问**：用户需选择或创建 JSON 数据文件

---

## 默认回答语言

所有解释性内容、步骤说明、分析、文字回答均默认使用 **中文**。
所有代码块 (code) 中的内容保持原始语言。

---

## 强制要求

1. 大任务（执行时长超过20分钟）必须要拆分为小任务执行，任何任务都要分步骤追加写入 `task_list.md` 文件中。
2. 我会把你生成的代码交给 Claude 和 Gemini agent 进行 review，他们会毫不留情地指出代码存在的低级错误，当错误数**多余10个**时，我会改用 claude 的 opus 大模型。
3. 非必要不要引入依赖包，若必须要依赖包则需要将引入的依赖包写入 `dependencies.md` 依赖列表清单文件中。
