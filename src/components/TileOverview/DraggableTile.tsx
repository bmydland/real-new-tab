import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import * as TileComponent from "./styles";
import type { TileType } from "~/settings";
import { isSvgImageDataUrl } from "~/utils/image";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";

const TILE_DND_TYPE = "tile";

interface DragTile {
  id: string;
  index: number;
}

interface Props {
  index: number;
  tile: TileType;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
  onDragStart: () => void;
  onEdit: (tile: TileType) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  isEditMode: boolean;
}

export function DraggableTile({
  index,
  tile,
  onDelete,
  onDragEnd,
  onDragStart,
  onEdit,
  onMove,
  isEditMode,
}: Props) {
  const {
    color: tileColor,
    id: tileId,
    label: tileLabel,
    size: tileSize,
    url: tileUrl,
    icon: tileIcon,
    iconColor: tileIconColor,
    iconSize: tileIconSize,
  } = tile;

  const frameRef = useRef<HTMLElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: TILE_DND_TYPE,
      canDrag: isEditMode,
      item: () => {
        onDragStart();
        return { id: tileId, index };
      },
      end: onDragEnd,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, isEditMode, onDragEnd, onDragStart, tileId],
  );

  const [{ isDropTarget }, drop] = useDrop<
    DragTile,
    void,
    { isDropTarget: boolean }
  >(
    () => ({
      accept: TILE_DND_TYPE,
      canDrop: () => isEditMode,
      hover: (item) => {
        if (!isEditMode || item.id === tileId || item.index === index) {
          return;
        }

        onMove(item.index, index);
        item.index = index;
      },
      collect: (monitor) => ({
        isDropTarget: monitor.isOver({ shallow: true }),
      }),
    }),
    [index, isEditMode, onMove, tileId],
  );

  drop(frameRef);
  drag(frameRef);

  return (
    <TileComponent.TileElement
      ref={frameRef}
      $color={tileColor}
      $isDragging={isDragging}
      $isDropTarget={isDropTarget}
      $isEditMode={isEditMode}
      $size={tileSize}
    >
      <TileComponent.TileLink
        href={tileUrl}
        title={tileLabel}
        $isEditMode={isEditMode}
        aria-disabled={isEditMode || undefined}
        draggable={false}
        tabIndex={isEditMode ? -1 : undefined}
        onClick={(event) => {
          if (isEditMode) {
            event.preventDefault();
          }
        }}
      >
        {tileIcon &&
          (tileIconColor && isSvgImageDataUrl(tileIcon) ? (
            <TileComponent.TileIconMask
              aria-hidden
              $icon={tileIcon}
              $iconColor={tileIconColor}
              $iconSize={tileIconSize}
              $tileSize={tileSize}
            />
          ) : (
            <TileComponent.TileIcon
              src={tileIcon}
              alt=""
              draggable={false}
              $iconSize={tileIconSize}
              $tileSize={tileSize}
            />
          ))}
      </TileComponent.TileLink>

      {isEditMode && !isDragging && (
        <TileComponent.TileActionButtonWrapper>
          <TileComponent.TileActionButton
            type="button"
            title="Edit"
            onClick={() => onEdit(tile)}
          >
            <PencilIcon fontSize="2rem" aria-hidden />
          </TileComponent.TileActionButton>

          <TileComponent.TileActionButton
            type="button"
            title="Delete"
            onClick={() => onDelete(tileId)}
          >
            <TrashIcon fontSize="2rem" aria-hidden />
          </TileComponent.TileActionButton>
        </TileComponent.TileActionButtonWrapper>
      )}
    </TileComponent.TileElement>
  );
}
