import { Field, Label } from "@digdir/designsystemet-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { RangeInput, RangeLabel } from "./styles";

interface Props
  extends Omit<ComponentPropsWithoutRef<"input">, "id" | "type"> {
  id: string;
  label: ReactNode;
  valueText: ReactNode;
}

export function RangeField({ id, label, valueText, ...inputProps }: Props) {
  return (
    <Field>
      <RangeLabel>
        <Label htmlFor={id}>{label}</Label>
        <span aria-hidden="true">{valueText}</span>
      </RangeLabel>

      <RangeInput {...inputProps} id={id} type="range" />
    </Field>
  );
}
