import { CALENDAR_VIEW_TYPE } from "../../constants.js";
import CalendarView from "../obsidian/CalendarView.js";
import AbstractModule from "./AbstractModule.js";

export default class CalendarModule extends AbstractModule {
  onLoad() {
    this.plugin.registerView(
      CALENDAR_VIEW_TYPE,
      (leaf) => new CalendarView(leaf)
    );

    this.app.workspace.onLayoutReady(() => {
      this.activateView();
    });
  }

  onUnload(): void {
    this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);
  }

  async activateView() {
    if (this.app.workspace.getLeavesOfType(CALENDAR_VIEW_TYPE).length > 0) {
      return;
    }

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: CALENDAR_VIEW_TYPE,
    });
  }
}
