import Image from "next/image";
import { media } from "@/lib/site";

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            On the course
          </h2>
          <p className="mt-3 text-lg text-muted">
            A photo-friendly tropical escape—lush landscaping, island details, and Orlando sunshine.
          </p>
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {media.gallery.map((src, i) => (
            <div
              key={src}
              className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm ${
                i % 3 === 1 ? "lg:mt-8" : ""
              }`}
            >
              <Image
                src={src}
                alt={`Hawaiian Rumble mini golf scene ${i + 1}`}
                width={800}
                height={1100}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
