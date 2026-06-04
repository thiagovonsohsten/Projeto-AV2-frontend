import { useState } from "react";

const VIDEO_ID = "jQx6wItPuSo";

export default function YouTubeFacade() {
  const [carregado, setCarregado] = useState(false);

  if (carregado) {
    const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
    return (
      <div className="video-wrap">
        <iframe
          src={src}
          title="Vídeo institucional no YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="video-wrap video-wrap--facade">
      <button
        type="button"
        className="video-facade-btn"
        onClick={() => setCarregado(true)}
        aria-label="Carregar vídeo do YouTube incorporado"
      >
        <img
          className="video-facade-thumb"
          src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
          alt="Capa do vídeo institucional no YouTube"
          width="480"
          height="360"
        />
        <span className="video-facade-play" aria-hidden="true">
          <span className="video-facade-play-icon">▶</span>
          <span className="video-facade-play-text">Assistir aqui</span>
        </span>
      </button>
    </div>
  );
}
