import { Facet, Line, RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  PluginValue,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { TaskRegularExpressions } from "../parser/TaskRegularExpressions.js";
import PluginStore from "../../stores/PluginStore.js";
import { render } from "preact";
import MoveTaskButton from "../../components/MoveIcon/MoveIcon.js";

interface DotDecorationConfig {
  onClick?: (args: {
    view: EditorView;
    line: Line;
    event: MouseEvent;
    isSection: boolean;
  }) => void;
}

const activeDots = Facet.define<DotDecorationConfig>();

class DotWidget extends WidgetType {
  line: Line;
  isSection: boolean;

  constructor(line: Line, isSection = false) {
    super();
    this.line = line;
    this.isSection = isSection;
  }

  toDOM(view: EditorView) {
    const div = document.createElement("div");
    render(<MoveTaskButton isSection={this.isSection} />, div);
    const element = div.children[0] as HTMLDivElement;

    element.onclick = (event) => {
      view.state.facet(activeDots).forEach((conf) => {
        if (conf.onClick) {
          // const y = event.clientY;
          // const line = view.lineBlockAtHeight(y - view.documentTop);
          conf.onClick({
            view,
            event,
            line: this.line,
            isSection: this.isSection,
          });
        }
      });
    };

    return element as HTMLDivElement;
  }

  // ignoreEvent(event: Event): boolean {
  //   console.log(event.type);
  //   return event.type === "mousedown";
  // }
}

class DotPlugin implements PluginValue {
  decorations: DecorationSet;
  needsUpdate = false;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
    PluginStore.activeFile.subscribe(() => {
      if ("updateState" in view && view.updateState === 0) {
        this.needsUpdate = true;
        view.update([]);
      }
    });
  }

  update(update: ViewUpdate) {
    if (this.needsUpdate || update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  destroy() {}

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    if (PluginStore.activeFile.value) {
      view.visibleRanges.forEach(() => {
        let section: Line | undefined = undefined;

        for (let i = 0; i < view.state.doc.lines; i++) {
          const line = view.state.doc.line(i + 1);

          if (line.text.startsWith("#") && !section) {
            section = line;
          }

          if (
            TaskRegularExpressions.taskRegex.test(line.text) &&
            line.from !== line.to
          ) {
            if (section) {
              builder.add(
                section.to,
                section.to,
                Decoration.widget({
                  widget: new DotWidget(section, true),
                  side: 1,
                })
              );
              section = undefined;
            }

            builder.add(
              line.to,
              line.to,
              Decoration.widget({
                widget: new DotWidget(line),
                side: 1,
              })
            );
          }
        }
      });
    }

    return builder.finish();
  }
}

export default function DotDecorations(config: DotDecorationConfig) {
  return [
    ViewPlugin.fromClass(DotPlugin, {
      decorations: (value) => value.decorations,
    }),
    activeDots.of({ ...config }),
  ];
}
