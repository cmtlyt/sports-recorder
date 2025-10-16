import { Clock, Square } from 'lucide-react';
import { useEffect } from 'react';
import { useForceUpdate } from '@/hooks/use-force-update';
import type { ExerciseRecord, ExerciseType, ExerciseTypeOption } from '@/types/recorder';
import { formatDuration } from '@/utils/recorder/format-duration';
import { SegmentControls } from '../exercise-selector';
import styles from './index.module.css';

interface RecordingViewProps {
  currentExercise: ExerciseRecord;
  exerciseTypes: ExerciseTypeOption[];
  getExerciseType: (type: ExerciseTypeOption['value'] | undefined) => ExerciseTypeOption | null;
  onStopExercise: () => void;
  onAddSegment: (type: 'exercise' | 'rest', exerciseType?: ExerciseType) => void;
}

export function Timer({ startTime }: { startTime: number }) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [forceUpdate]);

  return <span className={styles.timer}>{formatDuration(Math.floor((Date.now() - startTime) / 1000))}</span>;
}

export function RecordingView({
  currentExercise,
  exerciseTypes,
  getExerciseType,
  onStopExercise,
  onAddSegment,
}: RecordingViewProps) {
  // 更新分段持续时间
  const segmentsWithUpdatedDuration =
    currentExercise.segments?.map((segment) => {
      return { ...segment };
    }) || [];

  // 获取当前最后一个分段的类型
  const lastSegment = (currentExercise.segments || []).at(-1);

  return (
    <div className={styles.recordingCard}>
      <div className={styles.recordingHeader}>
        <h2 className={styles.recordingTitle}>
          {(getExerciseType((lastSegment || {}).exerciseType) || {}).label || '运动'} - 记录中
        </h2>
        <div className={styles.timerContainer}>
          <Clock className={styles.timerIcon} />
          <Timer startTime={currentExercise.startTime.getTime()} />
        </div>
      </div>

      {/* 分段记录控制 */}
      <SegmentControls
        currentExerciseType={currentExercise.type}
        currentSegmentType={(lastSegment || {}).type}
        exerciseTypes={exerciseTypes}
        onAddSegment={onAddSegment}
      />

      {/* 分段记录列表 */}
      {segmentsWithUpdatedDuration.length > 0 && (
        <div className={styles.segmentList}>
          <h3 className={styles.segmentTitle}>分段记录</h3>
          <div className={styles.segmentList}>
            {segmentsWithUpdatedDuration.map((segment, index, arr) => {
              const exerciseType = getExerciseType(segment.exerciseType);
              const exerciseLabel = exerciseType ? `${exerciseType.icon} ${exerciseType.label}` : '🏃 运动';

              return (
                <div className={styles.segmentItem} key={segment.id}>
                  <span>{segment.type === 'exercise' ? exerciseLabel : '⏸️ 休息'}</span>
                  {index === arr.length - 1 ? (
                    <Timer startTime={segment.startTime.getTime()} />
                  ) : (
                    <span>{formatDuration(segment.duration)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 停止记录按钮 */}
      <div className={styles.stopButtonContainer}>
        <button className={styles.stopButton} onClick={onStopExercise} type="button">
          <Square className={styles.tabIcon} />
          停止记录
        </button>
      </div>
    </div>
  );
}
