export function getFromStorage(key) {
    if (!key) {
        return null;
    }

    try {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    } catch (err) {
        return null;
    }
}

export function setInStorage(key, obj) {
    if (!key) {
        console.error('Lỗi: không tìm thấy key');
    }

    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err);
    }
}

export function removeFromStorage(key) {
    if (!key) {
        console.log('Lỗi: không có key cần tìm');
    }

    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.log(err);
    }
}