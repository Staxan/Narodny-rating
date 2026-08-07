"use client";

import { useState } from "react";
import type { Deputy } from "@/lib/types";

interface AvatarProps {
  d: Deputy;
  /** big=true — крупный аватар в карточке депутата */
  big?: boolean;
}

/**
 * Аватар депутата: фотография по кругу с плавным фолбэком на инициалы,
 * если изображение не загрузилось (важно для живучести сайта).
 */
export default function Avatar({ d, big = false }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const cls = big ? "ava-big" : "ava";
  const gradient = {
    background: `linear-gradient(135deg, ${d.avatarColor[0]}, ${d.avatarColor[1]})`,
  };

  if (d.photoUrl && !broken) {
    return (
      <div className={cls} style={gradient}>
        <img
          src={d.photoUrl}
          alt={d.fullName}
          onError={() => setBroken(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div className={cls} style={gradient}>
      {d.initials}
    </div>
  );
}
