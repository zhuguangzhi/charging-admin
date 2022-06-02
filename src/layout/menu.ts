import {h, defineComponent, resolveComponent, onMounted, watch} from 'vue'
import { Menu, MenuTheme } from 'ant-design-vue'
import { MenuMode } from 'ant-design-vue/lib/menu/src/interface'
import { useRouter } from 'vue-router'
import {account} from "@/store";

// 状态组件需要使用 defineComponent
export default defineComponent({
  name: 'IMenu',
  props: {
    menuData: Array,
    theme: String,
    mode: String,
    selectedKeys: Array,
    collapsed: Boolean
  },
  emits: ['onSelect'],
  setup(props, ctx) {

    const router = useRouter()

    onMounted(() => {
      formatOptions(props.menuData, "")
    })
    // 格式化菜单
    const formatOptions = (options:any, parentPath:any) => {
      options.forEach((route:any) => {
        // console.log('格式化', route)
        if (route.path) {
          let isFullPath = route.path.substring(0, 1) == '/'
          route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path
        }
        // console.log('格式化', route)
        if (route.children) {
          formatOptions(route.children, route.fullPath)
        }
      })
    }

    const renderMenu = (menuTree: any) => {
      let menuArr:any = []
      //商户管理权限
      const tenantId = account().getTenant
      const tenantInfo:any =account().getState.tenantInfo
      if (tenantId != tenantInfo?.tenantCode)
        menuTree = menuTree.filter((item: object, index: number) => {
          return (item as any).path != '/MerchantManage'
        })
      menuTree.forEach( (menu: any, i: any) => {
        if (menu?.isMenu) {
          menuArr.push(renderItem(menu.children[0]))
        } else {
          menuArr.push(renderItem(menu))
        }
      })
      return menuArr
    }

    const renderItem = (menu: any) => {
      const meta = menu.meta
      if (!meta || !meta.invisible) {
        let renderChildren = false
        const children = menu.children
        if (children != undefined) {
          for (let i = 0; i < children.length; i++) {
            const childMeta = children[i].meta
            if (!childMeta || !childMeta.invisible) {
              renderChildren = true
              break
            }
          }
        }
        if (menu?.fullPath?.indexOf('http://') >= 0) {
          return renderAMenuItem(menu)
        } else {
          return (menu.children && renderChildren) ? renderSubMenu(menu) : renderMenuItem(menu)
        }
        
      }
    }

    const renderMenuItem =(menu:any) => {
      // console.log('renderMenuItem', menu)
      return h(
        Menu.Item, {key: menu.fullPath || menu.router},
        {
          default: () => h(
            resolveComponent('router-link'),
            { to: menu.path },
            () => [
              renderIcon(menu ? menu.icon : 'none'),
              h('span', [menu.name])
            ]
          )
        }
      )
    }

    // 多级菜单
    const renderSubMenu = (menu:any) => {
      let itemArr:any = []
      menu.children.forEach((item:any) => {
        itemArr.push(renderItem(item))
      })
      return h(
        Menu.SubMenu,
        { key: menu.fullPath },
        {
          default: () => itemArr,
          title: (props:any) => h(
            'span',
            null,
            [
              renderIcon(menu ? menu.icon : 'none'),
              h('span', [menu.name])
            ]
          )
        }
      )
    }

    // a链接菜单
    const renderAMenuItem = (menu: any) => {
      return h(
        Menu.Item, {key: menu.fullPath},
        {
          default: () => h('a',
            {
              href: menu.path,
              target: '_blank'
            },
            [
              renderIcon(menu ? menu.icon : 'none'),
              h('span', [menu.name])
            ]
          )
        }
      )
    }

    // 图标
    const renderIcon =  (icon: any) => {
      // return h('span', {class:"iconify", 'data-icon':"ant-design:eye-twotone", 'data-inline':"false"})
      return !icon || icon == 'none' ? null : h(resolveComponent('icon-font'), {type: icon, style: { fontSize: '18px', marginRight: '16px' }})
    }

    const updateMenu = () => {
      // const menuRoutes = this.$route.matched.filter(item => item.path !== '')
      // console.log('updateMenu::menuRoutes', menuRoutes)
      // const route = menuRoutes.pop()
      // console.log('updateMenu::route', route)
      // if(props.selectedKeys.length === 0) {
      //   this.selectedKeys = [this.getSelectedKey(route)]
      // }
      // console.log('openKeys', this.sOpenKeys)
      // let openKeys = menuRoutes.map(item => item.path)
      // console.log('openKeys', openKeys)
      // if (!fastEqual(openKeys, this.sOpenKeys)) {
      //   this.collapsed || this.mode === 'horizontal' ? this.cachedOpenKeys = openKeys : this.sOpenKeys = openKeys
      // }
    }
    return () => h(
      Menu,
      {
        // inlineCollapsed: props.collapsed,
        theme: (props.theme ?? "dark") as MenuTheme,
        mode: props.mode as MenuMode,
        selectedKeys: props.selectedKeys,
        onSelect: (obj:any) => {
          console.log("menu::select", obj)
          ctx.emit('onSelect', obj)
        },
        // onClick: (obj:any) => {
        //   console.log("menu::click", obj)
        //   router.push(obj.key)
        // }
      },
      {
        default: () => renderMenu(props.menuData)
      }
    )
  }
})