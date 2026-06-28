import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "react-hot-toast";
import { NewTabShell, Toolbar, ToolbarButton } from "./App.styles";
import { SettingsDialog } from "./components/SettingsDialog";
import { PageSpinner } from "./components/Spinner";
import { TileBoard } from "./components/TileBoard";
import { TileDialog, type TileFormValue } from "./components/TileDialog";
import { useStoredSettings } from "./hooks/useStoredSettings";
import type { Tile } from "./settings";
import { createTileId } from "./settings/createTileId";
import { AppTheme } from "./theme/AppTheme";

type TileDialogState = { type: "add" } | { type: "edit"; tile: Tile } | null;

export default function App() {
  const { isLoading, persistSettings, settings, showToast } = useStoredSettings();
  const [dialogState, setDialogState] = useState<TileDialogState>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  async function saveTile(form: TileFormValue) {
    const existingTile = dialogState?.type === "edit" ? dialogState.tile : undefined;
    const now = new Date().toISOString();
    const nextTile: Tile = {
      id: existingTile?.id ?? createTileId(),
      url: form.url,
      label: form.label,
      color: form.color,
      size: form.size,
      icon: form.icon,
      createdAt: existingTile?.createdAt ?? now,
      updatedAt: now,
    };
    const tiles = existingTile
      ? settings.tiles.map((tile) => (tile.id === existingTile.id ? nextTile : tile))
      : [...settings.tiles, nextTile];

    await persistSettings({ ...settings, tiles }, existingTile ? "Tile updated." : "Tile added.");
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
      "Tile deleted.",
    );
  }

  async function reorderTiles(tiles: Tile[]) {
    try {
      await persistSettings({ ...settings, tiles });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save tile order.", "error");
      throw error;
    }
  }

  return (
    <AppTheme>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <NewTabShell $backgroundColor={settings.backgroundColor} $backgroundImage={settings.backgroundImage}>
          <Toolbar aria-label="New tab actions">
            <ToolbarButton type="button" onClick={() => setDialogState({ type: "add" })} title="Add tile">
              +
            </ToolbarButton>
            <ToolbarButton type="button" $isText onClick={() => setSettingsOpen(true)} title="Settings">
              Settings
            </ToolbarButton>
          </Toolbar>

          <DndProvider backend={HTML5Backend}>
            <TileBoard
              tiles={settings.tiles}
              onAdd={() => setDialogState({ type: "add" })}
              onDelete={(id) => void deleteTile(id)}
              onEdit={(tile) => setDialogState({ type: "edit", tile })}
              onReorder={reorderTiles}
            />
          </DndProvider>

          <TileDialog
            open={dialogState !== null}
            tile={dialogState?.type === "edit" ? dialogState.tile : undefined}
            onClose={() => setDialogState(null)}
            onSave={saveTile}
          />

          <SettingsDialog
            open={settingsOpen}
            settings={settings}
            onClose={() => setSettingsOpen(false)}
            onPersist={persistSettings}
            onStatus={showToast}
          />
        </NewTabShell>
      )}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background: "#101816",
            color: "#f7faf9",
          },
          success: {
            iconTheme: {
              primary: "#008a74",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#c62828",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </AppTheme>
  );
}
