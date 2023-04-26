import { signal } from "@preact/signals";
import { moment } from "obsidian";
import { ListEntry } from "types";

async function fetchFiles(day: moment.Moment | undefined) {
  if (!day) return [];

  const files = app.vault.getMarkdownFiles().filter((file) => {
    return day.isSame(file.stat.ctime, "day");
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

function createJournalStore() {
  const day = signal<moment.Moment | undefined>(undefined);
  const entries = signal<ListEntry[]>([]);

  const store = {
    day,
    entries,
    async refresh() {
      entries.value = await fetchFiles(day.value);
    },
  };

  day.subscribe(store.refresh);

  return store;
}

const JournalStore = createJournalStore();
export default JournalStore;
