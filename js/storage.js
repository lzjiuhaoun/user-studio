let fileHandle = null;
let data = null;

const DEFAULT_DATA = {
    categories: [
        { id: 'default', name: '未分类', color: '#808080' }
    ],
    sites: [],
    todos: [],
    weather: {
        city: '北京市',
        temp: 24,
        desc: '多云转晴',
        wind: '3级',
        humidity: '45%'
    },
    quote: '预测未来的最好方式就是去创造它。'
};

// 检查浏览器是否支持 File System Access API
export function isSupported() {
    return 'showOpenFilePicker' in window;
}

// 选择已存在的文件
export async function selectFile() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }],
            multiple: false
        });
        return await loadFile();
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('选择文件失败:', err);
        }
        return null;
    }
}

// 创建新文件
export async function createFile() {
    try {
        fileHandle = await window.showSaveFilePicker({
            suggestedName: 'sites.json',
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }]
        });
        data = { ...DEFAULT_DATA };
        await saveFile();
        return data;
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('创建文件失败:', err);
        }
        return null;
    }
}

// 加载文件内容
export async function loadFile() {
    try {
        const file = await fileHandle.getFile();
        const text = await file.text();
        data = JSON.parse(text);
        // 确保有默认分类
        if (!data.categories || data.categories.length === 0) {
            data.categories = [...DEFAULT_DATA.categories];
        }
        // 确保有必要的字段
        if (!data.todos) data.todos = [];
        if (!data.weather) data.weather = { ...DEFAULT_DATA.weather };
        if (!data.quote) data.quote = DEFAULT_DATA.quote;
        return data;
    } catch (err) {
        console.error('加载文件失败:', err);
        return null;
    }
}

// 保存文件
export async function saveFile() {
    try {
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        return true;
    } catch (err) {
        console.error('保存文件失败:', err);
        return false;
    }
}

// 获取当前数据
export function getData() {
    return data;
}

// 设置数据并保存
export async function setData(newData) {
    data = newData;
    return await saveFile();
}

// 添加网站
export async function addSite(site) {
    if (!data) return false;
    data.sites.push(site);
    return await saveFile();
}

// 更新网站
export async function updateSite(id, updates) {
    if (!data) return false;
    const index = data.sites.findIndex(s => s.id === id);
    if (index !== -1) {
        data.sites[index] = { ...data.sites[index], ...updates };
        return await saveFile();
    }
    return false;
}

// 删除网站
export async function deleteSite(id) {
    if (!data) return false;
    data.sites = data.sites.filter(s => s.id !== id);
    return await saveFile();
}

// 添加分类
export async function addCategory(category) {
    if (!data) return false;
    data.categories.push(category);
    return await saveFile();
}

// 更新分类
export async function updateCategory(id, updates) {
    if (!data) return false;
    const index = data.categories.findIndex(c => c.id === id);
    if (index !== -1) {
        data.categories[index] = { ...data.categories[index], ...updates };
        return await saveFile();
    }
    return false;
}

// 删除分类
export async function deleteCategory(id) {
    if (!data) return false;
    data.categories = data.categories.filter(c => c.id !== id);
    // 将该分类下的网站移至默认分类
    data.sites.forEach(site => {
        if (site.categoryId === id) {
            site.categoryId = 'default';
        }
    });
    return await saveFile();
}

// 添加待办
export async function addTodo(todo) {
    if (!data) return false;
    data.todos.push(todo);
    return await saveFile();
}

// 更新待办
export async function updateTodo(id, updates) {
    if (!data) return false;
    const index = data.todos.findIndex(t => t.id === id);
    if (index !== -1) {
        data.todos[index] = { ...data.todos[index], ...updates };
        return await saveFile();
    }
    return false;
}

// 删除待办
export async function deleteTodo(id) {
    if (!data) return false;
    data.todos = data.todos.filter(t => t.id !== id);
    return await saveFile();
}

// 更新天气
export async function updateWeather(weather) {
    if (!data) return false;
    data.weather = { ...data.weather, ...weather };
    return await saveFile();
}

// 更新名言
export async function updateQuote(quote) {
    if (!data) return false;
    data.quote = quote;
    return await saveFile();
}
