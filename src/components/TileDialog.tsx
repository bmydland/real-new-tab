import {
  Button,
  DialogBlock,
  Fieldset,
  Heading,
  Radio,
  Textfield,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { useEffect, useState, type ChangeEvent, type ComponentPropsWithoutRef } from "react";
import { readFileAsDataUrl } from "../utils/file/readFileAsDataUrl";
import { isValidUrl, normalizeUrl } from "../utils/url";
import type { Tile, TileSize } from "../settings";
import {
  DialogActions,
  DialogHeader,
  FieldGrid,
  FileActions,
  FormStack,
  HiddenFileInput,
  IconPreview,
  RadioGrid,
  StyledDialog,
} from "./TileDialog.styles";

type FormSubmitEvent = Parameters<NonNullable<ComponentPropsWithoutRef<"form">["onSubmit"]>>[0];

export type TileFormValue = {
  url: string;
  label: string;
  color: string;
  size: TileSize;
  icon?: string;
};

type TileDialogProps = {
  open: boolean;
  tile?: Tile;
  onClose: () => void;
  onSave: (form: TileFormValue) => Promise<void>;
};

const EMPTY_TILE_FORM: TileFormValue = {
  url: "",
  label: "",
  color: "#008a8a",
  size: "normal",
};

const TILE_SIZE_OPTIONS: Array<{ value: TileSize; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "large", label: "Large" },
];

export function TileDialog({ open, tile, onClose, onSave }: TileDialogProps) {
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
    <StyledDialog
      open={open}
      closedby="any"
      closeButton="Close dialog"
      onClose={onClose}
    >
      <DialogBlock>
        <DialogHeader>
          <Heading level={1} data-size="sm">
            {tile ? "Edit tile" : "Add tile"}
          </Heading>
        </DialogHeader>
      </DialogBlock>

      <DialogBlock>
        <FormStack id="tile-form" onSubmit={(event) => handleSubmit(event)}>
          <Textfield
            autoFocus
            label="Link"
            placeholder="https://example.com"
            value={form.url}
            onChange={(event) =>
              setForm((current) => ({ ...current, url: event.target.value }))
            }
          />

          <FieldGrid>
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
          </FieldGrid>

          <Fieldset>
            <Fieldset.Legend>Size</Fieldset.Legend>
            <RadioGrid>
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
            </RadioGrid>
          </Fieldset>

          <FileActions>
            <Button asChild variant="secondary">
              <label>
                Choose icon
                <HiddenFileInput
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleIconChange(event)}
                />
              </label>
            </Button>

            {form.icon ? <IconPreview src={form.icon} alt="" /> : null}

            {form.icon ? (
              <Button
                type="button"
                variant="tertiary"
                onClick={() =>
                  setForm((current) => ({ ...current, icon: undefined }))
                }
              >
                Remove icon
              </Button>
            ) : null}
          </FileActions>

          {formError ? (
            <ValidationMessage>{formError}</ValidationMessage>
          ) : null}
        </FormStack>
      </DialogBlock>

      <DialogBlock>
        <DialogActions>
          <Button type="submit" form="tile-form" loading={isSaving}>
            {tile ? "Save tile" : "Create tile"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </DialogBlock>
    </StyledDialog>
  );
}
