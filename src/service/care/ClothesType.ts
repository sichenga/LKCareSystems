// 错衣缺衣列表
export interface ClothesListparams {
  page: number;
  pageSize: number;
  elderlyName: string;
  beginDate: string;
  type: string;
  state: string;
  endDate: string;
}

// 错衣缺衣信息添加
interface pictures {
  file: string;
}

export interface ClothesAddParams {
  id: number;
  elderlyId: number | null;
  title: string;
  content: string;
  type: string;
  state: string;
  pictures: Array<pictures>;
}
