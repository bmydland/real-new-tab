import {
  BucketMopIcon,
  CogIcon,
  PencilIcon,
  PlusCircleIcon,
} from "@navikt/aksel-icons";
import { StyledHeader, ToolbarButton } from "./styles";

interface Props {
  isEditMode: boolean;
  toggleEditMode: () => void;
  onAddTile: () => void;
  onOpenSettings: () => void;
}

export function Toolbar({
  isEditMode,
  toggleEditMode,
  onAddTile,
  onOpenSettings,
}: Props) {
  return (
    <StyledHeader $isEditMode={isEditMode}>
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
