"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Home", path: "/" },
  { name: "Bands", path: "/bands" },
  { name: "Events", path: "/events" },
  { name: "Venues", path: "/venues" },
];

export default function Navbar() {
  const router = usePathname();
  const selectedTab = tabs.find((tab) => tab.path === router);
  return (
    <>
      <nav className="flex justify-between flex-wrap p-3">
        <ul className="flex">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={`ml-4 ${tab.name === selectedTab?.name ? "font-bold border-b-2" : ""}`}
            >
              <Link href={tab.path}>{tab.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
