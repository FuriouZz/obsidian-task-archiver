import { CALENDAR_VIEW_TYPE } from "constants.js";
import { Plugin } from "obsidian";
import CalendarView from "view";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    this.registerView(CALENDAR_VIEW_TYPE, (leaf) => new CalendarView(leaf));

    this.app.workspace.onLayoutReady(() => {
      this.activateView();
    });
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: CALENDAR_VIEW_TYPE,
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(CALENDAR_VIEW_TYPE)[0]
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
