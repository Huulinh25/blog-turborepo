import Hero from "@/components/hero";
import Posts from "@/components/Posts";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <Posts posts={[]}/>
    </main>
  );
}
