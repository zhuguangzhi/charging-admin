// store.js
import { defineStore } from "pinia";

export default defineStore({
  id: "account",
  state: () => ({
    token: "",
    admin: null,
    tenantCode:"CP99AD99",
    permissions: null,
    roles: null, //角色
    routesConfig: null,
    adminInfo:null,//管理员信息
    tenantInfo:null,//商户信息,
    isTenantBoss:false,//是否是总商户
  }),

  actions: {
    login(admin: any) {
      this.$state.admin = admin
    },
    setToken(token: string) {
      this.$state.token = token
    },
    setPermissions(permissions: any) {
      this.$state.permissions = permissions
    },
    setRoles(roles: any) {
      this.$state.roles = roles
    },
    setRoutesConfig(routesConfig: any) {
      this.$state.routesConfig = routesConfig
    },
    setAdminInfo(routesConfig: any) {
      this.$state.adminInfo = routesConfig
    },
    setTenantInfo(routesConfig: any) {
      this.$state.tenantInfo = routesConfig
    },
    setTenantBoss(routesConfig: any) {
      this.$state.isTenantBoss = routesConfig
    },
  },

  getters:{
    getState(state){
      return state
    },
    getTenant(state){
      return state.tenantCode
    },
    getToken(state){
      return state.token
    },
    getTenantBoos(state) {
      return state.isTenantBoss
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true
  }
})
