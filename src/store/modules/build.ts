import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ConfigBuildingList,
  getBedsList,
  getHouseList,
} from "@/service/config/ConfigApi";

export const useBuildStroke = defineStore(
  "build",
  () => {
    const BuildList = ref([]);
    const HouseList = ref([]);
    const BedList = ref([]);
    // 楼栋信息
    const getBuildList = async () => {
      const res: any = await ConfigBuildingList();
      if (res?.code === 10000) {
        return res.data.list;
      }
    };
    // 房间信息
    const getHouseData = async () => {
      const res: any = await getHouseList();
      if (res?.code === 10000) {
        return res.data.list;
      }
    };
    // 床位信息
    const getBedsData = async () => {
      const res: any = await getBedsList();
      if (res?.code === 10000) {
        return res.data.list;
      }
    };
    //  树形结构数据
    const getBuildListData = async () => {
      BuildList.value = await getBuildList();
      HouseList.value = await getHouseData();
      BedList.value = await getBedsData();
      console.log(HouseList.value);
      return await convertToTree(BuildList.value);
    };

    const convertToTree = (flatData: any, pid: number = 0) => {
      const children = flatData.filter((node: any) => node.pid === pid);
      if (!children.length) {
        return HouseList.value
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            pid: item.buildingId,
            children: BedList.value
              .map((chItem: any) => ({
                id: chItem.id,
                name: chItem.name,
                pid: chItem.houseId,
              }))
              .filter((FItem: any) => FItem.pid === item.id),
          }))
          .filter((item: any) => item.pid === pid);
      }
      return children.map((node: any) => ({
        ...node,
        children: convertToTree(flatData, node.id),
      }));
    };

    return {
      getBuildList,
      getHouseData,
      getBedsData,
      getBuildListData,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
