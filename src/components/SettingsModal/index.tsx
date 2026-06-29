import type { ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogBlock,
  Divider,
  Field,
  Heading,
  Label,
  Select,
} from "@digdir/designsystemet-react";
import {
  createSettingsExport,
  parseSettingsImport,
  type AppSettings,
} from "~/settings";
import type { ToastKind } from "~/utils/toast";
import { readFileAsDataUrl } from "~/utils/file/readFileAsDataUrl";
import { readFileAsText } from "~/utils/file/readFileAsText";
import * as Styles from "./styles";

interface Props {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onPersist: (settings: AppSettings, message?: string) => Promise<void>;
  onStatus: (message: string, kind?: ToastKind) => void;
}

const GRID_ROW_OPTIONS = [2, 3, 4, 5, 6];

// TODO: When import/export is successfull, close modal
export function SettingsModal({
  open,
  settings,
  onClose,
  onPersist,
  onStatus,
}: Props) {
  if (!open) {
    return null;
  }

  async function handleBackgroundChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const backgroundImage = await readFileAsDataUrl(file);

    await onPersist(
      { ...settings, backgroundImage },
      "Background image saved.",
    );
  }

  async function clearBackground() {
    await onPersist(
      { ...settings, backgroundImage: undefined },
      "Background image removed.",
    );
  }

  async function changeGridRows(event: ChangeEvent<HTMLSelectElement>) {
    const gridRows = Number(event.currentTarget.value);

    await onPersist({ ...settings, gridRows }, "Grid layout saved.");
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
      const imported = parseSettingsImport(
        await readFileAsText(file),
        settings,
      );
      await onPersist(imported, "Settings imported.");
    } catch (error) {
      onStatus(
        error instanceof Error ? error.message : "Could not import settings.",
        "error",
      );
    } finally {
      event.currentTarget.value = "";
    }
  }

  return (
    <Dialog
      open={open}
      modal={false}
      placement="right"
      closedby="any"
      closeButton="Close dialog"
      onClose={onClose}
      style={{ zIndex: 100 }}
    >
      <DialogBlock>
        <Heading level={1} data-size="sm">
          Settings
        </Heading>
      </DialogBlock>

      <DialogBlock>
        <Styles.SettingsStack>
          <Styles.SettingsSection>
            <Heading level={2} data-size="xs">
              Tile layout
            </Heading>

            <Field>
              <Label htmlFor="grid-rows">Maximum rows</Label>
              <Field.Description>
                The grid stays only as wide as needed for this many rows.
              </Field.Description>

              <Select
                id="grid-rows"
                width="auto"
                value={settings.gridRows}
                onChange={(event) => void changeGridRows(event)}
              >
                {GRID_ROW_OPTIONS.map((x) => (
                  <Select.Option key={x} value={x}>
                    {x}
                  </Select.Option>
                ))}
              </Select>
            </Field>
          </Styles.SettingsSection>

          <Divider />

          <Styles.SettingsSection>
            <Heading level={2} data-size="xs">
              Background image
            </Heading>

            <Styles.SettingsActions>
              <Button asChild variant="secondary">
                <label>
                  Upload image
                  <Styles.HiddenFileInput
                    type="file"
                    accept="image/*"
                    onChange={(event) => void handleBackgroundChange(event)}
                  />
                </label>
              </Button>

              <Button
                type="button"
                variant="tertiary"
                onClick={() => void clearBackground()}
              >
                Remove image
              </Button>
            </Styles.SettingsActions>
          </Styles.SettingsSection>

          <Divider />

          <Styles.SettingsSection>
            <Heading level={2} data-size="xs">
              Import / export settings
            </Heading>

            <Styles.SettingsActions>
              <Button type="button" onClick={exportSettings}>
                Export settings
              </Button>

              <Button asChild variant="secondary">
                <label>
                  Import settings
                  <Styles.HiddenFileInput
                    type="file"
                    accept="application/json,.json"
                    onChange={(event) => void importSettings(event)}
                  />
                </label>
              </Button>
            </Styles.SettingsActions>
          </Styles.SettingsSection>
        </Styles.SettingsStack>
      </DialogBlock>
    </Dialog>
  );
}
