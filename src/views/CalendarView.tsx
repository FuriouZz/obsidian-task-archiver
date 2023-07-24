import { ItemView, WorkspaceLeaf } from "obsidian";
import { render } from "preact";
import Calendar from "components/Calendar/Calendar";
import {
  CALENDAR_ICON,
  CALENDAR_TITLE,
  CALENDAR_VIEW_TYPE,
} from "constants.js";
import CalendarStore from "stores/CalendarStore";
import noteSource from "sources/NoteSource";
import TaskList from "components/TaskList/TaskList";
import { TaskListEntry } from "types";

export default class CalendarView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);

    this.onClickDay = this.onClickDay.bind(this);
    this.onClickWeek = this.onClickWeek.bind(this);
    this.onOpenEntry = this.onOpenEntry.bind(this);

    this.registerEvent(this.app.vault.on("create", CalendarStore.refresh));
    this.registerEvent(this.app.vault.on("delete", CalendarStore.refresh));
    this.registerEvent(this.app.vault.on("modify", CalendarStore.refresh));
  }

  getViewType(): string {
    return CALENDAR_VIEW_TYPE;
  }

  getDisplayText(): string {
    return CALENDAR_TITLE;
  }

  getIcon(): string {
    return CALENDAR_ICON;
  }

  protected async onOpen() {
    const sources = [noteSource];

    render(
      <>
        <Calendar
          showWeekNums
          activeDay={CalendarStore.date}
          granularity={CalendarStore.granularity}
          sources={sources}
          onClickDay={this.onClickDay}
          onClickWeek={this.onClickWeek}
        />
        <TaskList
          entries={CalendarStore.entries}
          onOpenEntry={this.onOpenEntry}
        />
      </>,
      this.contentEl
    );
  }

  async onClose() {
    // Nothing to clean up.
  }

  onClickDay(day: moment.Moment) {
    CalendarStore.granularity.value = "day";
    CalendarStore.date.value = day;
  }

  onClickWeek(day: moment.Moment) {
    CalendarStore.granularity.value = "week";
    CalendarStore.date.value = day;
  }

  onOpenEntry(entry: TaskListEntry) {
    const leaf = app.workspace.getLeaf(false);
    leaf.openFile(entry.file);
  }
}
