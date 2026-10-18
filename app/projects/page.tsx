"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { projectStyles as p } from "@/public/dummyStyles";
import Reveal from "@/app/components/Reveal";

type Category = "Media" | "IT";

type Project = {
  title: string;
  description: string;
  image: string;
  status: "active" | "archived";
  category: Category;
  tags: string[];
  canvaUrl: string;
};

const CANVA_URL = "https://canva.link/bn3xmd31bc6rlxe";

const projects: Project[] = [
  // ── IT ──────────────────────────────────────────────────────────────
  {
    title: "Pemesanan Tiket Bus Online",
    description: "Design aplikasi Mobile pemesanan tiket bus pada tugas Akhir kampus.",
    image: "/projects/tiket-bus.png",
    status: "archived",
    category: "IT",
    tags: ["UI/UX", "Mobile", "Figma"],
    canvaUrl: CANVA_URL,
  },
  {
    title: "BRAKA",
    description: "Design aplikasi Mobile pemesanan tiket bus (BRAKA) pada tugas Akhir kampus.",
    image: "/projects/braka.png",
    status: "archived",
    category: "IT",
    tags: ["UI/UX", "Mobile", "Figma"],
    canvaUrl: CANVA_URL,
  },
  {
    title: "Xayara Indonesia",
    description: "Sistem fitur website layanan jasa servis AC — instalasi, perawatan, dan perbaikan berbagai AC Split, Cassette, Window, dan lainnya.",
    image: "/projects/xayara.png",
    status: "active",
    category: "IT",
    tags: ["Web Developer", "Next.js", "Full Stack"],
    canvaUrl: CANVA_URL,
  },
  {
    title: "Stok Produk UMKM",
    description: "Website UMKM stock barang — request dari mahasiswa Sistem Informasi Universitas Komputer Indonesia.",
    image: "/projects/stok-umkm.png",
    status: "archived",
    category: "IT",
    tags: ["Web Developer", "UNIKOM", "Laravel"],
    canvaUrl: CANVA_URL,
  },
  {
    title: "Myanature",
    description: "Website pengelola limbah rumah tangga — membantu masyarakat dalam mengelola dan mendaur ulang limbah secara mandiri.",
    image: "/projects/myanature.png",
    status: "active",
    category: "IT",
    tags: ["Web Developer", "Lingkungan", "UMKM"],
    canvaUrl: CANVA_URL,
  },
  {
    title: "Website Promosi UMKM",
    description: "Website UMKM untuk membantu mempromosikan produk dan jualannya.",
    image: "/projects/indihome-umkm.png",
    status: "active",
    category: "IT",
    tags: ["Client UMKM", "Web Developer", "Promosi"],
    canvaUrl: CANVA_URL,
  },
  {
    title: "SIPKA",
    description: "Sistem pelaporan kepolisian atasan dan anggota dari Kepolisian Jawa Tengah.",
    image: "/projects/sipka.png",
    status: "active",
    category: "IT",
    tags: ["Android Developer", "Mobile", "Kepolisian"],
    canvaUrl: CANVA_URL,
  },
];

const filters: Array<"Semua" | Category> = ["Semua", "Media", "IT"];

const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12v16l-6-4-6 4z" />
  </svg>
);

function ProjectsContent() {
  const searchParams = useSearchParams();
  const active = (searchParams.get("category") ?? "") as "" | Category;

  const visibleProjects = active
    ? projects.filter((proj) => proj.category === active)
    : projects;

  return (
    <div className={p.pageContainer}>
      <div className={p.innerContainer}>
        <header className={p.header}>
          <Reveal as="h1" className={p.pageTitle}>Projects</Reveal>
          <Reveal as="p" delay={100} className={p.pageSubtitle}>
            Playground — dari MVP kecil sampai aplikasi production.
            {active && (
              <span className="ml-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {active}
              </span>
            )}
          </Reveal>
        </header>

        <div className={p.projectsGrid}>
          {visibleProjects.map((proj, i) => (
            <Reveal key={proj.title} as="article" variant="scale" delay={i * 100} className={p.projectCard}>
              <div className={p.imageContainer}>
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={p.projectImage}
                />
                <div className={p.statusBadgeContainer}>
                  <span
                    className={`${p.statusBadge} ${
                      proj.status === "active" ? p.statusActive : p.statusInactive
                    }`}
                  >
                    {proj.category}
                  </span>
                </div>
                <button type="button" aria-label="Bookmark" className={p.bookmarkButton}>
                  <BookmarkIcon className={p.bookmarkIcon} />
                </button>
              </div>

              <div className={p.contentSection}>
                <h2 className={p.projectTitle}>{proj.title}</h2>
                <p className={p.projectDescription}>{proj.description}</p>

                <div className={p.tagsContainer}>
                  {proj.tags.map((tag) => (
                    <span key={tag} className={p.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={p.actionsContainer}>
                  <div className={p.actionsLinksContainer}>
                    <a
                      href={proj.canvaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={p.visitButton}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4 flex-shrink-0">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.54 18.3c-1.178 0-2.21-.468-2.96-1.22l1.04-1.04c.496.497 1.18.8 1.92.8 1.496 0 2.712-1.215 2.712-2.712 0-.74-.303-1.424-.8-1.92l1.04-1.04c.752.75 1.22 1.782 1.22 2.96 0 2.31-1.872 4.172-4.172 4.172zm4.98-4.98l-1.04 1.04a2.703 2.703 0 00-.8-1.92c-.496-.496-1.18-.8-1.92-.8-1.496 0-2.712 1.216-2.712 2.712 0 .74.304 1.424.8 1.92l-1.04 1.04A4.153 4.153 0 017.54 14.13c0-2.3 1.872-4.172 4.172-4.172 1.154 0 2.2.47 2.96 1.22l-1.04 1.04a2.703 2.703 0 00-1.92-.8c-1.496 0-2.712 1.216-2.712 2.712 0 1.497 1.216 2.712 2.712 2.712.74 0 1.424-.303 1.92-.8l1.04 1.04a4.153 4.153 0 01-2.96 1.22c-2.3 0-4.172-1.872-4.172-4.172s1.872-4.172 4.172-4.172c1.154 0 2.2.47 2.96 1.22z"/>
                      </svg>
                      Lihat di Canva
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <p className="mt-12 text-center text-zinc-500">
            Belum ada proyek pada kategori ini.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <Suspense fallback={
      <div className={p.pageContainer}>
        <div className={p.innerContainer}>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
