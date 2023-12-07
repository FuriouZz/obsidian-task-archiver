import { Facet, RangeSetBuilder } from "@codemirror/state";
import {
  BlockInfo,
  Decoration,
  DecorationSet,
  EditorView,
  PluginValue,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";

interface DotDecorationConfig {
  onClick?: (view: EditorView, line: BlockInfo, event: MouseEvent) => void;
}

const activeDots = Facet.define<DotDecorationConfig>();

class DotWidget extends WidgetType {
  toDOM(view: EditorView) {
    const div = document.createElement("span");
    div.style.cursor = "pointer";
    // div.onmouseenter = () => {
    //   dot.style.visibility = "";
    // };
    // div.onmouseleave = () => {
    //   dot.style.visibility = "hidden";
    // };

    div.onclick = (event) => {
      view.state.facet(activeDots).forEach((conf) => {
        if (conf.onClick) {
          const y = event.clientY;
          const line = view.lineBlockAtHeight(y - view.documentTop);
          conf.onClick(view, line, event);
        }
      });
    };

    const dot = document.createElement("span");
    dot.textContent = " 👉";
    // dot.style.visibility = "hidden";
    div.append(dot);

    return div;
  }
}

class DotPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  destroy() {}

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    view.visibleRanges.forEach(() => {
      for (let i = 0; i < view.state.doc.lines; i++) {
        const line = view.state.doc.line(i + 1);

        const w = Decoration.widget({
          widget: new DotWidget(),
          side: 1,
        });

        if (line.from !== line.to) {
          builder.add(line.to, line.to, w);
        }
      }
    });

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
