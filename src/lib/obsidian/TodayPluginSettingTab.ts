import { PluginSettingTab, Setting } from "obsidian";
import ConfigStore from "../../stores/ConfigStore.js";
import PluginStore from "../../stores/PluginStore.js";
import { FolderSuggest } from "./FolderSuggest.js";

export class TodayPluginSettingTab extends PluginSettingTab {
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Daily Note Format")
      .setDesc("Default file format")
      .addText((text) =>
        text
          .setPlaceholder("YYYY-MM-DD")
          .setValue(ConfigStore.settings.value.filenameFormat)
          .onChange((filenameFormat) => {
            return ConfigStore.update({ filenameFormat }, PluginStore.saveData);
          })
      );

    new Setting(containerEl)
      .setName("Directory date format")
      .setDesc("Default directory format")
      .addText((text) =>
        text
          .setPlaceholder("YYYY/MM")
          .setValue(ConfigStore.settings.value.dirnameFormat)
          .onChange((dirnameFormat) => {
            return ConfigStore.update({ dirnameFormat }, PluginStore.saveData);
          })
      );

    new Setting(containerEl)
      .setName("Directory path")
      .setDesc("Default directory path")
      .addSearch((search) => {
        new FolderSuggest(search.inputEl);
        search
          .setPlaceholder(ConfigStore.settings.value.directoryPath)
          .setValue(ConfigStore.settings.value.directoryPath)
          .onChange((directoryPath) => {
            return ConfigStore.update({ directoryPath }, PluginStore.saveData);
          });
      });
  }
}
