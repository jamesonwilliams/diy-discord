import { Socials } from "../types/Band";
import Link from "next/link";

export default function SocialsList({ socials }: { socials: Socials }) {
  return (
    <ul className="flex space-x-2">
      <li>
        <Link href={socials.instagram} target="_blank">
          IG
        </Link>
      </li>
      <li>
        <Link href={socials.twitter} target="_blank">
          X
        </Link>
      </li>
      <li>
        <Link href={socials.bandcamp} target="_blank">
          BC
        </Link>
      </li>
      <li>
        <Link href={socials.spotify} target="_blank">
          SP
        </Link>
      </li>
    </ul>
  );
}
