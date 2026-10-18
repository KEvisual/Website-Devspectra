"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WELCOME_EVENT } from "./WelcomeIntro";

type Props = {
  imgSrc: string;
  name: string;
  typingClassName: string;
  children: React.ReactNode; // TypingAnimation
};

export default function LogoLink({ imgSrc, name, typingClassName, children }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Dispatch animasi "Welcome Back"
    window.dispatchEvent(
      new CustomEvent(WELCOME_EVENT, {
        detail: {
          word: "Welcome Back",
          subtitle: "Devspectra Digital Kreasi",
        },
      })
    );
    // Navigasi ke Home setelah animasi selesai (2.9s)
    setTimeout(() => router.push("/"), 300);
  };

  return (
    <Link href="/" onClick={handleClick} className="flex items-center gap-3 group" aria-label="Kembali ke Home">
      <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-white/10 shadow-sm transition-transform duration-300 group-hover:scale-105">
        <Image src={imgSrc} alt="Devspectra Avatar" width={48} height={48} className="object-cover" priority />
      </div>
      <div>
        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{name}</div>
        <div className={typingClassName}>{children}</div>
      </div>
    </Link>
  );
}
