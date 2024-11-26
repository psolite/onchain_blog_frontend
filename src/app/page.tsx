"use client"

import HomePage from "@/components/pages/home";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

export default function Home() {
  const {publicKey} = useWallet()

 
  return (
    <div className="container mx-auto p-4 my-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center">Home Page</h1>
        <p className='text-center mb-8'>Designed on solana devnet By Psolite</p>
        {publicKey ? <HomePage user={publicKey?.toBase58()}/> : <h2 className="text-xl font-bold text-center">Connect Wallet</h2> }
        
      </div>
    </div>
  );
}
