# Informativa sulla privacy

**Versione del: 2026-08-29**

<!-- verbindlich: de -->
> **La versione tedesca è quella vincolante.** Questa traduzione è fornita per comodità. In caso di divergenza prevale il testo tedesco su [/datenschutz.html](/datenschutz.html).

> Prima l'essenziale: **ANITEW resta local-first.** Non esiste **alcun account
> ANITEW**, nessuna pubblicità, nessun servizio di analisi esterno e nessun
> tracciatore. Allenamento, ricordi, misurazioni e profilo restano sul tuo
> dispositivo. Solo le funzioni che attivi o avvii espressamente —
> sincronizzazione con Google Drive, funzioni di IA, analisi delle foto e
> notifiche di sistema — usano i servizi di rete necessari.

Questo documento descrive ciò che la versione attuale di ANITEW fa davvero.

---

## 1. Titolare del trattamento

Titolare ai sensi del Regolamento generale sulla protezione dei dati (GDPR):

**ANITEW by Impekal**  
Titolare: **Dr. Mèhèza Kalibani**  
Holstenwall 24  
20335 Amburgo  
Germania

E-mail: impekaltech+anitew@gmail.com  
Telefono: +49 151 12784951

Ulteriori dati del fornitore sono riportati nelle [note legali](/impressum.it.html).

## 2. Cosa viene salvato sul tuo dispositivo

Nella memoria del browser (soprattutto IndexedDB; accanto a essa localStorage/sessionStorage per le preferenze del dispositivo come tema, marcatori di primo avvio e avvisi passeggeri) si trovano tra l'altro:

| Cosa | A che scopo |
|---|---|
| Sessioni di allenamento e risposte | Piano di ripetizione e valutazioni |
| Date di ripetizione | Reincontri in scadenza |
| Misurazioni | Confronto all'interno della tua serie di misurazioni |
| I tuoi ricordi, le tue carte e il tuo palazzo della memoria | Allenamento personale |
| Impostazioni come lingua, suono e ora del promemoria | Prossimo avvio |

Questi contenuti **non** vengono copiati su un server ANITEW per il Web Push.

ANITEW può inoltre calcolare sul dispositivo informazioni diagnostiche puramente
tecniche e misure beta aggregate. Non contengono testi di ricordi, contenuti di
risposte, chiavi API o token OAuth e **non vengono trasmesse automaticamente**.
Una persona deve esportare espressamente un simile rapporto prima di poterlo
consegnare volontariamente.

## 3. Cosa ANITEW non fa

- Nessuna pubblicità, nessun ID pubblicitario, nessuna profilazione pubblicitaria.
- Nessun servizio di analisi esterno, nessuna statistica d'uso automatica, nessun tracciatore.
- Nessun caricamento dei tuoi contenuti di allenamento o di memoria per il push.
- Nessun accesso ai contatti o alla posizione.
- Nessuna registrazione permanente di microfono o fotocamera in secondo piano.
- Nessuna classifica pubblica né profili sociali.

## 4. Microfono, dettatura e foto

### Dettatura

Se avvii espressamente la dettatura, ANITEW può usare il microfono per **una
breve dettatura**. Il riconoscimento vocale viene avviato solo se il browser
conferma un riconoscimento locale e supporta `processLocally`. ANITEW
deliberatamente **non** ripiega su un servizio vocale remoto del browser. Se
l'elaborazione locale non è disponibile, la dettatura resta spenta. Il testo
riconosciuto viene trattato come testo digitato da te.

### Scelta della foto e fotocamera

«Scegli foto» apre il selettore di immagini/fotocamera messo a disposizione dal
dispositivo. La foto originale scelta resta dapprima come copia di lavoro locale
e passeggera nella memoria del browser e non viene salvata automaticamente in
IndexedDB, nel backup o in Google Drive.

Solo quando tocchi in più **«Analizza foto»**, ANITEW crea nel browser una copia
JPEG ridotta senza metadati di file/EXIF e la invia direttamente al fornitore di
IA che hai scelto e configurato con la tua chiave API. La foto originale non
viene inviata al fornitore. La risposta dell'IA è solo una proposta; nulla viene
salvato prima della tua conferma espressa.

## 5. Cosa accade tecnicamente al caricamento

L'app viene distribuita tramite Cloudflare Workers/Static Assets. Come con
qualsiasi server web, presso il fornitore di infrastruttura sorgono dati tecnici
di connessione quali indirizzo IP, momento, browser e richiesta di file. ANITEW
non ne ricava alcun profilo d'uso.

**In chiaro:** dopo il caricamento **l'allenamento stesso funziona offline**.
L'accesso alla rete serve solo per le funzioni online scelte espressamente. La
sincronizzazione con Drive, le funzioni di IA e le notifiche di sistema sono
spente finché non le tocchi. Solo un'attivazione o un'azione espressa avvia il
rispettivo percorso online.

## 6. Backup e ripristino

