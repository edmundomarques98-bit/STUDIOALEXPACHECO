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
  },
  {
    number: "−22 kg",
    title: "De 114 kg a 92 kg",
    text: "O retorno ao movimento virou constância, confiança e disposição para retomar o que antes parecia distante.",
  },
  {
    number: "−16 kg",
    title: "Mais leve. Mais confiante.",
    text: "Um processo construído com persistência, novos hábitos e acompanhamento em cada fase da evolução.",
  },
  {
    number: "100%",
    title: "Movimento recuperado",
    text: "Depois de uma lesão no joelho, o fortalecimento progressivo devolveu segurança para treinar e viver melhor.",
  },
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
    <article className={`price-card ${featured ? "price-card-featured" : ""}`}>
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
            <h1>Seu progresso vai <em>muito além</em> da balança.</h1>
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

      <section className="principles" aria-label="Como o Studio trabalha">
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
          <div className="section-heading split-heading">
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
              <article className="evolution-card" key={item.title}>
                <span className="card-index">0{index + 1}</span>
                <strong className="evolution-number">{item.number}</strong>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="results-note">Resultados individuais variam de acordo com frequência, hábitos e condições de cada pessoa.</p>
        </div>
      </section>

      <section className="plans-section section" id="programas">
        <div className="container">
          <div className="section-heading center-heading">
            <p className="eyebrow"><span /> Programas de treino</p>
            <h2>Escolha a frequência que cabe na sua semana.</h2>
            <p>Valores mensais. Você organiza os dias e constrói consistência sem transformar treino em obrigação impossível.</p>
          </div>

          <div className="plan-group">
            <div className="plan-group-title">
              <span><Dumbbell size={20} /> Individual</span>
              <small>Seu ritmo. Sua programação.</small>
            </div>
            <div className="pricing-grid">
              {individualPlans.map((plan) => <PriceCard key={plan.days} plan={plan} kind="Individual" />)}
            </div>
          </div>

          <div className="plan-group couple-group">
            <div className="plan-group-title">
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
          <div className="schedule-copy">
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
          <div className="week-board" aria-label="Programação semanal de segunda a sexta">
            {[
              ["SEG", "01"], ["TER", "02"], ["QUA", "03"], ["QUI", "04"], ["SEX", "05"],
            ].map(([day, number]) => (
              <div className="day-card" key={day}>
                <span>{day}</span><strong>{number}</strong><small>Movimento</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="start-section" id="como-comecar">
        <div className="container start-card">
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
