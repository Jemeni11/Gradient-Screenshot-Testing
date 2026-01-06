import type { CSSProperties, Ref } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import { screenshot } from "@renoun/screenshot";

const defaultGradients = [
  `linear-gradient(
    180deg,
    lch(93.75% 1.56 96.9deg) 0%,
    lch(61.64% 57.44 1.54deg) 100%
  )`,
  "linear-gradient(90deg in oklch, oklch(59.327% 0.1897 254.84), oklch(92.065% 0.00256 228.79))",
  "linear-gradient(90deg, #cd7c69, #060505)",
  "radial-gradient(ellipse at center in oklch, oklch(23.443% 0.03062 283.79), oklch(84.585% 0.04349 297.27))",
  "linear-gradient(90deg, #141414, #d4d4d4)",
  "radial-gradient(circle at right top in hwb, hwb(356.1 34.118% 17.647%), hwb(260 1.5686% 97.255%))",
  "radial-gradient(circle at center in hwb, hwb(36 75.686% 20.392%), hwb(18.75 7.8431% 73.333%))",
  "linear-gradient(90deg in oklch, oklch(21.43% 0.03516 283.03), oklch(43.151% 0.18211 275.26), oklch(81.435% 0.00883 349.3), oklch(50.208% 0.0137 334.33), oklch(70.969% 0.09311 255.44))",
];

export default function App() {
  const index = Math.floor(Math.random() * defaultGradients.length);
  const gradientString = defaultGradients[index];

  const gradientRef = useRef<HTMLDivElement>(null);

  const handleNewDownload = async () => {
    if (!gradientRef.current) return;

    try {
      const blob = await screenshot.blob(gradientRef.current, {
        format: "png",
        scale: 2,
        backgroundColor: null, // Transparent background
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gradient-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download gradient:", error);
    }
  };

  return (
    <div className="w-full">
      <main className="mt-6">
        <h1 className="mx-auto mb-4 w-fit scroll-m-20 font-aladin text-4xl font-extrabold tracking-tight">Gradie Testing</h1>
        <GradientPreview ref={gradientRef} gradient={gradientString} className="mx-auto my-8 w-[45%] border border-solid border-gradie-1" />
        <div className="mx-auto flex w-3/4 items-center justify-center gap-8">
          <button className="max-w-36 rounded-xl bg-primary px-8 py-4 text-white" onClick={handleNewDownload}>
            new lib
          </button>
          <button className="max-w-36 rounded-xl bg-black px-8 py-4 text-white">old lib</button>
        </div>
      </main>
    </div>
  );
}

function GradientPreview({
  gradient,
  ref,
  className,
  styles,
}: {
  gradient: string;
  ref?: Ref<HTMLDivElement>;
  className?: string;
  styles?: Partial<Omit<CSSProperties, "backgroundImage">>;
}) {
  return (
    <div
      ref={ref}
      className={cn("aspect-video w-full rounded-lg", className)}
      style={{
        backgroundImage: gradient,
        transform: "translate3d(0,0,0)",
        ...styles,
      }}
    />
  );
}
