import { Plugin, PluginSettingTab, Setting } from "obsidian";
import { TodayPluginSettings } from "../types.js";

type TTodayPluginLike = Plugin & {
  settings: TodayPluginSettings;
  saveSettings(): Promise<void>;
};

export class TodayPluginSettingTab extends PluginSettingTab {
  plugin: TTodayPluginLike;

  constructor(plugin: TTodayPluginLike) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("File date format")
      .setDesc("Default file format")
      .addText((text) =>
        text
          .setPlaceholder("YYYY-MM-DD")
          .setValue(this.plugin.settings.filenameFormat)
          .onChange(async (value) => {
            this.plugin.settings.filenameFormat = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Directory date format")
      .setDesc("Default directory format")
      .addText((text) =>
        text
          .setPlaceholder("YYYY/MM")
          .setValue(this.plugin.settings.dirnameFormat)
          .onChange(async (value) => {
            this.plugin.settings.dirnameFormat = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Directory path")
      .setDesc("Default directory path")
      .addText((text) =>
        text
          .setPlaceholder("Daily")
          .setValue(this.plugin.settings.directoryPath)
          .onChange(async (value) => {
            this.plugin.settings.directoryPath = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
