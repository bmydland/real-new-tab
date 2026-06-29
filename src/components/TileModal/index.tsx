import {
  Button,
  Dialog,
  DialogBlock,
  Fieldset,
  Heading,
  Radio,
  Textfield,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
} from "react";
import type { TileType, TileSize } from "~/settings";
import type { TileFormValue } from "~/types";
import { readFileAsDataUrl } from "~/utils/file/readFileAsDataUrl";
import { isValidUrl, normalizeUrl } from "~/utils/url";
import * as Styles from "~/components/TileBoard/styles";

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
};

const TILE_SIZE_OPTIONS: Array<{ value: TileSize; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "large", label: "Large" },
];

export function TileModal({ open, tile, onClose, onSave }: TileDialogProps) {
  const [form, setForm] = useState<TileFormValue>(EMPTY_TILE_FORM);
  const [formError, setFormError] = useState("");
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
          }
        : EMPTY_TILE_FORM,
    );
    setFormError("");
  }, [open, tile]);

  if (!open) {
    return null;
  }

  async function handleIconChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const icon = await readFileAsDataUrl(file);
    setForm((current) => ({ ...current, icon }));
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
      closedby="any"
      closeButton="Close dialog"
      onClose={onClose}
    >
      <DialogBlock>
        <Styles.DialogHeader>
          <Heading level={1} data-size="sm">
            {tile ? "Edit tile" : "Add tile"}
          </Heading>
        </Styles.DialogHeader>
      </DialogBlock>

      <DialogBlock>
        <Styles.FormStack id="tile-form" onSubmit={(e) => handleSubmit(e)}>
          <Textfield
            autoFocus
            label="Link"
            placeholder="https://example.com"
            value={form.url}
            onChange={(e) =>
              setForm((current) => ({ ...current, url: e.target.value }))
            }
          />

          <Styles.FieldGrid>
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

            <Textfield
              label="Color"
              type="color"
              value={form.color}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  color: event.target.value,
                }))
              }
            />
          </Styles.FieldGrid>

          <Fieldset>
            <Fieldset.Legend>Size</Fieldset.Legend>
            <Styles.RadioGrid>
              {TILE_SIZE_OPTIONS.map((option) => (
                <Radio
                  key={option.value}
                  label={option.label}
                  name="tile-size"
                  value={option.value}
                  checked={form.size === option.value}
                  onChange={() =>
                    setForm((current) => ({ ...current, size: option.value }))
                  }
                  variant="outline"
                />
              ))}
            </Styles.RadioGrid>
          </Fieldset>

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

            {form.icon && <Styles.IconPreview src={form.icon} alt="" />}

            {form.icon && (
              <Button
                type="button"
                variant="tertiary"
                onClick={() =>
                  setForm((current) => ({ ...current, icon: undefined }))
                }
              >
                Remove icon
              </Button>
            )}
          </Styles.FileActions>

          {formError && <ValidationMessage>{formError}</ValidationMessage>}
        </Styles.FormStack>
      </DialogBlock>

      <DialogBlock>
        <Styles.DialogActions>
          <Button type="submit" form="tile-form" loading={isSaving}>
            {tile ? "Save tile" : "Create tile"}
          </Button>

          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Styles.DialogActions>
      </DialogBlock>
    </Dialog>
  );
}
