// 老人排班添加 /api/schedule/add
export interface ScheduleAdd {
  elderlyId: number;
  day: string;
  week: string;
  staffId: number;
  staffName: string;
  staffPhoto: string;
}
// 老人信息
export interface ElderlyInfo {
  name: string;
  idCard: string;
  begName: string;
  photo: string;
}
