import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/logo";
import { type API_ENV } from "_src/shared/api-env";

type HeaderProps = {
  networkName: API_ENV;
  middleContent?: ReactNode;
  rightContent?: ReactNode;
};

export function Header({
  networkName,
  middleContent,
  rightContent,
}: HeaderProps) {
  return (
    <header className="grid grid-cols-header items-center gap-3 px-3 py-2">
      <div>
        <Link to="/" className="no-underline text-gray-90">
          <Logo networkName={networkName} />
        </Link>
      </div>
      {middleContent && (
        <div className="col-start-2 overflow-hidden">{middleContent}</div>
      )}
      {rightContent && (
        <div className="col-start-3 mr-1 justify-self-end">{rightContent}</div>
      )}
    </header>
  );
}
