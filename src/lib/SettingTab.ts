import type TaskArchiverPlugin from "main.js";
import { PluginSettingTab, Setting } from "obsidian";
import { FileInputSuggester } from "./suggesters/FileInputSuggester";

export class SettingTab extends PluginSettingTab {
    plugin: TaskArchiverPlugin;

    constructor(plugin: TaskArchiverPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Source file")
            .setDesc("File where tasks are located")
            .addSearch((search) => {
                if (this.plugin.settings.sourceFile) {
                    search.setValue(this.plugin.settings.sourceFile);
                }
                const suggester = new FileInputSuggester(
                    this.plugin.app,
                    search.inputEl,
                ).onSelect(async (value) => {
                    search.setValue(value.path);
                    this.plugin.settings.sourceFile = value.path;
                    await this.plugin.saveSettings();
                    suggester.close();
                });
            });

        new Setting(containerEl)
            .setName("Target File")
            .setDesc("File where tasks are archived")
            .addSearch((search) => {
                if (this.plugin.settings.targetFile) {
                    search.setValue(this.plugin.settings.targetFile);
                }
                const suggester = new FileInputSuggester(
                    this.plugin.app,
                    search.inputEl,
                ).onSelect(async (value) => {
                    search.setValue(value.path);
                    this.plugin.settings.targetFile = value.path;
                    await this.plugin.saveSettings();
                    suggester.close();
                });
            });
    }
}
