import { useEffect, useRef, useState } from "react";
import type { TileType } from "~/settings";
import { moveArrayItem } from "~/utils/array/moveArrayItem";
import { EmptyState, TileGrid, TileStage } from "./styles";
import { DraggableTile } from "~/components/TileOverview/DraggableTile";
import { hasTileOrderChanged } from "~/components/TileOverview/hasTileOrderChanged";

type TileOverviewProps = {
  tiles: TileType[];
  rowCount: number;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (tile: TileType) => void;
  onReorder: (tiles: TileType[]) => Promise<void>;
};

export function TileOverview({
  tiles,
  rowCount,
  onAdd,
  onDelete,
  onEdit,
  onReorder,
}: TileOverviewProps) {
  const [orderedTiles, setOrderedTiles] = useState(tiles);
  const orderedTilesRef = useRef(orderedTiles);
  const isDraggingRef = useRef(false);

  const visibleRowCount = Math.min(
    rowCount,
    Math.max(
      orderedTiles.length,
      orderedTiles.some(({ size }) => size === "large") ? 2 : 1,
    ),
  );

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
        <TileGrid $rowCount={visibleRowCount}>
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
