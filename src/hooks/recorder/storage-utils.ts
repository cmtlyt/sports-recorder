import type { ExerciseRecord } from '@/types/recorder';

/** 本地存储键名 */
const STORAGE_KEY = 'cmtlyt:sports-recorder:exercises';
const CURRENT_EXERCISE_STORAGE_KEY = 'cmtlyt:sports-recorder:current-exercise';

/**
 * 从本地存储加载运动历史数据
 * @returns 运动记录数组
 */
export function loadExerciseHistory(): ExerciseRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 将字符串日期转换回 Date 对象
      return parsed.map((exercise: any) => {
        return {
          ...exercise,
          startTime: new Date(exercise.startTime),
          endTime: exercise.endTime ? new Date(exercise.endTime) : undefined,
          segments:
            exercise.segments?.map((segment: any) => {
              return {
                ...segment,
                startTime: new Date(segment.startTime),
              };
            }) || [],
        };
      });
    }
  } catch (error) {
    console.error('Failed to load exercise history:', error);
  }
  return [];
}

/**
 * 保存运动历史数据到本地存储
 * @param history 运动记录数组
 */
export function saveExerciseHistory(history: ExerciseRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save exercise history:', error);
  }
}

/**
 * 从本地存储加载当前运动状态
 * @returns 当前运动记录或null
 */
export function loadCurrentExercise(): ExerciseRecord | null {
  try {
    const stored = localStorage.getItem(CURRENT_EXERCISE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 将字符串日期转换回 Date 对象
      return {
        ...parsed,
        startTime: new Date(parsed.startTime),
        segments:
          parsed.segments?.map((segment: any) => {
            return {
              ...segment,
              startTime: new Date(segment.startTime),
            };
          }) || [],
      };
    }
  } catch (error) {
    console.error('Failed to load current exercise:', error);
  }
  return null;
}

/**
 * 保存当前运动状态到本地存储
 * @param exercise 运动记录或null
 */
export function saveCurrentExercise(exercise: ExerciseRecord | null) {
  try {
    if (exercise) {
      localStorage.setItem(CURRENT_EXERCISE_STORAGE_KEY, JSON.stringify(exercise));
    } else {
      localStorage.removeItem(CURRENT_EXERCISE_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to save current exercise:', error);
  }
}

/**
 * 清除本地存储的运动历史数据
 */
export function clearExerciseHistoryStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear exercise history:', error);
  }
}
