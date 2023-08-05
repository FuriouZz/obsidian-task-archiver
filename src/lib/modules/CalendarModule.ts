import { CALENDAR_VIEW_TYPE } from "../../constants.js";
import CalendarView from "../../views/CalendarView.js";
import AbstractModule from "./AbstractModule.js";

export default class CalendarModule extends AbstractModule {
  onload() {
    this.plugin.registerView(
      CALENDAR_VIEW_TYPE,
      (leaf) => new CalendarView(leaf)
    );

    this.app.workspace.onLayoutReady(() => {
      this.activateView();
    });
  }

  onunload(): void {
    this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: CALENDAR_VIEW_TYPE,
      active: false,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(CALENDAR_VIEW_TYPE)[0]
    );
  }
}
