"use client";
import './TestimonialVideos.css';

import { useState } from "react";
import { pushEvent } from "@/lib/analytics";
import styles from "./TestimonialVideos.module.css";

export default function TestimonialVideos() {
  const [played, setPlayed] = useState<Record<string, boolean>>({});

  const handlePlay = (id: string) => {
    if (!played[id]) {
      setPlayed(prev => ({ ...prev, [id]: true }));
      pushEvent("testimonial_play", { video_id: id });
    }
  };

  const handleEnded = (id: string) => {
    pushEvent("testimonial_complete", { video_id: id });
  };

  return (
    <div className="vids">
      <figure className="vid">
        <video controls playsInline preload="none" poster="/video-1-poster.jpg" data-testi="client-1"
               src="/video-1.mp4#t=0.5"
               onPlay={() => handlePlay("client-1")}
               onEnded={() => handleEnded("client-1")}></video>
        <figcaption>ACE LAW CLIENT</figcaption>
      </figure>
      <figure className="vid">
        <video controls playsInline preload="none" poster="/video-2-poster.jpg" data-testi="client-2"
               src="/video-2.mp4#t=0.5"
               onPlay={() => handlePlay("client-2")}
               onEnded={() => handleEnded("client-2")}></video>
        <figcaption>ACE LAW CLIENT</figcaption>
      </figure>
    </div>
  );
}
