import { h, ref, defineComponent, useSlots } from 'vue'
import { useRouter } from 'vue-router'
import { account, app } from '@/store'
import IMenu from './menu'
import './pageLayout.less'
import { MenuFoldOutlined,MenuUnfoldOutlined,PoweroffOutlined } from '@ant-design/icons-vue'


interface InputProps {
  // value: string;
  // onChange: (value: string) => void;
}
interface routerArrayType {
  key:string,
  desc:string
}

export default defineComponent({
  components: {IMenu,MenuFoldOutlined,MenuUnfoldOutlined,PoweroffOutlined},
  setup(props: InputProps) {
    
    const accountStore = account()
    const appStore:any = app()
    const router:any = useRouter()
    const slots = useSlots()
    const userName = (account().getState.adminInfo as any).name || ''
    let collapsed = ref<boolean>(false)

    let isSmallScreen = false;
    if ((document.body as any).offsetWidth<=628){
    //  小屏
      collapsed.value = true
      isSmallScreen = true
    }
    const selectKeys = ref([router.currentRoute.value.path])

    //获取路由表 制作路由导航
    let routerMap:routerArrayType[] = [];
    function MakeRouter(list:Array<object>,oldList:any = {}){
      list.forEach((data:any)=>{
        let key=data.router,
            desc=data.name;
        if (Object.keys(oldList).length !== 0){
          desc = oldList.name+'>'+data.name
        }
        if (data.children==null || data.children.length===0){
          routerMap.push({
            key,
            desc
          })
        }else {
          MakeRouter(data.children,data)
        }
      })
    }
    MakeRouter(window.$$router[0].children)
    console.log('路由导航::routerMap',routerMap)
    //获取导航头
    const getHeadTitle = (key:any)=>routerMap.find((item:routerArrayType)=>key.value[0] === '/'+item.key)
    //点击侧边栏
    const menuOnSelect = (obj:any) => {
      selectKeys.value = obj.selectedKeys
      //小屏点击自动收起侧边栏
      if(isSmallScreen){
        setTimeout(()=>{
          collapsed.value = true
        },200)
      }
    }

    const themeState = ref<boolean>(false)
    // const themeChange = (checked: boolean) => {
    //   if (checked) {
    //     appStore.setTheme('light')
    //   } else {
    //     appStore.setTheme('dark')
    //   }
    // }
    const updateChecked = (value:any) => {
      console.log('updateChecked')
      themeState.value = value
    }

    // 测试按钮点击事件
    const testClick = () => {
      // selectKeys.value = ['/tableView']
      console.log(selectKeys.value[0])
      if (selectKeys.value[0] == '/example') {
        selectKeys.value = ['/tableView']
      } else {
        selectKeys.value = ['/example']
      }
      collapsed.value = !collapsed.value
    }

    // layout变更
    // const layoutChange = (value: string) => {
    //   appStore.setLayout(value)
    // }

    // 点击Logo事件，返回登陆页
    const logoClick = () => {
      // TODO 点击了LOGO
      console.log('PageLayout:点击了LOGO')
    }
    //退出登录
    const loginOut = ()=>{
      router.push('/login')
      accountStore.setAdminInfo({});
      accountStore.setToken('')
      accountStore.setTenantInfo({})
      accountStore.setRoles('')
    }
    // logo
    const logo = (layout: string,isSmall:boolean=false) => {
      if (!isSmall){
        if (appStore.layout == layout) {
          return (<div class="k-page-layout-logo" onClick={logoClick} style={{ color: appStore.layout == 'sider' ? '#ffffff' : '#000000' }}>
            <img style={{height:'32px'}} src="http://img.park.applyrealsmart.com/logo.png" alt=""/>
          </div>)
        }
      }else {
        //小屏收起时不使用logo
        if (!collapsed.value){
          if (appStore.layout == layout) {
            return (<div class="k-page-layout-logo" onClick={logoClick} style={{ color: appStore.layout == 'sider' ? '#ffffff' : '#000000' }}>LOGO</div>)
          }
        }
      }
    }
    
    // layout-header
    const header = () => (
      <a-layout-header class="k-page-layout-header">
        <div class="k-page-layout-header-left">
          {
            logo('header')
          }
          <menu-fold-outlined onClick={()=>{collapsed.value=true}} style={{display:collapsed.value?'none':'inline-block'}} class="k-page-layout-header-icon" />
          <menu-unfold-outlined onClick={()=>{collapsed.value=false}} style={{display:collapsed.value?'inline-block':'none'}} class="k-page-layout-header-icon"/>

          <div class="k-page-layout-header-sign">
            {getHeadTitle(selectKeys)?.desc || ''}
          </div>
        </div>

        <div class="k-page-layout-header-right" >
          <span style={{display:'inline-block;',marginLeft: '8px',fontWeight:"bolder",fontSize:"16px"}}>{userName}</span>
          <a-tooltip placement="bottomRight" title={'退出登录'}>
          <poweroff-outlined onClick={loginOut} style={{cursor: 'pointer'}} class="k-page-layout-header-icon"/>
        </a-tooltip>

          {/*<span onClick={loginOut} style={{display:'inline-block;',marginLeft: '8px'}}>退出登录</span>*/}
          {/*<a-switch checked={themeState.value} onUpdate:checked={updateChecked} onChange={themeChange} />*/}
          {/*<a-select value={appStore.layout} onChange={ layoutChange } style={{ width: '120px', marginLeft: '20px' }}>*/}
          {/*  <a-select-option value="header">顶部</a-select-option>*/}
          {/*  <a-select-option value="sider">侧边栏</a-select-option>*/}
          {/*</a-select>*/}

        </div>
      </a-layout-header>
    )
    const siderOnCollapse = (_collapsed:boolean) => collapsed.value = _collapsed
    const sider = () => (
        <div class="minSideLayout">
          <a-layout-sider style={{height:'100%'}} collapsed={collapsed.value} collapsedWidth={70} collapsible={true} onCollapse={siderOnCollapse} class="k-page-layout-sider maxScreenSide" width="240px">
            {
              logo('sider')
            }
            <i-Menu
                theme={appStore.theme ?? 'dark'}
                mode="inline"
                menuData={appStore.menuData}
                collapsed={collapsed.value}
                selectedKeys={selectKeys.value}
                onSelect={menuOnSelect}
                class="k-menu">
            </i-Menu>
          </a-layout-sider>
          <a-layout-sider style={{height: '100%'}} collapsed={collapsed.value} collapsedWidth={0.001} collapsible={true} onCollapse={siderOnCollapse} class="k-page-layout-sider minScreenSide" width="240px">
            {
              logo('sider',true)
            }
            <i-Menu
                theme={appStore.theme ?? 'dark'}
                mode="inline"
                menuData={appStore.menuData}
                collapsed={collapsed.value}
                selectedKeys={selectKeys.value}
                onSelect={menuOnSelect}
                class="k-menu">
            </i-Menu>
          </a-layout-sider>

        </div>
    )

    const content = () => (
      <a-layout-content class="k-page-layout-content">
        { { default: slots.default } }
      </a-layout-content>
    )

    return () => (
      <div class="k-page-layout">
        <a-layout>
          {
            () => {
              if (appStore.layout == 'sider') {
                return (
                  <>
                    { sider() }
                    <a-layout>
                      { header() }
                      { content() }
                    </a-layout>
                  </>
                )
              } else {
                return (
                  <>
                    { header() }
                    <a-layout>
                      { sider() }
                      { content() }
                    </a-layout>
                  </>
                )
              }
            }
          }
          
        </a-layout>
      </div>
    )
  }
})