import { useContext } from "react";
import { createPortal } from "react-dom";
import { PageMainLayoutContext } from ".";
import { Heading } from "../heading";

export type PageMainLayoutTitleProps = {
  title: string;
};
export function PageMainLayoutTitle({ title }: PageMainLayoutTitleProps) {
  const titleNode = useContext(PageMainLayoutContext);
  if (titleNode) {
    return createPortal(
      <Heading variant="heading4" truncate weight="semibold" color="gray-90">
        {title}
      </Heading>,
      titleNode,
    );
  }
  return null;
}
