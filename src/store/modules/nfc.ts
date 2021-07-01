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
	 * @Mutation 设置store数据
	 */
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
}

/**
 * @NfcModule NFC模块
 */
export const NfcModule = getModule(Nfc);
