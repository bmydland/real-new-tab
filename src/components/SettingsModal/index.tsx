import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Toaster } from "react-hot-toast";
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
  Fieldset,
  Heading,
  Label,
  Radio,
  Select,
} from "@digdir/designsystemet-react";
import {
  createSettingsExport,
  formatToolbarRevealKey,
  normalizeToolbarRevealKey,
  parseSettingsImport,
  type AppSettings,
  type BackgroundPosition,
  type ToolbarRevealMode,
} from "~/settings";
import type { ToastKind } from "~/utils/toast";
import { readFileAsDataUrl } from "~/utils/file/readFileAsDataUrl";
import { readFileAsText } from "~/utils/file/readFileAsText";
import { ModalHeader } from "~/components/Modal";
import { RangeField } from "~/components/RangeField";
import { SrOnly } from "~/components/SrOnly";
import { TILE_SIZE_SCALE_RANGE } from "~/settings/constants";
import { formatBackupTimestamp } from "./utils";
import {
  BACKGROUND_POSITION_OPTIONS,
  GRID_ROW_OPTIONS,
  TOOLBAR_REVEAL_OPTIONS,
} from "./settings";
import {
  SettingsActions,
  SettingsSection,
  SettingsStack,
  ToolbarRevealKeyField,
  ToolbarRevealOptions,
} from "./styles";

const TILE_SIZE_SAVE_DELAY_MS = 300;

interface Props {
  settings: AppSettings;
  onClose: () => void;
  onPersist: (settings: AppSettings, message?: string) => Promise<void>;
  onTileSizeScalePreview: (tileSizeScale: number) => void;
  onStatus: (message: string, kind?: ToastKind) => void;
}

