import { BrandMark } from "@/components/BrandMark";

export function AuthSplit({
  photo,
  caption,
  children,
}: {
  photo: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-[#f4efe6] lg:grid-cols-2">
      <div className="relative hidden min-h-screen overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          className="dp-kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        <div className="absolute left-10 right-10 top-10">
          <BrandMark invert />
        </div>
        <p className="dp-display absolute bottom-12 left-10 right-16 text-4xl leading-tight text-white">
          {caption}
        </p>
      </div>
      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandMark />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
