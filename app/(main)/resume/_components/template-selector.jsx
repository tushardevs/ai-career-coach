"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const templates = [
  {
    id: "classic",
    name: "AutoCV",
    description: "A simple, clean CV template.",
    thumbnail: "/templates/classic.png", // put preview image here
  },
  {
    id: "modern",
    name: "Marissa Mayer CV",
    description: "Inspired by Business Insider's CV of Marissa Mayer.",
    thumbnail: "/templates/modern.png",
  },
  {
    id: "creative",
    name: "AltaCV",
    description: "Creative timeline style CV (AwesomeCV inspired).",
    thumbnail: "/templates/creative.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and elegant one-page resume.",
    thumbnail: "/templates/minimal.png",
  },
];

export default function TemplateSelector() {
  const router = useRouter();

  const handleSelect = (id) => {
    router.push(`/resume?template=${id}`);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Choose Your Resume Template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((t) => (
          <div
            key={t.id}
            className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-white"
            onClick={() => handleSelect(t.id)}
          >
            <div className="relative h-72 w-full">
              <Image
                src={t.thumbnail}
                alt={t.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              <p className="text-sm text-gray-600">{t.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
