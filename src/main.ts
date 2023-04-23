import { Plugin } from "obsidian";
import JournalView, { VIEW_TYPE_JOURNAL } from "views/journal-view";

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

    this.registerView(VIEW_TYPE_JOURNAL, (leaf) => new JournalView(leaf));

    this.addRibbonIcon("dice", "Activate view", () => {
      this.activateView();
    });
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_JOURNAL);
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_JOURNAL);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_JOURNAL,
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE_JOURNAL)[0]
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
