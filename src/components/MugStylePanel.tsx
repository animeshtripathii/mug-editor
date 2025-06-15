
import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type PresetProps = {
  preset: "classic" | "color" | "pattern";
  setPreset: (p: "classic" | "color" | "pattern") => void;
};

const presets = [
  {
    key: "classic" as const,
    name: "Classic White",
    color: "#fff",
    desc: "Simple, timeless and lets your photo & text shine.",
  },
  {
    key: "color" as const,
    name: "Sunrise Yellow",
    color: "#ffe27a",
    desc: "Brighten mornings with cheerful color.",
  },
  {
    key: "pattern" as const,
    name: "Funny Sheep",
    img: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=60&q=30",
    desc: "Quirky sheep for animal lovers.",
  },
];

export const MugStylePanel: React.FC<PresetProps> = ({ preset, setPreset }) => {
  return (
    <aside className="flex flex-col bg-white/95 border shadow-lg rounded-xl px-5 py-6 min-h-[410px] max-w-xs">
      <h3 className="text-lg font-bold mb-5 text-gray-900 flex items-center">
        <Info className="w-5 h-5 mr-2 text-muted-foreground" />
        Mug Styles
      </h3>
      <ul className="space-y-4">
        {presets.map((p) => (
          <li
            key={p.key}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border hover:shadow hover-scale select-none",
              preset === p.key
                ? "border-primary bg-primary/10"
                : "border-transparent bg-transparent"
            )}
            onClick={() => setPreset(p.key)}
            tabIndex={0}
            aria-label={p.name}
          >
            {p.img ? (
              <img
                src={p.img}
                alt={p.name}
                className="w-10 h-10 rounded shadow"
              />
            ) : (
              <span
                className="w-10 h-10 rounded shadow border"
                style={{ background: p.color, display: "inline-block" }}
              />
            )}
            <div>
              <div className="font-medium text-gray-800">{p.name}</div>
              <div className="text-xs text-gray-500">{p.desc}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-xs text-muted-foreground mt-8">
        More styles coming soon.
      </div>
    </aside>
  );
};
