import Request from 'luch-request';
import { UserModule } from '@/store/modules/user';
const http = new Request();

/* 根域名 */
http.config.baseURL = process.env.VUE_APP_BASE_API; // url = baseURL + request url

// Request interceptors
http.interceptors.request.use((config: any) => {
	config.header = {
		...config.header,
		// 将token 放入header
		// X-Access-Token = UserModule.token
		// Authorization = "Bearer " + UserModule.token
		token: UserModule.token
	};
	return config;
});

// Request interceptors
http.interceptors.response.use(
	(response: any) => {
		const res = response.data;
		if (res.code !== 200) {
			uni.showToast({
				title: res.message || res.msg,
				duration: 2000,
				icon: 'none'
			});
			if (res.code == 401) {
				// 重新登录
				uni.showModal({
					title: '提示',
					content: '当前未登录或者登录状态失效，请重新登录',
					confirmText: '重新登入',
					// confirmColor: '#007aff',
					showCancel: false,
					success: res => {
						if (res.confirm) {
							// uni.removeStorageSync('token');
							// uni.redirectTo({
							//   url: '/pages/login/index'
							// });
						}
					}
				});
			}
			return Promise.reject(res);
		} else {
			// console.log('response=>', response);
			return res.data;
		}
	},
	(response: any) => {
		/*  对响应错误做点什么 （statusCode !== 200）*/
		// console.log('response', response)
		if (response.errMsg == 'request:fail abort' || response.errMsg == 'request:fail abort statusCode:-1') {
			uni.showToast({
				title: '请求超时',
				duration: 2000,
				icon: 'none',
				position: 'top'
			});
		}
		return Promise.reject(response);
	}
);

export default http;
