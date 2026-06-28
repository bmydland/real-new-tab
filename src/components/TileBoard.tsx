import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  EmptyState,
  TileActionButton,
  TileActions,
  TileDragHandle,
  TileFrame,
  TileGrid,
  TileIcon,
  TileInitial,
  TileLabel,
  TileLink,
  TileStage,
} from "../App.styles";
import type { Tile } from "../settings";
import { moveArrayItem } from "../utils/array/moveArrayItem";

const TILE_DND_TYPE = "tile";

type DragTile = {
  id: string;
  index: number;
};

type TileBoardProps = {
  tiles: Tile[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (tile: Tile) => void;
  onReorder: (tiles: Tile[]) => Promise<void>;
};

type DraggableTileProps = {
  index: number;
  tile: Tile;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
  onDragStart: () => void;
  onEdit: (tile: Tile) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

export function TileBoard({ tiles, onAdd, onDelete, onEdit, onReorder }: TileBoardProps) {
  const [orderedTiles, setOrderedTiles] = useState(tiles);
  const orderedTilesRef = useRef(orderedTiles);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    orderedTilesRef.current = orderedTiles;
  }, [orderedTiles]);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setOrderedTiles(tiles);
    }
  }, [tiles]);

  function moveTile(fromIndex: number, toIndex: number) {
    setOrderedTiles((current) => {
      const nextTiles = moveArrayItem(current, fromIndex, toIndex);

      orderedTilesRef.current = nextTiles;
      return nextTiles;
    });
  }

  function startDrag() {
    isDraggingRef.current = true;
  }

  async function endDrag() {
    isDraggingRef.current = false;

    const nextTiles = orderedTilesRef.current;

    if (!hasTileOrderChanged(tiles, nextTiles)) {
      return;
    }

    try {
      await onReorder(nextTiles);
    } catch {
      setOrderedTiles(tiles);
    }
  }

  return (
    <TileStage aria-label="Saved links">
      {orderedTiles.length === 0 ? (
        <EmptyState type="button" onClick={onAdd}>
          Add your first tile
        </EmptyState>
      ) : (
        <TileGrid>
          {orderedTiles.map((tile, index) => (
            <DraggableTile
              key={tile.id}
              index={index}
              tile={tile}
              onDelete={onDelete}
              onDragEnd={() => void endDrag()}
              onDragStart={startDrag}
              onEdit={onEdit}
              onMove={moveTile}
            />
          ))}
        </TileGrid>
      )}
    </TileStage>
  );
}

function DraggableTile({
  index,
  tile,
  onDelete,
  onDragEnd,
  onDragStart,
  onEdit,
  onMove,
}: DraggableTileProps) {
  const frameRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: TILE_DND_TYPE,
      item: () => {
        onDragStart();
        return { id: tile.id, index };
      },
      end: onDragEnd,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, onDragEnd, onDragStart, tile.id],
  );
  const [{ isDropTarget }, drop] = useDrop<DragTile, void, { isDropTarget: boolean }>(
    () => ({
      accept: TILE_DND_TYPE,
      hover: (item) => {
        if (item.id === tile.id || item.index === index) {
          return;
        }

        onMove(item.index, index);
        item.index = index;
      },
      collect: (monitor) => ({
        isDropTarget: monitor.isOver({ shallow: true }),
      }),
    }),
    [index, onMove, tile.id],
  );

  drag(handleRef);
  drop(frameRef);

  return (
    <TileFrame ref={frameRef} $color={tile.color} $isDragging={isDragging} $isDropTarget={isDropTarget} $size={tile.size}>
      <TileLink href={tile.url} title={tile.label}>
        {tile.icon ? (
          <TileIcon src={tile.icon} alt="" draggable={false} />
        ) : (
          <TileInitial aria-hidden="true">{tile.label.slice(0, 1).toUpperCase()}</TileInitial>
        )}
        <TileLabel>{tile.label}</TileLabel>
      </TileLink>

      <TileDragHandle ref={handleRef} type="button" aria-label={`Drag ${tile.label}`} title="Drag tile" />

      <TileActions>
        <TileActionButton type="button" onClick={() => onEdit(tile)}>
          Edit
        </TileActionButton>
        <TileActionButton type="button" onClick={() => onDelete(tile.id)}>
          Delete
        </TileActionButton>
      </TileActions>
    </TileFrame>
  );
}

function hasTileOrderChanged(previousTiles: Tile[], nextTiles: Tile[]) {
  return previousTiles.length !== nextTiles.length || previousTiles.some((tile, index) => tile.id !== nextTiles[index]?.id);
}
