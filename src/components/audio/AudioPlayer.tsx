import { useRef, useState, useEffect } from "react";
import type { AudioResource } from "@app-types/resource";

type Props = {
  audio?: AudioResource;
};

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
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

  const skip = (delta: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.min(duration, Math.max(0, el.currentTime + delta));
    setCurrentTime(el.currentTime);
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remaining = duration - currentTime;

  return (
    <div className="audio-player" id="audio">
      <div className="audio-controls">
        <button className="audio-btn skip-btn" type="button" onClick={() => skip(-10)} aria-label="Retroceder 10s" title="−10s">
          ⟲
        </button>
        <button className="audio-btn play-btn" type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>
          {playing ? "Ⅱ" : "▶"}
        </button>
        <button className="audio-btn skip-btn" type="button" onClick={() => skip(10)} aria-label="Adelantar 10s" title="+10s">
          ⟳
        </button>
      </div>
      <div className="audio-body">
        <span className="audio-label">
          {audio?.title ?? "Audio de la lectura"}
        </span>
        <div className="audio-bar">
          <span className="audio-time-current">{formatTime(currentTime)}</span>
          <div className="audio-progress-wrap">
            <div className="audio-progress-fill" style={{ width: `${pct}%` }}></div>
            <input
              className="audio-progress-input"
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={seek}
              aria-label="Progreso del audio"
            />
          </div>
          <span className="audio-time-remaining">−{formatTime(remaining)}</span>
        </div>
      </div>
      {audio?.url && <audio ref={audioRef} src={audio.url} preload="none" />}
    </div>
  );
}
