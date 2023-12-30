'use client'
import type {FC} from 'react';
import React, {useEffect} from 'react';
import {useConnect, useWallet, useWallets} from "@wallet-standard/react";
import {useIsConnected} from "../../hooks/useIsConnected";
import {Wallet} from "@wallet-standard/core";
import XDagPng from "../../public/static/images/logoRmBg.png";
import Image from "@/components/Image";

const XDagWalletTopRight: FC = () => {

    const {wallets} = useWallets();
    const {setWallet, wallet, accounts} = useWallet();
    const isConnected = useIsConnected();
    const {connect} = useConnect();

    const doConnect = async (wallet: Wallet) => {
        console.log('will connect XDag wallet. connect: ', connect)
        connect && await connect();
    }

    useEffect(() => {
        console.log('wallets:\n', wallets)
        if (wallets) {
            wallets.map((walletObj, index) => {
                if (walletObj.name.toLowerCase().includes("xdag"))
                    setWallet(walletObj);
            })
        }
    }, [wallets])


    const formatAddress = (address: string) => {
        if (address.length <= 6) {
            return address;
        }
        const ELLIPSIS = "\u{2026}";
        return address.slice(0, 0 + 3) + ELLIPSIS + address.slice(-9,);
    }

    const xDagTransaction = (toAddress: string, amount: number, remark: string) => {
        //使用了any,暂时无法确定类型
        const signAndExecute:any = (wallet?.features["XDag:signAndExecuteTransactionBlock"] as any)?.signAndExecuteTransactionBlock;
        if (!signAndExecute) return;
        signAndExecute({toAddress, amount, remark});
    }

    return (
        <>
            <div className="fixed w-full">
                <div className="flex justify-end items-start">
                    {
                        wallet ? (
                            (isConnected && accounts[0]) ? (
                                <button
                                    className="flex items-center w-500 bg-amber-300 hover:bg-amber-500 font-bold py-2 px-4 rounded">
                                    <span className="mr-2">
                                        <Image alt="XDag" src={XDagPng} width={20} height={20}/>
                                    </span>
                                    <span>
                                        {formatAddress(accounts[0].address)}
                                    </span>
                                </button>
                            ) : (
                                <button
                                    className="flex items-center w-500 bg-blue-300 hover:bg-blue-500 font-bold py-2 px-4 rounded"
                                    onClick={() => doConnect(wallet)}
                                >
                                    <span className="mr-2">
                                        <Image alt="XDag" src={XDagPng} width={20} height={20}/>
                                    </span>
                                    <span>
                                        connect
                                    </span>
                                </button>
                            )
                        ) : (
                            <>
                                <div>
                                    <button
                                        className="flex items-center w-500 bg-blue-300 hover:bg-blue-500 font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            const url = "https://chrome.google.com/webstore/detail/xdag-wallet/ilboijfdpoiokmioeiceibgpbnemlkeb";
                                            window.open(url, "_blank");
                                        }
                                        }
                                    >
                                    <span className="mr-2">
                                        <Image alt="XDag" src={XDagPng} width={20} height={20}/>
                                    </span>
                                        <span>
                                        install
                                    </span>
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default XDagWalletTopRight