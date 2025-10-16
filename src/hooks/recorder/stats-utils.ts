import type { ExerciseRecord, ExerciseStats } from '@/types/recorder';

/**
 * 计算运动统计数据
 * @param history 运动记录数组
 * @returns 统计数据
 */
export function calculateExerciseStats(history: ExerciseRecord[]): ExerciseStats {
  return {
    totalSessions: history.length,
    totalDuration: history.reduce((sum, ex) => sum + (ex.duration || 0), 0),
    totalDistance: history.reduce((sum, ex) => sum + (ex.distance || 0), 0),
    totalCount: history.reduce((sum, ex) => sum + (ex.count || 0), 0),
    averageDuration:
      history.length > 0 ? Math.round(history.reduce((sum, ex) => sum + (ex.duration || 0), 0) / history.length) : 0,
    lastExercise: history.length > 0 ? new Date(history[0].startTime).toLocaleString('zh-CN') : undefined,
  };
}
