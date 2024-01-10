import { signal } from "@preact/signals";
import { moment } from "obsidian";
import { TodayPluginSettings } from "../types.js";
import { NOOP } from "../lib/utils.js";

function createConfigStore() {
  const settings = signal({
    filenameFormat: "YYYY-MM-DD",
    dirnameFormat: "YYYY/MM",
    directoryPath: "Daily",
  });

  const store = {
    settings,

    async getDailyNoteFile() {
      const date = moment();
      const dirname = `${settings.value.directoryPath.replace(
        /\/*$/,
        ""
      )}/${date.format(settings.value.dirnameFormat)}`;
      const filename = `${date.format(settings.value.filenameFormat)}.md`;
      const path = `${dirname}/${filename}`;

      await app.vault.createFolder(dirname).catch(NOOP);

      let file = app.vault.getMarkdownFiles().find((f) => f.path === path);

      if (!file) {
        file = await app.vault.create(`${dirname}/${filename}`, "");
      }

      return file;
    },

    async load(loadData: <T = unknown>() => Promise<T | undefined>) {
      const loadedData = await loadData<TodayPluginSettings>();
      settings.value = { ...settings.value, ...loadedData };
    },

    async update(
      state: Partial<TodayPluginSettings>,
      saveData: <T = unknown>(data: T) => Promise<void>
    ) {
      settings.value = { ...settings.value, ...state };
      return saveData(settings.value);
    },

    async save(saveData: <T = unknown>(data: T) => Promise<void>) {
      await saveData<TodayPluginSettings>(settings.value);
    },
  };

  return store;
}

const ConfigStore = createConfigStore();
export default ConfigStore;
