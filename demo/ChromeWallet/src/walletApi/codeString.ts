export const packageJson = `
{
  "name": "xdagecosystem",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@types/react-syntax-highlighter": "^15.5.7",
    "@wallet-standard/core": "^1.0.3",
    "@wallet-standard/react": "^0.1.4",
    "lingo3d-react": "latest",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.2",
    "react-syntax-highlighter": "15.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^3.1.0",
    "autoprefixer": "^10.4.13",
    "postcss": "^8.4.21",
    "tailwindcss": "^3.2.6",
    "typescript": "^4.9.5",
    "vite": "^4.1.1"
  },
  "prettier": {
    "trailingComma": "none",
    "tabWidth": 2,
    "semi": false,
    "singleQuote": false
  }
}



`




export const codeString:string = `

import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { useConnect, useWallet, useWallets } from "@wallet-standard/react";
import { useIsConnected } from "../hooks/useIsConnected";
import { Wallet } from "@wallet-standard/core";

const walletApi: FC = () => {

\tconst { wallets } = useWallets();
\tconst { setWallet, wallet, accounts } = useWallet();
\tconst isConnected = useIsConnected();
\tconst { connect } = useConnect();

\tconst doConnect = async ( wallet: Wallet ) => {
\t\tconnect && await connect();
\t}

\tuseEffect( () => {
\t\tconsole.log( 'wallets:\\n', wallets )
\t\tif ( wallets ) {
\t\t\twallets.map( ( wallet, index ) => {
\t\t\t\tif ( wallet.name.toLowerCase().includes( "xdag" ) )
\t\t\t\t\tsetWallet( wallet );
\t\t\t} )
\t\t}
\t}, [ wallets ] )


\tconst formatAddress = ( address: string ) => {
\t\tif ( address.length <= 6 ) {
\t\t\treturn address;
\t\t}
\t\tconst ELLIPSIS = "\\u{2026}";
\t\treturn address.slice( 0, 0 + 9 )  + ELLIPSIS + address.slice( -9, ) ;
\t}

\tconst xDagTransaction = ( toAddress: string, amount: number, remark: string ) => {
\t\tconst signAndExecute = (wallet?.features[ "XDag:signAndExecuteTransactionBlock" ] as any)?.signAndExecuteTransactionBlock;
\t\tif ( !signAndExecute ) return;
\t\tsignAndExecute( { toAddress, amount, remark } );
\t}


\treturn (
\t\t<>
\t\t\t<div className="flex flex-col  ">
\t\t\t\t{
\t\t\t\t\twallet ? (
\t\t\t\t\t\t<div className="flex justify-end items-start">
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t(isConnected && accounts[ 0 ]) ? (
\t\t\t\t\t\t\t\t\t<button className=" w-1/5 bg-amber-50 hover:bg-amber-300  font-bold py-2 px-4 rounded">
\t\t\t\t\t\t\t\t\t\t{ formatAddress( accounts[ 0 ].address ) }
\t\t\t\t\t\t\t\t\t</button>
\t\t\t\t\t\t\t\t) : (
\t\t\t\t\t\t\t\t\t<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={ () => doConnect( wallet ) }
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\tConnect XDagWallet
\t\t\t\t\t\t\t\t\t</button>
\t\t\t\t\t\t\t\t)
\t\t\t\t\t\t\t}
\t\t\t\t\t\t</div>
\t\t\t\t\t) : (
\t\t\t\t\t\t<>
\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t<a
\t\t\t\t\t\t\t\t\tclassName="underline text-blue-500 hover:underline hover:text-blue-700 "
\t\t\t\t\t\t\t\t\thref="https://chrome.google.com/webstore/detail/xdag-wallet/ilboijfdpoiokmioeiceibgpbnemlkeb"
\t\t\t\t\t\t\t\t\ttarget="_blank"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\tcan't find XDag Wallet. click me to install.
\t\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</>
\t\t\t\t\t)
\t\t\t\t}
\t\t\t</div>


\t\t\t<button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
\t\t\t\t\t\t\tonClick={ () => xDagTransaction('4duPWMbYUgAifVYkKDCWxLvRRkSByf5gb', 1, 'tryRemark') }
\t\t\t>
\t\t\t\tDonate to community
\t\t\t</button>


\t\t\t<div className="mt-3">
\t\t\t\t<a
\t\t\t\t\tclassName=" mt-3 underline text-blue-500 hover:underline hover:text-blue-700 cursor-pointer"
\t\t\t\t\thref={ undefined }
\t\t\t\t\tonClick={ () => xDagTransaction('C3vw9K8wteBHkaFTEiezh825YQrYWz71k', 1, 'tryRemark') }
\t\t\t\t>
\t\t\t\t\tC3vw9K8wteBHkaFTEiezh825YQrYWz71k
\t\t\t\t</a>
\t\t\t</div>

\t\t</>
\t)


}

export default walletApi




`


export default codeString