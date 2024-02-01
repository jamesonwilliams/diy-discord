import BandcampIcon from "../components/social-icons/BandcampIcon";
import InstagramIcon from "../components/social-icons/InstagramIcon";
import SpotifyIcon from "../components/social-icons/SpotifyIcon";
import XIcon from "../components/social-icons/XIcon";
import { Socials } from "../types/Band";
import Link from "next/link";

export default function SocialsList({ socials }: { socials: Socials }) {
  return (
    <ul className="space-x-2 inline-flex text-gray-500">
      {socials.instagram &&
      <li>
        <Link href={socials.instagram} target="_blank">
          <InstagramIcon />
        </Link>
      </li>}
      {socials.twitter && <li>
        <Link href={socials.twitter} target="_blank">
          <XIcon />
        </Link>
      </li>}
      {socials.bandcamp && <li>
        <Link href={socials.bandcamp} target="_blank">
          <BandcampIcon />
        </Link>
      </li>}
      {socials.spotify && <li>
        <Link href={socials.spotify} target="_blank">
          <SpotifyIcon />
        </Link>
      </li>}
    </ul>
  );
}
