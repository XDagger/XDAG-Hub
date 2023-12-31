import cl from "classnames";
import LoadingIndicator from "../loading/LoadingIndicator";
import {
  WalletActionStake24,
  ArrowRight16,
  Info16,
  Swap16,
  Unstaked,
  Xdag,
  Account24,
} from "_assets/icons/tsIcons";

const icons = {
  Send: (
    <ArrowRight16
      fill="currentColor"
      className="text-gradient-blue-start text-body -rotate-45 "
    />
  ),
  Receive: (
    <ArrowRight16
      fill="currentColor"
      className="text-gradient-blue-start text-body rotate-135"
    />
  ),
  Transaction: (
    <ArrowRight16
      fill="currentColor"
      className="text-gradient-blue-start text-body -rotate-45"
    />
  ),
  Staked: (
    <WalletActionStake24 className="text-gradient-blue-start text-heading2 bg-transparent" />
  ),
  Unstaked: <Unstaked className="text-gradient-blue-start text-heading3" />,
  Rewards: <Xdag className="text-gradient-blue-start text-body" />,
  Swapped: <Swap16 className="text-gradient-blue-start text-heading6" />,
  Failed: <Info16 className="text-issue-dark text-heading6" />,
  Loading: <LoadingIndicator />,
  PersonalMessage: (
    <Account24
      fill="currentColor"
      className="text-gradient-blue-start text-body"
    />
  ),
};

interface TxnItemIconProps {
  txnFailed?: boolean;
  variant: keyof typeof icons;
}

export function TxnIcon({ txnFailed, variant }: TxnItemIconProps) {
  return (
    <div className={cl([
      txnFailed ? "bg-issue-light" : variant==="Send"?"bg-gray-40":"bg-sui-light",
      "w-7.5 h-7.5 flex justify-center items-center rounded-2lg",
    ])}>
      {icons[txnFailed ? "Failed" : variant]}
    </div>
  );
}
