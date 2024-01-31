import { Socials } from "../types/Band";
import Link from "next/link";

export default function SocialsList({ socials }: { socials: Socials }) {
  return (
    <ul className="space-x-2 inline-flex text-gray-500">
      {socials.instagram &&
      <li>
        <Link href={socials.instagram} target="_blank">
          IG
        </Link>
      </li>}
      {socials.twitter && <li>
        <Link href={socials.twitter} target="_blank">
          X
        </Link>
      </li>}
      {socials.bandcamp && <li>
        <Link href={socials.bandcamp} target="_blank">
          BC
        </Link>
      </li>}
      {socials.spotify && <li>
        <Link href={socials.spotify} target="_blank">
          SP
        </Link>
      </li>}
    </ul>
  );
}
