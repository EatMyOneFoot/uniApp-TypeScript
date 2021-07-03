// #ifdef H5
// 仅在H5平台编译
const ua: any = navigator.userAgent.toLowerCase();

/**
 * 是否是微信浏览器
 */
export const isWeiXin = () => {
	return ua.match(/microMessenger/i) == 'micromessenger';
};

/**
 * 是否是移动端
 */
export const isDeviceMobile = () => {
	return /android|webos|iphone|ipod|balckberry/i.test(ua);
};

/**
 * 是否为PC端
 */
export const isPC = () => {
	let userAgentInfo = navigator.userAgent;
	let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
	let flag = true;
	for (let v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
};
// #endif

/**
 * 返回客户端平台
 * @returns 值域为：ios、android、mac（3.1.10+）、windows（3.1.10+）、linux（3.1.10+）
 */
export const platform = () => {
	return uni.getSystemInfoSync().platform
}

/**
 * 严格的身份证校验
 * @param {number|string} sId 身份证号码
 */
export const isCardID = (sId: any) => {
	if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
		uni.showToast({
			title: '你输入的身份证长度或格式错误',
			icon: 'none'
		});
		return false;
	}
	return true;
};

/**
 * 时间戳格式化，转日期
 * @param {number|string} time 要格式化的时间戳，秒或者毫秒级时间戳
 * @param {string} format 指定需要返回的时间格式('yyyy-MM-dd'==>'2021-01-01','yyyy年MM月dd日 hh时mm分ss秒'==>'2021年01月01日 00时00分00秒',不传则返回空值)
 * @tip 举个栗子：formatTime(1615116430, "yyyy-MM-dd hh:mm:ss")
 */
export const formatTime = (time: any, format: string) => {
	if (!format) {
		format = 'yyyy-MM-dd hh:mm:ss';
	}
	let date: Date;
	if (!time) return;
	if (parseInt(time).toString().length === 10) {
		date = new Date(time * 1000);
	} else {
		date = new Date(time);
	}
	let o: any = {
		'M+': date.getMonth() + 1, // 月
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
		}
	}
	return format;
};

/**
 * 将阿拉伯数字翻译成中文的大写数字，带单位
 */
export const numberToChinese = (num: any) => {
	let AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
	let BB = new Array('', '十', '百', '仟', '萬', '億', '点', '');
	let a: any = ('' + num).replace(/(^0*)/g, '').split('.'),
		k = 0,
		re = '';
	for (let i = a[0].length - 1; i >= 0; i--) {
		switch (k) {
			case 0:
				re = BB[7] + re;
				break;
			case 4:
				if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$').test(a[0])) re = BB[4] + re;
				break;
			case 8:
				re = BB[5] + re;
				BB[7] = BB[5];
				k = 0;
				break;
		}
		if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
		if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
		k++;
	}

	if (a.length > 1) {
		// 加上小数部分(如果有小数部分)
		re += BB[6];
		for (let i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
	}
	if (re == '一十') re = '十';
	if (re.match(/^一/) && re.length == 3) re = re.replace('一', '');
	return re;
};

// #ifdef MP-WEIXIN
/**
 * 微信小程序线上版本检查更新管理器
 */
export const WeChatUpdateManager = () => {
	const updateManager = uni.getUpdateManager();
	updateManager.onCheckForUpdate((res) => {
		// 请求完新版本信息的回调
		if (res.hasUpdate) {
			updateManager.onUpdateReady((res2) => {
				uni.showModal({
					title: "更新提示",
					content: "发现新版本，是否重启应用?",
					cancelColor: "#eeeeee",
					confirmColor: "#FF0000",
					success(res2) {
						if (res2.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					},
				});
			});
		}
	});
	updateManager.onUpdateFailed((res) => {
		// 新的版本下载失败
		uni.showModal({
			title: "提示",
			content: "检查到有新版本，但下载失败，请检查网络设置",
			success(res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			},
		});
	});
};
// #endif

/**
 * 获取当前页面路由，也就是最后一个打开的页面路由
 */
export const currentRoute = () => {
	// 获取当前打开过的页面路由数组
	let routes = getCurrentPages();
	return routes[routes.length - 1].route;
};