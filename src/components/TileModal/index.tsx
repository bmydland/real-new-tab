import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogBlock,
  Divider,
  Fieldset,
  Heading,
  Radio,
  Textfield,
} from "@digdir/designsystemet-react";
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import type { TileType } from "~/settings";
import type { TileFormValue } from "~/types";
import { getReadableTileTextColor } from "~/utils/color";
import { readFileAsDataUrl } from "~/utils/file/readFileAsDataUrl";
import { getDominantImageEdgeColor, isSvgImageDataUrl } from "~/utils/image";
import { showToast } from "~/utils/toast";
import { isValidUrl, normalizeUrl } from "~/utils/url";
import { TILE_ICON_SIZE_RANGE } from "~/settings/constants";
import { ModalHeader, StickyFooter } from "~/components/Modal";
import { RangeField } from "~/components/RangeField";
import { SrOnly } from "~/components/SrOnly";
import {
  FloppydiskIcon,
  PaletteIcon,
  TrashIcon,
  XMarkIcon,
} from "@navikt/aksel-icons";
import { EMPTY_TILE_FORM, TILE_SIZE_OPTIONS } from "./settings";
import {
  DialogActions,
  FileActions,
  HorizontalStack,
  IconColorControls,
  IconPreview,
  IconPreviewFrame,
  MaskedIconPreview,
  RadioGrid,
  VerticalStack,
} from "./styles";

interface Props {
  tile?: TileType;
  isTileModalOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (form: TileFormValue) => Promise<void>;
  closeEditModeHandler: () => void;
}

