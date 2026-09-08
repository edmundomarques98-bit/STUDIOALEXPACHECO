# Ferramentas de análise

Integração implementada, mas **inativa até cadastrar os IDs reais** em
`public/analytics-config.js`. Nenhuma conta, propriedade ou contêiner foi criado.
Não colocar senhas, tokens nem chaves privadas nesse arquivo público.

| Campo | Identificador necessário |
| --- | --- |
| `gtmId` | ID do contêiner Web do Google Tag Manager (`GTM-…`) |
| `ga4Id` | ID de medição do fluxo Web do Google Analytics 4 (`G-…`) |
| `clarityId` | ID do projeto do Microsoft Clarity |
| `metaPixelId` | ID numérico do Meta Pixel |

## Ativação e responsabilidade das tags

Com `managedByGtm: false`, cada ID válido carrega seu provedor diretamente.
O GTM também pode carregar, mas **não deve conter cópias das tags GA4, Clarity e
Meta já instaladas diretamente**, para evitar contagem duplicada.

Para administrar tudo pelo GTM, configure e publique as três ferramentas dentro
do contêiner e mude `managedByGtm` para `true` na mesma implantação. Nesse modo,
somente o GTM é carregado pelo site; os outros IDs locais não ativam scripts.
O contêiner precisa das tags de visualização de página e das tags de eventos.
O site depende de JavaScript para a medição; não há pixel alternativo sem JS.

## Eventos

O código enviado como `src/analytics.js` foi adaptado ao arquivo realmente
publicado, `public/analytics.js`. Não instalar uma segunda cópia no HTML.


- `contact_click` no `dataLayer`: posição do botão, programa, canal WhatsApp,
  parâmetros UTM sanitizados e domínio de referência.
- Na instalação direta: `contact_click` no GA4 e Clarity;
  evento personalizado `WhatsAppClick` no Meta Pixel.
- Na instalação pelo GTM: criar acionador de Evento Personalizado
  `contact_click` e variáveis da camada de dados `contact_source`, `plan` e
  `contact_channel`; usar nas tags de evento das ferramentas.
- Um clique **não confirma mensagem enviada, aula agendada nem matrícula**.
  O texto da conversa não é incluído nos parâmetros personalizados.

### Medições adicionais

- `click_instagram`, `click_localizacao`, `click_avaliacao`, `click_telefone` e
  `click_email` são registrados na camada de dados e, no modo direto, no GA4 e
  Clarity. Os eventos incluem somente o domínio do destino, sem URL completa,
  mensagem, telefone, endereço de e-mail ou texto livre do botão.
- `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90` e `scroll_100`: cada marco
  dispara uma vez por página; a altura considerada é a disponível no momento
  da rolagem (a galeria recolhível pode alterar essa altura).
- `engajamento_30_segundos` e `engajamento_60_segundos`: tempo acumulado com a aba
  visível. Tempo em segundo plano não conta. Isso não comprova leitura atenta.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` são
  limitados e sanitizados. Com um provedor configurado, ficam no
  `sessionStorage` para a sessão da aba. Armazenamento bloqueado não interrompe
  os eventos; sem IDs válidos, nenhuma campanha é gravada no armazenamento.
- Eventos manuais: `data-analytics="ver_programas"` em botões/links ou
  `window.trackSiteEvent('ver_programas')`. Nomes aceitam letras, números e
  sublinhado, iniciando por letra, até 40 caracteres. Parâmetros permitidos:
  `contact_channel`, `contact_source`, `plan`, `link_domain`, `percent_scrolled`,
  `seconds`. Os contatos com `data-contact-source` preservam `contact_click`.
- Não há interceptação de `history.pushState`/`replaceState`: a publicação é uma
  página estática com âncoras. O carregamento inicial mantém o page view padrão
  do GA4. Se o site ganhar rotas, configurar uma única estratégia de medição
  conforme a [documentação de SPA do Google](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).
- No modo GTM, configurar também acionadores/tags para esses eventos adicionais.
  Os eventos personalizados de scroll/clique são distintos da medição
  otimizada automática do GA4; não somar ambos como se fossem ações únicas.

Depois da ativação, verificar uma visualização e um clique no Tag Assistant/GA4,
no projeto Clarity e em Testar Eventos do Meta, confirmando ausência de eventos
duplicados. Configurar consentimento e privacidade conforme as definições do
Studio antes de ativar a coleta. Bloqueadores podem impedir a medição, sem
interferir nos botões de contato.

## Referências oficiais

- [Google tag](https://developers.google.com/tag-platform/gtagjs)
- [Google Tag Manager](https://developers.google.com/tag-platform/tag-manager)
- [Instalação do Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)
- [Meta Pixel](https://developers.facebook.com/documentation/meta-pixel/get-started)
- [Eventos personalizados do Meta](https://developers.facebook.com/documentation/meta-pixel/implementation/conversion-tracking)
