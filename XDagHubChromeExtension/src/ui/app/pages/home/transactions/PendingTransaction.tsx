import Alert from "_components/alert";
import Loading from "_components/loading";
import { useActiveAddress } from "_src/ui/app/hooks/useActiveAddress";
import useAppSelector from "_app/hooks/useAppSelector";
import { useRpcClient } from "_src/xdag/api";
import { useQuery } from "@tanstack/react-query";
import cl from "classnames";
import { Text } from "_app/shared/text";
import BigNumber from "bignumber.js";
import { getTransactionUrl } from "_components/explorer-link/Explorer";
import "./index.css"
import { cx } from "class-variance-authority";
import Browser from "webextension-polyfill";
import { useEffect, useState } from "react";
import { formatAddress } from "_src/xdag/typescript/utils";
import { useTranslation } from "react-i18next";

export function PendingTransaction() {

	// const pendingBlockAddress = useAppSelector( ( state ) => (state.app.pendingTransactionBlock) )
	// const pendingBlockAddress = Browser.storage.local.get("pendingBlockAddress")
	const networkName = useAppSelector( ( { app: { apiEnv } } ) => apiEnv );
	const rpc = useRpcClient();
	const activeAddress = useActiveAddress();
	const { t } = useTranslation();

	const [ pendingBlockAddress, setPendingBlockAddress ] = useState<string | undefined>( undefined )
	useEffect( () => {
		Browser.storage.local.get( { "pendingBlockAddress": null } ).then( ( record ) => {
			setPendingBlockAddress( record.pendingBlockAddress );
		} )
	}, [] )


	const { data, isLoading, error, } = useQuery( {
		queryKey: [ "transaction block", pendingBlockAddress ],
		queryFn: async () => {
			return await rpc.getTransactionBlock( { digest: pendingBlockAddress ?? "", } );
		},
		enabled: !!pendingBlockAddress && pendingBlockAddress.length > 1,
		refetchInterval: 5 * 1000,
	} );

	const clickIconEvent = ( address: string ) => {
		const url = getTransactionUrl( address, networkName, "" )
		if ( url ) {
			window.open( url, "_blank" );
		}
	}

	if ( error ) {
		return <Alert>{ (error as Error)?.message }</Alert>;
	}
	if ( !pendingBlockAddress && data?.state !== "Pending" ) {
		return null;
	}

	const cacuRefsAmount = ( refs: any ): { in: BigNumber, out: BigNumber } => {
		let amount = { in: BigNumber( 0 ), out: BigNumber( 0 ) };
		for ( const ref of refs ) {
			if ( ref.direction === 0 )
				amount.in = amount.in.plus( BigNumber( ref.amount ) );
			if ( ref.direction === 1 )
				amount.out = amount.out.plus( BigNumber( ref.amount ) );
		}
		return amount;
	}

	const getState = ( data: any ) => {
		// state: "Main" | "Rejected" | "Accepted" | "Pending" | "error"
		const tKey = "PendingTransaction." + data.state;
		return t( tKey );
	}

	return (
		<Loading loading={ isLoading }>
			{ data &&
        <>
          <div
            className={ cl( "flex flex-row w-full cursor-pointer py-2", " bg-issue-light " ) }
            onClick={ () => clickIconEvent( data.address ) }
          >

            <div className={ cx( "flex w-1/6 h-full justify-center ", data.state === "Pending" ? "blink" : "" ) }>
              <Text>{ getState( data ) }</Text>
            </div>

            <div className="w-5/6">

              <div className="flex gap-1 items-baseline">
								<span className="mr-1.5">
									<Text color="gray-60" weight="medium">
										{ t( "PendingTransaction.Amount" ) }
									</Text>
								</span>
                <span>
									<Text color="steel-dark" weight="semibold">
										{ cacuRefsAmount( data.refs ).in.toNumber().toString() }
									</Text>
								</span>
                <span className="ml-0.5">
									<Text color="steel-dark" weight="bold">
										XDAG
									</Text>
								</span>
              </div>

							{ data?.refs && data.refs.map( ( ref, index ) => {
								if ( ref.direction !== 0 && ref.direction !== 1 ) {
									return null;
								}
								return (
									<div key={ index } className="flex gap-1 items-baseline">
										<span className="mr-1">
											<Text color="gray-60" weight={ "medium" } variant={ "bodySmall" }>
												{ ref.direction === 0 ? t( "PendingTransaction.From" ) : t( "PendingTransaction.To" ) }
											</Text>
										</span>
										<span>
											<Text color="steel-dark" weight={ "medium" } variant={ "bodySmall" }>
												{ formatAddress( ref.address ) }
											</Text>
										</span>
									</div>
								)
							} )
							}

              <div className="flex gap-1 items-baseline">
								<span className="mr-1.5">
									<Text color="gray-60" weight="medium">
										{ t( "PendingTransaction.Remark" ) }
									</Text>
								</span>
                <span>
									<Text color="gray-70" weight="semibold">
										{ data.remark }
									</Text>
								</span>
              </div>

            </div>


          </div>
        </>


			}
		</Loading>
	);
}
