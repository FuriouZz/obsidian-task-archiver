import { ItemView, WorkspaceLeaf } from "obsidian";
import { render } from "preact";
import Calendar from "components/Calendar/Calendar";
import {
  CALENDAR_ICON,
  CALENDAR_TITLE,
  CALENDAR_VIEW_TYPE,
} from "constants.js";
import JournalStore from "store";
import noteSource from "notes-source";
import List from "components/List/List";
import { ListEntry } from "types";

export default class CalendarView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);

    this.onClickDay = this.onClickDay.bind(this);
    this.onClickWeek = this.onClickWeek.bind(this);
    this.onOpenEntry = this.onOpenEntry.bind(this);

    this.registerEvent(this.app.vault.on("create", JournalStore.refresh));
    this.registerEvent(this.app.vault.on("delete", JournalStore.refresh));
    this.registerEvent(this.app.vault.on("modify", JournalStore.refresh));
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
          activeDay={JournalStore.date}
          granularity={JournalStore.granularity}
          sources={sources}
          onClickDay={this.onClickDay}
          onClickWeek={this.onClickWeek}
        />
        <List entries={JournalStore.entries} onOpenEntry={this.onOpenEntry} />
      </>,
      this.contentEl
    );
  }

  async onClose() {
    // Nothing to clean up.
  }

  onClickDay(day: moment.Moment) {
    JournalStore.granularity.value = "day";
    JournalStore.date.value = day;
  }

  onClickWeek(day: moment.Moment) {
    JournalStore.granularity.value = "week";
    JournalStore.date.value = day;
  }

  onOpenEntry(entry: ListEntry) {
    const leaf = app.workspace.getLeaf(false);
    leaf.openFile(entry.file);
  }
}
