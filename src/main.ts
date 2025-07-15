import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS } from "./constants.js";
import type AbstractModule from "./lib/modules/AbstractModule.js";
import CalendarModule from "./lib/modules/CalendarModule.js";
import SendActionModule from "./lib/modules/SendActionModule.js";
import { SettingTab } from "./lib/SettingTab.js";
import type { Settings } from "./types.js";

export default class TaskArchiverPlugin extends Plugin {
    settings: Settings;
    modules: AbstractModule[] = [];

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new SettingTab(this));

        this.modules.push(new CalendarModule(this), new SendActionModule(this));
        for (const mod of this.modules) mod.onload();
    }

    onunload() {
        for (const mod of this.modules) mod.onunload();
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