«Salva backup» crea un file JSON con il tuo stato ANITEW. Decidi tu dove si
trova. Chi possiede questo file può leggerne il contenuto.

**Non sono contenuti nel backup** i valori legati al dispositivo: chiavi API di
IA memorizzate, l'indicazione dell'account Google del dispositivo e lo stato
tecnico della sincronizzazione con Drive. Non lasciano il dispositivo né nel file
né durante la sincronizzazione con Drive; anche leggendo un file più vecchio che
contenga ancora tali valori, questi vengono scartati.

Con la sincronizzazione facoltativa con Google Drive, ANITEW deposita lo stesso
file di backup in una cartella `Anitew` propria del tuo Google Drive. ANITEW non
tocca altri file.

## 7. Notifiche di sistema / Web Push

Se tocchi espressamente «Consenti notifiche» e il tuo dispositivo supporta il Web
Push, il browser crea un **indirizzo push tecnico** per questo dispositivo. Per
la consegna, ANITEW salva sul server soltanto:

- questo indirizzo push tecnico,
- l'identificativo del promemoria (`daily` o `benchmark`),
- il momento di scadenza,
- per il promemoria quotidiano l'ora e il fuso orario IANA,
- il testo generico della notifica — anche come breve nota di consegna che dopo
  l'attivazione resta disponibile presso il server finché il tuo dispositivo non
  la ritira, ma al massimo 24 ore **a partire dalla scadenza** (60 minuti per il
  promemoria di misurazione); dopo viene cancellata anziché consegnata in
  ritardo. Il termine decorre dalla scadenza e non riparte con un nuovo
  tentativo di consegna. Questo termine vale indipendentemente dal fatto che
  siano previsti altri promemoria o che il servizio push sia al momento
  irraggiungibile. Se non resta né un appuntamento né una nota, l'intera voce
  lato server viene cancellata.

**A tal fine non vengono salvati:** risposte di allenamento, contenuti di
memoria, profilo, nome, indirizzo e-mail, misurazioni o file di backup.

Il salvataggio avviene in un Durable Object Cloudflare derivato unicamente
dall'indirizzo push. Per questo non esiste alcun account utente ANITEW né un
identificativo utente multipiattaforma. Il percorso di consegna vero e proprio
passa per il servizio push determinato dal browser/sistema operativo (sui
dispositivi Apple la corrispondente infrastruttura Apple).

«Nessun promemoria» cancella il promemoria quotidiano. «Ricominciare» tenta di
cancellare la voce push lato server e revoca inoltre l'abbonamento push locale;
in tal modo l'indirizzo push precedente diventa non valido, anche se il server è
al momento irraggiungibile. L'autorizzazione alle notifiche può inoltre essere
revocata in qualsiasi momento nelle impostazioni di sistema o del browser.

Su iPhone e iPad il Web Push funziona solo per una web app aggiunta alla
schermata iniziale, su versioni di iOS/iPadOS supportate. Dove il Web Push non è
disponibile su un dispositivo, ANITEW non promette alcuna notifica di sistema ad
app chiusa e ripiega sull'avviso «solo finché è aperta».

## 8. Cancellazione e portabilità

- **Portabilità:** «Salva backup» esporta il tuo stato locale.
- **Riavvio completo:** «Ricominciare» cancella i dati ANITEW locali, disattiva
  localmente la sincronizzazione con Google e revoca l'abbonamento push.
  Facoltativamente può essere cancellato anche il file di backup proprio di
  ANITEW nel tuo Google Drive. Se al momento del riavvio il worker OAuth è
  irraggiungibile, la disconnessione tecnica del browser viene recuperata al
  successivo avvio raggiungibile; nel frattempo non può avviarsi alcuna
  sincronizzazione con Drive, perché il suo interruttore locale è già cancellato.
- **Solo promemoria spento:** «Nessun promemoria» termina il promemoria
  quotidiano senza cancellare i tuoi dati di allenamento.

## 9. Sincronizzazione con Google Drive

Google Drive è spento finché non lo accendi tu. L'accesso avviene tramite Google
OAuth. Oltre all'accesso a Drive, ANITEW richiede l'informazione di base di
Google (`openid email profile`) — solo perché l'interfaccia possa mostrare con
quale identità sei collegato. Il worker Cloudflare scambia il codice di
autorizzazione Google con dei token e conserva la sessione — compreso il token di
aggiornamento Google — cifrata in un cookie `HttpOnly` del tuo browser. La durata
è fissata a un massimo di 180 giorni dall'accesso; il termine **non** viene
prolungato dall'uso.

La schermata di consenso di Google presenta l'accesso a Drive in una casella
separata, non selezionata di default. Se l'hai selezionata, Google lo comunica
al worker nella sua risposta; il worker ne conserva **un sì o un no** nella
stessa sessione cifrata e passa questo sì/no all'interfaccia — mai l'elenco
delle autorizzazioni di Google. Solo così ANITEW può dirti già all'accesso che
la casella è rimasta vuota, invece di lasciartelo scoprire al primo tentativo
di salvataggio con un messaggio di errore di Google. Senza quella spunta tutto
resta sul tuo dispositivo; non si perde nulla.

