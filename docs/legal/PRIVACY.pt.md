# Política de privacidade

**Versão de: 2026-08-29**

<!-- verbindlich: de -->
> **A versão alemã é a vinculativa.** Esta tradução é fornecida por conveniência. Em caso de divergência, prevalece o texto alemão em [/datenschutz.html](/datenschutz.html).

> Primeiro o essencial: **a ANITEW mantém-se local-first.** Não há **qualquer
> conta ANITEW**, nem publicidade, nem serviços de análise externos, nem
> rastreadores. Treino, memórias, medições e perfil ficam no teu aparelho. Só as
> funções que ligas ou desencadeias expressamente — sincronização com o Google
> Drive, funções de IA, análise de fotos e notificações do sistema — usam os
> serviços de rede necessários.

Este documento descreve o que a versão atual da ANITEW faz realmente.

---

## 1. Responsável pela proteção de dados

Responsável na aceção do Regulamento Geral sobre a Proteção de Dados (RGPD):

**ANITEW by Impekal**  
Titular: **Dr. Mèhèza Kalibani**  
Holstenwall 24  
20335 Hamburgo  
Alemanha

Correio eletrónico: impekaltech+anitew@gmail.com  
Telefone: +49 151 12784951

Mais indicações sobre o prestador constam da [informação legal](/impressum.pt.html).

## 2. O que é guardado no teu aparelho

No armazenamento do navegador (sobretudo IndexedDB; a par dele localStorage/sessionStorage para preferências do aparelho como tema, marcas de primeiro arranque e avisos passageiros) encontram-se, entre outras coisas:

| O quê | Para quê |
|---|---|
| Sessões de treino e respostas | Plano de repetição e avaliações |
| Datas de repetição | Reencontros em dívida |
| Medições | Comparação dentro da tua própria série de medições |
| As tuas memórias, cartões e palácio da memória | Treino pessoal |
| Definições como idioma, som e hora do lembrete | Próximo arranque |

Estes conteúdos **não** são copiados para um servidor da ANITEW para o Web Push.

A ANITEW pode ainda calcular no aparelho informação de diagnóstico puramente
técnica e medições beta agregadas. Não contêm textos de memórias, conteúdos de
respostas, chaves de API nem tokens OAuth e **não são transmitidas
automaticamente**. É preciso que uma pessoa exporte expressamente esse relatório
antes de o poder entregar voluntariamente.

## 3. O que a ANITEW não faz

- Sem publicidade, sem identificador publicitário, sem perfis publicitários.
- Sem serviços de análise externos, sem estatísticas de utilização automáticas, sem rastreadores.
- Sem envio dos teus conteúdos de treino ou de memória para o push.
- Sem acesso aos contactos nem à localização.
- Sem gravação permanente do microfone ou da câmara em segundo plano.
- Sem classificação pública nem perfis sociais.

## 4. Microfone, ditado e fotos

### Ditado

Se iniciares expressamente o ditado, a ANITEW pode usar o microfone para **um
ditado curto**. O reconhecimento de voz só é iniciado se o navegador confirmar um
reconhecimento local e suportar `processLocally`. A ANITEW deliberadamente **não**
recorre a um serviço de voz remoto do navegador. Se o processamento local não
estiver disponível, o ditado fica desligado. O texto reconhecido é tratado como
texto escrito por ti.

### Escolha de foto e câmara

«Escolher foto» abre o seletor de imagens/câmara disponibilizado pelo aparelho. A
foto original escolhida fica primeiro como cópia de trabalho local e passageira na
memória do navegador e não é guardada automaticamente em IndexedDB, na cópia de
segurança ou no Google Drive.

Só quando tocas adicionalmente em **«Analisar foto»** é que a ANITEW cria no
navegador uma cópia JPEG reduzida sem metadados de ficheiro/EXIF e a envia
diretamente ao fornecedor de IA que escolheste e configuraste com a tua própria
chave de API. A foto original não é enviada ao fornecedor. A resposta da IA é só
uma proposta; nada é guardado antes da tua confirmação expressa.

## 5. O que acontece tecnicamente ao carregar

A aplicação é distribuída através de Cloudflare Workers/Static Assets. Como com
qualquer servidor web, surgem no fornecedor de infraestrutura dados técnicos de
ligação como endereço IP, momento, navegador e pedido de ficheiro. A ANITEW não
constrói com isso qualquer perfil de utilização.

**Em claro:** depois de carregada, **o treino em si funciona sem ligação**. O
acesso à rede só é necessário para as funções online expressamente escolhidas. A
sincronização com o Drive, as funções de IA e as notificações do sistema estão
desligadas até lhes tocares. Só uma ativação ou ação expressa inicia o respetivo
caminho online.

## 6. Cópia de segurança e reposição

