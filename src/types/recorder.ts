import type { ExerciseType } from '@/routes/api/exercise-types';

export type { ExerciseType } from '@/routes/api/exercise-types';

/** 活动标签页 */
export type ActiveTab = 'record' | 'history' | 'stats';

/** 运动类型选项 */
export interface ExerciseTypeOption {
  value: ExerciseType;
  label: string;
  icon: string;
  unit: string;
}

/** 运动记录接口 */
export interface ExerciseRecord {
  id: string;
  type: ExerciseType;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // 秒
  distance?: number; // 公里
  count?: number; // 个数
  segments?: ExerciseSegment[]; // 二级分段记录
}

/** 运动分段接口 */
export interface ExerciseSegment {
  id: string;
  type: 'exercise' | 'rest';
  exerciseType?: ExerciseType;
  duration: number; // 秒
  count?: number; // 个数
  startTime: Date;
}

/** 运动历史统计 */
export interface ExerciseStats {
  totalSessions: number;
  totalDuration: number;
  totalDistance: number;
  totalCount: number;
  averageDuration: number;
  lastExercise?: string;
}
