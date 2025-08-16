import { getSession } from "@/lib/session";
import Link from "next/link";
import SignInPanel from "./signInPanel";

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getSession();
  return (
    <>
      <h1 className="text-2xl font-bold p-2">My Modern Blog</h1>
      {/* Liên kết bên phải */}
      <div className="flex flex-col md:flex-row gap-2 ml-auto [&>a]:py-2 [&>a]:px-4 [&>a]:transition [&>a]:rounded-md [&>a:hover]:text-sky-100 [&>a:hover]:bg-sky-500">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Blog
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition-colors">
          Contact
        </Link>
        {session && session.user ? (
          <a href={"/api/auth/signout"}>Sign Out</a>
        ) : (
          <SignInPanel />
        )}
      </div>
    </>
  );
};

export default Navbar;
