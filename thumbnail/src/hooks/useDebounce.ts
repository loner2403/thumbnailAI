import { useRef, useCallback } from "react";

function useDebounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => func(...args), wait);
  }, [func, wait]);
}

export default useDebounce;
