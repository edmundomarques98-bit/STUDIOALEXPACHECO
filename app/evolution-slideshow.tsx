type Props = { title: string; images: string[] };

export function EvolutionSlideshow({ title, images }: Props) {
  return (
    <div className="evolution-slideshow" data-evolution-slideshow role="region" aria-roledescription="carrossel" aria-label={`Evolução: ${title}`}>
      <div className="evolution-slides" tabIndex={0} aria-label="Slides da evolução. Use as setas para navegar." aria-live="off">
        {images.map((src, index) => (
          <div className="evolution-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${images.length}`} key={src}>
            <img src={src} alt={`${title} — relato completo, slide ${index + 1} de ${images.length}`} width={1080} height={1440} loading="lazy" decoding="async" draggable={false} />
          </div>
        ))}
      </div>
      <div className="evolution-controls" hidden>
        <button type="button" data-slide-prev aria-label="Slide anterior">←</button>
        <span className="evolution-counter" data-slide-count>1 / {images.length}</span>
        <button type="button" className="evolution-pause" data-slide-pause aria-label="Pausar passagem automática">Pausar</button>
        <button type="button" data-slide-next aria-label="Próximo slide">→</button>
      </div>
    </div>
  );
}
