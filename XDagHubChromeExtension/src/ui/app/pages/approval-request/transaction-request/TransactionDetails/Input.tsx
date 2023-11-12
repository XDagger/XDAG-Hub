import ExplorerLink from "_src/ui/app/components/explorer-link";
import {ExplorerLinkType} from "_src/ui/app/components/explorer-link/ExplorerLinkType";
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
import {Text} from "_src/ui/app/shared/text";
import BigNumber from "bignumber.js";


interface InputProps {
    input: TransactionBlockInput;
}


const formatInput = (input: any) => {
    if( typeof input.value === "object" ){
        return (
            <div>
                input: { (input.value as BigNumber).toString()}
            </div>
        )
    }
    return (
        <div>
            input: {input.value.toString()}
        </div>
    )
}


export function Input({input}: InputProps) {

    console.log(" input :\n", input);

    return (
        <div className="break-all">
            <Text variant="pBodySmall" weight="medium" color="steel-dark" mono>
                {formatInput(input)}
            </Text>
        </div>
    );
}
