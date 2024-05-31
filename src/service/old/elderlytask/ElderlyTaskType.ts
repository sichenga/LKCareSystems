// 老人任务添加 /api/elderlyTask/add
export interface AddElderlyTaskDto {
  elderlyId: number;
  serviceId: undefined | number;
  startTime: string;
  endTime: string;
  week: string;
  day: string;
  type: string;
  typedata?: string;
}
// 选择老人任务
export interface SelectElderlyTaskDto {
  id: number;
  name: string;
}
