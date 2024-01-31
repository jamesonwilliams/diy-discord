
import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <nav className="flex justify-between flex-wrap p-3">
        <ul className="flex">
          <li className="ml-3">
            <Link href="/">Home</Link>
          </li>
          <li className="ml-3">
            <Link href="/bands">Bands</Link>
          </li>
          <li className="ml-3">
            <Link href="/events">Events</Link>
          </li>
          <li className="ml-3">
            <Link href="/venues">Venues</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}