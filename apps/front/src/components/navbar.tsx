import Link from "next/link";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <>
      <h1 className="text-2xl font-bold p-2">My Modern Blog</h1>
      {/* Liên kết bên phải */}
      <div className="flex gap-2 ml-auto [&>a]:py-2 [&>a]:px-4 [&>a]:transition [&>a]:rounded-md [&>a:hover]:text-sky-100 [&>a:hover]:bg-sky-500">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Blog
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition-colors">
          Contact
        </Link>
      </div>
    </>
  );
};

export default Navbar;