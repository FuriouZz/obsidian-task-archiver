import { Plugin } from "obsidian";
import AbstractModule from "./lib/modules/AbstractModule.js";
import CalendarModule from "./lib/modules/CalendarModule.js";
import SendActionModule from "./lib/modules/SendActionModule.js";
import { TodayPluginSettings } from "./types.js";
import { DEFAULT_SETTINGS } from "./constants.js";
import { TodayPluginSettingTab } from "./lib/TodayPluginSettingTab.js";
import InteractiveBlockModule from "./lib/modules/InteractiveBlockModule.js";

export default class TodayPlugin extends Plugin {
  settings: TodayPluginSettings;
  modules: AbstractModule[] = [];

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new TodayPluginSettingTab(this));

    this.modules.push(
      new CalendarModule(this),
      new SendActionModule(this),
      new InteractiveBlockModule(this)
    );
    this.modules.forEach((mod) => mod.onLoad());
  }

  onunload() {
    this.modules.forEach((mod) => mod.onUnload());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
