import { headers } from '@/lib/header';
import { Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {

   

    return (
        <footer className=" text-zinc-300">
            <div className="bg-black px-4 py-6">
                {/* Logo */}
                <div className="text-center ">
                    <Link href="/">
                        <div className='flex justify-center'>
                            {/* <img src='./logo2.png' className="sm:w-36 w-24 text-3xl transition-colors" /> */}
                            <div className="text-4xl font-extrabold text-[#1d45fe] ml-2 my-6">
                                <Link href={'/'}>Escryn</Link>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-10 text-zinc-300 mb-3">
                    <Link
                        href="/"
                        className="transition-colors hover:text-[#1638d6]"
                    >
                        Home
                    </Link>
                    <a
                        href="https://github.com/Smitbhuva15/Escrow-platform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" transition-colors hover:text-[#1638d6]"
                    >
                        GitHub
                    </a>
                    <Link
                        href="/guides"
                        className="transition-colors hover:text-[#1638d6]"
                    >
                        About
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-10 text-zinc-300 mb-6">
                    {
                        headers.map((header,index) => (
                            <Link
                                href={`${header.link}` }
                                className="hover:text-[#1638d6]  transition duration-500"
                            key={index}>
                                {header.name}
                            </Link>
                        ))
                    }
                </div>

                {/* Bottom Row */}
                <div>
                    <div className="flex flex-col  justify-between items-center  pt-2 gap-4 sm:w-[90%] sm:mx-auto" >
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/Smitbhuva15"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#1d45fe] hover:bg-[#1638d6] transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/smit-bhuva-1007ba314/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#1d45fe] hover:bg-[#1638d6] transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <Link
                                href={'/'}
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#1d45fe] hover:bg-[#1638d6]   transition-colors"
                            >
                                <Globe className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-sm text-zinc-400 text-center sm:text-left">
                            Designed & Developed by <span className="font-extrabold text-[#1638d6]">Smit Bhuva</span>
                        </p>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;