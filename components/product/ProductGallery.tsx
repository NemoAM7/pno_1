'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex aspect-square items-end overflow-hidden rounded-[2rem] bg-moss p-8 text-paper">
        {activeImage && !imageFailed ? (
          <Image src={activeImage} alt={name} width={1000} height={1000} className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
        ) : (
          <p className="max-w-xs text-6xl font-black leading-[0.85] tracking-[-0.08em]">{name}</p>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image) => (
            <button key={image} type="button" onClick={() => { setActiveImage(image); setImageFailed(false); }} className="h-20 w-20 rounded-xl bg-moss/15 p-2" aria-label={`View ${name}`}>
              <Image src={image} alt="" width={160} height={160} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
