import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useConnect, useWallet, useWallets } from "@wallet-standard/react";
import { useIsConnected } from "../hooks/useIsConnected";
import { Wallet } from "@wallet-standard/core";


const walletApi: FC = () => {

	const { wallets } = useWallets();
	const { setWallet, wallet, accounts } = useWallet();
	const isConnected = useIsConnected();
	const { connect } = useConnect();

	const doConnect = async ( wallet: Wallet ) => {
		console.log('will connect XDag wallet. connect: ', connect)
		connect && await connect();
	}

	useEffect( () => {
		console.log( 'wallets:\n', wallets )
		if ( wallets ) {
			wallets.map( ( walletObj, index ) => {
				if ( walletObj.name.toLowerCase().includes( "xdag" ) )
					setWallet( walletObj );
			} )
		}
	}, [ wallets ] )


	const formatAddress = ( address: string ) => {
		if ( address.length <= 6 ) {
			return address;
		}
		const ELLIPSIS = "\u{2026}";
		return address.slice( 0, 0 + 3 ) + ELLIPSIS + address.slice( -9, );
	}

	const xDagTransaction = ( toAddress: string, amount: number, remark: string ) => {
		const signAndExecute = (wallet?.features[ "XDag:signAndExecuteTransactionBlock" ] as any)?.signAndExecuteTransactionBlock;
		if ( !signAndExecute ) return;
		signAndExecute( { toAddress, amount, remark } );
	}


	return (
		<>
			<div className="flex flex-col">
				{
					wallet ? (
						<div className="flex justify-end items-start">
							{
								(isConnected && accounts[ 0 ]) ? (
									<button className=" w-1/5 bg-amber-50 hover:bg-amber-300  font-bold py-2 px-4 rounded">
										{ formatAddress( accounts[ 0 ].address ) }
									</button>
								) : (
									<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={ () => doConnect( wallet ) }
									>
										Connect XDagWallet
									</button>
								)
							}
						</div>
					) : (
						<>
							<div>
								<a
									className="underline text-blue-500 hover:underline hover:text-blue-700 "
									href="https://chrome.google.com/webstore/detail/xdag-wallet/ilboijfdpoiokmioeiceibgpbnemlkeb"
									target="_blank"
								>
									can't find XDag Wallet. click me to install.
								</a>
							</div>
						</>
					)
				}
			</div>


			<button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={ () => xDagTransaction( '4duPWMbYUgAifVYkKDCWxLvRRkSByf5gb', 1, 'donate to community' ) }
			>
				Donate 1 XDag to community
			</button>

			<div className="mt-5 mb-5">
				<h6>or</h6>
			</div>


			<div className="mt-3">
				<a
					className=" mt-3 underline text-blue-500 hover:underline hover:text-blue-700 cursor-pointer"
					href={ undefined }
					onClick={ () => xDagTransaction( 'xDAGhub2spqwn3c2Nku7siTnqWuCGzmy', 1, 'donate to XDag Hub' ) }
				>
					donate 1 XDag to XDag Hub
				</a>
			</div>

		</>
	)


}

export default walletApi