import { BlockInfo, EditorView, GutterMarker, gutter } from "@codemirror/view";

// https://codemirror.net/examples/gutter/

class DotMarker extends GutterMarker {
  toDOM(): Node {
    const div = document.createElement("div");
    div.style.cursor = "pointer";
    div.onmouseenter = () => {
      dot.style.visibility = "";
    };
    div.onmouseleave = () => {
      dot.style.visibility = "hidden";
    };
    const dot = document.createElement("span");
    dot.textContent = "👉";
    dot.style.visibility = "hidden";
    div.append(dot);

    return div;
  }
}

const dotMarker = new DotMarker();

export default function DotExtensions(config: {
  onClick?: (view: EditorView, line: BlockInfo, event: MouseEvent) => void;
}) {
  return gutter({
    lineMarker(view, line, otherMarkers) {
      if (line.from === line.to) return null;
      return dotMarker;
    },
    domEventHandlers: {
      click(view, line, event) {
        if (config.onClick) {
          config.onClick(view, line, event as MouseEvent);
        }
        return true;
      },
    },
  });
}
