import { PencilIcon, PlusCircleIcon, WrenchIcon } from "@navikt/aksel-icons";
import { StyledHeader, ToolbarButton } from "./styles";

interface Props {
  $isEditMode: boolean;
  toggleEditMode: () => void;
  onAddTile: () => void;
  onOpenSettings: () => void;
}

export function Toolbar({
  $isEditMode,
  toggleEditMode,
  onAddTile,
  onOpenSettings,
}: Props) {
  return (
    <StyledHeader $isEditMode={$isEditMode} aria-label="New tab actions">
      <ToolbarButton type="button" onClick={toggleEditMode}>
        <PencilIcon aria-hidden />
        Edit mode
      </ToolbarButton>

      <ToolbarButton type="button" onClick={onAddTile}>
        <PlusCircleIcon aria-hidden />
        Add tile
      </ToolbarButton>

      <ToolbarButton type="button" onClick={onOpenSettings}>
        <WrenchIcon />
        Settings
      </ToolbarButton>
    </StyledHeader>
  );
}