export function SettingsModal({
  settings,
  onClose,
  onPersist,
  onTileSizeScalePreview,
  onStatus,
}: Props) {
  const [tileSizeScale, setTileSizeScale] = useState(settings.tileSizeScale);
  const latestSettingsRef = useRef(settings);
  const pendingTileSizeScaleRef = useRef<number | null>(null);
  const tileSizeSaveTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    latestSettingsRef.current = settings;
  }, [settings]);

  useEffect(
    () => () => {
      if (tileSizeSaveTimerRef.current !== undefined) {
        window.clearTimeout(tileSizeSaveTimerRef.current);
      }
    },
    [],
  );

  function clearTileSizeSaveTimer() {
    if (tileSizeSaveTimerRef.current !== undefined) {
      window.clearTimeout(tileSizeSaveTimerRef.current);
      tileSizeSaveTimerRef.current = undefined;
    }
  }

  function persistPendingTileSizeScale() {
    clearTileSizeSaveTimer();

    const tileSizeScale = pendingTileSizeScaleRef.current;

    if (tileSizeScale === null) {
      return;
    }

    pendingTileSizeScaleRef.current = null;

    const next = {
      ...latestSettingsRef.current,
      tileSizeScale,
    };

    latestSettingsRef.current = next;
    void onPersist(next).catch((error: unknown) => {
      onStatus(
        error instanceof Error ? error.message : "Could not save tile size.",
        "error",
      );
    });
  }

  function cancelPendingTileSizeScale() {
    clearTileSizeSaveTimer();
    pendingTileSizeScaleRef.current = null;
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

  async function changeToolbarRevealMode(toolbarRevealMode: ToolbarRevealMode) {
    await onPersist(
      { ...settings, toolbarRevealMode },
      "Toolbar reveal setting saved.",
    );
  }

  async function captureToolbarRevealKey(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const toolbarRevealKey = normalizeToolbarRevealKey(event.key);

    if (!toolbarRevealKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    await onPersist(
      { ...settings, toolbarRevealKey },
      `Toolbar reveal key set to ${formatToolbarRevealKey(toolbarRevealKey)}.`,
    );
  }

  function changeTileSizeScale(event: ChangeEvent<HTMLInputElement>) {
    const tileSizeScale = event.currentTarget.valueAsNumber;

    setTileSizeScale(tileSizeScale);
    pendingTileSizeScaleRef.current = tileSizeScale;
    onTileSizeScalePreview(tileSizeScale);

    clearTileSizeSaveTimer();

    tileSizeSaveTimerRef.current = window.setTimeout(
      persistPendingTileSizeScale,
      TILE_SIZE_SAVE_DELAY_MS,
    );
  }

  function exportSettingsHandler() {
    persistPendingTileSizeScale();

    const payload = createSettingsExport(latestSettingsRef.current);
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

  function onCloseHandler() {
    persistPendingTileSizeScale();
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
      cancelPendingTileSizeScale();
      onTileSizeScalePreview(imported.tileSizeScale);
      await onPersist(imported, "Backup imported!");
      onCloseHandler();
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
      open
      placement="right"
      closedby="any"
      closeButton={false}
      onClose={onCloseHandler}
    >
      <DialogBlock>
        <ModalHeader title="Settings" onClose={onCloseHandler} />

        <SettingsStack>
          <SettingsSection>
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
          </SettingsSection>

          <Divider />

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Tile scaler
            </Heading>

            <RangeField
              id="tile-size-scale"
              label="Tile size adjustment"
              valueText={`${tileSizeScale > 0 ? "+" : ""}${tileSizeScale}%`}
              min={TILE_SIZE_SCALE_RANGE.min}
              max={TILE_SIZE_SCALE_RANGE.max}
              step={TILE_SIZE_SCALE_RANGE.step}
              value={tileSizeScale}
              aria-valuetext={`${tileSizeScale}%`}
              onChange={changeTileSizeScale}
              onPointerUp={persistPendingTileSizeScale}
              onPointerCancel={persistPendingTileSizeScale}
              onKeyUp={persistPendingTileSizeScale}
              onBlur={persistPendingTileSizeScale}
            />
          </SettingsSection>

          <Divider />

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Toolbar
            </Heading>

            <Fieldset>
              <Fieldset.Legend>Reveal toolbar</Fieldset.Legend>
              <Fieldset.Description>
                Choose how the hidden toolbar becomes visible.
              </Fieldset.Description>

              <ToolbarRevealOptions>
                {TOOLBAR_REVEAL_OPTIONS.map((option) => (
                  <Radio
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    name="toolbar-reveal-mode"
                    value={option.value}
                    checked={settings.toolbarRevealMode === option.value}
                    onChange={() => void changeToolbarRevealMode(option.value)}
                  />
                ))}
              </ToolbarRevealOptions>
            </Fieldset>

            {settings.toolbarRevealMode === "keypress" && (
              <ToolbarRevealKeyField
                label="Reveal key"
                description="Focus this field, then press the key you want to use."
                value={formatToolbarRevealKey(settings.toolbarRevealKey)}
                readOnly
                spellCheck={false}
                onKeyDown={(event) => void captureToolbarRevealKey(event)}
              />
            )}
          </SettingsSection>

          <Divider />

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Background image
            </Heading>

            <SettingsActions>
              <Button asChild variant="primary">
                <label>
                  <UploadIcon aria-hidden />
                  Upload image
                  <SrOnly
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
            </SettingsActions>

            <Field style={{ marginTop: "var(--tile-gap)" }}>
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
          </SettingsSection>

          <Divider />

          <SettingsSection>
            <Heading level={2} data-size="xs">
              Backup and restore
            </Heading>

            <p style={{ marginTop: 0 }}>
              Export creates one backup file containing all settings, tiles,
              background images, and tile icons. Keep this file somewhere safe
              and import it to restore your setup on another computer.
            </p>

            <SettingsActions>
              <Button type="button" onClick={exportSettingsHandler}>
                <FileExportIcon aria-hidden />
                Export full backup
              </Button>

              <Button asChild variant="secondary">
                <label>
                  <FileImportIcon aria-hidden />
                  Import backup
                  <SrOnly
                    type="file"
                    accept="application/json,.json"
                    onChange={(event) => void importSettings(event)}
                  />
                </label>
              </Button>
            </SettingsActions>
          </SettingsSection>
        </SettingsStack>
      </DialogBlock>

      <Toaster position="bottom-left" />
    </Dialog>
  );
}
