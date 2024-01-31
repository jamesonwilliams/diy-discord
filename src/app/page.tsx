import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link target="_blank" href="https://discord.gg/diyordie">
        <p>Join the discord server!</p>
        <Image
          src="/welcome.jpg"
          alt="DIY Discord"
          width="500"
          height="500"
          priority={true}
          className="rounded-2xl"
        />
      </Link>
    </>
  );
}
