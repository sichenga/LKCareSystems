// 供应商管理列表
export interface Supplier {
  total: number;
  pageSize: number;
  page: number;
}
// 添加供应商
export interface Supplieradd {
  id: number;
  name: string;
  linkMan: string;
  mobile: string;
}

// 添加食材 /api/foods/add
export interface AddFood {
  id: number;
  name: string;
  unit: string;
  supplierId: number | undefined;
}
// 添加食材价格 /api/foodprice/add
export interface AddFoodPrice {
  id: number;
  foodId: number;
  wholePrice: number | undefined;
  sellPrice: number | undefined;
  purchasePrice: number | undefined;
  updateTime: string;
}

// 选择供应商
export interface SelectSupplier {
  id: number;
  name: string;
}

// 食材详情
export interface FoodDetail {
  id: number;
  name: string;
  unit: string;
  supplierId: number;
  wholePrice: number;
  sellPrice: number;
  purchasePrice: number;
  updateTime: string;
  supplierName: string;
}

// 采购申请列表
export interface Purchase {
  pageSize: number;
  page: number;
  companyId: string;
  state: string;
  beginDate: string;
  endDate: string;
}
