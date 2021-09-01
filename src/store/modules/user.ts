import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { login, logout } from '@/api/users';
import { setStorage, getStorage, removeStorage } from '@/utils/storage';
import store from '@/store';

export interface IUserState {
	token: string;
	// #ifdef MP-WEIXIN
	code: string; //小程序专有，用户登录凭证。需要在开发者服务器后台，使用 code 换取 openid 和 session_key 等信息
	// #endif
	type: string;
	name: string;
	avatar: string;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
	public token = getStorage('access_token') || '';
	public code = '';
	public type = '';
	public name = '';
	public avatar = '';

	@Mutation
	public setState(value: any) {
		let arr = []
		if (Object.prototype.toString.call(value) === "[object Array]") {
			// console.log('value是数组');
			arr = value
		} else if (Object.prototype.toString.call(value) === '[object Object]') {
			// console.log('value是对象');
			arr.push(value)
		}
		arr.forEach((obj: any) => {
			(this as any)[obj.state] = obj.value;
		});
	}

	@Action
	public async Login(loginInfo: object) {
		const { data } = await login(loginInfo);
		// console.log(data)
		setStorage('access_token', data.token)
		this.setState({ state: 'token', value: data.token });
		// this.setState({ state: 'type', value: data.type });
		// console.log(data)
		return new Promise((resolve, reject) => {
			resolve(data);
		});
	}

	@Action
	public ResetToken() {
		removeStorage('access_token');
		this.setState({ state: 'token', value: '' });
	}

	// @Action
	// public async GetUserInfo() {
	// 	// @ts-ignore
	// 	// if (this.token === '') {
	// 	//   throw Error('GetUserInfo: token is undefined!')
	// 	// }
	// 	// const { data } = await getUserInfo({ /* Your params here */ })
	// 	// if (!data) {
	// 	//   throw Error('Verification failed, please Login again.')
	// 	// }
	// 	// const { name, avatar } = data.user
	// 	this.setState({ state: 'name', value: '' });
	// 	// this.setState({ state: 'avatar', value: '' });
	// }

	@Action
	public async LogOut() {
		if (this.token === '') {
			throw Error('LogOut: token is undefined!');
		}
		// await logout();
		// 清空本地缓存的 token
		removeStorage('access_token');
		this.setState({ state: 'token', value: '' });
	}

	// #ifdef MP-WEIXIN
	// emmmmm这个还没有测试过，不知道顶不顶用
	@Action
	public uniLogin() {
		return new Promise((resolve, reject) => {
			//获取微信小程序 code,因为一个code只能使用一次，所以每次需要使用的时候都要获取最新的
			uni.login({
				provider: 'weixin',
				success: (loginRes: any) => {
					if (loginRes.errMsg == 'login:ok') {
						this.setState({ state: 'code', value: loginRes.code });
						resolve(loginRes.code);
					}
				},
				fail: err => {
					reject('err');
				}
			});
		});
	}
	// #endif
}

export const UserModule = getModule(User);
