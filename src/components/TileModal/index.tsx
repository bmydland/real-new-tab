import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogBlock,
  Divider,
  Field,
  Fieldset,
  Heading,
  Label,
  Radio,
  Textfield,
} from "@digdir/designsystemet-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
} from "react";
import type { TileType, TileSize } from "~/settings";
import type { TileFormValue } from "~/types";
import { getReadableTileTextColor } from "~/utils/color";
import { readFileAsDataUrl } from "~/utils/file/readFileAsDataUrl";
import { getDominantImageEdgeColor, isSvgImageDataUrl } from "~/utils/image";
import { showToast } from "~/utils/toast";
import { isValidUrl, normalizeUrl } from "~/utils/url";
import * as Styles from "~/components/TileOverview/styles";
import { TILE_ICON_SIZE_RANGE } from "~/settings/constants";
import { ModalHeader, StickyFooter } from "~/components/Modal";
import { PaletteIcon } from "@navikt/aksel-icons";

type FormSubmitEvent = Parameters<
  NonNullable<ComponentPropsWithoutRef<"form">["onSubmit"]>
>[0];

type TileDialogProps = {
  open: boolean;
  tile?: TileType;
  onClose: () => void;
  onSave: (form: TileFormValue) => Promise<void>;
};

const EMPTY_TILE_FORM: TileFormValue = {
  url: "",
  label: "",
  color: "#000000",
  size: "normal",
  iconSize: TILE_ICON_SIZE_RANGE.default,
};

const TILE_SIZE_OPTIONS: Array<{ value: TileSize; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "large", label: "Large" },
];

export function TileModal({ open, tile, onClose, onSave }: TileDialogProps) {
  const [form, setForm] = useState<TileFormValue>(EMPTY_TILE_FORM);
  const [formError, setFormError] = useState("");

  const [isMatchingIconColor, setIsMatchingIconColor] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
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
  }, [open, tile]);

  if (!open) {
    return null;
  }

  const isSvgIcon = isSvgImageDataUrl(form.icon);

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

  async function handleSubmit(event: FormSubmitEvent) {
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
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save tile.",
      );
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      placement="right"
      closedby="any"
      closeButton={false}
      modal={false}
      onClose={onClose}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        zIndex: 9999,
      }}
    >
      <DialogBlock>
        <ModalHeader
          title={tile ? "Edit tile" : "Add tile"}
          onClick={onClose}
        />

        <form id="tile-form" onSubmit={(e) => handleSubmit(e)}>
          <Styles.VerticalStack>
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

            <Styles.VerticalStack>
              <Fieldset>
                <Fieldset.Legend>Icon</Fieldset.Legend>

                <Styles.FileActions>
                  <Button asChild variant="secondary">
                    <label>
                      Choose icon
                      <Styles.HiddenFileInput
                        type="file"
                        accept="image/*"
                        onChange={(event) => void handleIconChange(event)}
                      />
                    </label>
                  </Button>

                  {form.icon &&
                    (isSvgIcon && form.iconColor ? (
                      <Styles.IconPreviewFrame aria-hidden>
                        <Styles.MaskedIconPreview
                          $icon={form.icon}
                          $iconColor={form.iconColor}
                        />
                      </Styles.IconPreviewFrame>
                    ) : (
                      <Styles.IconPreview src={form.icon} alt="" />
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
                </Styles.FileActions>

                {isSvgIcon && (
                  <Styles.IconColorControls>
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
                  </Styles.IconColorControls>
                )}
              </Fieldset>

              <Field>
                <Styles.RangeLabel>
                  <Label htmlFor="tile-icon-size">Icon size</Label>
                  <span aria-hidden="true">{form.iconSize}%</span>
                </Styles.RangeLabel>

                <Styles.RangeInput
                  id="tile-icon-size"
                  type="range"
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
              </Field>

              <Divider />

              <Fieldset>
                <Fieldset.Legend>Tile size</Fieldset.Legend>

                <Styles.RadioGrid>
                  {TILE_SIZE_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      label={option.label}
                      name="tile-size"
                      value={option.value}
                      checked={form.size === option.value}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          size: option.value,
                        }))
                      }
                      variant="outline"
                    />
                  ))}
                </Styles.RadioGrid>
              </Fieldset>

              <Divider />

              <Styles.HorizontalStack>
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
              </Styles.HorizontalStack>
            </Styles.VerticalStack>

            {formError && (
              <Alert data-color="danger" role="alert">
                {formError}
              </Alert>
            )}
          </Styles.VerticalStack>
        </form>
      </DialogBlock>

      <StickyFooter>
        <Styles.DialogActions>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" form="tile-form" loading={isSaving}>
            {tile ? "Save tile" : "Create tile"}
          </Button>
        </Styles.DialogActions>
      </StickyFooter>
    </Dialog>
  );
}
