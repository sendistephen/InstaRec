import { Button } from "@/components/ui/button";
import { Menu, Video } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Menu className="w-8 h-8" />
        <Video className="w-8 h-8" />
        Instarec
      </div>
      <div className="hidden gap-x-10 items-center lg:flex text-sm ">
        <Link
          href="/"
          className="bg-[#7320DD] py-2 px-5 font-semibold rounded-full hover:bg-[#7320DD]/80"
        >
          Home
        </Link>
        <Link href="/">Pricing</Link>
        <Link href="/">Contact</Link>
      </div>
      <Link href="/auth/sign-in">
        <Button className="text-sm">Login</Button>
      </Link>
    </div>
  );
};

export default Navbar;
