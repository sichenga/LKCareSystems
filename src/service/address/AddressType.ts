// 地址列表 /api/address/list
export interface AddressList {
  page: number;
  pageSize: number;
}
// 地址添加 /api/address/add
export interface AddressAdd {
  id: number;
  name: string;
  qrcode: string;
}
