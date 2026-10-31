import { useSyncExternalStore } from 'react';

type StateCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T> | T)) => void,
  get: () => T
) => T;

export function create<T>(initializer: StateCreator<T>) {
  let state: T;
  const listeners = new Set<() => void>();

  const get = () => state;

  const set = (partial: Partial<T> | ((state: T) => Partial<T> | T)) => {
    const next = typeof partial === 'function' ? (partial as (state: T) => Partial<T> | T)(state) : partial;
    if (next !== state) {
      state = Object.assign({}, state, next);
      listeners.forEach((listener) => listener());
    }
  };

  state = initializer(set, get);

  const useStore = <U = T>(selector?: (state: T) => U): U => {
    return useSyncExternalStore(
      (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
      },
      () => (selector ? selector(state) : (state as unknown as U)),
      () => (selector ? selector(state) : (state as unknown as U))
    );
  };

  Object.assign(useStore, {
    getState: get,
    setState: set,
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  });

  return useStore as typeof useStore & {
    getState: () => T;
    setState: typeof set;
    subscribe: (callback: () => void) => () => void;
  };
}

export default create;
