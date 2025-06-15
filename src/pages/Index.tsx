
import React, { useState } from "react";
import { MugToolPanel } from "../components/MugToolPanel";
import { MugStylePanel } from "../components/MugStylePanel";
import { BuyButton } from "../components/BuyButton";
import { Pin, ArrowLeft } from "lucide-react";
import { Mug3DPreview } from "../components/Mug3DPreview";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { MugPreview } from "../components/MugPreview"; // Not used now

const Index = () => {
  // Mug customization state
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [mugText, setMugText] = useState<string>("");
  const [textColor, setTextColor] = useState("#3455ff");
  const [preset, setPreset] = useState<"classic" | "color" | "pattern">("classic");

  // Presets could affect mug background color or style
  const mugBg =
    preset === "classic"
      ? "#fff"
      : preset === "color"
      ? "#ffe27a"
      : "url('https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=600&q=80')"; // sheep photo pattern

  const threeColor =
    preset === "classic"
      ? "#fff"
      : preset === "color"
      ? "#ffe27a"
      : "#ffffff";

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      {/* Hero/Header */}
      <header className="w-full shadow-sm z-30 flex-none">
        <nav className="flex items-center px-8 py-4 bg-white border-b">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Pin className="mr-3 text-primary" size={32} />
          <span className="text-2xl font-extrabold tracking-wide mr-12 text-gray-900 select-none">LovablePrint Mugs</span>
          <span className="text-muted-foreground font-medium text-base ml-2 hidden md:inline">
            Design your personalized mug in seconds — just like Vistaprint.
          </span>
        </nav>
      </header>

      {/* Main 3-column layout */}
      <main className="flex-1 w-full flex flex-row gap-6 px-6 py-8 max-w-[1550px] mx-auto">
        {/* Left: Style Presets */}
        <section className="hidden lg:block w-64 flex-shrink-0">
          <MugStylePanel preset={preset} setPreset={setPreset} />
        </section>

        {/* Center: Mug Preview (swapped to 3D model!) */}
        <section className="flex-1 flex flex-col items-center">
          <div className="w-full mb-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">
              Preview Your Mug
            </h2>
            <div className="text-sm text-muted-foreground text-center max-w-[400px]">
              Drag &amp; drop a photo, add a message, and see your creation instantly.
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-full min-h-[350px]">
            <Mug3DPreview mugColor={threeColor} imgUrl={uploadedImg} />
          </div>
        </section>

        {/* Right: Tools */}
        <aside className="w-full lg:w-96 max-w-full flex-shrink-0">
          <div className="sticky top-9">
            <MugToolPanel
              mugText={mugText}
              setMugText={setMugText}
              textColor={textColor}
              setTextColor={setTextColor}
              uploadedImg={uploadedImg}
              setUploadedImg={setUploadedImg}
            />
            <div className="mt-8 flex justify-center">
              <BuyButton />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
