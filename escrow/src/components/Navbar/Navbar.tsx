"use client";
import { useState, useEffect } from "react";
import { AlignJustify, X } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";
import Link from "next/link";

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
});

const Navbar = () => {
    const [display, setDisplay] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#0a0a0a]/90 shadow-lg" : "bg-transparent"
                }`}
        >
            <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl w-[90%] mx-auto py-5 flex justify-between items-center">
                {/* Logo */}
                <div className="text-4xl font-extrabold text-[#1d45fe] ml-2">
                    <Link href={'/'}>Escrow</Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-14">
                    <ul className="flex text-zinc-300 font-semibold gap-6 xl:text-lg">
                        <Link href={'/escrows'}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Escrows</li>
                        </Link>
                        <Link href={'/arbitration'}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Arbitration</li>
                        </Link>
                        <Link href={'/stake'}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Stake</li>
                        </Link>
                        <Link href={'/dashboard'}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Dashboard</li>
                        </Link>
                        <Link href={'/admin'}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Admin</li>
                        </Link>
                        <Link href={'/guides'}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">User Guides</li>
                        </Link>
                    </ul>
                    <div>
                        <ConnectButton
                            client={client}
                            chain={sepolia}
                            wallets={[
                                createWallet("io.metamask"),
                                createWallet("com.coinbase.wallet"),
                                createWallet("me.rainbow"),
                            ]}
                        />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden block text-zinc-300 mr-2">
                    <button onClick={() => setDisplay(true)}>
                        <AlignJustify className="size-10" />
                    </button>
                </div>
            </div>

            {/* Mobile Slide-Out Drawer (from top) */}
            <div
                className={`fixed top-0 left-0 w-full h-full bg-[#0a0a0a] text-zinc-200 transform transition-transform duration-500 ease-in-out ${display ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                {/* Close Button */}
                <div className="absolute top-5 right-5">
                    <button onClick={() => setDisplay(false)}>
                        <X className="size-8" />
                    </button>
                </div>


                <div className="flex flex-col items-center justify-center  h-full ">

                    <ConnectButton
                        client={client}
                        chain={sepolia}
                        wallets={[
                            createWallet("io.metamask"),
                            createWallet("com.coinbase.wallet"),
                            createWallet("me.rainbow"),
                        ]}
                    />


                    <ul
                        className={`flex flex-col sm:text-2xl text-xl items-center font-semibold space-y-6 mt-10 ${display ? "animate-slideDown" : ""
                            }`}
                    >
                        <Link href={'/escrows'} onClick={() => {setDisplay(false) }}>
                            <li className="hover:text-[#1d45fe]  transition duration-500 ">Escrows</li>
                        </Link>
                        <Link href={'/arbitration'} onClick={() => setDisplay(false)}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Arbitration</li>
                        </Link>
                        <Link href={'/stake'} onClick={() => setDisplay(false)}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Stake</li>
                        </Link>
                        <Link href={'/dashboard'} onClick={() => setDisplay(false)}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Dashboard</li>
                        </Link>
                        <Link href={'/admin'} onClick={() => setDisplay(false)}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">Admin</li>
                        </Link>
                        <Link href={'/guides'} onClick={() => setDisplay(false)}>
                            <li className="hover:text-[#1d45fe]  transition duration-500">User Guides</li>
                        </Link>

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
