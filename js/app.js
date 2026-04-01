// js/app.js
import * as renderer from './renderer.js';
import * as storage from './storage.js';
import * as actions from './actions.js';

// 时钟更新
function updateTime() {
    const now = new Date();

    // 格式化时间 00:00
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // 格式化日期
    const dateOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    const dateString = now.toLocaleDateString('zh-CN', dateOptions);

    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');

    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
}

// 初始化时钟
function initClock() {
    updateTime();
    setInterval(updateTime, 1000);
}

// 检查浏览器兼容性
function checkBrowserCompatibility() {
    if (!('showOpenFilePicker' in window)) {
        return false;
    }
    return true;
}

// 初始化应用
export function init() {
    if (!checkBrowserCompatibility()) {
        return;
    }

    // 初始化时钟
    initClock();

    // 初始化所有事件绑定
    actions.initActions();
}

// 启动应用
init();
