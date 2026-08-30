import { useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { TileType } from "~/settings";
import {
  TileActionButton,
  TileActionButtonWrapper,
  TileElement,
  TileIcon,
  TileIconMask,
  TileLink,
} from "./styles";
import { isSvgImageDataUrl } from "~/utils/image";
import { PencilIcon } from "@navikt/aksel-icons";

const TILE_DND_TYPE = "tile";

interface DragTile {
  id: string;
  index: number;
}

interface Props {
  index: number;
  tile: TileType;
  onDragEnd: () => void;
  onDragStart: () => void;
  onEdit: (tile: TileType) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  isEditMode: boolean;
}

export function DraggableTile({
  index,
  tile,
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

  const connectFrame = useCallback(
    (element: HTMLElement | null) => {
      drag(drop(element));
    },
    [drag, drop],
  );

  return (
    <TileElement
      ref={connectFrame}
      $color={tileColor}
      $isDragging={isDragging}
      $isDropTarget={isDropTarget}
      $isEditMode={isEditMode}
      $size={tileSize}
    >
      <TileLink
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
            <TileIconMask
              aria-hidden
              $icon={tileIcon}
              $iconColor={tileIconColor}
              $iconSize={tileIconSize}
            />
          ) : (
            <TileIcon
              src={tileIcon}
              alt=""
              draggable={false}
              $iconSize={tileIconSize}
            />
          ))}
      </TileLink>

      {isEditMode && !isDragging && (
        <TileActionButtonWrapper>
          <TileActionButton
            type="button"
            title="Edit"
            onClick={() => onEdit(tile)}
          >
            <PencilIcon fontSize="2rem" aria-hidden />
          </TileActionButton>
        </TileActionButtonWrapper>
      )}
    </TileElement>
  );
}
