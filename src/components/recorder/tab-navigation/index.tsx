import { BarChart3, History, Play } from 'lucide-react';
import type { ActiveTab } from '@/types/recorder';
import styles from './index.module.css';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className={styles.tabNav}>
      <button
        className={`${styles.tabButton} ${activeTab === 'record' ? styles.active : styles.inactive}`}
        onClick={() => onTabChange('record')}
        type="button"
      >
        <Play className={styles.tabIcon} />
        运动记录
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'history' ? styles.active : styles.inactive}`}
        onClick={() => onTabChange('history')}
        type="button"
      >
        <History className={styles.tabIcon} />
        运动历史
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'stats' ? styles.active : styles.inactive}`}
        onClick={() => onTabChange('stats')}
        type="button"
      >
        <BarChart3 className={styles.tabIcon} />
        运动统计
      </button>
    </div>
  );
}