«Guardar cópia de segurança» cria um ficheiro JSON com o teu estado ANITEW. És tu
que decides onde fica. Quem tiver esse ficheiro pode ler o seu conteúdo.

**Não estão incluídos na cópia** os valores ligados ao aparelho: chaves de API de
IA guardadas, a indicação da conta Google do aparelho e o estado técnico da
sincronização com o Drive. Não saem do aparelho nem no ficheiro nem durante a
sincronização com o Drive; mesmo ao ler um ficheiro mais antigo que ainda contenha
tais valores, estes são descartados.

Na sincronização opcional com o Google Drive, a ANITEW deposita esse mesmo
ficheiro de cópia numa pasta `Anitew` própria do teu Google Drive. A ANITEW não
mexe noutros ficheiros.

## 7. Notificações do sistema / Web Push

Se tocares expressamente em «Permitir notificações» e o teu aparelho suportar Web
Push, o navegador cria um **endereço push técnico** para este aparelho. Para a
entrega, a ANITEW guarda no servidor apenas:

- este endereço push técnico,
- o identificador do lembrete (`daily` ou `benchmark`),
- o momento de vencimento,
- no lembrete diário, a hora e o fuso horário IANA,
- o texto genérico da notificação — também como uma nota curta de entrega que,
  após o disparo, fica disponível no servidor até o teu aparelho a ir buscar, mas
  no máximo 24 horas **a contar do vencimento** (60 minutos no lembrete de
  medição); depois é apagada em vez de entregue com atraso. O prazo conta a
  partir do vencimento e não recomeça com uma nova tentativa de entrega. Este
  prazo aplica-se independentemente de estarem previstos outros lembretes ou de
  o serviço push estar de momento inacessível. Se não restar nem uma marcação
  nem uma nota, a entrada do lado do servidor é apagada por completo.

**Para isso não são guardados:** respostas de treino, conteúdos de memória,
perfil, nome, endereço de correio eletrónico, medições ou ficheiros de cópia.

O armazenamento ocorre num Durable Object da Cloudflare derivado unicamente do
endereço push. Para isso não existe qualquer conta de utilizador ANITEW nem
identificador de utilizador multiplataforma. O caminho de entrega propriamente
dito passa pelo serviço push determinado pelo navegador/sistema operativo (nos
aparelhos Apple, a infraestrutura Apple correspondente).

«Sem lembrete» apaga o lembrete diário. «Recomeçar» tenta apagar a entrada push do
lado do servidor e revoga além disso a subscrição push local; com isso o endereço
push anterior fica inválido, mesmo que o servidor esteja de momento inacessível. A
autorização de notificação pode ainda ser retirada a qualquer momento nas
definições do sistema ou do navegador.

No iPhone e no iPad, o Web Push só funciona para uma aplicação web adicionada ao
ecrã inicial, em versões suportadas de iOS/iPadOS. Onde o Web Push não estiver
disponível num aparelho, a ANITEW não promete qualquer notificação do sistema com
a aplicação fechada e recorre ao aviso «só enquanto estiver aberta».

## 8. Apagar e portabilidade

- **Portabilidade:** «Guardar cópia de segurança» exporta o teu estado local.
- **Reinício completo:** «Recomeçar» apaga os dados ANITEW locais, desliga
  localmente a sincronização com a Google e revoga a subscrição push.
  Opcionalmente pode ser apagado também o ficheiro de cópia próprio da ANITEW no
  teu Google Drive. Se o worker OAuth estiver inacessível no momento do reinício,
  o encerramento técnico da sessão do navegador é recuperado no arranque
  acessível seguinte; entretanto não pode iniciar-se qualquer sincronização com o
  Drive, porque o seu interruptor local já foi apagado.
- **Só desligar o lembrete:** «Sem lembrete» termina o lembrete diário sem apagar
  os teus dados de treino.

## 9. Sincronização com o Google Drive

O Google Drive está desligado até o ligares tu. O início de sessão faz-se através
do Google OAuth. A par do acesso ao Drive, a ANITEW pede a informação básica da
Google (`openid email profile`) — apenas para que a interface possa mostrar com
que identidade estás ligado. O worker da Cloudflare troca o código de autorização
da Google por tokens e mantém a sessão — incluindo o token de atualização da
Google — cifrada num cookie `HttpOnly` do teu navegador. A duração está fixada
num máximo de 180 dias a contar do início de sessão; o prazo **não** é prolongado
pelo uso.

O ecrã de consentimento da Google apresenta o acesso ao Drive numa caixa
separada, que não vem marcada. Se a marcaste, a Google di-lo ao worker na sua
resposta; o worker guarda disso **um sim ou um não** na mesma sessão cifrada e
transmite esse sim/não à interface — nunca a lista de autorizações da Google.
Só assim a ANITEW te pode dizer logo no início de sessão que a caixa ficou
vazia, em vez de te deixar descobrir isso na primeira tentativa de gravação
através de uma mensagem de erro da Google. Sem essa marca tudo fica no teu
aparelho; nada se perde.

