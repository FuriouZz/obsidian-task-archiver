import { Plugin } from "obsidian";
import AbstractModule from "./lib/modules/AbstractModule.js";
import CalendarModule from "./lib/modules/CalendarModule.js";
import { TodayPluginSettingTab } from "./lib/obsidian/TodayPluginSettingTab.js";
import TaskMoverModule from "./lib/modules/TaskMoverModule.js";
import PluginStore from "./stores/PluginStore.js";
import ConfigStore from "./stores/ConfigStore.js";

export default class TodayPlugin extends Plugin {
  modules: AbstractModule[] = [];

  async onload() {
    PluginStore.setPlugin(this);
    await ConfigStore.load(PluginStore.loadData);

    this.addSettingTab(new TodayPluginSettingTab(app, this));

    this.modules.push(new CalendarModule(this), new TaskMoverModule(this));
    this.modules.forEach((mod) => mod.onLoad());
  }

  onunload() {
    this.modules.forEach((mod) => mod.onUnload());
  }
}
