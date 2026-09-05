import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Sauvegarde automatiquement `value` via `onSave` avec un debounce,
 * pour éviter d'écrire à chaque frappe.
 */
export function useAutosave<T>(value: T, onSave: (value: T) => Promise<void>, delayMs = 1200) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const isFirstRender = useRef(true);

  const debouncedSave = useDebouncedCallback(async (val: T) => {
    setStatus("saving");
    try {
      await onSave(val);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, delayMs);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedSave(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return status;
}
