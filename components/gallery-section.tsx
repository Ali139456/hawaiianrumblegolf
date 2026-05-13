import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { media } from "@/lib/site";

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            On the course
          </h2>
          <p className="mt-3 text-lg text-muted">
            A photo-friendly tropical escape: lush landscaping, island details, and Orlando sunshine.
          </p>
        </Reveal>

        <StaggerRoot className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {media.gallery.map((src, i) => (
            <MotionItem
              key={src}
              index={i}
              lift
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <Image
                src={src}
                alt={`Hawaiian Rumble mini golf scene ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </MotionItem>
          ))}
        </StaggerRoot>
      </div>
    </section>
  );
}
