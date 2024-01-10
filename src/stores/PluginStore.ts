import { signal } from "@preact/signals";
import type TodayPlugin from "../main.js";
import { MarkdownView, TFile } from "obsidian";

function createPluginStore() {
  const pluginInstance = signal<TodayPlugin | undefined>(undefined);
  const activeFile = signal<TFile | undefined>(undefined);

  const store = {
    activeFile,

    setPlugin(plugin: TodayPlugin) {
      pluginInstance.value = plugin;

      const view = app.workspace.getActiveViewOfType(MarkdownView);
      if (view) onFileOpen(view?.file);
    },

    async loadData<T = unknown>(): Promise<T | undefined> {
      return pluginInstance.value?.loadData();
    },

    async saveData<T = unknown>(data: T) {
      await pluginInstance.value?.saveData(data);
    },
  };

  const onFileOpen = (file: TFile) => {
    // const name = file.basename.toLowerCase();
    // activeFile.value = /^today$/.test(name) ? file : undefined;
    activeFile.value = file;
  };

  pluginInstance.subscribe((plugin) => {
    if (!plugin) return;

    app.workspace.off("file-open", onFileOpen);
    app.workspace.on("file-open", onFileOpen);
    plugin.register(() => {
      app.workspace.off("file-open", onFileOpen);
    });
  });

  return store;
}

const PluginStore = createPluginStore();
export default PluginStore;
