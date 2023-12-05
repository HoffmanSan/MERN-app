// IMPORTS
import { useEffect, useState } from "react";

export const useDebounce = (value: string | number, delay: number) => {
  // LOCAL STATES
  const [debouncedValue, setDebouncedValue] = useState<string | number>("");

  useEffect(() => {

    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    }

  }, [value, delay]);

  return debouncedValue;
};