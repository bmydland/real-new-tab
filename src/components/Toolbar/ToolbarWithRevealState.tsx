import {
  BucketMopIcon,
  CogIcon,
  PencilIcon,
  PlusCircleIcon,
} from "@navikt/aksel-icons";
import { useEffect, useState } from "react";
import { normalizeToolbarRevealKey, type ToolbarRevealMode } from "~/settings";
import { StyledHeader, ToolbarButton } from "./styles";
import { isInteractiveTarget } from "./utils";

export interface ToolbarProps {
  isEditMode: boolean;
  revealKey: string;
  revealMode: ToolbarRevealMode;
  toggleEditMode: () => void;
  onAddTile: () => void;
  onOpenSettings: () => void;
}

export function ToolbarWithRevealState({
  isEditMode,
  revealKey,
  revealMode,
  toggleEditMode,
  onAddTile,
  onOpenSettings,
}: ToolbarProps) {
  const [isKeypressRevealed, setIsKeypressRevealed] = useState(false);

  useEffect(() => {
    if (revealMode !== "keypress") {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.defaultPrevented ||
        event.isComposing ||
        event.metaKey ||
        event.repeat ||
        isInteractiveTarget(event.target) ||
        normalizeToolbarRevealKey(event.key) !== revealKey
      ) {
        return;
      }

      event.preventDefault();
      setIsKeypressRevealed((current) => !current);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealKey, revealMode]);

  const isVisible = isEditMode || isKeypressRevealed;
  const isHiddenKeypressToolbar = revealMode === "keypress" && !isVisible;

  return (
    <StyledHeader
      $isVisible={isVisible}
      $revealMode={revealMode}
      aria-hidden={isHiddenKeypressToolbar}
      inert={isHiddenKeypressToolbar}
    >
      <ToolbarButton
        variant="primary"
        $preserveVariant
        type="button"
        onClick={onAddTile}
      >
        <PlusCircleIcon aria-hidden />
        Add tile
      </ToolbarButton>

      <ToolbarButton
        type="button"
        onClick={toggleEditMode}
        $isEditMode={isEditMode}
      >
        {isEditMode ? (
          <>
            <BucketMopIcon aria-hidden />
            Exit edit mode
          </>
        ) : (
          <>
            <PencilIcon aria-hidden />
            Edit mode
          </>
        )}
      </ToolbarButton>

      <ToolbarButton type="button" onClick={onOpenSettings}>
        <CogIcon aria-hidden />
        Settings
      </ToolbarButton>
    </StyledHeader>
  );
}
