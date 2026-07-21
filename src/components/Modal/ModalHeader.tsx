import { Button, Heading } from "@digdir/designsystemet-react";
import { XMarkIcon } from "@navikt/aksel-icons";
import type { ReactNode } from "react";

interface Props {
  title: string | ReactNode;
  onClick?: () => void;
}

// This function is made for nesting Close button and Title in same div
// so close button don't break the layout when dealing with sticky footers
// TODO: Remove this when hopefully Digdir supports this in the future
export function ModalHeader({ title, onClick }: Props) {
  return (
    <div>
      <Button
        type="button"
        icon
        variant="tertiary"
        data-color="neutral"
        aria-label="Close dialog"
        onClick={onClick}
        style={{ float: "inline-end" }}
      >
        <XMarkIcon aria-hidden />
      </Button>

      <Heading level={1} data-size="sm" style={{ marginBottom: 40 }}>
        {title}
      </Heading>
    </div>
  );
}
