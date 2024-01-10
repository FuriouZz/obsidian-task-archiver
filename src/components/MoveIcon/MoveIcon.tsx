import { useEffect, useRef } from "preact/hooks";
import css from "./MoveIcon.module.css";
import { setIcon } from "obsidian";

export interface MoveTaskButtonProps {
  isSection?: boolean;
}

export default function MoveTaskButton(props: MoveTaskButtonProps) {
  const $a = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    setIcon($a.current!, props.isSection ? "refresh-cw" : "clipboard-paste");
  }, [props.isSection]);

  return (
    <a ref={$a} className={css.Root} href="#">
      ...
    </a>
  );
}
