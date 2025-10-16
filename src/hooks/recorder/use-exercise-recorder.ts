import { useEffect } from 'react';
import type { ExerciseRecord, ExerciseStats, ExerciseTypeOption } from '@/types/recorder';
import { useRefState } from '../use-ref-state';
import { calculateExerciseStats } from './stats-utils';
import { loadCurrentExercise, loadExerciseHistory } from './storage-utils';
import { useExerciseLogic } from './use-exercise-logic';

// 定义状态结构
export interface RecorderState {
  isRecording: boolean;
  currentExercise: ExerciseRecord | null;
  exerciseHistory: ExerciseRecord[];
  exerciseStats: ExerciseStats;
}

export function useExerciseRecorder({ exerciseTypes }: { exerciseTypes: ExerciseTypeOption[] }) {
  // 使用状态管理hook
  const [recorderState, ctrl] = useRefState<RecorderState>({
    isRecording: false,
    currentExercise: null,
    exerciseHistory: [],
    exerciseStats: {
      totalSessions: 0,
      totalDuration: 0,
      totalDistance: 0,
      totalCount: 0,
      averageDuration: 0,
    },
  });

  // 初始化时从本地存储加载数据
  // biome-ignore lint/correctness/useExhaustiveDependencies: once
  useEffect(() => {
    ctrl.patchState((state) => {
      const history = loadExerciseHistory();
      state.exerciseHistory = history;
      // 计算统计数据
      state.exerciseStats = calculateExerciseStats(history);

      // 尝试恢复之前未完成的运动
      const savedCurrentExercise = loadCurrentExercise();
      if (savedCurrentExercise) {
        state.currentExercise = savedCurrentExercise;
        state.isRecording = true;
      }
    });
  }, []);

  // 使用运动记录逻辑hook
  const {
    getExerciseType,
    startExercise,
    stopExercise,
    addExerciseSegment,
    updateCurrentSegmentDuration,
    clearHistory,
  } = useExerciseLogic(exerciseTypes, ctrl);

  return {
    // 状态
    isRecording: recorderState.isRecording,
    currentExercise: recorderState.currentExercise,
    exerciseHistory: recorderState.exerciseHistory,
    exerciseStats: recorderState.exerciseStats,

    // 操作函数
    getExerciseType,
    startExercise,
    stopExercise,
    addExerciseSegment,
    updateCurrentSegmentDuration,
    clearHistory,
  };
}
