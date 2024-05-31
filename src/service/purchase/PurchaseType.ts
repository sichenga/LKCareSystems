export interface IUser {
  pageSize: number;
  page: number;
  total: number;
}
interface TypeList {
  foodName: string;
  unit: string;
  supplierId: number;
  wholePrice: number;
  sellPrice: number;
  purchasePrice: number;
  purchaseCounts: number;
}
export interface IUserList {
  receiveTime?: string | null;
  remarks?: string | null;
  foods: Array<TypeList>;
}
