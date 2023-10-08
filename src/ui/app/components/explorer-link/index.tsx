import {
  type ExplorerLinkConfig,
  useExplorerLink,
} from "../../hooks/useExplorerLink";
import { ArrowUpRight16 } from "_assets/icons/tsIcons";
import ExternalLink from "_components/external-link";
import type { ReactNode } from "react";
import st from "./ExplorerLink.module.scss";

export type ExplorerLinkProps = ExplorerLinkConfig & {
  track?: boolean;
  children?: ReactNode;
  className?: string;
  title?: string;
  showIcon?: boolean;
};

function ExplorerLink({
  track,
  children,
  className,
  title,
  showIcon,
  ...linkConfig
}: ExplorerLinkProps) {
  const explorerHref = useExplorerLink(linkConfig);
  if (!explorerHref) {
    return null;
  }
  return (
    <ExternalLink href={explorerHref} className={className} title={title}>
      <>
        {children} {showIcon && <ArrowUpRight16 className={st.explorerIcon} />}
      </>
    </ExternalLink>
  );
}

export default ExplorerLink;
