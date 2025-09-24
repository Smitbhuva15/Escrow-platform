"use client";
import { useState, useEffect } from "react";
import { AlignJustify, X } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";
import Link from "next/link";
import { headers } from "@/lib/header";
import { useDispatch } from "react-redux";
import { LoadContarct } from "@/lib/LoadData";
import { usePathname } from "next/navigation";

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
});

const Navbar = () => {
    const [display, setDisplay] = useState(false);
    const [scrolled, setScrolled] = useState(false);
   const pathname = usePathname()
   
    const dispatch = useDispatch();
    
    useEffect(() => {
        LoadContarct(dispatch);
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#131519]/90 shadow-lg" : "bg-transparent"
                }`}
        >
            <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl w-[90%] mx-auto py-5 flex justify-between items-center">
                {/* Logo */}
                <div className="text-4xl font-extrabold text-[#1d45fe] ml-2">
                    <Link href={'/'}>Escryn</Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center xl:gap-14 gap-6">
                    <ul className="flex text-zinc-300 font-semibold xl:gap-6 gap-5 text-sm xl:text-lg">
                        {
                            headers.map((header, index) => (
                                <Link href={`${header.link}`} key={index}>
                                    <li className={`hover:text-[#1638d6]  transition duration-500 ${pathname ==header.link &&"text-[#1638d6]"}`}> {header.name}</li>
                                </Link>
                            ))
                        }
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
                className={`fixed top-0 left-0 w-full h-full bg-[#131519] text-zinc-200 transform transition-transform duration-500 ease-in-out ${display ? "translate-y-0" : "-translate-y-full"
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


                    <ul className={`flex flex-col sm:text-2xl text-xl items-center font-semibold space-y-6 mt-10 ${display ? "animate-slideDown" : ""}`} >
                        {
                            headers.map((header, index) => (
                                <Link href={`${header.link}`} onClick={() => setDisplay(false)} key={index}>
                                    <li className={`hover:text-[#1638d6]  transition duration-500 ${pathname ==header.link &&"text-[#1638d6]"}`}> {header.name}</li>
                                </Link>
                            ))
                        }

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