export function TileModal({
  tile,
  isTileModalOpen,
  onClose,
  onDelete,
  onSave,
  closeEditModeHandler,
}: Props) {
  const [form, setForm] = useState<TileFormValue>(EMPTY_TILE_FORM);
  const [formError, setFormError] = useState("");
  const [isMatchingIconColor, setIsMatchingIconColor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Prefill edit modal with existing data
  useEffect(() => {
    if (!isTileModalOpen) {
      return;
    }

    setForm(
      tile
        ? {
            url: tile.url,
            label: tile.label,
            color: tile.color,
            size: tile.size,
            icon: tile.icon,
            iconColor: isSvgImageDataUrl(tile.icon)
              ? tile.iconColor
              : undefined,
            iconSize: tile.iconSize,
          }
        : EMPTY_TILE_FORM,
    );
    setFormError("");
    setIsMatchingIconColor(false);
  }, [isTileModalOpen, tile]);

  if (!isTileModalOpen) {
    return null;
  }

  const isSvgIcon = isSvgImageDataUrl(form.icon);

  function closeHandler() {
    setForm(EMPTY_TILE_FORM);
    closeEditModeHandler();
    onClose();
  }

  async function handleIconChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const icon = await readFileAsDataUrl(file);
    setForm((current) => ({
      ...current,
      icon,
      iconColor: isSvgImageDataUrl(icon) ? current.iconColor : undefined,
    }));
  }

  async function handleMatchIconColor() {
    const icon = form.icon;

    if (!icon) {
      return;
    }

    setIsMatchingIconColor(true);

    try {
      const color = await getDominantImageEdgeColor(icon);

      if (!color) {
        showToast(
          "Could not find one consistent opaque color around the icon edge.",
          "error",
        );
        return;
      }

      setForm((current) =>
        current.icon === icon ? { ...current, color } : current,
      );
      showToast(`Matched tile color to ${color}.`, "success");
    } catch {
      showToast("Could not read the icon background color.", "error");
    } finally {
      setIsMatchingIconColor(false);
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const url = normalizeUrl(form.url);
    const label = form.label.trim();

    if (!url || !label) {
      setFormError("Link and label are required.");
      return;
    }

    if (!isValidUrl(url)) {
      setFormError("Use a valid link, for example https://example.com.");
      return;
    }

    setIsSaving(true);

    try {
      await onSave({ ...form, url, label });
      setIsSaving(false);
      closeHandler();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save tile.",
      );
      setIsSaving(false);
    }
  }

  const isEditing = tile;

  return (
    <Dialog
      open={isTileModalOpen}
      placement="right"
      closedby="any"
      closeButton={false}
      modal={false}
      onClose={closeHandler}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        zIndex: 9999,
      }}
    >
      <DialogBlock>
        <ModalHeader
          title={isEditing ? "Edit tile" : "Add tile"}
          onClose={closeHandler}
        />

        <form id="tile-form" onSubmit={(e) => handleSubmit(e)}>
          <VerticalStack>
            <Textfield
              autoFocus
              label="Link"
              placeholder="https://example.no"
              value={form.url}
              onChange={(e) =>
                setForm((current) => ({ ...current, url: e.target.value }))
              }
            />

            <Textfield
              label="Label"
              placeholder="Example"
              value={form.label}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
            />

            <Divider />

            <Heading level={2} data-size="sm">
              Tile configuration
            </Heading>

            <VerticalStack>
              <Fieldset>
                <Fieldset.Legend>Icon</Fieldset.Legend>

                <FileActions>
                  <Button asChild variant="secondary">
                    <label>
                      Choose icon
                      <SrOnly
                        type="file"
                        accept="image/*"
                        onChange={(event) => void handleIconChange(event)}
                      />
                    </label>
                  </Button>

                  {form.icon &&
                    (isSvgIcon && form.iconColor ? (
                      <IconPreviewFrame aria-hidden>
                        <MaskedIconPreview
                          $icon={form.icon}
                          $iconColor={form.iconColor}
                        />
                      </IconPreviewFrame>
                    ) : (
                      <IconPreview src={form.icon} alt="" />
                    ))}

                  {form.icon && (
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          icon: undefined,
                          iconColor: undefined,
                        }))
                      }
                    >
                      Remove icon
                    </Button>
                  )}
                </FileActions>

                {isSvgIcon && (
                  <IconColorControls>
                    <Checkbox
                      label="Apply custom color"
                      checked={form.iconColor !== undefined}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;

                        setForm((current) => ({
                          ...current,
                          iconColor: checked
                            ? getReadableTileTextColor(current.color)
                            : undefined,
                        }));
                      }}
                    />

                    <Textfield
                      label="Icon color"
                      type="color"
                      value={
                        form.iconColor ?? getReadableTileTextColor(form.color)
                      }
                      disabled={form.iconColor === undefined}
                      onChange={(event) => {
                        const iconColor = event.currentTarget.value;

                        setForm((current) => ({ ...current, iconColor }));
                      }}
                    />
                  </IconColorControls>
                )}
              </Fieldset>

              <RangeField
                id="tile-icon-size"
                label="Icon size"
                valueText={`${form.iconSize}%`}
                min={TILE_ICON_SIZE_RANGE.min}
                max={TILE_ICON_SIZE_RANGE.max}
                step={TILE_ICON_SIZE_RANGE.step}
                value={form.iconSize}
                aria-valuetext={`${form.iconSize}%`}
                onChange={(event) => {
                  const iconSize = event.currentTarget.valueAsNumber;

                  setForm((current) => ({
                    ...current,
                    iconSize,
                  }));
                }}
              />

              <Divider />

              <Fieldset>
                <Fieldset.Legend>Tile size</Fieldset.Legend>

                <RadioGrid>
                  {TILE_SIZE_OPTIONS.map((x) => (
                    <Radio
                      key={x.value}
                      label={x.label}
                      name="tile-size"
                      value={x.value}
                      checked={form.size === x.value}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          size: x.value,
                        }))
                      }
                      variant="outline"
                    />
                  ))}
                </RadioGrid>
              </Fieldset>

              <Divider />

              <HorizontalStack>
                <Textfield
                  label="Tile color"
                  type="color"
                  value={form.color}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      color: event.target.value,
                    }))
                  }
                />

                {form.icon && (
                  <Button
                    type="button"
                    variant="secondary"
                    loading={isMatchingIconColor}
                    onClick={() => void handleMatchIconColor()}
                  >
                    <PaletteIcon aria-hidden />
                    Match Tile color
                  </Button>
                )}
              </HorizontalStack>
            </VerticalStack>

            {formError && (
              <Alert data-color="danger" role="alert">
                {formError}
              </Alert>
            )}
          </VerticalStack>
        </form>
      </DialogBlock>

      <StickyFooter>
        <DialogActions>
          {isEditing && (
            <Button
              variant="primary"
              data-color="danger"
              onClick={() => void onDelete(tile.id)}
              style={{ marginRight: "auto" }}
            >
              <TrashIcon aria-hidden />
              Delete tile
            </Button>
          )}

          <Button type="button" variant="secondary" onClick={closeHandler}>
            <XMarkIcon aria-hidden />
            Close
          </Button>

          <Button type="submit" form="tile-form" loading={isSaving}>
            <FloppydiskIcon aria-hidden />
            {isEditing ? "Save tile" : "Create tile"}
          </Button>
        </DialogActions>
      </StickyFooter>
    </Dialog>
  );
}
