import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import logo from '@/logo.svg';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={`${styles.homeContent} ${isMounted ? styles.mounted : ''}`}>
        {/* Logo 和标题区域 */}
        <div className={`${styles.logoSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.logoWrapper}>
            <img alt="Sports Recorder Logo" className={styles.logo} src={logo} />
          </div>
          <h1 className={styles.title}>Sports Recorder</h1>
          <p className={styles.subtitle}>记录每一次运动，见证每一份进步</p>
        </div>

        {/* 功能卡片区域 */}
        <div className={`${styles.featuresSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏃</div>
            <h3>运动追踪</h3>
            <p>精准记录你的每一次运动数据</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>数据分析</h3>
            <p>可视化展示你的运动成果和进步</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <h3>成就系统</h3>
            <p>解锁成就，激励持续运动</p>
          </div>
        </div>

        {/* 主要操作按钮 */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <Link className={styles.ctaButton} to="/recorder">
            开始记录
          </Link>
          <p className={styles.ctaSubtext}>立即开始你的运动之旅</p>
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className={styles.decorativeElements}>
        <div className={`${styles.circle} ${styles.circle1}`} />
        <div className={`${styles.circle} ${styles.circle2}`} />
        <div className={`${styles.circle} ${styles.circle3}`} />
      </div>
    </div>
  );
}
