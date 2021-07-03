import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface INfcState {
	readyWriteData: boolean
	readyRead: boolean
	bytesId: string
	readResult: string
	writeText: string
	goodsInfo: any
}

@Module({ dynamic: true, store, name: 'nfc' })
class Nfc extends VuexModule implements INfcState {
	/**
	 * 开启写
	 */
	public readyWriteData: boolean = false
	/**
	 * 开启读
	 */
	public readyRead: boolean = false
	/**
	 * 标签id
	 */
	public bytesId: string = ""
	/**
	 * 标签内容
	 */
	public readResult: string = ""
	/**
	 * 要写入的内容
	 */
	public writeText: string = ""
	/**
	 * nfc标签对应的商品信息
	 */
	public goodsInfo: any = ''

	/**
	 * 设置store数据
	 * @Mutation
	 * @param {Array|Object} data {state: 'key',value: data}
	 */
	@Mutation
	public setState(data: any) {
		let arr = []
		if (Object.prototype.toString.call(data) === "[object Array]") {
			// console.log('data是数组');
			arr = data
		} else if (Object.prototype.toString.call(data) === '[object Object]') {
			// console.log('data是对象');
			arr.push(data)
		}
		arr.forEach((obj: any) => {
			(this as any)[obj.state] = obj.value;
		});
	}
}

/**
 * NFC模块
 * @NfcModule
 */
export const NfcModule = getModule(Nfc);