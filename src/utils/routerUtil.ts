import routerMap from '@/router/router.map'
import {account, app} from '@/store'
import XEUtils from 'xe-utils'

/**
 * 加载路由并应用
 */
function loadRoutes(router: any, routesConfig: any) {
    const accountStore = account()

    console.log("初始化时路由信息", router, routesConfig)
    // 如果 routesConfig 有值，则更新到本地，否则从本地获取
    if (routesConfig) {
        accountStore.setRoutesConfig(routesConfig)
    } else {
        routesConfig = accountStore.routesConfig
    }

    console.log("路由信息2", routesConfig, accountStore.permissions)
    if (routesConfig && routesConfig.length > 0) {
        console.log("001::解析路由配置开始", routesConfig, routerMap)
        let routes = parseRoutes(routesConfig, routerMap)
        // 补充权限信息
        formatAuthority(routes) // 格式化权限信息
        console.log("002::补充权限信息", routes)

        // 过滤权限不足路由
        // console.log("002::过滤权限不足的路由开始", routes, store.state.account.permissions)
        routes = filtersPermission(routes, accountStore.permissions)
        console.log("002::过滤权限不足的路由", routes)

        addRoutes(router, routes)
        console.log('addRoutes', router)
        // 添加路由
        // router.addRoutes(finalRoutes)
        console.log("003::动态添加路由", router, routes)
        return routes
    }
    return []
}

/**
 * 动态添加路由
 */
function addRoutes(router: any, routes: any, name?: string) {
    console.log('routes', router, routes, name)
    // 动态新增路由
    for (let i: number = 0; i < routes.length; i++) {
        const route = routes[i]
        // 添加路由
        if (name) {
            router.addRoute(name, route)
        } else {
            router.addRoute(route)
        }
        if (route.children) {
            addRoutes(router, route.children, route.name)
        }
    }
}

/**
 * 解析路由：通过配置文件获取到实际路由信息
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfig: any, routerMap: any) {
    let routes: any = []
    routesConfig.forEach((item: any) => {
        // 获取注册在 routerMap 中的 router，初始化 routeCfg
        let router: any = undefined, routeCfg: any = {}
        if (typeof item === 'string' && routerMap[item]) {
            router = routerMap[item]
            routeCfg = {path: router.path || item, router: item}
        } else if (typeof item === 'object') {
            // 没有router属性说明这不是真实的路由
            if (item.router) {
                router = routerMap[item.router]
                routeCfg = item
            }
        }
        // 从 router 和 routeCfg 解析路由
        if (!router) {
            console.warn(`未找到注册的路由 ${item.name}`)
            if (item.children && item.children.length > 0) {
                // console.log('开始解析子路由:', item.children, routerMap)
                const route = parseRoutes(item.children, routerMap)
                // console.log('解析子路由:', route)
                routes.push(...route)
            }
        } else {
            // 生成路由信息
            const route: any = {
                path: routeCfg.path || router.path || routeCfg.router,
                name: routeCfg.name || router.name,
                router: routeCfg.router,
                component: router.component,
                redirect: routeCfg.redirect || router.redirect,
                meta: {
                    authority: routeCfg.authority || router.authority || '*', // 权限信息
                    icon: routeCfg.icon || router.icon, // 图标信息
                    page: routeCfg.page || router.page // 路由path路径
                }
            }
            // if (routeCfg.invisible || router.invisible) {
            //   route.meta.invisible = true // 是否隐藏
            // }
            if (routeCfg.children && routeCfg.children.length > 0) {
                route.children = parseRoutes(routeCfg.children, routerMap)
            }
            routes.push(route)
        }
    })
    return routes
}

/**
 * 格式化路由的权限配置,防止出现没有authority的路由
 * @param routes
 */
