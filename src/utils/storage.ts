// 数据缓存
/**
 * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口
 * @param {string} key 本地缓存中的指定的 key
 * @param {any} value 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
 */
export const setStorage = (key: string, value: any) => {
	try {
		uni.setStorageSync(key, value);
	} catch (error) { }
};

/**
 * 从本地缓存中同步获取指定 key 对应的内容
 * @param {string} key 本地缓存中的指定的 key
 */
export const getStorage = (key: string) => {
	try {
		return uni.getStorageSync(key);
	} catch (error) { }
};

/**
 * 从本地缓存中异步移除指定 key
 * @param {string} key 本地缓存中的指定的 key
 * @param {Function} success 接口调用的回调函数
 */
export const removeStorage = (key: string) => {
	uni.removeStorage({
		key: key,
		success: res => {
			// console.log('success');
		}
	});
};