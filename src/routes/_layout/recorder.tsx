import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ExerciseSelector } from '@/components/recorder/exercise-selector';
import { HistoryView } from '@/components/recorder/history-view';
import { RecordingView } from '@/components/recorder/recording-view';
import { StatsView } from '@/components/recorder/stats-view';
import { TabNavigation } from '@/components/recorder/tab-navigation';
import { useExerciseRecorder } from '@/hooks/recorder/use-exercise-recorder';
import type { ActiveTab, ExerciseTypeOption } from '@/types/recorder';
import styles from './recorder.module.css';

export const Route = createFileRoute('/_layout/recorder')({
  component: RouteComponent,
});

/** 运动类型选项 */
export const defaultExerciseTypes: ExerciseTypeOption[] = [
  { value: 'walking', label: '步行', icon: '🚶', unit: '分钟' },
  { value: 'running', label: '跑步', icon: '🏃', unit: '公里' },
  { value: 'pushup', label: '俯卧撑', icon: '💪', unit: '个' },
  { value: 'situp', label: '仰卧起坐', icon: '🧘', unit: '个' },
  { value: 'squat', label: '深蹲', icon: '🦵', unit: '个' },
  { value: 'plank', label: '平板支撑', icon: '⏱️', unit: '秒' },
  { value: 'cycling', label: '骑行', icon: '🚴', unit: '公里' },
  { value: 'swimming', label: '游泳', icon: '🏊', unit: '米' },
  { value: 'jumpingRope', label: '跳绳', icon: '🪢', unit: '次' },
  { value: 'yoga', label: '瑜伽', icon: '🧘', unit: '分钟' },
  { value: 'weightlifting', label: '举重', icon: '🏋️', unit: '公斤' },
  { value: 'custom', label: '自定义', icon: '📝', unit: '' },
];

function RouteComponent() {
  const { data: exerciseTypes } = useQuery({
    queryKey: ['exerciseTypes'],
    queryFn: () => fetch('/api/exercise-types').then<ExerciseTypeOption[]>((res) => res.json()),
    initialData: defaultExerciseTypes,
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('record');

  const {
    // 状态
    isRecording,
    currentExercise,
    exerciseHistory,
    exerciseStats,

    // 操作函数
    getExerciseType,
    startExercise,
    stopExercise,
    addExerciseSegment,
    clearHistory,
  } = useExerciseRecorder({ exerciseTypes });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 标题 */}
        <h1 className={styles.title}>运动记录器</h1>

        {/* 标签页导航 - 仅在非运动记录状态下显示 */}
        {!isRecording && <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />}

        {/* 运动记录页面 */}
        {activeTab === 'record' &&
          (isRecording ? (
            <RecordingView
              currentExercise={currentExercise!}
              exerciseTypes={exerciseTypes}
              getExerciseType={getExerciseType}
              onAddSegment={addExerciseSegment}
              onStopExercise={stopExercise}
            />
          ) : (
            <ExerciseSelector exerciseTypes={exerciseTypes} onStartExercise={startExercise} />
          ))}

        {/* 运动历史页面 */}
        {activeTab === 'history' && (
          <HistoryView exerciseHistory={exerciseHistory} exerciseTypes={exerciseTypes} onClearHistory={clearHistory} />
        )}

        {/* 运动统计页面 */}
        {activeTab === 'stats' && <StatsView exerciseStats={exerciseStats} />}
      </div>
    </div>
  );
}
