import HeadLine from "@/components/landing/HeadLine";
import HowItWorks from "@/components/landing/HowItWorks";
import Image from "next/image";

export default function Home() {
  return (
  <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl w-[90%] mx-auto ">
  <HeadLine />
  <HowItWorks />
  </div>
  );
}
