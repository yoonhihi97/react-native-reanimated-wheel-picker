import { useEffect, useState } from 'react';

/**
 * Hook to ensure native modules (Gesture Handler, Reanimated) are fully initialized.
 *
 * Uses requestAnimationFrame to wait for the next frame, which is fast enough
 * for native modules to be ready while avoiding the delay of InteractionManager.
 *
 * @returns {boolean} isReady - true when native modules are ready
 */
export function useWheelPickerReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return isReady;
}
