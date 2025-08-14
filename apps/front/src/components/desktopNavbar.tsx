"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect, useState } from "react";

type Props = PropsWithChildren;

const DesktopNavbar = (props: Props) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentPosition = window.scrollY;
      console.log("Scroll position:", currentPosition); // Debug scroll
      setScrollPosition(currentPosition);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Gọi ngay lần đầu để set trạng thái
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const isScrollDown = scrollPosition > 0; // Đổi màu ngay khi scroll

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300",
        {
          "bg-white text-gray-700 shadow-md": isScrollDown,
          "bg-transparent text-white": !isScrollDown, // Mặc định khi không scroll
        }
      )}
    >
      <div className="flex items-center px-4 py-4 w-full">
        {props.children}
      </div>
      <hr className="border-b border-gray-100 opacity-25" />
    </nav>
  );
};

export default DesktopNavbar;