import { createFileRoute } from '@tanstack/react-router';

/** 运动类型选项 */
export const exerciseTypes = [
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
] as const;

/** 运动类型定义 */
export type ExerciseType = (typeof exerciseTypes)[number]['value'];

export const Route = createFileRoute('/api/exercise-types')({
  server: {
    handlers: {
      async GET() {
        return Response.json(exerciseTypes);
      },
    },
  },
});
