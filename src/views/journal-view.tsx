import { ItemView } from "obsidian";
import JournalViewApp from "components/App/App.jsx";
import { render } from "preact";

export const VIEW_TYPE_JOURNAL = "journal-view";

export default class JournalView extends ItemView {
  getViewType(): string {
    return VIEW_TYPE_JOURNAL;
  }

  getDisplayText(): string {
    return "Journal view";
  }

  protected async onOpen() {
    const container = this.containerEl.children[1];
    render(<JournalViewApp />, container);
  }

  async onClose() {
    // Nothing to clean up.
  }
}
