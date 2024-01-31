import Image from "next/image";

export default function Home() {
  return <Image 
  src="/welcome.jpg"
  alt="DIY Discord" 
  width="500"
  height="500"
  priority={true}
  />;
}
