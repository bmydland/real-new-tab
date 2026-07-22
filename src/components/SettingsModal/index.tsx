import type { ChangeEvent } from "react";
import {
  FileExportIcon,
  FileImportIcon,
  TrashIcon,
  UploadIcon,
} from "@navikt/aksel-icons";
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
  type BackgroundPosition,
} from "~/settings";
import type { ToastKind } from "~/utils/toast";
import { readFileAsDataUrl } from "~/utils/file/readFileAsDataUrl";
import { readFileAsText } from "~/utils/file/readFileAsText";
import * as Styles from "./styles";
import { ModalHeader } from "~/components/Modal";

interface Props {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onPersist: (settings: AppSettings, message?: string) => Promise<void>;
  onStatus: (message: string, kind?: ToastKind) => void;
}

const GRID_ROW_OPTIONS = [2, 3, 4, 5];

function formatBackupTimestamp(date: Date): string {
  const twoDigits = (value: number) => String(value).padStart(2, "0");
  const datePart = [
    date.getFullYear(),
    twoDigits(date.getMonth() + 1),
    twoDigits(date.getDate()),
  ].join("-");
  const timePart = [
    twoDigits(date.getHours()),
    twoDigits(date.getMinutes()),
    twoDigits(date.getSeconds()),
  ].join("-");

  return `${datePart}_${timePart}`;
}

const BACKGROUND_POSITION_OPTIONS: Array<{
  label: string;
  value: BackgroundPosition;
}> = [
  { label: "Top", value: "top" },
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
  { label: "Bottom", value: "bottom" },
];

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

  async function changeBackgroundPosition(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const backgroundPosition = event.currentTarget.value as BackgroundPosition;

    await onPersist(
      { ...settings, backgroundPosition },
      "Background position saved.",
    );
  }

  async function changeGridRows(event: ChangeEvent<HTMLSelectElement>) {
    const gridRows = Number(event.currentTarget.value);

    await onPersist({ ...settings, gridRows }, "Grid layout saved.");
  }

  function exportSettingsHandler() {
    const payload = createSettingsExport(settings);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `realnewtab-backup-${formatBackupTimestamp(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onStatus("Backup exported!", "success");
    onClose();
  }

  async function importSettings(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imported = parseSettingsImport(
        await readFileAsText(file),
        settings,
      );
      await onPersist(imported, "Backup imported!");
      onClose();
    } catch (error) {
      onStatus(
        error instanceof Error ? error.message : "Could not import settings.",
        "error",
      );
    } finally {
      input.value = "";
    }
  }

  return (
    <Dialog
      open={open}
      placement="right"
      closedby="any"
      closeButton={false}
      onClose={onClose}
    >
      <DialogBlock>
        <ModalHeader title="Settings" onClick={onClose} />

        <Styles.SettingsStack>
          <Styles.SettingsSection>
            <Heading level={2} data-size="xs">
              Tile layout
            </Heading>

            <Field>
              <Label htmlFor="grid-rows">Maximum vertical rows</Label>

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
              <Button asChild variant="primary">
                <label>
                  <UploadIcon aria-hidden />
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
                variant="secondary"
                onClick={() => void clearBackground()}
              >
                <TrashIcon aria-hidden />
                Remove image
              </Button>
            </Styles.SettingsActions>

            <Field>
              <Label htmlFor="background-position">Background position</Label>

              <Select
                id="background-position"
                width="auto"
                value={settings.backgroundPosition}
                onChange={(event) => void changeBackgroundPosition(event)}
              >
                {BACKGROUND_POSITION_OPTIONS.map(({ label, value }) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Field>
          </Styles.SettingsSection>

          <Divider />

          <Styles.SettingsSection>
            <Heading level={2} data-size="xs">
              Backup and restore
            </Heading>

            <p style={{ marginTop: 0 }}>
              Export creates one backup file containing all settings, tiles,
              background images, and tile icons. Keep this file somewhere safe
              and import it to restore your setup on another computer.
            </p>

            <Styles.SettingsActions>
              <Button type="button" onClick={exportSettingsHandler}>
                <FileExportIcon aria-hidden />
                Export full backup
              </Button>

              <Button asChild variant="secondary">
                <label>
                  <FileImportIcon aria-hidden />
                  Import backup
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
