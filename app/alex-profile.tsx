import { whatsappUrl } from "./studio-contact";

export function AlexProfile() {
  return (
<section className="alex-section section" id="quem-e-alex" aria-labelledby="alex-title">
      <div className="container">
        <div className="alex-intro">
          <div className="alex-portrait alex-reveal">
            <span className="alex-portrait-word" aria-hidden="true">ALEX</span>
            <div className="alex-portrait-halo" aria-hidden="true"></div>
            <img src="/alex/alex-retrato.jpg" alt="Alex Pacheco de braços cruzados, vestindo a camisa do Studio" width="1385" height="1536" loading="lazy" decoding="async" />
            <div className="alex-portrait-caption"><strong>Alex Pacheco</strong><span>Fundador do Studio · Cascavel–CE</span></div>
          </div>
          <div className="alex-bio alex-reveal">
            <p className="eyebrow"><span></span> Por trás de cada evolução</p>
            <h2 id="alex-title">Quem é<br /><span>Alex Pacheco.</span></h2>
            <p className="alex-lead">Experiência para orientar.<br />Proximidade para evoluir.</p>
            <p>Natural de Itapipoca e fundador do Studio Alex Pacheco, em Cascavel, Alex reúne mais de 15 anos de atuação em Educação Física. Seu trabalho aproxima conhecimento técnico e acompanhamento humano, respeitando a história e o ritmo de cada pessoa.</p>
            <dl className="alex-credentials">
              <div><dt>15+</dt><dd>anos de atuação<br />em Educação Física</dd></div>
              <div><dt>Formação plena</dt><dd>Bacharelado e licenciatura<br />em Educação Física</dd></div>
            </dl>
            <p>Ginásticas coletivas, dança e treinamento funcional fazem parte da sua trajetória. Como personal trainer, leva essa experiência para um trabalho individualizado, com atenção à qualidade de vida e ao movimento.</p>
            <details className="alex-background"><summary>Conheça mais da sua trajetória <span aria-hidden="true">+</span></summary><div><p>Sua formação também abrange doenças crônicas e lesões no esporte. Na área acadêmica, é autor de dois artigos publicados e colaborador de um livro sobre a história da dança em Itapipoca, cidade onde começou sua trajetória.</p></div></details>
            <a className="button button-solid alex-contact" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" data-contact-source="about">Converse com Alex <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="alex-action-heading alex-reveal"><p className="eyebrow"><span></span> Movimento faz parte da história</p><h3>Quem orienta também<br /><em>vive o movimento.</em></h3></div>
        <div className="alex-actions">
          <figure className="alex-action alex-reveal" data-alex-depth>
            <div className="alex-action-scene"><span className="alex-action-number" aria-hidden="true">01</span><div className="alex-action-orbit" aria-hidden="true"></div><div className="alex-depth-layer"><img src="/alex/alex-pneu-alto.jpg" alt="Alex Pacheco em treino, sustentando um pneu acima da cabeça" width="1152" height="1536" loading="lazy" decoding="async" /></div></div>
            <figcaption><strong>Força em movimento.</strong><span>Vivência prática que acompanha sua trajetória profissional.</span></figcaption>
          </figure>
          <figure className="alex-action alex-reveal" data-alex-depth>
            <div className="alex-action-scene"><span className="alex-action-number" aria-hidden="true">02</span><div className="alex-action-orbit" aria-hidden="true"></div><div className="alex-depth-layer"><img src="/alex/alex-pneu-apoio.jpg" alt="Alex Pacheco em uma pose de treino com um pé apoiado no pneu" width="1536" height="1152" loading="lazy" decoding="async" /></div></div>
            <figcaption><strong>Uma vida dedicada a ensinar.</strong><span>Da dança ao funcional, uma relação próxima com o corpo e suas possibilidades.</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
