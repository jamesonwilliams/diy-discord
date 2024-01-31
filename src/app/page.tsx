import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p className="py-4">
        Some tools to help find DIY resources. <Link className="font-bold" target="_blank" href="https://discord.gg/diyordie">Join the discord server!</Link>
      </p>
      <Link target="_blank" href="https://discord.gg/diyordie">
        <Image
          src="/welcome.jpg"
          alt="DIY Discord"
          width="500"
          height="500"
          priority={true}
          className="rounded-2xl"
        />
      </Link>
    </div>
  );
}
