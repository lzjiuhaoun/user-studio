// js/app.js
import * as storage from './storage.js';
import * as renderer from './renderer.js';
import { initActions } from './actions.js';

document.addEventListener('DOMContentLoaded', () => {
    // 初始化事件绑定
    initActions();

    // 检查浏览器兼容性
    if (!storage.isSupported()) {
        document.getElementById('welcome-screen').innerHTML = `
            <h1>浏览器不支持</h1>
            <p>请使用 Chrome、Edge 或 Opera 等支持 File System Access API 的浏览器</p>
        `;
        return;
    }

    // 默认显示欢迎屏幕
    renderer.showWelcomeScreen();
});
