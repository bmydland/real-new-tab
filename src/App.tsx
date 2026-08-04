import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "react-hot-toast";
import {
  PageSpinner,
  SettingsDialog,
  TileOverview,
  TileModal,
} from "~/components";
import { useStoredSettings, useToggle } from "~/hooks";
import type { TileType } from "~/settings";
import { createTileId } from "~/settings/createTileId";
import type { TileFormValue } from "~/types";
import { StyledMain } from "./styles";
import "./font/roboto.css";
import { Toolbar } from "./components/Toolbar";

type TileDialogState =
  | { type: "add" }
  | { type: "edit"; tile: TileType }
  | null;

export default function App() {
  const { isLoading, persistSettings, settings, showToast } =
    useStoredSettings();

  const [dialogState, setDialogState] = useState<TileDialogState>(null);

  const {
    isOpen: isEditMode,
    onClose: closeEditMode,
    onToggle: toggleEditMode,
  } = useToggle();

  const {
    isOpen: isSettingsOpen,
    onOpen: onOpenSettings,
    onClose: setSettingsClosed,
  } = useToggle();

  async function saveTile(form: TileFormValue) {
    const existingTile =
      dialogState?.type === "edit" ? dialogState.tile : undefined;

    const now = new Date().toISOString();

    const nextTile: TileType = {
      id: existingTile?.id ?? createTileId(),
      url: form.url,
      label: form.label,
      color: form.color,
      size: form.size,
      icon: form.icon,
      iconColor: form.iconColor,
      iconSize: form.iconSize,
      createdAt: existingTile?.createdAt ?? now,
      updatedAt: now,
    };

    const tiles = existingTile
      ? settings.tiles.map((tile) =>
          tile.id === existingTile.id ? nextTile : tile,
        )
      : [...settings.tiles, nextTile];

    await persistSettings(
      { ...settings, tiles },
      existingTile ? "Tile updated" : "Tile added",
    );
  }

  async function deleteTile(id: string) {
    const tile = settings.tiles.find((item) => item.id === id);

    if (!tile || !window.confirm(`Delete "${tile.label}"?`)) {
      return;
    }

    await persistSettings(
      {
        ...settings,
        tiles: settings.tiles.filter((item) => item.id !== id),
      },
      "Tile deleted",
    );

    setDialogState(null);
    closeEditMode();
  }

  async function reorderTiles(tiles: TileType[]) {
    try {
      await persistSettings({ ...settings, tiles });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Could not save tile order",
        "error",
      );
      throw error;
    }
  }

  function closeEditModeHandler() {
    if (isEditMode) {
      closeEditMode();
    }
  }

  return (
    <>
      {isLoading && <PageSpinner />}

      {!isLoading && (
        <StyledMain
          $backgroundColor={settings.backgroundColor}
          $backgroundImage={settings.backgroundImage}
          $backgroundPosition={settings.backgroundPosition}
        >
          <Toolbar
            isEditMode={isEditMode}
            toggleEditMode={toggleEditMode}
            onAddTile={() => setDialogState({ type: "add" })}
            onOpenSettings={onOpenSettings}
          />

          <DndProvider backend={HTML5Backend}>
            <TileOverview
              tiles={settings.tiles}
              rowCount={settings.gridRows}
              onAdd={() => setDialogState({ type: "add" })}
              onEdit={(tile) => setDialogState({ type: "edit", tile })}
              onReorder={reorderTiles}
              isEditMode={isEditMode}
            />
          </DndProvider>

          <TileModal
            tile={dialogState?.type === "edit" ? dialogState.tile : undefined}
            isTileModalOpen={dialogState !== null}
            onClose={() => setDialogState(null)}
            onDelete={(id) => deleteTile(id)}
            onSave={saveTile}
            closeEditModeHandler={closeEditModeHandler}
          />

          <SettingsDialog
            isSettingsOpen={isSettingsOpen}
            settings={settings}
            onClose={setSettingsClosed}
            onPersist={persistSettings}
            onStatus={showToast}
            closeEditModeHandler={closeEditModeHandler}
          />
        </StyledMain>
      )}

      <Toaster position="bottom-left" />
    </>
  );
}
