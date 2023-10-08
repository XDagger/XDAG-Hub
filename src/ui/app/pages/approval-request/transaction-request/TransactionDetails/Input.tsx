import ExplorerLink from "_src/ui/app/components/explorer-link";
import { ExplorerLinkType } from "_src/ui/app/components/explorer-link/ExplorerLinkType";
import {
  BuilderCallArg,
  type TransactionBlockInput
} from "_src/xdag/typescript/builder";
import {
  toB64
} from "_src/xdag/bcs";
import {
  formatAddress,
  is
} from "_src/xdag/typescript/utils";
import { Text } from "_src/ui/app/shared/text";


interface InputProps {
  input: TransactionBlockInput;
}

export function Input({ input }: InputProps) {
  return (
    <div className="break-all">
      <Text variant="pBodySmall" weight="medium" color="steel-dark" mono>
        {is(input.value, BuilderCallArg) ? (
          "Pure" in input.value ?
            (`${toB64(new Uint8Array(input.value.Pure))}`)
            :
            (
            <ExplorerLink
              className="text-hero-dark no-underline"
              type={ExplorerLinkType.address}
              address={"Todo......"}
            >
              {formatAddress("Todo......should do sth.")}
            </ExplorerLink>
          )
        ) : (
          "Unknown input value"
        )}
      </Text>
    </div>
  );
}
