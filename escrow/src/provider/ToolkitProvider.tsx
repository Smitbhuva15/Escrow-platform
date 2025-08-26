'use client'
import React from 'react'
import { store } from "@/store/store"
import { Provider } from 'react-redux'

export default function ToolkitProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <Provider store={store}>
      {children}
    </Provider>

  );
}