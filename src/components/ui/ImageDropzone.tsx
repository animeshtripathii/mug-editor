
import React, { useRef } from "react";
import { Upload } from "lucide-react";

type Props = {
  value: string | null;
  onChange: (img: string | null) => void;
};

export const ImageDropzone: React.FC<Props> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      onChange(url);
    };
    reader.readAsDataURL(f);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    handleFile(f ?? null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    handleFile(f ?? null);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="flex flex-col gap-1">
      {value ? (
        <div className="group relative w-32 h-32 mx-auto mb-2 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center overflow-hidden hover:opacity-80 transition">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover object-center"
          />
          <button
            type="button"
            className="absolute top-1 right-1 text-xs bg-white/80 rounded px-1.5 py-0.5 shadow hover:bg-red-100 text-red-700 font-bold transition"
            onClick={() => onChange(null)}
          >
            ×
          </button>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="button"
          className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground h-32 w-32 rounded-lg cursor-pointer hover:bg-accent transition relative"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Upload className="w-7 h-7 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">Drag & drop<br />or click to upload</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={onInputChange}
        aria-label="Upload image"
      />
    </div>
  );
};
