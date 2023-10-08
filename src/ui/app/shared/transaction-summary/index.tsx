import clsx from "classnames";
import { ExplorerLinkCard } from "./cards/ExplorerLink";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import { Heading } from "../heading";
import type { TransactionSummary as TransactionSummaryType } from "_shared/utils";

export function TransactionSummary({
  summary,
  isLoading,
  isError,
  isDryRun = false,
  /* todo: remove this, we're using it until we update tx approval page */
  showGasSummary = false,
}: {
  summary: TransactionSummaryType;
  isLoading?: boolean;
  isDryRun?: boolean;
  isError?: boolean;
  showGasSummary?: boolean;
}) {
  if (isError) return null;
  return (
    <section className="-mx-5 bg-Xdag/10 min-h-full">
      {isLoading ? (
        <div className="flex items-center justify-center p-10">
          <LoadingIndicator />
        </div>
      ) : (
        <div>
          <div className={clsx("px-5 py-8", { "py-6": isDryRun })}>
            <div className="flex flex-col gap-4">
              <ExplorerLinkCard digest={summary?.digest} timestamp={summary?.timestamp}/>
            </div>
          </div>
        </div>

      )}
    </section>
  );
}
