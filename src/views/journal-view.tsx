import { ItemView } from "obsidian";
import { render } from "preact";
import ViewContextProvider from "contexts/ViewContext";
import Calendar from "components/Calendar/Calendar";

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
    this.app;
    render(
      <ViewContextProvider app={this.app}>
        <Calendar />
      </ViewContextProvider>,
      container
    );
  }

  async onClose() {
    // Nothing to clean up.
  }
}
