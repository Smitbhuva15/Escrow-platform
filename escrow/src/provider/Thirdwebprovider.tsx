'use client'
import React from 'react'
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";

const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string });

export default function Thirdwebprovider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ThirdwebProvider >
        {children}
    </ThirdwebProvider>

  );
}