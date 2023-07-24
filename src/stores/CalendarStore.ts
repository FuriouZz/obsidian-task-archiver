import { signal } from "@preact/signals";
import { moment } from "obsidian";
import { NoteListEntry } from "types";

async function fetchFiles(
  day: moment.Moment | undefined,
  granularity: moment.unitOfTime.StartOf
) {
  if (!day) return [];

  const files = app.vault.getMarkdownFiles().filter((file) => {
    return day.isSame(file.stat.ctime, granularity);
  });

  if (files.length === 0) return [];

  const items = files.map(async (file) => ({
    filename: file.path,
    title: file.basename,
    excerpt: await this.app.vault.cachedRead(file),
    date: moment(file.stat.ctime),
    file,
  }));

  return Promise.all(items);
}

function createCalendarStore() {
  const date = signal<moment.Moment | undefined>(undefined);
  const granularity = signal<"day" | "week">("day");
  const entries = signal<NoteListEntry[]>([]);

  const store = {
    date,
    entries,
    granularity,
    async refresh() {
      entries.value = await fetchFiles(date.value, granularity.value);
    },
  };

  date.subscribe(store.refresh);
  granularity.subscribe(store.refresh);

  return store;
}

const CalendarStore = createCalendarStore();
export default CalendarStore;
