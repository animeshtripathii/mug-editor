
import React from "react";

// Placeholder mug base image (public Unsplash, can use local later)
const MUG_IMG =
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80";

type MugPreviewProps = {
  imgUrl?: string | null;
  mugBg: string; // color or pattern
  text: string;
  textColor: string;
};

export const MugPreview: React.FC<MugPreviewProps> = ({
  imgUrl,
  mugBg,
  text,
  textColor,
}) => {
  return (
    <div className="relative" style={{ width: 340, height: 340 }}>
      {/* Drop shadow and subtle animation */}
      <div className="absolute left-1/2 -translate-x-1/2 z-0 bottom-0 w-[180px] h-[30px] bg-black/20 backdrop-blur-md rounded-full blur-sm" />
      {/* Mug base */}
      <div
        className="relative shadow-lg rounded-2xl overflow-hidden flex justify-center items-center"
        style={{
          width: 320,
          height: 320,
          background: typeof mugBg === "string" && mugBg.startsWith("#") ? mugBg : undefined,
          backgroundImage: mugBg.startsWith("url(") ? mugBg : undefined,
          transition: "background 0.3s",
        }}
      >
        {/* Mug image as faint background */}
        <img
          src={MUG_IMG}
          alt="Mug"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 pointer-events-none"
          draggable={false}
          style={{ zIndex: 1, filter: "brightness(1) saturate(1)" }}
        />
        {/* If user photo, overlay it */}
        {imgUrl && (
          <img
            src={imgUrl}
            alt="Your upload"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md rounded-md"
            style={{
              width: 136,
              height: 136,
              objectFit: "cover",
              objectPosition: "center",
              zIndex: 3,
              border: "2px solid #eee",
              background: "#fff",
              transition: "box-shadow 0.2s",
            }}
            draggable={false}
          />
        )}
        {/* If user text, overlay it too */}
        {!!text && (
          <span
            className="absolute px-3 pt-0.5 pb-0.5 rounded-full font-bold text-xl text-center"
            style={{
              left: "50%",
              top: "83%",
              transform: "translate(-50%, -50%)",
              color: textColor,
              background: "rgba(255,255,255,0.88)",
              boxShadow: "0 1px 7px 0 rgba(0,0,0,0.08)",
              zIndex: 5,
              fontFamily: "inherit",
              maxWidth: 210,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
};
