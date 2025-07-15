import type TaskArchiverPlugin from "../../main.js";

export default abstract class AbstractModule {
    plugin: TaskArchiverPlugin;

    constructor(plugin: TaskArchiverPlugin) {
        this.plugin = plugin;
    }

    get app() {
        return this.plugin.app;
    }

    onload() {}
    onunload() {}
}
