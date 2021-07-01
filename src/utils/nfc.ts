import { platform, Bytes2HexString, currentRoute, formatTime } from '@/utils/common';
import { UserModule } from "@/store/modules/user";
import { NfcModule } from "@/store/modules/nfc";
import { } from '@/api/index'

let NfcAdapter: any = null;
let main: any = null
let NdefRecord: any = null
let NdefMessage: any = null

let iosNfcModule: any = uni.requireNativePlugin("yzy-YzyNfcTagRead")
// NFC云插件地址 https://ext.dcloud.net.cn/plugin?id=3545

/**
 * @NFC nfc.ts
 */
export default {
    /**
     * @NFCInit 初始化NFC
     */
    NFCInit() {
        console.log('--------------NFCInit--------------')
        // 未登录就return掉
        if (!UserModule.token) return
        if (platform() === 'android') {
            try {
                main = plus.android.runtimeMainActivity();
                const Intent: any = plus.android.importClass('android.content.Intent');
                const Activity = plus.android.importClass('android.app.Activity');
                const PendingIntent: any = plus.android.importClass('android.app.PendingIntent');
                // console.log(PendingIntent);
                const IntentFilter: any = plus.android.importClass('android.content.IntentFilter');
                // console.log(IntentFilter);
                NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
                //console.log(NfcAdapter);
                const _nfcAdapter = NfcAdapter.getDefaultAdapter(main);
                // console.log(_nfcAdapter);
                const ndef = new IntentFilter('android.nfc.action.NDEF_DISCOVERED');
                // console.log(ndef);
                const tag = new IntentFilter('android.nfc.action.TAG_DISCOVERED');
                // console.log(tag);
                const tech = new IntentFilter('android.nfc.action.TECH_DISCOVERED');
                // console.log(tech);
                const intentFiltersArray = [ndef, tag, tech];

                const techListsArray = [
                    ['android.nfc.tech.Ndef'],
                    ['android.nfc.tech.IsoDep'],
                    ['android.nfc.tech.NfcA'],
                    ['android.nfc.tech.NfcB'],
                    ['android.nfc.tech.NfcF'],
                    ['android.nfc.tech.Nfcf'],
                    ['android.nfc.tech.NfcV'],
                    ['android.nfc.tech.NdefFormatable'],
                    ['android.nfc.tech.MifareClassi'],
                    ['android.nfc.tech.MifareUltralight']
                ];

                let _intent = new Intent(main, main.getClass());
                // console.log(_intent);
                _intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

                const pendingIntent = PendingIntent.getActivity(main, 0, _intent, 0);
                // console.log(pendingIntent);
                if (_nfcAdapter == null) {
                    toast('设备不支持NFC！', "none");
                } else if (!_nfcAdapter.isEnabled()) {
                    toast('请先启用设备NFC！', "none");
                } else {
                    (plus as any).globalEvent.addEventListener('newintent', () => {
                        // console.log('newintent running===>');
                        // 启动 NFC
                        this.nfcRuning()
                    });
                    (plus as any).globalEvent.addEventListener('pause', (e: any) => {
                        // console.log('pause running===>');
                        if (_nfcAdapter) {
                            // 关闭前台调度系统
                            // 恢复默认状态
                            _nfcAdapter.disableForegroundDispatch(main);
                        }
                    });
                    (plus as any).globalEvent.addEventListener('resume', (e: any) => {
                        // console.log('resume running===>');
                        if (_nfcAdapter) {
                            // 开启前台调度系统
                            // 优于所有其他NFC
                            _nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
                        }
                    });
                    _nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
                }
            } catch (e) {
                //TODO handle the exception
            }
        } else if (platform() === 'ios') {
            // 调用异步方法
            iosNfcModule.NdefNfcReadAsyncFunc({
                name: 'yzyzuishuai', // name字段是固定的
                doWrite: NfcModule.readyWriteData, // true代表写入 false代表只读
            }, (res: any) => {
                // res.type为0的情况下res.msg为错误消息，type为1的情况下msg为tag值
                console.log(res)
                uni.showModal({ content: res.msg })
            })
        }
    },

    /**
     * @nfcRuning 启动Nfc进行读写
     */
    nfcRuning() {
        if (!UserModule.token) return
        if (platform() !== "android") return
        console.log("--------------nfcRuning--------------")
        NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
        NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
        const main: any = plus.android.runtimeMainActivity();
        const intent = main.getIntent();
        const action = intent.getAction();
        const that = this;
        // console.log("action type===>" + action);
        if (NfcAdapter.ACTION_NDEF_DISCOVERED == action || NfcAdapter.ACTION_TAG_DISCOVERED == action || NfcAdapter.ACTION_TECH_DISCOVERED == action) {
            if (NfcModule.readyWriteData) {
                // 写入
                that.write(intent);
                NfcModule.setState({
                    state: 'readyWriteData',
                    value: false
                })
            } else if (NfcModule.readyRead) {
                // 读取
                that.read(intent);
                NfcModule.setState({
                    state: 'readyRead',
                    value: false
                })
            }
        }
    },

    /**
     * @write 写入Nfc
     */
    write(intent: any) {
        console.log("--------------我在写--------------")
        try {
            toast('正在写入...', "none");
            console.log("writeText===>", NfcModule.writeText);
            let textBytes = (plus.android as any).invoke(NfcModule.writeText, "getBytes");
            // image/jpeg text/plain  
            let textRecord = new NdefRecord(NdefRecord.TNF_MIME_MEDIA,
                (plus.android as any).invoke("text/plain", "getBytes"),
                (plus.android as any).invoke("", "getBytes"), textBytes);
            let message = new NdefMessage([textRecord]);
            let Ndef: any = plus.android.importClass('android.nfc.tech.Ndef');
            let NdefFormaTable: any = plus.android.importClass('android.nfc.tech.NdefFormatable');
            let tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            let ndef = Ndef.get(tag);
            if (ndef != null) {
                // 待写入的数据长度
                let size = message.toByteArray().length;
                ndef.connect();
                if (!ndef.isWritable()) {
                    toast('tag不允许写入！', "none");
                    return;
                }
                if (ndef.getMaxSize() < size) {
                    toast('文件大小超出容量！', "none");
                    return;
                }
                ndef.writeNdefMessage(message);
                toast('写入数据成功！', "success");
                return;
            } else {
                let format = NdefFormaTable.get(tag);
                if (format != null) {
                    try {
                        format.connect();
                        format.format(message);
                        toast('格式化tag并且写入message', "none");
                        return;
                    } catch (e) {
                        toast('格式化tag失败', "none");
                        return;
                    }
                } else {
                    toast('Tag不支持NDEF', "none");
                    return;
                }
            }
        } catch (e) {
            toast('写入失败', "none");
            console.log("error===>", e);
        }

    },

    /**
     * @read 读取Nfc
     */
    read(intent: any) {
        console.log("--------------我在读--------------")
        // const Tag = plus.android.importClass('android.nfc.Tag');
        // const tagFromIntent = intent.getParcelableExtra(this.NfcAdapter.EXTRA_TAG);
        const bytesId = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
        NfcModule.setState({
            state: 'bytesId',
            value: Bytes2HexString(bytesId)
        })
        console.log("bytesId====>", NfcModule.bytesId)

        let Parcelable: any = plus.android.importClass("android.os.Parcelable");
        let rawMsgs: any = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
        // console.log("数据==>", rawMsgs)
        if (rawMsgs != null && rawMsgs.length > 0) {
            let records: any = rawMsgs[0].getRecords();
            let result: any = records[0].getPayload();
            let data = plus.android.newObject("java.lang.String", result);
            NfcModule.setState({
                state: 'readResult',
                value: data
            })
            console.log('NFC 数据===>', NfcModule.readResult);
        } else {
            toast('没有读取到数据', 'none')
        }

        // 如果读到了数据
        if (!!NfcModule.readResult) {
            // currentRoute 返回当前读取数据的页面路由
            // if (currentRoute() == 'pages/index/index') {
            //     uni.navigateTo({
            //         url: '/pages/index/nfcDetail',
            //     });
            // } else {
            //     uni.redirectTo({
            //         url: '/pages/index/nfcDetail',
            //     });
            // }
        }
    }
}

/**
 * @轻提示 uni.showToas
 */
const toast = (content: string, type: "none" | "success" | "loading" | undefined) => {
    uni.showToast({
        title: content,
        icon: type
    })
}