import type { ExerciseStats } from '@/types/recorder';
import { formatDuration } from '@/utils/recorder/format-duration';
import styles from './index.module.css';

interface StatsViewProps {
  exerciseStats: ExerciseStats;
}

export function StatsView({ exerciseStats }: StatsViewProps) {
  return (
    <div className={styles.statsPage}>
      <h2 className={styles.recordingTitle}>运动统计</h2>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={`${styles.statValue} ${styles.blue}`}>{exerciseStats.totalSessions}</div>
          <div className={styles.statLabel}>总运动次数</div>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <div className={`${styles.statValue} ${styles.green}`}>{formatDuration(exerciseStats.totalDuration)}</div>
          <div className={styles.statLabel}>总运动时长</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={`${styles.statValue} ${styles.purple}`}>{exerciseStats.totalDistance.toFixed(1)} km</div>
          <div className={styles.statLabel}>总距离</div>
        </div>
        <div className={`${styles.statCard} ${styles.orange}`}>
          <div className={`${styles.statValue} ${styles.orange}`}>{formatDuration(exerciseStats.averageDuration)}</div>
          <div className={styles.statLabel}>平均时长</div>
        </div>
      </div>

      {exerciseStats.lastExercise && (
        <div className={styles.lastExercise}>
          <p className={styles.lastExerciseText}>最近一次运动: {exerciseStats.lastExercise}</p>
        </div>
      )}
    </div>
  );
}
