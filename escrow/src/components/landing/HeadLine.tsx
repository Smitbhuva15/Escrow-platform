import { FileMinus2, Scale, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";


const HeadLine = () => {


  return (
    <div>
      <div className="text-white flex flex-col md:flex-row items-center md:items-start mt-10 px-2 justify-evenly">
        {/* Left Section */}
        <div className=" text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl  font-extrabold xl:leading-28 lg:leading-20 leading-tight">
            Decentralized escrow
          </h1>
          <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-6 font-bold leading-snug">
            Fair settlement through decentralized arbitration
          </h3>
          <Link href={'/escrows'}>
            <button className="mt-7 bg-[#1d45fe] text-white font-semibold rounded-full px-6 py-3 hover:bg-[#1638d6] transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* photo */}
        <div className="hidden md:block  mt-10 md:mt-0">
          <Image
            src={"/escowhand.png"}
            alt="escrow photo"
            width={400}
            height={400}
            className="mx-auto md:mx-0 xl:w-3xl lg:w-xl"
          />
        </div>
      </div>
      <div className="text-gray-300 grid grid-cols-1 lg:grid-cols-3 gap-6 my-16">
        {/* Box 1 */}
        <div className="flex  items-center text-center bg-[#24292e] p-6 rounded-xl w-full ">
          <Shield className=" size-14 text-[#1d45fe]" />
          <p className="lg:text-lg font-bold  ml-4  w-[80%]  text-left">Safe transactions between businesses or individuals.</p>
        </div>

        {/* Box 2 */}
        <div className="flex  items-center text-center bg-[#24292e] p-6 rounded-xl w-full">
          <FileMinus2 className=" size-14 text-[#1d45fe]" />
          <p className="lg:text-lg font-bold  ml-4 w-[80%] text-left ">
            Smart contracts provide decentralized escrow and protect both parties
            from fraud.
          </p>
        </div>

        {/* Box 3 */}
        <div className="flex  items-center text-center bg-[#24292e] p-6 rounded-xl w-full ">
          <Scale className=" size-14 text-[#1d45fe] " />
          <p className="lg:text-lg font-bold  ml-4  w-[80%]  text-left">Any conflict is resolved through neutral arbitration.</p>
        </div>
      </div>
    </div>
  );
};

export default HeadLine;
