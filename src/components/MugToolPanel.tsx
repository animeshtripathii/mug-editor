
import React from "react";
import { Input } from "@/components/ui/input";
import { ImageDropzone } from "./ui/ImageDropzone";
import { Label } from "@/components/ui/label";

type Props = {
  mugText: string;
  setMugText: (s: string) => void;
  textColor: string;
  setTextColor: (c: string) => void;
  uploadedImg: string | null;
  setUploadedImg: (u: string | null) => void;
};

export const MugToolPanel: React.FC<Props> = ({
  mugText,
  setMugText,
  textColor,
  setTextColor,
  uploadedImg,
  setUploadedImg,
}) => {
  return (
    <div className="bg-white/90 shadow-lg border rounded-xl px-6 py-6">
      <h3 className="text-lg font-bold mb-4 text-gray-900">Personalize Your Mug</h3>
      {/* Upload */}
      <div className="mb-5">
        <Label className="font-semibold mb-1 text-sm text-gray-700 block">1. Add a photo</Label>
        <ImageDropzone
          value={uploadedImg}
          onChange={setUploadedImg}
        />
      </div>

      {/* Text */}
      <div className="mb-5">
        <Label className="font-semibold mb-1 text-sm text-gray-700 block">2. Add a message</Label>
        <Input
          placeholder="Your text e.g. World's Best Dad"
          value={mugText}
          onChange={(e) => setMugText(e.target.value)}
          maxLength={32}
          className="w-full"
        />
      </div>

      {/* Color picker */}
      <div>
        <Label className="font-semibold mb-1 text-sm text-gray-700 block">3. Message color</Label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="h-8 w-14 cursor-pointer bg-transparent border-none outline-none mt-1"
          style={{ background: "none" }}
          title="Pick text color"
        />
      </div>
    </div>
  );
};
