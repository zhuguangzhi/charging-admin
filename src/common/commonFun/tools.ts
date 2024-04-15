// 图标
import {h, resolveComponent} from "vue";

export const KIcon =  (icon: any) => {
  // return h('span', {class:"iconify", 'data-icon':"ant-design:eye-twotone", 'data-inline':"false"})
  return !icon || icon == 'none' ? null : h(resolveComponent('icon-font'), {type: icon, style: { fontSize: '18px'}})
}