function formatAuthority(routes: any) {
    routes.forEach((route: any) => {
        const meta = route.meta
        if (meta) {
            let authority: any = {}
            if (!meta.authority) {
                authority.permission = '*'
            } else if (typeof meta.authority === 'string') {
                authority.permission = meta.authority
            } else if (typeof meta.authority === 'object') {
                authority = meta.authority
            } else {
                console.log(typeof meta.authority)
            }
            meta.authority = authority
        } else {
            route.meta = {
                authority: {permission: '*'}
            }
        }
        if (route.children) {
            formatAuthority(route.children)
        }
    })
}

/**
 * 过滤路由权限，权限只取最低一级
 */
function filtersPermission(route: any, permissions: any) {
    let routes: any = []
    XEUtils.arrayEach(route, (item: any, key: any) => {
        let routeItem
        if (item.children) {
            const filters = filtersPermission(item.children, permissions)
            if (filters.length > 0) {
                routeItem = item
                routeItem.children = filters
            }
        } else {
            // console.log('hasPermission', item,hasPermission(item, permissions))
            if (hasPermission(item, permissions)) {
                routeItem = item
            }
        }
        if (routeItem) {
            routes.push(routeItem)
        }
    })
    return routes
}

/**
 * 判断是否有路由的权限
 * @param route 路由
 * @param permissions 用户权限集合
 * @returns {boolean|*}
 */
function hasPermission(route: any, permissions: any) {
    // 全部权限
    if (permissions == '*' || permissions.findIndex((item:any)=>item=='*')!==-1) {
        return true
    }

    const authority = route.authority || route.meta.authority || '*'
    console.log('route.authority',route)
    let required = '*'
    if (typeof authority === 'string') {
        required = authority
    } else if (typeof authority === 'object') {
        required = authority.permission
    }
    return required === '*' || (permissions && permissions.findIndex((item: any) => item === required || item.name === required)!== -1)
}

// 生成菜单
const loadMenu = (router: any, routesConfig: any, isAgent: any) => {

    const appStore = app()

    console.log("001::解析菜单配置",router, routesConfig, routerMap)
    const accountStore = account()
    let res = filtersPermission(routesConfig,accountStore.permissions)
    let menus = parseMenu(res, routerMap, isAgent)
    console.log("001::菜单配置", menus)
    // store.commit('setting/setMenuData', menus)
    appStore.setMenuData(menus)

    if (menus[0].children) {
        router.push(menus[0].children[0].path)
    } else {
        router.push(menus[0].path)
    }
}

/**
 * 动态生成菜单
 */
function parseMenu(routesConfig: any, routerMap: any, isAgent: any) {
    // console.log('isAgent', isAgent)
    let menus: any = []
    routesConfig.forEach((item: any) => {
        // console.log('parseMenu', item)
        // console.log('isAgent', isAgent, item)
        if (isAgent && item.admin) {
            console.log('管理员菜单', item)
        } else {
            let menu = undefined
            // 跳过纯路由节点
            if (!item.isRouter) {
                if (item.router) {
                    // 存在router说明是路由节点
                    const router = routerMap[item.router]
                    if (router) {
                        menu = item
                        menu.path = router.path
                        menu.key = menu.path
                    } else {
                        console.log('解析菜单出错,缺少菜单节点', item)
                    }
                } else {
                    // 不存在router说明是纯菜单节点,纯菜单节点直接新增就行了
                    menu = item
                    menu.key = menu.path
                }
            }

            // console.log('菜单', menu)
            if (menu) {
                if (menu.children && menu.children.length > 0) {
                    // console.log('开始解析子路由:', item.children, routerMap)
                    const childrenMenus = parseMenu(menu.children, routerMap, isAgent)
                    // console.log('解析子路由:', route)
                    menu.children = childrenMenus
                }
                menus.push(menu)
            } else {
                // 判断是否存在子节点，如果存在则继续递归处理
                if (item.children && item.children.length > 0) {
                    const childrenMenus = parseMenu(item.children, routerMap, isAgent)
                    // console.log('childrenMenus', childrenMenus)
                    menus = menus.concat(childrenMenus)
                    // console.log('menus', menus)
                }
            }
            return menus
        }
    })
    return menus
}

export {
    parseRoutes,
    loadRoutes,
    loadMenu,
    formatAuthority
}