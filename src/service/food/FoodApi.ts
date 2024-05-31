import { get, post, put, del } from "@/utils/request";
import type {
  Supplier,
  Supplieradd,
  AddFood,
  AddFoodPrice,
  Purchase,
} from "./FoodType";

// 供应商列表
export const SupplierList = (params?: Supplier) => {
  return get("/api/supplier/list", params || {});
};
// 添加供应商
export const SupplierAdd = (data: Supplieradd) => {
  return post("/api/supplier/add", data);
};
// 根据id获取供应商信息
export const Supplierget = (id: number) => {
  return get(`/api/supplier/get/${id}`);
};

// 修改供应商
export const SupplierUpdate = (data: Supplieradd) => {
  return put("/api/supplier/update", data);
};

// 删除供应商
export const Supplierdelete = (id: number) => {
  return del(`/api/supplier/delete/${id}`);
};

// 食材管理 /api/foods/list
export const FoodList = (params: Supplier) => get("/api/foods/list", params);

// 根据食材id获取食材信息  /api/foods/get
export const Foodget = (id: number) => get(`/api/foods/get/${id}`);

// 删除食材 /api/foods/delete/4
export const Fooddelete = (id: number) => del(`/api/foods/delete/${id}`);

// 添加食材 /api/foods/add
export const Foodadd = (data: AddFood) => post("/api/foods/add", data);

// 添加食材价格 /api/foodprice/add
export const foodpriceadd = (data: AddFoodPrice) =>
  post("/api/foodprice/add", data);

// 根据食材id获取价格列表 /api/foodprice/list/5
export const foodpricelist = (id: number) => get(`/api/foodprice/list/${id}`);

// 修改食材 /api/foods/update
export const Foodupdate = (data: AddFood) => put("/api/foods/update", data);

// 修改食材价格 /api/foodprice/update
export const foodpriceupdate = (data: AddFoodPrice) =>
  put("/api/foodprice/update", data);

// 删除食材价格 /api/foodprice/delete/6
export const foodpricedelete = (id: number) =>
  del(`/api/foodprice/delete/${id}`);

// 采购申请列表
export const PurchaseList = (params: Purchase) => {
  return get("/api/purchase/list", params);
};

// 单条采购申请信息
export const Purchaseget = (id: number) => {
  return get(`/api/purchase/get/${id}`);
};

// 获取采购物品列表
export const purchaseFoodslist = (id: number) => {
  return get(`/api/purchaseFoods/list/${id}`);
};
// 收货验收
export const purchase = () => {
  return put("/api/purchase/check");
};
