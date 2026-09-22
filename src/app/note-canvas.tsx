"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function NoteCanvas() {
  return (
    <div className="mt-8 h-[70dvh] min-h-105 overflow-hidden rounded-2xl border border-[#e5e3dd]">
      <Tldraw />
    </div>
  );
}