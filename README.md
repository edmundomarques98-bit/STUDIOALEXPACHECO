# Studio Alex Pacheco

Site institucional do Studio Alex Pacheco, desenvolvido para apresentar evoluções reais, programas de treino, valores e organização semanal.

## Conteúdo

- Evoluções acompanhadas pelo Studio
- Programas individuais de 3, 4 e 5 dias
- Programas para casal de 3, 4 e 5 dias
- Organização dos treinos de segunda a sexta
- Layout responsivo para celular, tablet e desktop

## Tecnologias

- React 19
- Next.js / Vinext
- TypeScript
- Tailwind CSS
- Cloudflare Workers

## Publicação

A versão publicada está disponível em:

https://edmundomarques98-bit.github.io/STUDIOALEXPACHECO/

## Versão pública e manutenção

O GitHub Pages publica `index.html`, `site.css` e os recursos copiados por `.github/workflows/pages.yml`, sem compilar o aplicativo React. As alterações comerciais principais também estão refletidas em `app/`.

- Localização confirmada: Cascavel–CE. Endereço e telefone conferidos em https://studioalexpacheco.com.br/contato em 08/09/2026.
- WhatsApp: +55 85 99807-3701. Os links incluem mensagem e programa escolhido, mas não enviam mensagens automaticamente.
- As 11 histórias e os 48 slides permanecem disponíveis; a primeira grade contém três destaques.
- Horários, duração e condições da primeira aula devem ser consultados com Alex até existir uma programação atualizada confirmada.
- `public/analytics.js`, integrado aos botões por `public/site-interactions.js`, emite `contact_click` em `window.dataLayer`, com posição do botão, plano, parâmetros UTM sanitizados e domínio de referência. As integrações GA4, GTM, Clarity e Meta Pixel estão implementadas, aguardando os IDs reais em `public/analytics-config.js`. Veja [configuração e validação](docs/analytics.md). Contato é medido separadamente de matrícula.

Verificação sem instalar dependências: `node --check public/site-interactions.js` e `node --test tests/evolution-slideshow.test.mjs`.

## Correções de desktop e atualização

No computador, os botões abrem diretamente o WhatsApp Web. Celulares e tablets mantêm o link do aplicativo. A mensagem AIDA e o programa escolhido são preservados. Sem JavaScript, o link universal continua disponível.

A publicação gera versões por conteúdo para todos os CSS/JS referenciados no HTML usando `scripts/version-pages-assets.py`. Ao carregar o HTML novo, o navegador busca os arquivos novos. O HTML ainda está sujeito ao cache do GitHub Pages; uma recarga forçada ou um parâmetro `?v=` novo força uma nova URL de entrada.

Testes de contato e integração: `node --test tests/contact-analytics.test.mjs`.

O módulo de análise também prepara UTMs de sessão, cliques sociais/localização/avaliações, marcos de rolagem e 30/60 segundos de aba visível. Continua inativo nas plataformas enquanto os IDs não forem preenchidos.
