import { Button, DialogBlock, Heading } from "@digdir/designsystemet-react";
import type { ChangeEvent } from "react";
import type { AppSettings } from "../settings";
import { createSettingsExport, parseSettingsImport } from "../settings";
import { readFileAsDataUrl } from "../utils/file/readFileAsDataUrl";
import { readFileAsText } from "../utils/file/readFileAsText";
import type { ToastKind } from "../utils/toast";
import {
  HiddenFileInput,
  PreviewGrid,
  PreviewTile,
  SettingsActions,
  SettingsFact,
  SettingsFacts,
  SettingsPreview,
  SettingsSection,
  SettingsStack,
  StyledSettingsDialog,
} from "./SettingsDialog.styles";

type SettingsDialogProps = {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onPersist: (settings: AppSettings, message?: string) => Promise<void>;
  onStatus: (message: string, kind?: ToastKind) => void;
};

export function SettingsDialog({ open, settings, onClose, onPersist, onStatus }: SettingsDialogProps) {
  if (!open) {
    return null;
  }

  async function handleBackgroundChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const backgroundImage = await readFileAsDataUrl(file);
    await onPersist({ ...settings, backgroundImage }, "Background image saved.");
  }

  async function clearBackground() {
    await onPersist({ ...settings, backgroundImage: undefined }, "Background image removed.");
  }

  function exportSettings() {
    const payload = createSettingsExport(settings);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `realnewtab-settings-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onStatus("Settings exported.", "success");
  }

  async function importSettings(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imported = parseSettingsImport(await readFileAsText(file), settings);
      await onPersist(imported, "Settings imported.");
    } catch (error) {
      onStatus(error instanceof Error ? error.message : "Could not import settings.", "error");
    } finally {
      event.currentTarget.value = "";
    }
  }

  return (
    <StyledSettingsDialog open={open} closedby="any" closeButton="Close dialog" onClose={onClose}>
      <DialogBlock>
        <Heading level={1} data-size="sm">
          Settings
        </Heading>
      </DialogBlock>

      <DialogBlock>
        <SettingsStack>
          <SettingsPreview $backgroundColor={settings.backgroundColor} $backgroundImage={settings.backgroundImage}>
            <PreviewGrid aria-hidden="true">
              {settings.tiles.slice(0, 14).map((tile) => (
                <PreviewTile key={tile.id} $size={tile.size} />
              ))}
            </PreviewGrid>
          </SettingsPreview>

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Background image
            </Heading>
            <SettingsActions>
              <Button asChild variant="secondary">
                <label>
                  Upload image
                  <HiddenFileInput type="file" accept="image/*" onChange={(event) => void handleBackgroundChange(event)} />
                </label>
              </Button>
              <Button type="button" variant="tertiary" onClick={() => void clearBackground()}>
                Remove image
              </Button>
            </SettingsActions>
          </SettingsSection>

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Import / export settings
            </Heading>
            <SettingsActions>
              <Button type="button" onClick={exportSettings}>
                Export settings
              </Button>
              <Button asChild variant="secondary">
                <label>
                  Import settings
                  <HiddenFileInput type="file" accept="application/json,.json" onChange={(event) => void importSettings(event)} />
                </label>
              </Button>
            </SettingsActions>
          </SettingsSection>

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Current data
            </Heading>
            <SettingsFacts>
              <SettingsFact>
                <dt>Tiles</dt>
                <dd>{settings.tiles.length}</dd>
              </SettingsFact>
              <SettingsFact>
                <dt>Background</dt>
                <dd>{settings.backgroundImage ? "Custom image" : "Default"}</dd>
              </SettingsFact>
            </SettingsFacts>
          </SettingsSection>
        </SettingsStack>
      </DialogBlock>
    </StyledSettingsDialog>
  );
}
