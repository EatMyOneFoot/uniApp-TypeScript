// User
const tokenKey = 'uni_typescript_access_token';
export const setToken = (token: string) => {
	try {
		return uni.setStorageSync(tokenKey, token);
	} catch (error) {}
};
export const getToken = () => {
	try {
		return uni.getStorageSync(tokenKey);
	} catch (error) {
		return '';
	}
};
export const removeToken = () => {
	uni.removeStorage({
		key: tokenKey,
		success: res => {
			// console.log('success');
		}
	});
};
