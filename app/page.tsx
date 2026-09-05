import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { MotionController } from "./motion-controller";

const individualPlans = [
  { days: "3 dias", price: "100", note: "3 dias da sua escolha", featured: false },
  { days: "4 dias", price: "120", note: "4 dias da sua escolha", featured: true },
  { days: "5 dias", price: "150", note: "De segunda a sexta", featured: false },
];

const couplePlans = [
  { days: "3 dias", price: "180", note: "Treinem 3 dias por semana" },
  { days: "4 dias", price: "220", note: "Treinem 4 dias por semana" },
  { days: "5 dias", price: "280", note: "De segunda a sexta" },
];

const evolutions = [
  {
    number: "−35 kg",
    title: "De 109 kg a 74 kg",
    text: "Uma mudança que começou na rotina e transformou a relação com a alimentação, o corpo e a autoestima.",
    image: "/evolucoes/evolucao-35kg.webp",
    imageClass: "",
    alt: "Aluna do Studio Alex Pacheco celebrando sua evolução física",
  },
  {
    number: "−22 kg",
    title: "De 114 kg a 92 kg",
    text: "O retorno ao movimento virou constância, confiança e disposição para retomar o que antes parecia distante.",
    image: "/evolucoes/evolucao-22kg.webp",
    imageClass: "evolution-photo-portrait",
    alt: "Aluno do Studio Alex Pacheco mostrando sua evolução durante o treino",
  },
  {
    number: "−16 kg",
    title: "Mais leve. Mais confiante.",
    text: "Um processo construído com persistência, novos hábitos e acompanhamento em cada fase da evolução.",
    image: "/evolucoes/evolucao-16kg.webp",
    imageClass: "evolution-photo-art",
    alt: "Comparativo de evolução com 16 quilos eliminados",
  },
  {
    number: "100%",
    title: "Movimento recuperado",
    text: "Depois de uma lesão no joelho, o fortalecimento progressivo devolveu segurança para treinar e viver melhor.",
    image: "/evolucoes/evolucao-movimento-recuperado.webp",
    imageClass: "evolution-photo-knee",
    alt: "Aluno do Studio que recuperou o movimento após uma lesão no joelho",
  },
  {
    "number": "−28 kg",
    "title": "De 135 kg a 107 kg",
    "text": "Uma história de mudança construída com treino, autocuidado e a confiança de continuar evoluindo.",
    "image": "/evolucoes/evolucao-28kg.webp",
    "imageClass": "evolution-photo-portrait",
    "alt": "Aluna no Studio, na etapa de 107 kg registrada em seu relato de evolução"
  },
  {
    "number": "−18 kg",
    "title": "Sandrinha: de 87 kg a 69 kg",
    "text": "Além dos 18 kg eliminados, Sandrinha conquistou sua primeira corrida de 4,10 km. Mais um desafio vencido.",
    "image": "/evolucoes/evolucao-sandrinha-18kg.webp",
    "imageClass": "evolution-photo-complete",
    "alt": "Arte da evolução de Sandrinha com sua foto e o resultado de 87 kg para 69 kg"
  },
  {
    "number": "−10,7 kg",
    "title": "De 66,5 kg a 55,8 kg",
    "text": "Uma conquista que vai além da balança, celebrada com movimento, gratidão e orgulho de cada etapa.",
    "image": "/evolucoes/evolucao-107kg.webp",
    "imageClass": "evolution-photo-portrait",
    "alt": "Aluna com sua medalha na foto usada no relato de 10,7 kg eliminados"
  },
  {
    "number": "Recomeço",
    "title": "Rita: orgulho da própria história",
    "text": "Mesmo sem se sentir pronta, Rita decidiu tentar. Hoje, agradece à mulher que não desistiu de si mesma.",
    "image": "/evolucoes/evolucao-rita.webp",
    "imageClass": "evolution-photo-rita",
    "alt": "Rita sorrindo na foto de seu depoimento de evolução"
  },
  {
    "number": "9 meses",
    "title": "Futebol do início ao fim",
    "text": "Antes, correr cinco minutos era difícil. Após nove meses de constância, voltou a jogar uma partida inteira, com mais condicionamento.",
    "image": "/evolucoes/evolucao-futebol.webp",
    "imageClass": "evolution-photo-football",
    "alt": "Aluno com uniforme de futebol número 12, do relato de nove meses de evolução"
  },
  {
    "number": "Na pista",
    "title": "Do funcional às conquistas",
    "text": "A busca por mais saúde se transformou em evolução esportiva, superação e conquistas nas corridas.",
    "image": "/evolucoes/evolucao-corrida.webp",
    "imageClass": "evolution-photo-portrait",
    "alt": "Corredor do Studio durante uma prova, fotografado no material de sua evolução esportiva"
  },
  {
    "number": "−15,7 kg",
    "title": "Evolução em 4 meses e 18 dias",
    "text": "A avaliação registrou também 13 cm a menos de cintura e 11 cm de abdômen. Cada medida representa uma etapa do processo.",
    "image": "/evolucoes/evolucao-avaliacao.webp",
    "imageClass": "evolution-photo-complete",
    "alt": "Antes e depois da avaliação de quatro meses e dezoito dias, com 15,7 kg eliminados"
  },
];

