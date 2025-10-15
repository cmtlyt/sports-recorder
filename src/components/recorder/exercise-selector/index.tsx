import { Clock, Plus } from 'lucide-react';
import { useState } from 'react';
import type { ExerciseType, ExerciseTypeOption } from '@/types/recorder';
import styles from './index.module.css';

interface ExerciseSelectorProps {
  exerciseTypes: ExerciseTypeOption[];
  onStartExercise: (type: ExerciseType) => void;
}

export function ExerciseSelector({ exerciseTypes, onStartExercise }: ExerciseSelectorProps) {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [selectedType, setSelectedType] = useState<ExerciseType | undefined>(undefined);

  const handleStartExercise = () => {
    if (selectedType) {
      onStartExercise(selectedType);
    }
  };

  return (
    <div className={styles.exerciseSelection}>
      {showTypeSelector ? (
        <div className={styles.exerciseTypeSelector}>
          <h3 className={styles.selectorTitle}>选择运动类型</h3>
          <div className={styles.exerciseTypeContainer}>
            <div className={styles.exerciseGrid}>
              {exerciseTypes.map((exercise) => (
                <button
                  className={`${styles.exerciseButton} ${selectedType === exercise.value ? styles.selected : ''}`}
                  key={exercise.value}
                  onClick={() => setSelectedType(exercise.value)}
                  type="button"
                >
                  <span className={styles.exerciseIcon}>{exercise.icon}</span>
                  <span className={styles.exerciseLabel}>{exercise.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.selectorActions}>
            <button
              className={`${styles.segmentButton} ${styles.green}`}
              disabled={!selectedType}
              onClick={handleStartExercise}
              type="button"
            >
              开始运动
            </button>
            <button
              className={`${styles.segmentButton} ${styles.gray}`}
              onClick={() => setShowTypeSelector(false)}
              type="button"
            >
              返回
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.startButtonContainer}>
          <button className={styles.startButton} onClick={() => setShowTypeSelector(true)} type="button">
            开始运动
          </button>
        </div>
      )}
    </div>
  );
}

export function SegmentControls({
  onAddSegment,
  currentExerciseType,
  currentSegmentType,
  exerciseTypes,
}: {
  onAddSegment: (type: 'exercise' | 'rest', exerciseType?: ExerciseType) => void;
  currentExerciseType?: ExerciseType;
  currentSegmentType?: 'exercise' | 'rest';
  exerciseTypes: ExerciseTypeOption[];
}) {
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | undefined>(currentExerciseType);

  const handleAddExerciseSegment = () => {
    onAddSegment('exercise', selectedExerciseType);
    setShowExerciseSelector(false);
  };

  return (
    <div className={styles.segmentControls}>
      {showExerciseSelector ? (
        <div className={styles.exerciseTypeSelector}>
          <h3 className={styles.selectorTitle}>选择运动类型</h3>
          {/* 添加滚动容器 */}
          <div className={styles.exerciseTypeContainer}>
            <div className={styles.exerciseGrid}>
              {exerciseTypes
                .filter((exercise) => exercise.value !== 'custom')
                .map((exercise) => (
                  <button
                    className={`${styles.exerciseButton} ${
                      selectedExerciseType === exercise.value ? styles.selected : ''
                    }`}
                    key={exercise.value}
                    onClick={() => setSelectedExerciseType(exercise.value)}
                    type="button"
                  >
                    <span className={styles.exerciseIcon}>{exercise.icon}</span>
                    <span className={styles.exerciseLabel}>{exercise.label}</span>
                  </button>
                ))}
            </div>
          </div>
          <div className={styles.selectorActions}>
            <button
              className={`${styles.segmentButton} ${styles.green}`}
              onClick={handleAddExerciseSegment}
              type="button"
            >
              确认添加
            </button>
            <button
              className={`${styles.segmentButton} ${styles.gray}`}
              onClick={() => setShowExerciseSelector(false)}
              type="button"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 只有在当前不是运动分段时才显示添加运动分段按钮 */}
          {currentSegmentType !== 'exercise' && (
            <button
              className={`${styles.segmentButton} ${styles.green}`}
              onClick={() => setShowExerciseSelector(true)}
              type="button"
            >
              <Plus className={styles.tabIcon} />
              添加运动分段
            </button>
          )}
          {/* 只有在当前不是休息分段时才显示添加休息分段按钮 */}
          {currentSegmentType !== 'rest' && (
            <button
              className={`${styles.segmentButton} ${styles.yellow}`}
              onClick={() => onAddSegment('rest')}
              type="button"
            >
              <Clock className={styles.tabIcon} />
              添加休息分段
            </button>
          )}
        </>
      )}
    </div>
  );
}
