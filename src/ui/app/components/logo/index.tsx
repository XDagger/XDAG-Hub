import {
  XdagMainnet,
  XdagTestnet,
  XdagDevnet,
  XdagLocal,
  XdagCustomRpc,
} from "_assets/icons/tsIcons";
import { API_ENV } from "_src/shared/api-env";

type LogoProps = {
  networkName?: API_ENV;
};

const networkLogos = {
  [API_ENV.mainnet]: XdagMainnet,
  [API_ENV.devNet]: XdagDevnet,
  [API_ENV.testNet]: XdagTestnet,
  [API_ENV.local]: XdagLocal,
  [API_ENV.customRPC]: XdagCustomRpc,
};

const Logo = ({ networkName }: LogoProps) => {
  const LogoComponent = networkName
    ? networkLogos[networkName]
    : networkLogos[API_ENV.mainnet];
  return <LogoComponent className="h-7 w-walletLogo" />;
};

export default Logo;
