import { useReducer } from 'react';

/**
 * 自定义 hook，用于强制组件重新渲染
 * @returns 强制更新函数
 */
export function useForceUpdate() {
  const [, forceUpdate] = useReducer(() => Math.random(), 0);
  return forceUpdate;
}
