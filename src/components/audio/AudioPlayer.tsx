import { useRef, useState, useEffect } from "react";
import type { AudioResource } from "@app-types/resource";

type Props = {
  audio?: AudioResource;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ audio }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onDuration = () => setDuration(el.duration);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDuration);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDuration);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Number(e.target.value);
    setCurrentTime(el.currentTime);
  };

  const remaining = duration - currentTime;
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player" id="audio">
      <button className="play-button" type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>
        {playing ? "Ⅱ" : "▶"}
      </button>
      <strong className="audio-title">{audio?.title ?? "Escuchar el estudio de hoy"}</strong>
      <span className="audio-sep">|</span>
      <div className="audio-track">
        <div className="audio-progress-bar" style={{ width: `${pct}%` }}></div>
        <input
          className="audio-progress"
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={seek}
          aria-label="Progreso del audio"
        />
      </div>
      <span className="audio-time">{remaining > 0 ? `-${formatTime(remaining)}` : ""}</span>
      <span className="audio-lang">Audio resume by <i>sabbath-school.adventech.io</i></span>
      {audio?.url && <audio ref={audioRef} src={audio.url} preload="none" />}
    </div>
  );
}
