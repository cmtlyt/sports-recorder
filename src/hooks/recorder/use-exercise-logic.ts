import type { ExerciseRecord, ExerciseSegment, ExerciseType, ExerciseTypeOption } from '@/types/recorder';
import type { UseRefStateCtrl } from '../use-ref-state';
import { calculateExerciseStats } from './stats-utils';
import { clearExerciseHistoryStorage, saveCurrentExercise, saveExerciseHistory } from './storage-utils';
import type { RecorderState } from './use-exercise-recorder';

/** 辅助函数：更新分段时长 */
function updateSegmentDuration(segment: ExerciseSegment): ExerciseSegment {
  // 如果分段还在进行中（时长为0），则更新其时长
  if (segment.duration === 0) {
    const duration = Math.floor((Date.now() - segment.startTime.getTime()) / 1000);
    return {
      ...segment,
      duration,
    };
  }
  return segment;
}

/** 辅助函数：结束当前分段并添加新分段 */
function finishCurrentSegmentAndAddNew(segments: ExerciseSegment[], newSegment: ExerciseSegment): ExerciseSegment[] {
  if (segments.length === 0) {
    return [newSegment];
  }

  // 更新最后一个分段的时长
  const updatedSegments = [...segments];
  const lastSegmentIndex = updatedSegments.length - 1;
  updatedSegments[lastSegmentIndex] = updateSegmentDuration(updatedSegments[lastSegmentIndex]);

  // 添加新分段
  return [...updatedSegments, newSegment];
}

/**
 * 运动记录逻辑hook
 */
export function useExerciseLogic(exerciseTypes: ExerciseTypeOption[], stateCtrl: UseRefStateCtrl<RecorderState>) {
  /** 开始运动记录 */
  const startExercise = (type: ExerciseType) => {
    const state = stateCtrl.getState();

    // 创建初始运动分段，指定具体的运动类型
    const segment: ExerciseSegment = {
      id: Date.now().toString(),
      type: 'exercise',
      exerciseType: type, // 指定具体的运动类型
      duration: 0,
      startTime: new Date(),
    };

    // 如果是自定义运动类型，则使用"自定义运动"作为名称，否则使用选择的类型名称
    const exerciseName =
      type === 'custom' ? '自定义运动' : exerciseTypes.find((_type) => _type.value === type)?.label || '自定义运动';

    const exercise: ExerciseRecord = {
      id: Date.now().toString(),
      type,
      name: exerciseName,
      startTime: new Date(),
      segments: [segment],
    };
    state.currentExercise = exercise;
    state.isRecording = true;
    saveCurrentExercise(exercise);

    stateCtrl.forceUpdate();
  };

  /** 停止运动记录 */
  const stopExercise = () => {
    stateCtrl.patchState((state) => {
      if (state.currentExercise) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - state.currentExercise.startTime.getTime()) / 1000);

        // 更新所有分段的时长，确保最后一个分段也被正确计算
        const segmentsWithDurations = (state.currentExercise.segments || []).map(updateSegmentDuration);

        const completedExercise: ExerciseRecord = {
          ...state.currentExercise,
          endTime,
          duration,
          segments: segmentsWithDurations,
        };

        const newHistory = [completedExercise, ...state.exerciseHistory];
        state.exerciseHistory = newHistory;
        state.currentExercise = null;
        state.isRecording = false;
        state.exerciseStats = calculateExerciseStats(newHistory);
        saveExerciseHistory(newHistory);
        saveCurrentExercise(null);
      }
    });
  };

  /** 添加运动分段 */
  const addExerciseSegment = (type: 'exercise' | 'rest', exerciseType?: ExerciseType) => {
    const state = stateCtrl.getState();

    if (!state.currentExercise) {
      return;
    }

    // 获取当前分段列表
    const currentSegments = state.currentExercise.segments || [];

    // 检查是否可以添加分段
    if (currentSegments.length > 0) {
      // 获取最后一个分段
      const lastSegment = currentSegments[currentSegments.length - 1];

      // 如果要添加运动分段，但当前是运动分段，则不允许添加
      if (type === 'exercise' && lastSegment.type === 'exercise') {
        console.warn('当前已在运动分段中，无法添加新的运动分段');
        return;
      }
    }

    const segment: ExerciseSegment = {
      id: Date.now().toString(),
      type,
      exerciseType: type === 'exercise' ? exerciseType : undefined,
      duration: 0,
      startTime: new Date(),
    };

    state.currentExercise = {
      ...state.currentExercise,
      segments: finishCurrentSegmentAndAddNew(currentSegments, segment),
    };

    saveCurrentExercise(state.currentExercise);
    stateCtrl.forceUpdate();
  };

  /** 更新当前分段的持续时间 */
  const updateCurrentSegmentDuration = () => {
    stateCtrl.patchState((state) => {
      if (!(state.currentExercise && state.currentExercise.segments) || state.currentExercise.segments.length === 0) {
        return;
      }

      const segments = state.currentExercise.segments;
      const lastSegment = segments[segments.length - 1];

      // 只更新当前正在进行的分段（持续时间为0的分段）
      if (lastSegment.duration === 0) {
        const updatedSegments = [...segments];
        updatedSegments[segments.length - 1] = updateSegmentDuration(lastSegment);

        state.currentExercise = {
          ...state.currentExercise,
          segments: updatedSegments,
        };

        saveCurrentExercise(state.currentExercise);
      }
    });
  };

  /** 清除运动历史记录 */
  const clearHistory = () => {
    stateCtrl.patchState((state) => {
      state.exerciseHistory = [];
      state.exerciseStats = {
        totalSessions: 0,
        totalDuration: 0,
        totalDistance: 0,
        totalCount: 0,
        averageDuration: 0,
      };
      clearExerciseHistoryStorage();
    });
  };

  return {
    startExercise,
    stopExercise,
    addExerciseSegment,
    updateCurrentSegmentDuration,
    clearHistory,
  };
}
