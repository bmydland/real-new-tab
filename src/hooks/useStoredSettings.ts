import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings } from "../settings";
import { showToast } from "../utils/toast";

export function useStoredSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    loadSettings()
      .then((loaded) => {
        if (!ignore) {
          setSettings(loaded);
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          showToast(error instanceof Error ? error.message : "Could not load settings.", "error");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function persistSettings(next: AppSettings, message?: string) {
    setSettings(next);
    await saveSettings(next);

    if (message) {
      showToast(message, "success");
    }
  }

  return { isLoading, persistSettings, settings, showToast };
}