Ao tocares em «Desligar conta Google», a sincronização com o Drive é desligada
**de imediato e de forma permanente** no aparelho e a identidade de conta
mostrada localmente é removida. Se o worker estiver acessível, apaga ao mesmo
tempo o cookie de sessão HttpOnly e tenta revogar o token da Google. Se o worker
estiver temporariamente inacessível — por exemplo por o aparelho estar sem
ligação —, o navegador não pode apagar tecnicamente por si o cookie HttpOnly. A
ANITEW apenas anota então localmente este encerramento técnico pendente e volta a
tentá-lo no arranque seguinte ou ao voltar a ficar online. Entretanto a
sincronização com o Drive mantém-se desligada; o cookie que ficou não a ativa por
si só. Independentemente disso, a sessão selada termina o mais tardar com o seu
prazo fixo de 180 dias.

**Regra transitória para inícios de sessão mais antigos:** as sessões criadas
antes da introdução deste prazo fixo não trazem em si qualquer momento de início
de sessão; não é possível determiná-lo em retrospetiva e também não é estimado.
Tais sessões expiram por isso o mais tardar **30 dias** após a primeira
utilização com a nova versão — menos do que qualquer tempo restante que teriam
tido antes. Depois é necessário um novo início de sessão; para ele vale então o
prazo fixo de 180 dias a contar do início de sessão. Não existe qualquer base de
dados de utilizadores da ANITEW onde tokens fossem guardados. O aparelho usa em
seguida o acesso para a pasta ANITEW no teu próprio Drive. O nome e o correio
eletrónico mostrados na interface para controlo da conta são mantidos localmente
no armazenamento do aparelho da ANITEW e removidos ao desligar.

Para a Google valem além disso as condições de privacidade da Google.

## 10. Funções de IA com a tua própria chave de API

O coach e as propostas de IA estão desligados até guardares uma chave própria e
desencadeares expressamente uma função correspondente. No coach de texto são
suportados, consoante a seleção, Gemini, Anthropic, OpenAI, Groq, OpenRouter ou
Mistral. A pergunta e o contexto numérico descrito para ela vão então diretamente
ao fornecedor de IA escolhido. Os teus próprios textos de memórias só são
transmitidos numa função de proposta de IA que tu desencadeies.

Para a análise de fotos são suportados exclusivamente Gemini, Anthropic ou
OpenAI. Como descrito na secção 4, só depois de «Analisar foto» é transmitida uma
cópia de imagem preparada.

A chave de API permanece no teu aparelho. Para o tratamento junto do respetivo
fornecedor vale além disso a política de privacidade deste.

## 11. Fundamentos jurídicos e prazos de conservação

Na medida em que a ANITEW trata dados apenas no teu aparelho, és tu que decides
sobre a sua existência através do uso, da exportação e do apagamento. Nas funções
online ativadas voluntariamente, o tratamento serve para prestar a função
expressamente escolhida em cada caso. Prazos concretos: o cookie de sessão da
Google cifrado expira o mais tardar 180 dias após o início de sessão e não é
prolongado pelo uso. Ao encerrar sessão, a sincronização local com o Drive termina
de imediato; o worker apaga o cookie no encerramento confirmado. Se o worker não
puder ser alcançado nesse momento, é exatamente esse encerramento técnico que
volta a ser tentado no arranque online seguinte. As sessões anteriores à regra dos
180 dias expiram, segundo a regra transitória da secção 9, o mais tardar 30 dias
após a primeira utilização com a nova versão. As entradas push do lado do servidor
existem até a marcação ser entregue e recolhida, até terminares o lembrete ou até
terminar a subscrição push — as notas de entrega não recolhidas, no máximo 24
horas (lembrete de medição: 60 minutos). Os registos técnicos de infraestrutura e
os dados junto de fornecedores externos estão além disso sujeitos às regras de
conservação legais e contratuais destes.

## 12. Os teus direitos

Na medida em que sejam tratados dados pessoais pelo responsável, tens, na medida
prevista na lei, em especial direitos de acesso, retificação, apagamento,
limitação do tratamento, portabilidade e oposição. Existe além disso o direito de
apresentar reclamação junto de uma autoridade de controlo competente em matéria
de proteção de dados. Para pedidos basta o endereço de correio eletrónico
indicado acima.

## 13. Crianças

A ANITEW não tem função de conversa entre utilizadores, nem classificação
pública, nem publicidade. As funções online voluntárias descritas acima seguem as
mesmas regras técnicas independentemente da idade.

## 14. Alterações

Se o tratamento mudar, esta declaração é adaptada com uma data nova. Uma função
que transmita dados adicionais não pode surgir em silêncio sob um texto de
privacidade antigo.
