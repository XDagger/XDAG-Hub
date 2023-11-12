'use client'
import React from "react";
import {WalletStandardProvider} from '@wallet-standard/react';
import XDagWalletTopRight from "@/components/WalletTopRight/XDagHubWallet";

const WalletTopRight = () => {
    return (
        <WalletStandardProvider>
            <XDagWalletTopRight></XDagWalletTopRight>
        </WalletStandardProvider>
    )
}

export default WalletTopRight;