const weekdayVideos = [
  { day: "SEG", number: "01", label: "Segunda-feira", video: "/videos/segunda.mp4" },
  { day: "TER", number: "02", label: "Terça-feira", video: "/videos/terca.mp4" },
  { day: "QUA", number: "03", label: "Quarta-feira", video: "/videos/quarta.mp4" },
  { day: "QUI", number: "04", label: "Quinta-feira", video: "/videos/quinta.mp4" },
  { day: "SEX", number: "05", label: "Sexta-feira", video: "/videos/sexta.mp4" },
];

function BrandMark() {
  return (
    <a className="brand" href="#inicio" aria-label="Studio Alex Pacheco — início">
      <span className="brand-symbol">AP</span>
      <span className="brand-copy">
        <strong>Alex Pacheco</strong>
        <small>Studio funcional</small>
      </span>
    </a>
  );
}

function PriceCard({
  plan,
  kind,
}: {
  plan: (typeof individualPlans)[number] | (typeof couplePlans)[number];
  kind: "Individual" | "Casal";
}) {
  const featured = "featured" in plan && plan.featured;

  return (
    <article className={`price-card ${featured ? "price-card-featured" : ""}`} data-reveal="card">
      {featured ? <span className="popular-label">Mais escolhido</span> : null}
      <div className="price-card-top">
        <span>{kind}</span>
        <strong>{plan.days}</strong>
      </div>
      <div className="price-value">
        <span>R$</span>
        <strong>{plan.price}</strong>
        <small>/mês</small>
      </div>
      <ul>
        <li><Check size={17} aria-hidden="true" /> {plan.note}</li>
        <li><Check size={17} aria-hidden="true" /> Programação semanal</li>
        <li><Check size={17} aria-hidden="true" /> Evolução acompanhada</li>
      </ul>
      <a className={featured ? "button button-solid" : "button button-outline"} href="#como-comecar">
        Escolher programa <ArrowRight size={17} aria-hidden="true" />
      </a>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <MotionController />
      <header className="site-header">
        <div className="container header-inner">
          <BrandMark />
          <nav aria-label="Navegação principal">
            <a href="#evolucoes">Evoluções</a>
            <a href="#programas">Programas</a>
            <a href="#dias">Dias de treino</a>
          </nav>
          <a className="header-cta" href="#programas">
            Ver valores <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-media" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Treinamento funcional em Acopiara</p>
            <h1 className="hero-title">
              <span>Seu progresso</span>
              <span>vai <em>muito além</em></span>
              <span>da balança.</span>
            </h1>
            <p className="hero-lead">
              Programas de treino que respeitam seu nível, sua rotina e o resultado que você quer construir.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#programas">
                Conhecer programas <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#evolucoes">Ver histórias de evolução</a>
            </div>
            <div className="hero-proof" aria-label="Destaques do Studio">
              <div><strong>3–5</strong><span>dias por semana</span></div>
              <div><strong>Todos</strong><span>os níveis</span></div>
              <div><strong>Real</strong><span>acompanhamento</span></div>
            </div>
          </div>

          <aside className="hero-card">
            <div className="hero-card-icon"><Dumbbell size={22} aria-hidden="true" /></div>
            <span>Programa individual</span>
            <strong>A partir de</strong>
            <div className="hero-price"><small>R$</small> 100 <em>/mês</em></div>
            <a href="#programas">Comparar programas <ArrowRight size={16} /></a>
          </aside>
        </div>
        <div className="hero-bottom-line" />
      </section>

      <section className="principles" aria-label="Como o Studio trabalha" data-reveal="section">
        <div className="container principles-grid">
          <article>
            <HeartPulse aria-hidden="true" />
            <div><strong>Treino para a vida real</strong><span>Mais força, mobilidade e disposição.</span></div>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" />
            <div><strong>Progressão com segurança</strong><span>Respeito ao seu momento e ao seu ritmo.</span></div>
          </article>
          <article>
            <Sparkles aria-hidden="true" />
            <div><strong>Evolução que você sente</strong><span>No corpo, na rotina e na confiança.</span></div>
          </article>
        </div>
      </section>

      <section className="evolution-section section" id="evolucoes">
        <div className="container">
          <div className="section-heading split-heading" data-reveal="heading">
            <div>
              <p className="eyebrow"><span /> Evoluções reais</p>
              <h2>Quando o treino entra na rotina, a mudança aparece na vida.</h2>
            </div>
            <p>
              Cada número conta só uma parte da história. Por trás dele existem constância, retomadas, confiança e novos hábitos.
            </p>
          </div>
          <div className="evolution-grid">
            {evolutions.map((item, index) => (
              <article className="evolution-card" key={item.title} data-reveal="card">
                <div className={`evolution-photo ${item.imageClass}`}>
                  <img src={item.image} alt={item.alt} loading="lazy" />
                </div>
                <div className="evolution-card-content">
                  <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="evolution-number">{item.number}</strong>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="results-note">Resultados individuais variam de acordo com frequência, hábitos e condições de cada pessoa.</p>
        </div>
      </section>

      <section className="plans-section section" id="programas">
        <div className="container">
          <div className="section-heading center-heading" data-reveal="heading">
            <p className="eyebrow"><span /> Programas de treino</p>
            <h2>Escolha a frequência que cabe na sua semana.</h2>
            <p>Valores mensais. Você organiza os dias e constrói consistência sem transformar treino em obrigação impossível.</p>
          </div>

          <div className="plan-group">
            <div className="plan-group-title" data-reveal="heading">
              <span><Dumbbell size={20} /> Individual</span>
              <small>Seu ritmo. Sua programação.</small>
            </div>
            <div className="pricing-grid">
              {individualPlans.map((plan) => <PriceCard key={plan.days} plan={plan} kind="Individual" />)}
            </div>
          </div>

          <div className="plan-group couple-group">
            <div className="plan-group-title" data-reveal="heading">
              <span><Users size={20} /> Casal</span>
              <small>Mais motivação para evoluírem juntos.</small>
            </div>
            <div className="pricing-grid">
              {couplePlans.map((plan) => <PriceCard key={plan.days} plan={plan} kind="Casal" />)}
            </div>
          </div>
        </div>
      </section>

      <section className="schedule-section section" id="dias">
        <div className="container schedule-layout">
          <div className="schedule-copy" data-reveal="left">
            <p className="eyebrow"><span /> Sua semana, seu programa</p>
            <h2>Você escolhe os dias. A gente ajuda a manter o ritmo.</h2>
            <p>
              Nos programas de 3 e 4 dias, você monta sua programação semanal. No programa de 5 dias, os treinos acontecem de segunda a sexta.
            </p>
            <div className="schedule-notes">
              <div><CalendarDays size={20} /><span><strong>3 ou 4 dias</strong>Dias escolhidos por você</span></div>
              <div><Clock3 size={20} /><span><strong>5 dias</strong>Segunda a sexta</span></div>
            </div>
          </div>
          <div className="week-board" aria-label="Programação semanal de segunda a sexta" data-reveal="right">
            {weekdayVideos.map(({ day, number, label, video }) => (
              <article className="day-card day-video" key={day} aria-label={label} data-reveal="card">
                <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                  <source src={video} type="video/mp4" />
                </video>
                <div className="day-video-label">
                  <span>{day}</span><strong>{number}</strong><small>Movimento</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="start-section" id="como-comecar">
        <div className="container start-card" data-reveal="section">
          <div>
            <p className="eyebrow"><span /> Seu próximo passo</p>
            <h2>Você não precisa estar preparado para começar.</h2>
            <p>Precisa apenas escolher o primeiro passo. Veja o programa ideal e fale com a equipe do Studio para organizar sua rotina.</p>
          </div>
          <a className="button button-dark" href="#programas">
            Escolher meu programa <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <BrandMark />
          <p>Treinamento funcional com propósito, constância e evolução.</p>
          <a href="#inicio">Voltar ao topo ↑</a>
        </div>
      </footer>
    </main>
  );
}
