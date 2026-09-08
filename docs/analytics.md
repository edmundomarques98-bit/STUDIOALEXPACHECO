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

- `contact_click` no `dataLayer`: posição do botão, programa, canal WhatsApp,
  parâmetros UTM sanitizados e domínio de referência.
- Na instalação direta: `contact_click` no GA4 e Clarity;
  evento personalizado `WhatsAppClick` no Meta Pixel.
- Na instalação pelo GTM: criar acionador de Evento Personalizado
  `contact_click` e variáveis da camada de dados `contact_source`, `plan` e
  `contact_channel`; usar nas tags de evento das ferramentas.
- Um clique **não confirma mensagem enviada, aula agendada nem matrícula**.
  O texto da conversa não é incluído nos parâmetros personalizados.

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