Toccando «Scollega account Google», la sincronizzazione con Drive viene spenta
**immediatamente e in modo permanente** sul dispositivo e l'identità dell'account
mostrata localmente viene rimossa. Se il worker è raggiungibile, cancella
contestualmente il cookie di sessione HttpOnly e tenta di revocare il token
Google. Se il worker è temporaneamente irraggiungibile — per esempio perché il
dispositivo è offline — il browser non può cancellare tecnicamente da sé il
cookie HttpOnly. ANITEW annota allora solo localmente questa disconnessione
tecnica in sospeso e la ritenta al successivo avvio o al ritorno online. Nel
frattempo la sincronizzazione con Drive resta spenta; il cookie rimasto non la
attiva da solo. Indipendentemente da ciò, la sessione sigillata termina al più
tardi con il suo termine fisso di 180 giorni.

**Regola transitoria per accessi più vecchi:** le sessioni create prima
dell'introduzione di questo termine fisso non recano in sé alcun momento di
accesso; non è determinabile a posteriori e non viene nemmeno stimato. Tali
sessioni scadono perciò al più tardi **30 giorni** dopo il primo uso con la nuova
versione — meno di qualsiasi durata residua che avrebbero avuto prima. Dopo è
necessario un nuovo accesso; per esso vale allora il termine fisso di 180 giorni
dall'accesso. Non esiste alcuna banca dati utenti ANITEW in cui siano conservati
token. Il dispositivo usa poi l'accesso per la cartella ANITEW nel tuo Drive.
Nome ed e-mail mostrati nell'interfaccia per il controllo dell'account sono
conservati localmente nella memoria del dispositivo di ANITEW e rimossi allo
scollegamento.

Per Google valgono inoltre le condizioni sulla privacy di Google.

## 10. Funzioni di IA con la tua chiave API

Il coach e le proposte di IA sono spenti finché non depositi una tua chiave e non
avvii espressamente una funzione corrispondente. Per il coach testuale sono
supportati, a seconda della selezione, Gemini, Anthropic, OpenAI, Groq,
OpenRouter o Mistral. La domanda e il contesto numerico descritto per essa vanno
allora direttamente al fornitore di IA scelto. I tuoi testi di ricordi vengono
trasmessi solo in una funzione di proposta di IA avviata da te.

Per l'analisi delle foto sono supportati esclusivamente Gemini, Anthropic o
OpenAI. Come descritto nella sezione 4, una copia dell'immagine preparata viene
trasmessa solo dopo «Analizza foto».

La chiave API resta sul tuo dispositivo. Per il trattamento presso il rispettivo
fornitore vale inoltre la sua informativa sulla privacy.

## 11. Basi giuridiche e tempi di conservazione

Nella misura in cui ANITEW tratta i dati solo sul tuo dispositivo, sei tu a
deciderne l'esistenza tramite uso, esportazione e cancellazione. Per le funzioni
online attivate volontariamente il trattamento serve a fornire la funzione
espressamente scelta di volta in volta. Termini concreti: il cookie di sessione
Google cifrato scade al più tardi 180 giorni dopo l'accesso e non viene
prolungato dall'uso. Alla disconnessione la sincronizzazione locale con Drive
termina immediatamente; il worker cancella il cookie alla disconnessione
confermata. Se in quel momento il worker non è raggiungibile, viene ritentata
esattamente questa disconnessione tecnica al successivo avvio online. Le sessioni
precedenti alla regola dei 180 giorni scadono, secondo la regola transitoria
della sezione 9, al più tardi 30 giorni dopo il primo uso con la nuova versione.
Le voci push lato server esistono finché l'appuntamento non è consegnato e
ritirato, finché non termini il promemoria o finché non finisce l'abbonamento
push — le note di consegna non ritirate al massimo 24 ore (promemoria di
misurazione: 60 minuti). I registri tecnici di infrastruttura e i dati presso
fornitori esterni sottostanno inoltre alle loro regole di conservazione legali e
contrattuali.

## 12. I tuoi diritti

Nella misura in cui il titolare tratta dati personali, hai, nei limiti previsti
dalla legge, in particolare i diritti di accesso, rettifica, cancellazione,
limitazione del trattamento, portabilità e opposizione. Sussiste inoltre il
diritto di proporre reclamo a un'autorità di controllo competente in materia di
protezione dei dati. Per le richieste è sufficiente l'indirizzo e-mail indicato
sopra.

## 13. Minori

ANITEW non ha funzioni di chat tra utenti, né classifiche pubbliche, né
pubblicità. Le funzioni online facoltative descritte sopra seguono le stesse
regole tecniche indipendentemente dall'età.

## 14. Modifiche

Se il trattamento cambia, questa informativa viene adeguata con una nuova data.
Una funzione che trasmette dati aggiuntivi non deve comparire in silenzio sotto
un vecchio testo sulla privacy.
