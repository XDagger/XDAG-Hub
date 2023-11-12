import {useState} from "react";
import {ChevronDown12, ChevronRight12} from "_assets/icons/tsIcons";
import {Text} from "_src/ui/app/shared/text";
import type {
    TransactionType,
    TransactionArgument,
    PublishTransaction
} from "_src/xdag/typescript/builder";
import {toB64} from "_src/xdag/bcs";
import {formatAddress} from "_src/xdag/typescript/utils";
import {normalizeXDagAddress} from "_src/xdag/typescript/types";
import {TypeTagSerializer} from "_src/xdag/typescript/builder";
import BigNumber from "bignumber.js";


const formatCommand = (command: any) => {
    if (command?.kind === 'TransferXDag') {
        return (
            <>
                <div>
                    to: {command.address.value}
                </div>
                <div>
                    {
                        command.objects && command.objects.map((obj: any) => {
                                if (typeof obj.value === "object") {
                                    return (
                                        <div>
                                            amount: {(obj.value as BigNumber).toString()}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div>
                                            remark:{(obj.value as string).toString()}
                                        </div>
                                    )
                                }
                            }
                        )
                    }
                </div>
            </>
        )
    }
    return <></>
}


    export function Command({command}: any) {
        const [expanded, setExpanded] = useState(true);


        console.log(" command :\n", command);

        return (
            <div>
                <button className="flex items-center gap-2 w-full bg-transparent border-none p-0"
                        onClick={() => setExpanded((expanded) => !expanded)}
                >
                    <Text variant="body" weight="semibold" color="steel-darker">
                        {command.kind}
                    </Text>
                    <div className="h-px bg-gray-40 flex-1"/>
                    <div className="text-steel">
                        {expanded ? <ChevronDown12/> : <ChevronRight12/>}
                    </div>
                </button>

                {
                    expanded && (
                        <div className="mt-2 text-pBodySmall font-medium text-steel">
                            {formatCommand(command)}
                        </div>
                    )
                }
            </div>
        )
    }
