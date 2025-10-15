import type { ExerciseRecord, ExerciseTypeOption } from '@/types/recorder';
import { formatDuration } from '@/utils/recorder/format-duration';
import styles from './index.module.css';

interface HistoryViewProps {
  exerciseHistory: ExerciseRecord[];
  onClearHistory: () => void;
  exerciseTypes: ExerciseTypeOption[];
}

export function HistoryView({ exerciseHistory, onClearHistory, exerciseTypes }: HistoryViewProps) {
  const getExerciseLabel = (type: string): string =>
    exerciseTypes.find((_type) => _type.value === type)?.label || '自定义运动';

  return (
    <div className={styles.historyPage}>
      <div className={styles.historyHeader}>
        <h2 className={styles.recordingTitle}>运动历史</h2>
        {exerciseHistory.length > 0 && (
          <button className={styles.clearButton} onClick={onClearHistory} type="button">
            清空历史
          </button>
        )}
      </div>
      {exerciseHistory.length === 0 ? (
        <p className={styles.emptyState}>暂无运动记录</p>
      ) : (
        <div className={styles.historyList}>
          {exerciseHistory.map((exercise) => (
            <div className={styles.historyItem} key={exercise.id}>
              <div className={styles.historyItemHeader}>
                <span className={styles.historyTime}>{exercise.startTime.toLocaleString('zh-CN')}</span>
                <span className={styles.historyDuration}>{formatDuration(exercise.duration || 0)}</span>
              </div>
              {exercise.segments && exercise.segments.length > 0 && (
                <div className={styles.historySegments}>
                  <span>分段: </span>
                  {exercise.segments.map((seg, index) => (
                    <span key={seg.id}>
                      {index > 0 && ' → '}
                      {seg.type === 'exercise' ? seg.exerciseType && getExerciseLabel(seg.exerciseType) : '休息'}
                      {/* 显示分段持续时间，对于所有有duration>0的分段都显示时间 */}
                      {seg.duration > 0 && `(${formatDuration(seg.duration)})`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
