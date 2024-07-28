import React, { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
}

function BackgroundMusic(props: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Speaker Icons in White
  const SpeakerOnIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 5 2 9 2 15 6 19 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      <path d="M23 9a7 7 0 0 0 0 6"></path>
    </svg>
  );

  const SpeakerOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="1" x2="23" y2="23"></line>
      <path d="M9 9v6h6l3 3V6l-2 2"></path>
      <path d="M16.83 14.83c0-1.66 1.34-3 3-3"></path>
    </svg>
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio
          .play()
          .catch((error) => console.error("Error playing the audio", error));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src={props.src} loop preload="auto" />
      <button
        onClick={togglePlay}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {isPlaying ? (
          <div className="flex flex-row gap-2">
            <div className="rounded-full border-2 border-white">
              <div className="p-1">
                <SpeakerOnIcon />{" "}
              </div>
            </div>
            <p className="text-white font-semibold">Sound On</p>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <div className="rounded-full border-2 border-white">
              <div className="p-1">
                <SpeakerOffIcon />{" "}
              </div>
            </div>
            <p className="text-white font-semibold">Sound Off</p>
          </div>
        )}
      </button>
    </>
  );
}

export default BackgroundMusic;
