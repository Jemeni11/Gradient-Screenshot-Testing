import type { CSSProperties, Ref } from "react";
import { useRef, useState } from "react";

import { domToBlob } from "modern-screenshot";

import { cn } from "@/lib/utils";
import { screenshot } from "@renoun/screenshot";

import copyToClipboard from "./copyToClipboard";

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
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%, #feada6 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
  "radial-gradient(circle at top right, #ff0080, #7928ca, #0070f3)",
  "linear-gradient(135deg, #0093e9 0%, #80d0c7 100%)",
  "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)",
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  "conic-gradient(from 180deg at 50% 50%, #ff0080 0deg, #7928ca 120deg, #0070f3 240deg, #ff0080 360deg)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
  "linear-gradient(to top, #09203f 0%, #537895 100%)",
  "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #e17055 100%)",
  "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(135deg, #37ecba 0%, #72afd3 100%)",
  "linear-gradient(135deg, #ebbba7 0%, #cfc7f8 100%)",
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gradientString = defaultGradients[currentIndex];
  const gradientRef = useRef<HTMLDivElement>(null);

  const handleNewDownload = async () => {
    if (!gradientRef.current) return;

    try {
      const blob = await screenshot.blob(gradientRef.current, {
        format: "png",
        scale: 2,
        backgroundColor: null,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gradient-new-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download gradient:", error);
    }
  };

  const handleOldDownload = async () => {
    if (!gradientRef.current) return;

    try {
      const blob = await domToBlob(gradientRef.current, {
        scale: 2,
        backgroundColor: null,
      });

      if (!blob) {
        throw new Error("Failed to generate blob");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gradient-old-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download gradient:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="h-full w-64 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
        <h2 className="mb-4 font-aladin text-xl font-bold">Gradients</h2>
        <div className="flex flex-col gap-2">
          {defaultGradients.map((gradient, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-16 w-full cursor-pointer rounded-lg border-2 transition-all hover:scale-105",
                currentIndex === index ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent",
              )}
              style={{
                backgroundImage: gradient,
                transform: "translate3d(0,0,0)",
              }}
              aria-label={`Select gradient ${index + 1}`}
            />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <h1 className="mb-8 scroll-m-20 font-aladin text-4xl font-extrabold tracking-tight">Gradie Testing</h1>

        <div className="w-full max-w-3xl">
          <GradientPreview ref={gradientRef} gradient={gradientString} className="w-full" />
        </div>

        <p
          onClick={() => copyToClipboard(gradientString)}
          className="my-6 max-w-3xl cursor-pointer text-center font-aladin text-lg font-bold break-all text-black hover:text-primary"
        >
          {gradientString}
        </p>

        <div className="flex items-center justify-center gap-8">
          <button className="rounded-xl bg-primary px-8 py-4 text-white hover:opacity-90" onClick={handleNewDownload}>
            new lib
          </button>
          <button className="rounded-xl bg-black px-8 py-4 text-white hover:opacity-90" onClick={handleOldDownload}>
            old lib
          </button>
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
