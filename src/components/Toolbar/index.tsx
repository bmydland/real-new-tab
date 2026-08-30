import {
  ToolbarWithRevealState,
  type ToolbarProps,
} from "./ToolbarWithRevealState";

export function Toolbar({
  isEditMode,
  revealKey,
  revealMode,
  toggleEditMode,
  onAddTile,
  onOpenSettings,
}: ToolbarProps) {
  const revealConfiguration = `${revealMode}:${revealKey}`;

  return (
    <ToolbarWithRevealState
      key={revealConfiguration}
      isEditMode={isEditMode}
      revealKey={revealKey}
      revealMode={revealMode}
      toggleEditMode={toggleEditMode}
      onAddTile={onAddTile}
      onOpenSettings={onOpenSettings}
    />
  );
}
