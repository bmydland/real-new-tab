import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import * as TileComponent from "./styles";
import type { TileType } from "~/settings";
import { isSvgImageDataUrl } from "~/utils/image";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";

const TILE_DND_TYPE = "tile";

type DragTile = {
  id: string;
  index: number;
};

type Props = {
  index: number;
  tile: TileType;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
  onDragStart: () => void;
  onEdit: (tile: TileType) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

export function DraggableTile({
  index,
  tile,
  onDelete,
  onDragEnd,
  onDragStart,
  onEdit,
  onMove,
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
  const handleRef = useRef<HTMLButtonElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: TILE_DND_TYPE,
      item: () => {
        onDragStart();
        return { id: tileId, index };
      },
      end: onDragEnd,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, onDragEnd, onDragStart, tileId],
  );

  const [{ isDropTarget }, drop] = useDrop<
    DragTile,
    void,
    { isDropTarget: boolean }
  >(
    () => ({
      accept: TILE_DND_TYPE,
      hover: (item) => {
        if (item.id === tileId || item.index === index) {
          return;
        }

        onMove(item.index, index);
        item.index = index;
      },
      collect: (monitor) => ({
        isDropTarget: monitor.isOver({ shallow: true }),
      }),
    }),
    [index, onMove, tileId],
  );

  drag(handleRef);
  drop(frameRef);

  return (
    <TileComponent.TileElement
      ref={frameRef}
      $color={tileColor}
      $isDragging={isDragging}
      $isDropTarget={isDropTarget}
      $size={tileSize}
    >
      <TileComponent.TileLink href={tileUrl} title={tileLabel}>
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

      <TileComponent.TileDragHandle
        ref={handleRef}
        type="button"
        aria-label={`Drag ${tileLabel}`}
        title="Drag tile"
      />

      <TileComponent.TileActions>
        <TileComponent.TileActionButton
          type="button"
          title="Edit"
          onClick={() => onEdit(tile)}
        >
          <PencilIcon aria-hidden />
        </TileComponent.TileActionButton>

        <TileComponent.TileActionButton
          type="button"
          title="Delete"
          onClick={() => onDelete(tileId)}
        >
          <TrashIcon aria-hidden />
        </TileComponent.TileActionButton>
      </TileComponent.TileActions>
    </TileComponent.TileElement>
  );
}
