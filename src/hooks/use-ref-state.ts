import { useMemo, useRef } from 'react';
import { useForceUpdate } from './use-force-update';

export interface UseRefStateCtrl<T> {
  patchState: (updater: (state: T) => void, update?: boolean) => void;
  forceUpdate: () => void;
  getState: () => T;
  setState: (state: T, update?: boolean) => void;
  reset: (update?: boolean) => void;
}

export function useRefState<T>(initialState: T) {
  const origin = useRef(initialState);
  const stateRef = useRef(initialState);
  const forceUpdate = useForceUpdate();

  const ctrl = useMemo<UseRefStateCtrl<T>>(() => {
    const patchState = (updater: (state: T) => void, update = true) => {
      updater(stateRef.current);
      void (update && forceUpdate());
    };

    const setState = (state: T, update = true) => {
      patchState(() => {
        stateRef.current = state;
      }, update);
    };

    return {
      patchState,
      forceUpdate,
      getState: () => stateRef.current,
      setState,
      reset: (update = true) => setState(origin.current, update),
    };
  }, [forceUpdate]);

  return [stateRef.current, ctrl] as const;
}
