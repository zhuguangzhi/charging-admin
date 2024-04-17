import { ref } from 'vue';

type KPopupVoType = {
  open?: boolean;
  mask?: boolean;
  showClose?: boolean; //是否展示关闭按钮
  title: string;
  leftBtn?: string;
  isDanger?: boolean;
  okBtnName?: string;
  cancelBtnName?: string;
  useCancelBtn?: boolean; //是否展示取消按钮
  confirmLoading?: boolean;
  width?: string; //宽度
  disabled?: boolean; // okBtn是否禁用
  msg?: HTMLElement | string;
  onOk?: Function;
  onClose?: Function;
  onLeftEvent?: Function;
};

export class KPopupVo {
  static KPopupInstance: KPopupVo = new KPopupVo('title', () => {});

  // 将 KPopupVo 的属性改造为响应式
  open = ref(false);
  mask = ref(true);
  showClose = ref(true); //是否展示关闭按钮
  title = ref('');
  leftBtn = ref('');
  isDanger = ref(true);
  okBtnName = ref('确定');
  cancelBtnName = ref('取消');
  useCancelBtn = ref(true); //是否展示取消按钮
  confirmLoading = ref(false);
  width = ref('450px'); //宽度
  disabled = ref(false); // okBtn是否禁用
  msg = ref<HTMLElement | string>();
  onOk = ref<Function>(() => {});
  onClose = ref<Function>(() => {});
  onLeftEvent = ref<Function>(() => {});

  constructor(_title: string, _onOk: Function, _onClose?: Function) {
    this.title.value = _title;
    this.onOk.value = _onOk;
    if (_onClose) {
      this.onClose.value = _onClose;
    }
  }

  closeCall() {
    if (this.onClose.value) this.onClose.value();
    else this.open.value = false;
  }
  confirmCall() {
    this.open.value = false;
    this.onOk.value();
  }

  openCall(props: KPopupVoType) {
    this.mask.value = props.mask ?? true;
    this.showClose.value = props.showClose ?? true;
    this.isDanger.value = props.isDanger ?? true;
    this.useCancelBtn.value = props.useCancelBtn ?? true;
    this.confirmLoading.value = props.confirmLoading ?? false;
    this.width.value = props.width ?? '450px';
    this.disabled.value = props.disabled ?? false;
    this.okBtnName.value = props.okBtnName ?? '确定';
    this.cancelBtnName.value = props.cancelBtnName ?? '取消';
    this.leftBtn.value = props.leftBtn ?? '';
    this.onOk.value = props.onOk ?? (() => {});
    this.onClose.value = props.onClose ?? (() => {});
    this.onLeftEvent.value = props.onLeftEvent ?? (() => {});
    this.msg.value = props.msg ?? '';
    props.title && (this.title.value = props.title);
    this.open.value = true;
  }

  static instance(): KPopupVo {
    return this.KPopupInstance;
  }
}

export default KPopupVo.instance();
