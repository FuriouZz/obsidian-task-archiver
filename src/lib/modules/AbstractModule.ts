import type TodayPlugin from "../../main.js";

export default abstract class AbstractModule {
  plugin: TodayPlugin;

  constructor(plugin: TodayPlugin) {
    this.plugin = plugin;
  }

  get app() {
    return this.plugin.app;
  }

  onLoad() {}

  onUnload() {}
}
