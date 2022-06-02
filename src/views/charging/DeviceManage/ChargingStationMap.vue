<script setup lang="ts">
//获取全部的充电站
//地图初始化
import {onMounted, reactive, ref} from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
import {shallowRef} from '@vue/reactivity'
import {ApiBase, ChargingApi, errorCheck} from "@/common/api";
import StationDetails from './components/StationDetails.vue'
import {account} from "@/store";

type contentType = Number[]|String[]
type infoType = {
  id:number|string,
  content:contentType,
  mark:string
}
let stationInfo: infoType[] = reactive<infoType[]>([])

//获取充电站站点
const GetStationList = async ()=>{
  let tenantCode = (account().getState.tenantInfo as any)?.tenantCode;
  const {result,error} = await ApiBase(ChargingApi.GetAllStation({page:1,row:9999,tenantId:tenantCode}),{showLoading:true})
  if (errorCheck(result,error)){
    for (let i = 0; i < result.data.length; i++) {
      let cionPath = "https://static.hcqzhtc.com/haroad5.png"
      if (result.data[i].idle > 99) {
        cionPath = "https://static.hcqzhtc.com/icon/road99+.png"
      } else if (result.data[i].idle >= 0 && result.data[i].idle <= 99) {
        cionPath = "https://static.hcqzhtc.com/icon/road" + result.data[i].idle + ".png"
      }
      stationInfo.push({
        id: i,
        content:[result.data[i].longitude,result.data[i].latitude],
        // iconPath: "https://www.zysmartparking.com/imageUrl/images/haroad5.png",
        // iconPath: this.$config.stationIconPath || "https://static.hcqzhtc.com/haroad5.png",
        mark: cionPath,
      })
    }
  }
}
//地图实例
let amap:any = shallowRef(null);

//充电站详情
let pileList = ref([])

//地图初始化
const initMap = () => {
  AMapLoader.load({
    key: "1edf534b11ffdbed50b42308eedd580e",             // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then(async (AMap) => {
    amap = await new AMap.Map("station-amap", { //设置地图容器id
      viewMode: "2D",  //是否为3D地图模式
      zoom: 15,      //初始化地图级别
      // center: window.$$center, //初始化地图中心点位置
      // mapStyle: 'amap://styles/darkblue',//设置地图的显示样式
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      pitch: 60,//仰视角度
      rotation: 0,//顺时针旋转角度
      buildingAnimation: true, //楼块出现是否带动画
      expandZoomRange: true,
      showLabel: true,
      showIndoorMap: true,
      zooms: [3, 20],//地图显示的缩放级别范围, 默认为 [2, 20]
    });
    await bindMark(AMap)
    AutoComplete(AMap)
  })
}

// 循环绑定点击事件
const bindMark = (AMap:any) => {
  stationInfo.forEach(item => {
    //  绑定
    let mark = new AMap.Marker({
      position: new AMap.LngLat(...item.content),
      // content: `<p style="width: 10px;height: 10px;border-radius: 10px;background-color: red"></p>`,
      icon: item.mark,
      clickable: true
    })
    //  绑定id
    mark.setExtData({'id': item.id})
    //  绑定点击事件
    mark.on('click', clickMark)
    //绑定到地图
    amap.add(mark)
  })
};
//点击了mark
const clickMark = async (e:any) => {
  const stationId = e.target.getExtData() //拿到绑定的值
  const {result,error} = await ApiBase(ChargingApi.GetAllDevice({page:1,row:9999,stationId:stationId.id}))
  if (errorCheck(result,error)){
    pileList.value = result.data
  }

}
//地图插件，搜素提示初始化
const AutoComplete = (AMap:any) => {
  AMap.plugin(['AMap.AutoComplete', 'AMap.PlaceSearch'],  ()=> {
    let autoOptions = {input: "tipInput",output:"outPut"}
    const autoComplete = new AMap.AutoComplete(autoOptions);
    const placeSearch = new AMap.PlaceSearch({
      map: amap
    });
    autoComplete.on("select", select);//注册监听，当选中某条记录时会触发
    function select(e:any) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name);  //关键字查询查询
    }
  })
}

onMounted(async () => {
  await GetStationList()
  initMap();
})
</script>

<template>
  <div style="width: 100%;height: 100%;position: relative">
    <div id="station-amap"></div>
    <div class="station-details">
      <station-details :pileList="pileList"/>
    </div>
    <!--  <input v-model="search" class="statrionSearch" name="" id="tipInput">-->
    <div class="inputBox">
      <a-input
          id="tipInput"
          placeholder="输入地址"
          class="statrionSearch"
      />
      <div id="outPut"></div>
    </div>
  </div>
</template>


<style lang='less'>
#station-amap {
  width: 100%;
  height: 100%;

}
.station-details {
  position: absolute;
  left: 0;
  bottom: 46px;
  width: 100%;
  height: 100px;
  padding: 16px 0;

}
.inputBox {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  #outPut {
    width: 250px;
    background: #FFFFFF;
  }
}
.statrionSearch {
  width: 250px;
}
</style>