import type { Language } from '../core/index.ts'
import type { CourseId } from '../core/courses/progress.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import type { SpokenLanguage } from '../core/courses/media.ts'
import type { DownloadAsset } from '../app/courseDownloads.ts'
/** Verified attribution for this video's actual production pipeline. */
export interface CourseVideoCredit { name:string; url:string; license:string }
export interface CourseVideo extends DownloadAsset {
 course:CourseId; coach:CoachId; language:SpokenLanguage; mime:'video/mp4'
 /** Illustrated videos use their recorded course voice across coach choices. */
 presentation?:'illustrated'; recallBoundary?:number
 duration:number; cues:ReadonlyArray<{start:number;end:number}>
 /** Optional complete subtitle tracks for this edited video, in app languages. */
 captions?:Partial<Record<Language,readonly string[]>>
 credits:readonly CourseVideoCredit[]
}
// Complete locally bundled courses only; each video supplies its edited caption timeline.
export const courseVideos:CourseVideo[]=[
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "en",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-story-en-798e41c0c793.mp4",
    "bytes": 1775668,
    "sha256": "798e41c0c79399926a50b2f7984533e86ad375fb480fd743382d7eae8b116da3",
    "duration": 98.67999999999999,
    "cues": [
      {
        "start": 0,
        "end": 2.72
      },
      {
        "start": 2.72,
        "end": 5.76
      },
      {
        "start": 5.76,
        "end": 9
      },
      {
        "start": 9,
        "end": 16.16
      },
      {
        "start": 16.16,
        "end": 22.64
      },
      {
        "start": 22.64,
        "end": 26.72
      },
      {
        "start": 26.72,
        "end": 33.0
      },
      {
        "start": 33.0,
        "end": 37.4
      },
      {
        "start": 37.4,
        "end": 42.44
      },
      {
        "start": 42.44,
        "end": 47.12
      },
      {
        "start": 47.12,
        "end": 52.52
      },
      {
        "start": 52.52,
        "end": 58.48
      },
      {
        "start": 58.48,
        "end": 61.96
      },
      {
        "start": 61.96,
        "end": 66.56
      },
      {
        "start": 66.56,
        "end": 69.08
      },
      {
        "start": 69.08,
        "end": 73.36
      },
      {
        "start": 73.36,
        "end": 76.44
      },
      {
        "start": 76.44,
        "end": 80.63999999999999
      },
      {
        "start": 80.63999999999999,
        "end": 86.08
      },
      {
        "start": 86.08,
        "end": 92.6
      },
      {
        "start": 92.6,
        "end": 98.67999999999999
      }
    ],
    "credits": [
      {
        "name": "MultiTalk",
        "url": "https://github.com/MeiGen-AI/MultiTalk",
        "license": "Apache-2.0"
      },
      {
        "name": "Wan2.1 / city96 GGUF",
        "url": "https://huggingface.co/city96/Wan2.1-I2V-14B-480P-gguf",
        "license": "Apache-2.0"
      },
      {
        "name": "Created with WanGP",
        "url": "https://github.com/deepbeepmeep/Wan2GP",
        "license": "WanGP Community License 2.0 (rendering tool)"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "keyword-method",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-keyword-method-fr-visual-8a03f3bc58ad.mp4",
    "bytes": 1240547,
    "sha256": "8a03f3bc58ad55437827a58988968767ef2f72f2fe8269ad6b7eb65c30348d74",
    "duration": 76.88,
    "cues": [
      {
        "start": 0.0,
        "end": 3.32
      },
      {
        "start": 3.32,
        "end": 13.44
      },
      {
        "start": 13.44,
        "end": 23.84
      },
      {
        "start": 23.84,
        "end": 28.24
      },
      {
        "start": 28.24,
        "end": 31.08
      },
      {
        "start": 31.08,
        "end": 35.16
      },
      {
        "start": 35.16,
        "end": 39.6
      },
      {
        "start": 39.6,
        "end": 44.12
      },
      {
        "start": 44.12,
        "end": 49.4
      },
      {
        "start": 49.4,
        "end": 59.96
      },
      {
        "start": 59.96,
        "end": 66.48
      },
      {
        "start": 66.48,
        "end": 76.88
      }
    ],
    "recallBoundary": 65.6,
    "captions": {
      "de": [
        "Neue Vokabeln mit Schlüsselwörtern verbinden",
        "Ein ähnlich klingendes bekanntes Wort kann als Brücke zu einer fremdsprachigen Bedeutung dienen. Du verknüpfst das Schlüsselwort bildlich mit der Bedeutung und prüfst danach die echte Vokabel.",
        "Ein ähnlicher Klang ist keine korrekte Aussprache. Nicht für jedes Wort gibt es eine gute Brücke. Die Methode ersetzt weder Ausspracheprüfung noch Schreibweise und Verwendung im Satz.",
        "Prüfe Bedeutung und korrekte Aussprache der neuen Vokabel.",
        "Suche ein bekanntes Wort mit ähnlichem Klang.",
        "Verbinde dieses Schlüsselwort und die Bedeutung durch eine klare Vorstellung.",
        "Rufe die Bedeutung aus der Vokabel ab und danach die Vokabel aus der Bedeutung.",
        "Prüfe das Original: Aussprache, Schreibweise und ein passender Beispielsatz.",
        "Englisch: bell = cloche auf Französisch, Glocke auf Deutsch. Beispiel: The bell rings. = La cloche sonne.",
        "Das französische Wort „belle“ kann als Klangbrücke dienen: Stelle dir eine sehr schöne Glocke vor, die läutet. „Belle“ ist die Merkhilfe, keine Umschrift der englischen Aussprache von bell.",
        "Rufe das gehörte Beispiel ohne Vorlage ab. Erkläre die Bedeutung und den Weg der Merkhilfe.",
        "Teste die Technik an einer Vokabel, die du wirklich brauchst. Prüfe auch die Gegenrichtung: Kannst du aus der Bedeutung die fremdsprachige Form abrufen? Verwirrt dich das Schlüsselwort, ändere die Brücke oder nutze direktes Abrufen."
      ],
      "en": [
        "Connect vocabulary through keywords",
        "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
        "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
        "Check the new word’s meaning and correct pronunciation.",
        "Find a familiar word with a similar sound.",
        "Imagine a clear connection between that keyword and the meaning.",
        "Retrieve the meaning from the word, then the word from its meaning.",
        "Check the original pronunciation, spelling and an example sentence.",
        "English: bell = cloche in French. Example: The bell rings. = La cloche sonne.",
        "The French word “belle” can be a sound cue: imagine a very beautiful bell ringing. “Belle” is the mnemonic, not a transcription of the English pronunciation of bell.",
        "Recall the example you heard without looking. Explain its meaning and how the memory cue works.",
        "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval."
      ],
      "fr": [
        "Relier le vocabulaire à des mots-clés",
        "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image. Puis vérifie le mot à apprendre.",
        "Un son proche n’est pas une prononciation correcte. Certains mots ne se prêtent pas à cette technique. Vérifie séparément la prononciation, l’orthographe et l’emploi dans une phrase.",
        "Vérifie le sens et la prononciation correcte du nouveau mot.",
        "Cherche un mot connu au son proche.",
        "Imagine un lien clair entre ce mot-clé et le sens.",
        "Retrouve le sens à partir du mot, puis le mot à partir du sens.",
        "Vérifie la prononciation, l’orthographe et une phrase d’exemple.",
        "Anglais : bell = cloche. Exemple : The bell rings. = La cloche sonne.",
        "Le mot français « belle » peut servir d’indice sonore : imagine une très belle cloche qui sonne. « Belle » est l’aide-mémoire, pas une transcription de la prononciation anglaise de bell.",
        "Quel mot anglais signifie cloche ? Écris le mot, son sens et la phrase d’exemple de mémoire.",
        "Fais un essai avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct."
      ],
      "es": [
        "Conecta el vocabulario a través de palabras clave",
        "Una palabra familiar con un sonido similar puede servir como puente para el significado de una palabra extranjera. Conecta la palabra clave y el significado en una imagen, luego verifica el término real.",
        "Un sonido similar no es la pronunciación correcta. Algunas palabras no ofrecen una palabra clave útil. Verifica la pronunciación, ortografía y uso en una oración por separado.",
        "Verifica el significado del nuevo vocablo y su pronunciación correcta.",
        "Busca una palabra familiar con un sonido similar.",
        "Imagina una conexión clara entre la palabra clave y el significado.",
        "Recupera el significado desde la palabra, luego la palabra desde su significado.",
        "Verifica la pronunciación original, ortografía y una oración de ejemplo.",
        "EN: bell = campana. “The bell rings.” = “La campana suena.”",
        "FR: belle = bella. Imagina una campana muy bella que suena. La palabra sirve de puente para recordar, no como modelo de pronunciación.",
        "Escribe de memoria la palabra extranjera, su significado y la frase de ejemplo.",
        "Prueba una palabra que realmente necesitas. Prueba también la dirección inversa: ¿puedes recuperar la forma extranjera a partir de su significado? Si la palabra clave te confunde, cambia el puente o usa la recuperación directa."
      ],
      "it": [
        "Collega il vocabolario attraverso parole chiave",
        "Una parola familiare con un suono simile può fornire un ponte per il significato di una parola straniera. Collega la parola chiave e il significato in un'immagine, poi verifica la parola reale.",
        "Un suono simile non è la pronuncia corretta. Alcune parole non offrono un'utile parola chiave. Verifica la pronuncia, l'ortografia e l'uso in una frase separatamente.",
        "Verifica il significato della parola nuova e la pronuncia corretta.",
        "Trova una parola familiare con un suono simile.",
        "Immagina un'associazione chiara tra la parola chiave e il significato.",
        "Ricava il significato dalla parola, poi la parola dal suo significato.",
        "Verifica la pronuncia originale, l'ortografia e un esempio di frase.",
        "EN: bell = campana. “The bell rings.” = “La campana suona.”",
        "FR: belle = bella. Immagina una campana molto bella che suona. La parola è un aiuto per ricordare, non un modello di pronuncia.",
        "Scrivi a memoria la parola straniera, il suo significato e la frase di esempio.",
        "Prova con una parola che ti serve davvero. Controlla anche il percorso inverso: riesci a ricordare la parola straniera partendo dal significato? Se la parola chiave ti confonde, cambia associazione oppure esercita direttamente il richiamo."
      ],
      "pt": [
        "Conecte o vocabulário por meio de palavras-chave",
        "Uma palavra familiar com som semelhante pode fornecer uma ponte para o significado de uma palavra estrangeira. Conecte a palavra-chave e o significado em uma imagem, em seguida, verifique a palavra real.",
        "Um som semelhante não é a pronúncia correta. Algumas palavras não oferecem uma palavra-chave útil. Verifique a pronúncia, ortografia e uso em uma frase separadamente.",
        "Verifique o significado da nova palavra e a pronúncia correta.",
        "Encontre uma palavra familiar com som semelhante.",
        "Imagine uma ligação clara entre a palavra-chave e o significado.",
        "Recupere o significado da palavra, em seguida, a palavra a partir do seu significado.",
        "Verifique a pronúncia original, ortografia e uma frase de exemplo.",
        "EN: bell = sino. “The bell rings.” = “O sino toca.”",
        "FR: belle = bela. Imagina um sino muito belo a tocar. A palavra é uma ajuda para recordar, não um modelo de pronúncia.",
        "Escreva de memória a palavra estrangeira, o significado e a frase de exemplo.",
        "Tente uma palavra que você realmente precisa. Teste a direção inversa também: é possível recuperar a forma estrangeira a partir do seu significado? Se a palavra-chave te confundir, mude a ponte ou use a recuperação direta."
      ],
      "nl": [
        "Verbind woorden met sleutelwoorden",
        "Een bekend woord met een vergelijkbare klank kan een brug vormen naar de betekenis van een vreemd woord. Verbind het sleutelwoord en de betekenis in een beeld en controleer daarna het echte woord.",
        "Een vergelijkbare klank is niet de juiste uitspraak. Sommige woorden hebben geen bruikbaar sleutelwoord. Controleer uitspraak, spelling en gebruik in een zin afzonderlijk.",
        "Controleer de betekenis en de juiste uitspraak van het nieuwe woord.",
        "Zoek een bekend woord met een gelijksoortig geluid.",
        "Stel je een duidelijke verbinding tussen het sleutelwoord en de betekenis voor.",
        "Haal de betekenis op vanuit het woord en daarna het woord vanuit de betekenis.",
        "Controleer de oorspronkelijke uitspraak, spelling en een voorbeeldzin.",
        "EN: bell = bel. “The bell rings.” = “De bel luidt.”",
        "FR: belle = mooi. Stel je een heel mooie bel voor die luidt. Het woord is een geheugensteuntje, geen voorbeeld van de juiste uitspraak.",
        "Schrijf het vreemde woord, de betekenis en de voorbeeldzin uit je geheugen op.",
        "Probeer een woord dat je echt nodig hebt. Test ook de andere richting: kun je het vreemde woord vanuit de betekenis ophalen? Als het sleutelwoord verwarrend is, verander dan het geheugensteuntje of oefen het direct ophalen."
      ],
      "tr": [
        "Sözcükleri anahtar sözcüklerle ilişkilendir",
        "Benzer sesli, bildiğin bir sözcük yabancı bir sözcüğün anlamına köprü olabilir. Anahtar sözcükle anlamı bir görüntüde birleştir, sonra asıl sözcüğü kontrol et.",
        "Benzer ses, doğru telaffuz demek değildir. Her sözcük için yararlı bir anahtar sözcük bulunmaz. Telaffuzu, yazımı ve cümle içindeki kullanımı ayrı ayrı kontrol et.",
        "Yeni sözcüğün anlamını ve doğru telaffuzunu kontrol et.",
        "Benzer sesli, bildiğin bir sözcük bul.",
        "Anahtar sözcükle anlam arasında belirgin bir bağlantı hayal et.",
        "Sözcükten anlamını, sonra anlamından sözcüğü hatırla.",
        "Asıl telaffuzu, yazımı ve bir örnek cümleyi kontrol et.",
        "EN: bell = çan. “The bell rings.” = “Çan çalıyor.”",
        "FR: belle = güzel. Çalan çok güzel bir çan hayal et. Bu sözcük bir hatırlama ipucudur, doğru telaffuz örneği değildir.",
        "Yabancı sözcüğü, anlamını ve örnek cümleyi hafızandan yaz.",
        "Gerçekten ihtiyaç duyduğun bir sözcükle dene. Ters yönü de sına: anlamından yabancı sözcüğü hatırlayabiliyor musun? Anahtar sözcük kafanı karıştırıyorsa bağlantıyı değiştir veya doğrudan hatırlama çalış."
      ],
      "ar": [
        "اربط المفردات بكلمات مفتاحية",
        "قد تكون كلمة مألوفة ذات صوت مشابه جسرًا إلى معنى كلمة أجنبية. اربط الكلمة المفتاحية والمعنى بصورة ذهنية، ثم تحقّق من الكلمة الأصلية.",
        "تشابه الصوت لا يعني صحة النطق. بعض الكلمات لا يناسبها مفتاح مفيد. تحقّق من النطق والتهجئة والاستعمال في جملة كلٍّ على حدة.",
        "تحقّق من معنى الكلمة الجديدة ونطقها الصحيح.",
        "ابحث عن كلمة مألوفة ذات صوت مشابه.",
        "تخيّل ارتباطًا واضحًا بين الكلمة المفتاحية والمعنى.",
        "استرجع المعنى من الكلمة، ثم الكلمة من معناها.",
        "تحقّق من النطق الأصلي والتهجئة وجملة نموذجية.",
        "EN: bell = جرس. “The bell rings.” = “يرن الجرس.”",
        "FR: belle = جميلة. تخيّل جرسًا جميلًا جدًا يرن. هذه الكلمة وسيلة للتذكّر، وليست نموذجًا للنطق الصحيح.",
        "اكتب الكلمة الأجنبية ومعناها والجملة النموذجية من الذاكرة.",
        "جرّب كلمة تحتاج إليها فعلًا. اختبر الاتجاه العكسي أيضًا: هل تستطيع استرجاع الكلمة الأجنبية من معناها؟ إذا أربكك المفتاح، غيّر الرابط أو تدرب على الاسترجاع المباشر."
      ],
      "zh": [
        "通过关键词连接词汇",
        "一个发音相似的熟悉单词可以作为连接外语单词意义的桥梁。在图像中将关键词与其意义关联，然后核对实际单词。",
        "相似发音并不等于正确发音。有些单词没有可用的关键词。需分别检查发音、拼写和在句子中的用法。",
        "核对新单词的意义和正确发音。",
        "寻找一个发音相似的熟悉单词。",
        "在脑海中清晰地建立该关键词与其意义之间的联系。",
        "从单词中回忆出其意义，再从意义中回忆出单词本身。",
        "核对原始发音、拼写以及一个例句。",
        "EN: bell = 铃. “The bell rings.” = “铃响了。”",
        "FR: belle = 美丽的. 想象一只非常美丽的铃正在响。 这个词是记忆线索，不是正确发音的范本。",
        "请凭记忆写出外语单词、词义和例句。",
        "尝试一个你真正需要的单词。测试反向过程：能否从其意义中回忆出外语形式？如果关键词让你困惑，可以改变桥梁或直接回忆。"
      ],
      "ja": [
        "キーワードで外国語の単語を結びつける",
        "音が似た既知の語が、外国語の意味に橋渡しを提供できる。キーワードと意味をイメージで結びつけ、その後実際にその語を確認しよう",
        "音が似ているとは正確な発音ではない。一部の語には有用なキーワードが存在しない。発音、スペル、文脈での使用をそれぞれ別々に確認しよう",
        "新しい語の意味と正しい発音を確認しよう",
        "音が似た既知の語を探そう",
        "そのキーワードと意味の間で明確なつながりをイメージしよう",
        "単語から意味を思い出し、次に意味から単語を思い出しましょう。",
        "元の発音、スペル、そして例文を確認しよう",
        "EN: bell = 鐘. “The bell rings.” = “鐘が鳴ります。”",
        "FR: belle = 美しい. とても美しい鐘が鳴る様子を想像してください。 この語は記憶の手掛かりであり、正しい発音の見本ではありません。",
        "外国語の単語と意味、例文を記憶から書きましょう。",
        "実際に必要な単語で試しましょう。意味から外国語の単語を思い出せるかも確かめます。キーワードが混乱の原因になるなら、別の連想に変えるか、直接思い出す練習をしましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "long-words",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-long-words-fr-visual-09a2b0abf7a4.mp4",
    "bytes": 1328478,
    "sha256": "09a2b0abf7a460fd38f2dc3e478cf52b742dc6e8e42768fbe63ef0dbd3ae8cb6",
    "duration": 90.68,
    "cues": [
      {
        "start": 0.0,
        "end": 3.52
      },
      {
        "start": 3.52,
        "end": 12.08
      },
      {
        "start": 12.08,
        "end": 24.44
      },
      {
        "start": 24.44,
        "end": 27.56
      },
      {
        "start": 27.56,
        "end": 29.76
      },
      {
        "start": 29.76,
        "end": 34.4
      },
      {
        "start": 34.4,
        "end": 42.52
      },
      {
        "start": 42.52,
        "end": 46.92
      },
      {
        "start": 46.92,
        "end": 53.12
      },
      {
        "start": 53.12,
        "end": 56.16
      },
      {
        "start": 56.16,
        "end": 74.56
      },
      {
        "start": 74.56,
        "end": 81.8
      },
      {
        "start": 81.8,
        "end": 90.68
      }
    ],
    "recallBoundary": 80.80778541666668,
    "captions": {
      "de": [
        "Lange Wörter sicher behalten",
        "Du zerlegst ein langes Wort in verständliche Bausteine, setzt sie wieder zusammen und übst Bedeutung, Aussprache und Schreibweise.",
        "Bedeutungsbausteine sind nicht immer Sprechsilben. Nicht jedes Fachwort lässt sich sofort sinnvoll zerlegen. Kläre unbekannte Teile und die korrekte Aussprache, bevor du sie übst.",
        "Kläre die Bedeutung des ganzen Wortes.",
        "Suche bekannte Bausteine und erkläre ihre Bedeutung.",
        "Achte auf Änderungen der Schreibweise und auf Verbindungselemente.",
        "Sprich die Teile langsam und dann das ganze Wort flüssig. Sprechsilben können anders verlaufen als die Bedeutungsgrenzen.",
        "Verdecke die Vorlage, schreibe das ganze Wort und erkläre es.",
        "Vergleiche Schreibweise und Bedeutung. Übe unsichere Stellen und setze danach wieder das ganze Wort zusammen.",
        "incompréhensible",
        "in | compréhensible: etwas, das man nicht verstehen kann. „in“ verneint hier „compréhensible“. „Compréhensible“ hängt mit dem Verb „comprendre“ zusammen. Die Bausteine helfen beim Verstehen; sie sind keine Umschrift der Aussprache.",
        "Rufe das gehörte Beispiel ohne Vorlage ab. Erkläre die Bedeutung und den Weg der Merkhilfe.",
        "Wähle ein langes Wort aus deinem Alltag. Suche sinnvolle Bausteine und prüfe danach das vollständige Wort. Für andere Sprachen gelten deren Wortbildungs- und Ausspracheregeln."
      ],
      "en": [
        "Remember long words",
        "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
        "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
        "Clarify the meaning of the whole word.",
        "Identify familiar parts and explain what they contribute.",
        "Notice spelling changes and connecting elements.",
        "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "Hide the example, write the whole word and explain it.",
        "Check spelling and meaning. Practise uncertain parts, then put the whole word together again.",
        "incompréhensible",
        "in | compréhensible: something that cannot be understood. Here, “in” negates “compréhensible”. “Compréhensible” is related to the verb “comprendre”. This division helps with meaning; it is not a transcription of pronunciation.",
        "Recall the example you heard without looking. Explain its meaning and how the memory cue works.",
        "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language."
      ],
      "fr": [
        "Dans ce cours, tu vas apprendre à retenir les mots longs.",
        "Décompose un mot long en éléments compréhensibles, puis reconstitue-le. Travaille son sens, sa prononciation et son orthographe.",
        "Découper un mot pour comprendre son sens ne revient pas toujours à le découper de la même façon à l’oral. Certains termes techniques sont entièrement nouveaux. Vérifie leur sens et leur prononciation avant de les travailler.",
        "Clarifie le sens du mot entier.",
        "Repère des éléments connus et explique leur rôle.",
        "Observe les changements d’orthographe et les éléments de liaison.",
        "Dis chaque partie lentement. Ensuite, dis le mot entier de façon naturelle. Le découpage à l’oral peut être différent.",
        "Cache le modèle, écris le mot entier et explique-le.",
        "Vérifie l’orthographe et le sens. Travaille les parties incertaines, puis rassemble à nouveau le mot.",
        "Exemple : incompréhensible.",
        "Le mot incompréhensible signifie : ce qui ne peut pas être compris. On sépare le préfixe in et le mot compréhensible. Le préfixe in apporte ici la négation. Compréhensible est lié au verbe comprendre. Ce découpage aide à saisir le sens. Il ne constitue pas une transcription de la prononciation.",
        "Écris le mot entier de mémoire. Explique ensuite son sens à voix haute et prononce-le avec fluidité.",
        "Choisis un mot long utile dans ta vie. Repère ses éléments de sens, puis travaille le mot entier. Respecte les règles de formation et de prononciation de sa langue."
      ],
      "es": [
        "Recuerda las palabras largas",
        "Divide una palabra larga en partes con significado, vuelve a unirlas y practica su significado, pronunciación y escritura.",
        "Las partes significativas no siempre son sílabas habladas. Algunos términos técnicos son desconocidos en su totalidad. Verifica su significado y pronunciación antes de practicarlos.",
        "Aclara el significado de la palabra completa.",
        "Identifica partes conocidas y explica qué aportan.",
        "Nota los cambios ortográficos y elementos que las conectan.",
        "Pronuncia las partes despacio y después la palabra completa con fluidez. Los límites entre sílabas pueden diferir de los límites entre unidades de significado.",
        "Oculta el ejemplo, escribe la palabra completa y explica su significado.",
        "Comprueba la escritura y el significado. Practica las partes dudosas y después vuelve a unir la palabra completa.",
        "incompréhensible",
        "in | compréhensible — incomprensible: que no se puede entender. El prefijo in- expresa negación; compréhensible está relacionado con comprendre. Son unidades de significado, no una transcripción de la pronunciación.",
        "Escribe la palabra completa de memoria. Luego explica su significado en voz alta y di la palabra con fluidez.",
        "Elige una palabra larga relevante para tu vida. Busca partes significativas, luego practica la palabra completa. Usa las reglas de formación y pronunciación del idioma."
      ],
      "it": [
        "Ricorda le parole lunghe",
        "Dividi una parola lunga in parti dotate di significato, riuniscile e pratica il significato, la pronuncia e la scrittura della parola intera.",
        "Le parti dotate di significato non coincidono sempre con le sillabe. Alcuni termini tecnici sono del tutto sconosciuti: verifica significato e pronuncia prima di esercitarti.",
        "Chiarisci il significato della parola intera.",
        "Identifica parti familiari e spiega il loro contributo.",
        "Osserva i cambiamenti ortografici e gli elementi di collegamento.",
        "Pronuncia lentamente le parti, poi la parola intera con scioltezza. I confini tra sillabe possono differire da quelli tra parti di significato.",
        "Nascondi l'esempio, scrivi la parola intera e spiegala.",
        "Verifica grafia e significato. Pratica le parti incerte, poi riunisci nuovamente la parola intera.",
        "incompréhensible",
        "in | compréhensible — incomprensibile: che non si può capire. Il prefisso in- esprime negazione; compréhensible è legato a comprendre. Sono unità di significato, non una trascrizione della pronuncia.",
        "Scrivi la parola completa a memoria. Poi spiegane il significato ad alta voce e pronunciala con scioltezza.",
        "Scegli una parola lunga utile nella tua vita. Individua parti dotate di significato e poi esercita la parola intera. Rispetta le regole di formazione e pronuncia della sua lingua."
      ],
      "pt": [
        "Lembre-se de palavras longas",
        "Divida uma palavra longa em partes com significado, volte a juntá-las e pratique o significado, a pronúncia e a escrita da palavra completa.",
        "Partes significativas não são sempre sílabas faladas. Alguns termos técnicos são desconhecidos em sua totalidade. Verifique seu significado e pronúncia antes de praticar.",
        "Esclareça o significado da palavra inteira.",
        "Identifique partes familiares e explique o que elas contribuem.",
        "Observe mudanças na escrita e elementos que as conectam.",
        "Diga as partes lentamente, depois diga a palavra inteira com fluidez. Os limites das sílabas podem diferir dos limites do significado.",
        "Esconda o exemplo, escreva a palavra inteira e explique-a.",
        "Verifique a escrita e o significado. Pratique as partes incertas, depois reúna toda a palavra novamente.",
        "incompréhensible",
        "in | compréhensible — incompreensível: que não pode ser compreendido. O prefixo in- exprime negação; compréhensible está ligado a comprendre. São unidades de significado, não uma transcrição da pronúncia.",
        "Escreva a palavra completa de memória. Depois, explique o significado em voz alta e pronuncie a palavra com fluidez.",
        "Escolha uma palavra longa relevante para sua vida. Encontre partes significativas, depois pratique a palavra inteira. Use as regras de formação e pronúncia da língua."
      ],
      "nl": [
        "Onthoud lange woorden",
        "Verdeel een lang woord in betekenisvolle delen, voeg die weer samen en oefen betekenis, uitspraak en spelling.",
        "Betekenisvolle delen zijn niet altijd lettergrepen. Sommige vaktermen zijn helemaal onbekend. Controleer hun betekenis en uitspraak voordat je oefent.",
        "Verduidelijk de betekenis van het hele woord.",
        "Identificeer bekende delen en leg uit wat ze bijdragen.",
        "Let op spellingveranderingen en verbindingselementen.",
        "Zeg de delen langzaam en daarna het hele woord vloeiend. Grenzen tussen lettergrepen kunnen anders liggen dan grenzen tussen betekenisdelen.",
        "Verberg het voorbeeld, schrijf het hele woord en leg het uit.",
        "Controleer spelling en betekenis. Oefen de onzekere delen en voeg het hele woord weer samen.",
        "incompréhensible",
        "in | compréhensible — onbegrijpelijk: wat niet begrepen kan worden. Het voorvoegsel in- geeft een ontkenning aan; compréhensible hangt samen met comprendre. Dit zijn betekenisvolle delen, geen weergave van de uitspraak.",
        "Schrijf het hele woord uit je geheugen op. Leg daarna hardop de betekenis uit en spreek het vloeiend uit.",
        "Kies een lang woord dat voor jou nuttig is. Zoek betekenisvolle delen en oefen daarna het hele woord. Gebruik de woordvormings- en uitspraakregels van de betreffende taal."
      ],
      "tr": [
        "Uzun sözcükleri hatırla",
        "Uzun bir sözcüğü anlamlı parçalara ayır, yeniden birleştir ve anlamını, telaffuzunu ve yazımını çalış.",
        "Anlamlı parçalar her zaman hecelerle örtüşmez. Bazı teknik terimler tamamen yabancı olabilir. Çalışmadan önce anlamlarını ve telaffuzlarını kontrol et.",
        "Sözcüğün bütününün anlamını netleştir.",
        "Tanıdığın parçaları belirle ve anlama katkılarını açıkla.",
        "Yazım değişikliklerine ve birleştirici öğelere dikkat et.",
        "Parçaları yavaşça, sonra sözcüğün tamamını akıcı biçimde söyle. Hece sınırları anlam parçalarının sınırlarından farklı olabilir.",
        "Örneği gizle, sözcüğün tamamını yaz ve açıkla.",
        "Yazımı ve anlamı kontrol et. Emin olmadığın parçaları çalış, sonra sözcüğün tamamını yeniden birleştir.",
        "incompréhensible",
        "in | compréhensible — anlaşılmaz: anlaşılması mümkün olmayan. in- ön eki olumsuzluk belirtir; compréhensible, comprendre fiiliyle ilişkilidir. Bunlar anlam birimleridir, telaffuzun yazıya aktarımı değildir.",
        "Sözcüğün tamamını hafızandan yaz. Sonra anlamını sesli açıkla ve sözcüğü akıcı biçimde söyle.",
        "Hayatında işine yarayan uzun bir sözcük seç. Anlamlı parçaları bul ve ardından sözcüğün tamamını çalış. Sözcüğün ait olduğu dilin sözcük oluşturma ve telaffuz kurallarını kullan."
      ],
      "ar": [
        "تذكّر الكلمات الطويلة",
        "قسّم كلمة طويلة إلى أجزاء ذات معنى، ثم أعد تركيبها وتدرّب على معناها ونطقها وتهجئتها.",
        "الأجزاء ذات المعنى لا تتطابق دائمًا مع المقاطع الصوتية. قد تكون بعض المصطلحات التقنية غير مألوفة بالكامل. تحقّق من معناها ونطقها قبل التدريب.",
        "وضّح معنى الكلمة كاملة.",
        "حدّد الأجزاء المألوفة واشرح ما تضيفه إلى المعنى.",
        "لاحظ تغيّرات التهجئة وعناصر الربط.",
        "انطق الأجزاء ببطء، ثم الكلمة كاملة بسلاسة. قد تختلف حدود المقاطع الصوتية عن حدود أجزاء المعنى.",
        "أخفِ المثال واكتب الكلمة كاملة واشرحها.",
        "تحقّق من التهجئة والمعنى. تدرّب على الأجزاء غير الواضحة ثم أعد تركيب الكلمة كاملة.",
        "incompréhensible",
        "in | compréhensible — غير مفهوم: ما لا يمكن فهمه. تفيد السابقة in- النفي؛ وترتبط compréhensible بالفعل comprendre. هذه وحدات للمعنى، وليست كتابة صوتية للنطق.",
        "اكتب الكلمة كاملة من الذاكرة. ثم اشرح معناها بصوت عالٍ وانطقها بسلاسة.",
        "اختر كلمة طويلة مفيدة في حياتك. حدّد أجزاءها ذات المعنى ثم تدرّب على الكلمة كاملة. اتبع قواعد بناء الكلمات ونطقها في لغتها."
      ],
      "zh": [
        "记住长词",
        "将一个长词拆分成有意义的部分，重新组合并练习其含义、发音和拼写。",
        "有意义的部分不一定与音节重合。有些专业术语可能完全陌生。练习前应先核实它们的含义和发音。",
        "明确整个词的含义。",
        "找出熟悉的部分并解释它们的贡献。",
        "注意拼写变化和连接元素。",
        "先缓慢地说出各个部分，再流畅地说出整个词。音节边界可能与语义边界不同。",
        "隐藏例子，写出整个词并解释它。",
        "检查拼写和含义。先练习不确定的部分，然后重新拼出整个词。",
        "incompréhensible",
        "in | compréhensible — 不可理解的：无法被理解的. 前缀 in- 表示否定；compréhensible 与动词 comprendre 有关。 这些是意义单位，不是发音标注。",
        "从记忆中写出完整单词。然后大声解释其含义并流畅地读出来。",
        "选择一个与你生活相关的长词。找出有意义的部分，然后练习整个词。使用该词语言的构词和发音规则。"
      ],
      "ja": [
        "長い単語を覚える",
        "長い単語を意味のある部分に分割し、それらを再構成して、意味、発音、スペルを練習しよう。",
        "意味のある部分は必ずしも発音される音節とは限らない。いくつかの専門用語は、まったく未知である。その意味と発音を確認した上で練習しよう。",
        "全体の単語の意味を明確にしよう。",
        "馴染みのある部分を特定し、それぞれがどんな貢献をしているか説明しよう。",
        "スペルの変化やつながり要素に注意を払おう。",
        "部分をゆっくりと発音してから、全体を流暢に発音しよう。音節の境界は意味の境界とは必ずしも一致しない。",
        "例を隠し、全体の単語を書き、その意味を説明しよう。",
        "スペルと意味を確認し、不安な部分を練習した後、全体の単語を再構成しよう。",
        "incompréhensible",
        "in | compréhensible — 理解できない、理解不可能な. 接頭辞 in- は否定を表し、compréhensible は動詞 comprendre と関連しています。 これは意味のまとまりであり、発音表記ではありません。",
        "記憶から完全な単語を書こう。その後、その意味を口に出して説明し、流暢に発音しよう。",
        "生活に関連する長い単語を選び、意味のある部分を特定した後、全体の単語を練習しよう。その言語の単語形成および発音ルールを使用しよう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "text-meaning",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-text-meaning-fr-visual-0f5574f84420.mp4",
    "bytes": 1541823,
    "sha256": "0f5574f84420ccae89c31f1b7cc83a3b70e9d2af76185c88174e600fc90b1df1",
    "duration": 104.96,
    "cues": [
      {
        "start": 0.0,
        "end": 3.0
      },
      {
        "start": 3.0,
        "end": 14.12
      },
      {
        "start": 14.12,
        "end": 27.36
      },
      {
        "start": 27.36,
        "end": 31.92
      },
      {
        "start": 31.92,
        "end": 36.72
      },
      {
        "start": 36.72,
        "end": 42.6
      },
      {
        "start": 42.6,
        "end": 46.12
      },
      {
        "start": 46.12,
        "end": 53.44
      },
      {
        "start": 53.44,
        "end": 59.16
      },
      {
        "start": 59.16,
        "end": 76.8
      },
      {
        "start": 76.8,
        "end": 91.76
      },
      {
        "start": 91.76,
        "end": 97.24
      },
      {
        "start": 97.24,
        "end": 104.96
      }
    ],
    "recallBoundary": 96.24300833333334,
    "captions": {
      "de": [
        "Lange Texte inhaltlich behalten",
        "Du lernst, die Aussagen und Zusammenhänge eines Textes ohne Vorlage wiederzugeben. Das hilft bei Sachtexten, Vorträgen und Prüfungsvorbereitung.",
        "Eine Zusammenfassung enthält nicht jedes Detail. Wenn genaue Zahlen oder Formulierungen wichtig sind, übe sie zusätzlich. Beginne mit einem kurzen Abschnitt; verlängere ihn erst, wenn du ihn erklären kannst.",
        "Lies einen Abschnitt und kläre unbekannte Begriffe.",
        "Teile ihn nach Gedanken auf. Gib jedem Gedanken eine kurze Überschrift.",
        "Formuliere eine Frage pro Abschnitt: Was passiert? Warum? Welche Folge hat es?",
        "Decke die Vorlage ab und beantworte die Fragen in eigenen Worten.",
        "Vergleiche mit dem Original: Welche Aussage fehlt, welche Verbindung ist falsch? Korrigiere gezielt.",
        "Rufe den Inhalt später erneut ab. Passe den Abstand daran an, wie sicher der Abruf gelingt.",
        "Eine Stadt pflanzt Bäume an einer viel befahrenen Straße. Ihre Kronen spenden Schatten. Wasser verdunstet über die Blätter und trägt zur Kühlung bei. Damit die Bäume bei Trockenheit gesund bleiben, brauchen sie ausreichend Wasser und Platz für ihre Wurzeln.",
        "Drei Sinnabschnitte: Maßnahme (Bäume pflanzen), Wirkung (Schatten und Verdunstung), Voraussetzung (Wasser und Wurzelraum). Die Gliederung hält den Zusammenhang fest.",
        "Erkläre ohne Vorlage: Welche Maßnahme wird beschrieben, wie wirkt sie und was braucht sie?",
        "Nimm einen eigenen kurzen Sachtext. Erstelle drei Leitfragen, lege den Text weg und beantworte sie. Steigere später die Länge, nicht nur die Anzahl der Wiederholungen."
      ],
      "en": [
        "Remember the meaning of long texts",
        "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
        "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
        "Read a passage and clarify unfamiliar terms.",
        "Group it by ideas and give each group a short heading.",
        "Ask a question for each part: what happens, why, and with what result?",
        "Hide the source and answer in your own words.",
        "Compare with the original. Correct missing ideas and mistaken connections.",
        "Recall it again later. Adjust the interval to how reliably you remember.",
        "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
        "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
        "Without looking, explain the action, how it works and what it requires.",
        "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length."
      ],
      "fr": [
        "Retenir le sens d’un texte long",
        "Apprends à restituer les idées et les liens d’un texte sans le regarder. Cette méthode convient aux textes documentaires, aux présentations et à la préparation d’un examen.",
        "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage. Allonge ce passage quand tu peux en expliquer le sens.",
        "Commence par lire un passage. Clarifie les termes inconnus.",
        "Repère les idées du passage. Donne un titre court à chacune.",
        "Pose une question par partie : que se passe-t-il, pourquoi et avec quelles conséquences ?",
        "Cache le texte et réponds avec tes propres mots.",
        "Compare ton rappel avec le texte original. Ajoute les idées manquantes. Corrige les erreurs dans les liens entre les idées.",
        "Plus tard, recommence le rappel. Adapte le délai selon la qualité de ta réponse.",
        "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. Les feuilles rejettent de l’eau par évaporation. Cette évaporation contribue au refroidissement. Pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau. Leurs racines ont aussi besoin d’espace pour rester en bonne santé.",
        "On distingue trois parties. Premièrement, l’action : planter des arbres. Deuxièmement, les effets : l’ombre et l’évaporation. Troisièmement, les conditions : de l’eau et de l’espace pour les racines. Ce plan conserve les liens entre les idées.",
        "Sans regarder le texte, explique l’action décrite, ses effets et ses conditions.",
        "Choisis un court texte documentaire. Prépare trois questions, mets le texte de côté et réponds. Augmente progressivement la longueur du passage."
      ],
      "es": [
        "Recuerda el significado de textos largos",
        "Aprende a recordar las ideas y relaciones en un texto sin mirar. Usa esto para lectura factual, presentaciones y preparación de exámenes.",
        "Un resumen no conserva todos los detalles. Practica números o palabras exactas por separado cuando sea necesario. Comienza con un pasaje corto y aumenta su longitud después de que puedas explicarlo.",
        "Lee un fragmento y aclara los términos desconocidos.",
        "Agrúpalo por ideas y asigna un título breve a cada grupo.",
        "Formula una pregunta para cada parte: ¿qué ocurre, por qué y con qué resultado?",
        "Oculta la fuente y responde en tus propias palabras.",
        "Compara con el original. Corrige ideas faltantes y conexiones erróneas.",
        "Recuerda nuevamente más tarde. Ajusta el intervalo según la confiabilidad con la que lo recuerdas.",
        "Un pueblo planta árboles al lado de una carretera con tráfico intenso. Sus copas proporcionan sombra. El agua se evapora a través de las hojas y contribuye al enfriamiento. Para permanecer saludables en condiciones de sequía, los árboles necesitan suficiente agua y espacio para sus raíces.",
        "Tres grupos: acción (plantar árboles), efectos (sombra y evaporación) y requisitos (agua y espacio para las raíces). El esquema conserva su relación.",
        "Sin mirar, explica la acción, cómo funciona y qué requiere.",
        "Elige un breve texto factual propio. Escribe tres preguntas guía, pon el texto lejos y responde a ellas. Aumenta gradualmente su longitud."
      ],
      "it": [
        "Ricorda il significato dei testi lunghi",
        "Apprendi a ricordare le idee e le relazioni in un testo senza guardare. Usa questo per la lettura fattuale, le presentazioni e la preparazione degli esami.",
        "Un riassunto non preserva ogni dettaglio. Pratica numeri o parole esatte separatamente quando necessario. Inizia con un breve passaggio e aumenta la sua lunghezza dopo averne spiegato il contenuto.",
        "Leggi un passaggio e chiarisci termini sconosciuti.",
        "Organizzalo per idee e assegna a ciascun gruppo un breve titolo.",
        "Fai una domanda per ogni parte: cosa accade, perché e con quale risultato?",
        "Nascondi la fonte e rispondi in parole tue.",
        "Compara con l'originale. Correggi idee mancanti e connessioni errate.",
        "Richiama il contenuto più tardi. Adatta l’intervallo a quanto riesci a ricordare con sicurezza.",
        "Un comune pianta alberi accanto a una strada trafficata. Le chiome fanno ombra. L’acqua evapora dalle foglie e contribuisce al raffreddamento. Per restare sani durante la siccità, gli alberi hanno bisogno di acqua sufficiente e spazio per le radici.",
        "Tre gruppi: azione (piantare alberi), effetti (ombra ed evaporazione), requisiti (acqua e spazio per le radici). Lo schema conserva il rapporto tra questi elementi.",
        "Senza guardare, spiega l'azione, come funziona e cosa richiede.",
        "Scegli un breve testo fattuale di tua scelta. Scrivi tre domande guida, metti da parte il testo e rispondi a queste domande. Aumenta progressivamente la lunghezza."
      ],
      "pt": [
        "Lembre-se do significado de textos longos",
        "Aprenda a lembrar as ideias e as relações em um texto sem olhar. Use isso para leitura factual, apresentações e preparação para provas.",
        "Um resumo não preserva todos os detalhes. Pratique números ou frases exatas separadamente quando necessário. Comece com um trecho curto e aumente o comprimento depois que conseguir explicá-lo.",
        "Leia um trecho e esclareça termos desconhecidos.",
        "Agrupe por ideias e dê a cada grupo um título curto.",
        "Formule uma pergunta para cada parte: o que acontece, porquê e com que resultado?",
        "Oculte a fonte e responda em suas próprias palavras.",
        "Compare com o original. Corrija ideias faltantes e conexões incorretas.",
        "Lembre-se novamente mais tarde. Ajuste o intervalo de acordo com a confiabilidade da memória.",
        "Uma cidade planta árvores junto a uma estrada movimentada. As copas dão sombra. A água evapora pelas folhas e contribui para o arrefecimento. Para se manterem saudáveis durante a seca, as árvores precisam de água suficiente e espaço para as raízes.",
        "Três grupos: ação (plantar árvores), efeitos (sombra e evaporação) e requisitos (água e espaço para as raízes). O esboço preserva suas relações.",
        "Sem olhar, explique a ação, como ela funciona e o que exige.",
        "Escolha um breve texto factual de sua própria escolha. Escreva três perguntas orientadoras, coloque o texto de lado e responda a elas. Aumente gradualmente o comprimento."
      ],
      "nl": [
        "Onthoud de betekenis van lange teksten",
        "Leer de ideeën en verbanden in een tekst uit je geheugen op te halen. Gebruik dit voor informatieve teksten, presentaties en examenvoorbereiding.",
        "Een samenvatting bewaart niet elk detail. Oefen zo nodig exacte getallen of formuleringen apart. Begin met een korte passage en maak die langer zodra je haar kunt uitleggen.",
        "Lees een tekst en verduidelijk onbekende termen.",
        "Groepeer de tekst per idee en geef elke groep een kort kopje.",
        "Stel een vraag per deel: wat gebeurt er, waarom, en met welk resultaat?",
        "Verberg de bron en antwoord in je eigen woorden.",
        "Vergelijk met de oorspronkelijke tekst. Corrigeer ontbrekende ideeën en verkeerde verbindingen.",
        "Haal de inhoud later opnieuw op. Pas het interval aan aan hoe betrouwbaar je kunt herinneren.",
        "Een stad plant bomen langs een drukke weg. De boomkronen geven schaduw. Water verdampt via de bladeren en draagt bij aan verkoeling. Om gezond te blijven tijdens droogte hebben de bomen voldoende water en ruimte voor hun wortels nodig.",
        "Drie groepen: actie (bomen planten), effecten (schaduw en verdamping), en vereisten (water en wortelruimte). De structuur behoudt hun relatie.",
        "Zonder te kijken, leg uit wat de actie is, hoe het werkt en wat het vereist.",
        "Kies een korte feitelijke tekst van jezelf. Schrijf drie richtvragen, zet de tekst weg en beantwoord ze. Verhoog geleidelijk de lengte."
      ],
      "tr": [
        "Uzun metinlerin anlamını hatırla",
        "Bir metindeki fikirleri ve ilişkileri bakmadan hatırlamayı öğren. Bu, bilgi veren metinlerde, sunumlarda ve sınav hazırlığında kullanılabilir.",
        "Özet her ayrıntıyı korumaz. Gerekiyorsa kesin sayıları veya sözcükleri ayrıca çalış. Kısa bir bölümle başla; açıklayabildiğinde uzunluğu artır.",
        "Bir bölüm oku ve bilmediğin terimleri netleştir.",
        "Fikirlere göre grupla ve her gruba kısa bir başlık ver.",
        "Her bölüm için soru sor: ne oluyor, neden ve sonuç ne?",
        "Kaynağı gizle ve kendi sözlerinle cevapla.",
        "Aslıyla karşılaştır. Eksik fikirleri ve yanlış ilişkileri düzelt.",
        "Daha sonra yeniden hatırla. Aralığı ne kadar güvenilir hatırladığına göre ayarla.",
        "Bir şehir, yoğun bir yolun yanına ağaçlar diker. Ağaçların taçları gölge sağlar. Yapraklardan buharlaşan su serinlemeye katkıda bulunur. Kuraklıkta sağlıklı kalmak için ağaçların yeterli suya ve kökleri için alana ihtiyacı vardır.",
        "Üç grup: eylem (ağaç dikmek), etkiler (gölge ve buharlaşma), koşullar (su ve kök alanı). Bu yapı aralarındaki ilişkiyi korur.",
        "Bakmadan eylemi, nasıl etkili olduğunu ve neye ihtiyaç duyduğunu açıkla.",
        "Kısa bir bilgi metni seç. Üç yol gösterici soru yaz, metni kaldır ve soruları cevapla. Uzunluğu adım adım artır."
      ],
      "ar": [
        "تذكّر معنى النصوص الطويلة",
        "تعلّم استرجاع أفكار النص والعلاقات بينها دون النظر إليه. يفيد ذلك في النصوص المعلوماتية والعروض والتحضير للامتحانات.",
        "الملخّص لا يحتفظ بكل التفاصيل. تدرّب على الأرقام أو الألفاظ الدقيقة بشكل منفصل عند الحاجة. ابدأ بفقرة قصيرة وزد طولها بعد أن تستطيع شرحها.",
        "اقرأ فقرة ووضّح المصطلحات المجهولة.",
        "قسّمها حسب الأفكار وضع عنوانًا قصيرًا لكل مجموعة.",
        "اسأل عن كل جزء: ماذا يحدث، ولماذا، وما النتيجة؟",
        "أخفِ المصدر وأجب بكلماتك.",
        "قارن بالأصل. صحّح الأفكار الناقصة والروابط الخاطئة.",
        "استرجعها لاحقًا مرة أخرى. عدّل الفترة بحسب مدى موثوقية التذكّر.",
        "تزرع مدينة أشجارًا بجوار طريق مزدحم. توفّر تيجان الأشجار الظل. يتبخر الماء عبر الأوراق ويساهم في التبريد. للبقاء بصحة جيدة أثناء الجفاف، تحتاج الأشجار إلى ماء كافٍ ومساحة لجذورها.",
        "ثلاث مجموعات: الإجراء (زراعة الأشجار)، الآثار (الظل والتبخر)، والمتطلبات (الماء ومساحة الجذور). يحافظ المخطط على العلاقة بينها.",
        "اشرح دون النظر الإجراء وكيف يعمل وما يحتاج إليه.",
        "اختر نصًا معلوماتيًا قصيرًا. اكتب ثلاثة أسئلة إرشادية، وأبعد النص، ثم أجب. زد الطول تدريجيًا."
      ],
      "zh": [
        "记住长文本的含义",
        "学会在不看原文的情况下回忆文本中的观点和关系。这适用于事实性阅读、演讲和考试准备。",
        "摘要不会保留所有细节。需要时，应单独练习精确的数字或措辞。从短段落开始，当你能解释它时，逐步增加段落长度。",
        "阅读一段文字，并明确不熟悉的术语。",
        "按观点分组，并为每组拟定简短标题。",
        "为每个部分提出一个问题：发生了什么、为什么发生、结果如何？",
        "隐藏原文来源，用自己的话作答。",
        "与原文对比，修正遗漏的观点和错误的联系。",
        "稍后再次回忆，根据你记忆的可靠程度调整间隔时间。",
        "一个城镇在繁忙道路旁种树。树冠提供阴凉。水分经叶片蒸发，有助于降温。为了在干旱时保持健康，树木需要充足的水和根系生长空间。",
        "分为三组：行动（植树）、效果（遮荫和蒸发）和需求（水分和根部空间）。大纲保留了它们之间的关系。",
        "不看原文，解释该行动、其运作方式以及所需条件。",
        "选择一段适合自己的简短说明性文字。写下三个引导问题，收起原文再回答。逐步增加篇幅。"
      ],
      "ja": [
        "長い文章の意味を覚える",
        "原文を見ずに、文章の考えやつながりを思い出す練習です。説明文の学習、発表、試験準備に使えます。",
        "要約はすべての詳細を残すものではありません。正確な数字や語句が必要なら別に練習しましょう。短い段落から始め、説明できたら長くします。",
        "1つの段落を読み、知らない用語を確認しましょう。",
        "考えごとに分け、それぞれに短い見出しを付けましょう。",
        "各部分に質問を作りましょう。何が起きるのか、なぜか、どんな結果になるのか。",
        "原文を隠して、自分の言葉で答えましょう。",
        "原文と比べ、抜けた考えや間違ったつながりを修正しましょう。",
        "後でもう一度思い出しましょう。思い出せる確かさに合わせて間隔を調整します。",
        "ある町が交通量の多い道路沿いに木を植えます。枝葉が日陰を作り、葉から水が蒸発して冷却に役立ちます。乾燥時も健康を保つため、木には十分な水と根が伸びる空間が必要です。",
        "3つに分けられます。行動は植樹、効果は日陰と蒸発、必要条件は水と根の空間です。この整理で相互の関係を保てます。",
        "原文を見ずに、行動、その仕組み、必要条件を説明しましょう。",
        "自分の学習用の短い説明文を選びましょう。3つの問いを書き、原文を隠して答えます。少しずつ文章を長くしましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "text-verbatim",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-text-verbatim-fr-visual-d4c94c3c8515.mp4",
    "bytes": 1175192,
    "sha256": "d4c94c3c851597654b8db094696e6ca08446d5c3d1a71444894ddb8b85ef6ce7",
    "duration": 84.2,
    "cues": [
      {
        "start": 0.0,
        "end": 3.44
      },
      {
        "start": 3.44,
        "end": 12.24
      },
      {
        "start": 12.24,
        "end": 22.2
      },
      {
        "start": 22.2,
        "end": 26.12
      },
      {
        "start": 26.12,
        "end": 32.64
      },
      {
        "start": 32.64,
        "end": 36.56
      },
      {
        "start": 36.56,
        "end": 42.04
      },
      {
        "start": 42.04,
        "end": 48.4
      },
      {
        "start": 48.4,
        "end": 53.92
      },
      {
        "start": 53.92,
        "end": 60.84
      },
      {
        "start": 60.84,
        "end": 71.0
      },
      {
        "start": 71.0,
        "end": 76.4
      },
      {
        "start": 76.4,
        "end": 84.2
      }
    ],
    "recallBoundary": 75.36334583333334,
    "captions": {
      "de": [
        "Texte wortgetreu lernen",
        "Du übst den genauen Wortlaut, etwa für ein Gedicht, eine Definition oder einen kurzen Vortrag. Dabei zählen auch kleine Wörter und die Reihenfolge.",
        "Wortgetreuer Abruf beweist nicht, dass du den Inhalt verstanden hast. Kläre zuerst die Bedeutung. Ein Merkbilder-Weg kann die Reihenfolge stützen, ersetzt aber nicht das Üben des Wortlauts.",
        "Verstehe den Text und wähle eine kurze Sinneinheit.",
        "Lies sie aufmerksam und sprich sie einmal deutlich.",
        "Verdecke die Vorlage und sage oder schreibe sie aus dem Gedächtnis.",
        "Vergleiche Wort für Wort. Korrigiere Auslassungen, Vertauschungen und hinzugefügte Wörter.",
        "Übe die nächste Einheit und danach den Übergang zwischen beiden. Beginne gelegentlich in der Mitte.",
        "Wiederhole später ohne Vorlage. Verlängere den Abschnitt erst, wenn der aktuelle sicher gelingt.",
        "Am Morgen öffne ich das Fenster. Frische Luft strömt ins Zimmer. Danach beginne ich meinen Tag.",
        "Drei kurze Sätze bilden drei Übungseinheiten. Übe zuerst Satz eins, dann Satz zwei und schließlich ihren Übergang. Starte einen späteren Versuch auch mit „Frische Luft …“.",
        "Schreibe die drei Sätze möglichst genau aus dem Gedächtnis.",
        "Nutze eine eigene kurze Passage, die du wortgetreu brauchst. Prüfe den Wortlaut selbst am Original; eine bloß ähnliche Formulierung erfüllt dieses Lernziel nicht."
      ],
      "en": [
        "Learn a text word for word",
        "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
        "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
        "Understand the text and choose a short meaningful passage.",
        "Read it carefully and say it clearly once.",
        "Hide it and say or write it from memory.",
        "Compare word for word. Correct omissions, changes in order and added words.",
        "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "Recall it again later without looking. Extend the passage after the current part becomes reliable.",
        "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
        "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
        "Write the three sentences as accurately as you can from memory.",
        "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal."
      ],
      "fr": [
        "Apprendre un texte mot pour mot",
        "Travaille la formulation exacte d’un poème, d’une définition ou d’un court discours. Les petits mots et leur ordre comptent aussi.",
        "Réciter exactement ne prouve pas que tu as compris. Clarifie d’abord le sens. Des images mentales peuvent soutenir l’ordre des idées, mais elles ne remplacent pas le travail sur les mots.",
        "Comprends le texte et choisis un court passage cohérent.",
        "Commence par lire le passage attentivement. Lis ensuite le passage à voix haute, une seule fois.",
        "Cache-le, puis récite-le ou écris-le de mémoire.",
        "Compare mot à mot. Corrige les omissions, les inversions et les ajouts.",
        "Travaille le passage suivant, puis la transition entre les deux. Commence parfois au milieu.",
        "Essaie de nouveau plus tard sans modèle. Allonge le passage lorsque le rappel devient fiable.",
        "Le matin, j’ouvre la fenêtre. L’air frais entre dans la pièce. Ensuite, je commence ma journée.",
        "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Au prochain essai, commence aussi par les mots : l’air frais.",
        "Écris les trois phrases de mémoire en respectant leur formulation aussi précisément que possible.",
        "Choisis un court passage dont la formulation compte pour toi. Vérifie les mots dans l’original : une reformulation ne répond pas à cet objectif précis."
      ],
      "es": [
        "Aprende un texto palabra por palabra",
        "Practica las palabras exactas de un poema, una definición o un discurso breve. También importan las palabras pequeñas y su orden.",
        "El recuerdo exacto no demuestra comprensión. Asegúrate de entender primero el significado. Imágenes mentales pueden ayudar a recordar el orden de las ideas, pero no sustituyen la práctica del lenguaje exacto.",
        "Entiende el texto y elige un pasaje breve y significativo.",
        "Léelo con atención y dilo claramente una vez.",
        "Oculta el texto y di o escribe el contenido desde la memoria.",
        "Compara palabra por palabra. Corrige omisiones, cambios de orden y palabras añadidas.",
        "Practica el siguiente fragmento y después la transición entre ambos. Empieza a veces por la mitad.",
        "Vuelve a recordarlo más tarde sin mirar. Amplía el fragmento cuando recuerdes con seguridad el actual.",
        "En la mañana abro la ventana. El aire fresco fluye en la habitación. Luego comienzo mi día.",
        "Las tres oraciones forman tres unidades de práctica. Aprende la primera, luego la segunda y su transición. Comienza un intento posterior en «Aire fresco…» también.",
        "Escribe las tres oraciones con la mayor precisión posible desde la memoria.",
        "Elige un fragmento breve cuyas palabras exactas necesites aprender. Compáralo con el original: una paráfrasis no cumple este objetivo."
      ],
      "it": [
        "Impara un testo parola per parola",
        "Esercita le parole esatte di una poesia, una definizione o un breve discorso. Contano anche le parole piccole e il loro ordine.",
        "Ricordare le parole esatte non dimostra comprensione. Chiarisci prima il significato. Le immagini mentali possono aiutare con l’ordine delle idee, ma non sostituiscono l’esercizio delle parole stesse.",
        "Capisci il testo e scegli un breve passaggio significativo.",
        "Leggi attentamente il brano e pronuncialo chiaramente una volta.",
        "Nascondilo e ripetilo o scrivilo a memoria.",
        "Compara parola per parola. Correggi omissioni, cambi di ordine e parole aggiunte.",
        "Esercita il brano successivo, poi il collegamento tra i due. Ogni tanto inizia da metà testo.",
        "Richiama il testo più tardi senza guardare. Allunga il brano quando ricordi con sicurezza quello attuale.",
        "Alla mattina apro la finestra. L'aria fresca entra in camera. Poi inizio il giorno.",
        "Le tre frasi formano tre unità di esercizio. Impara la prima, poi la seconda e il loro collegamento. In un tentativo successivo parti anche da «L’aria fresca…».",
        "Scrivi le tre frasi a memoria nel modo più preciso possibile.",
        "Scegli un breve brano di cui ti servono le parole esatte. Confrontalo con l’originale: una parafrasi non soddisfa questo obiettivo."
      ],
      "pt": [
        "Aprenda um texto palavra por palavra",
        "Pratique a formulação exata de um poema, definição ou discurso curto. As palavras pequenas e a sua ordem importam também.",
        "Recordar as palavras exatas não prova a compreensão. Esclareça primeiro o significado. As imagens mentais podem ajudar com a ordem das ideias, mas não substituem a prática das palavras originais.",
        "Compreenda o texto e escolha um trecho curto e significativo.",
        "Leia com atenção e diga claramente uma vez.",
        "Esconda-o e diga ou escreva de memória.",
        "Compare palavra por palavra. Corrija omissões, mudanças de ordem e palavras adicionadas.",
        "Pratique o próximo trecho, depois a transição entre eles. Às vezes, comece no meio.",
        "Recorde o texto novamente mais tarde, sem olhar. Aumente o trecho quando conseguir recordar com segurança o atual.",
        "Na manhã, abro a janela. O ar fresco entra na sala. Depois, começo o dia.",
        "As três frases formam três unidades de prática. Aprenda a primeira, depois a segunda e a transição entre ambas. Num ensaio posterior, comece também em «O ar fresco…».",
        "Escreva as três frases com a maior precisão possível de memória.",
        "Escolha um trecho curto cuja formulação importa para você. Compare com a fonte original; uma paráfrase não atende a este objetivo particular."
      ],
      "nl": [
        "Leer een tekst woord voor woord",
        "Oefen de precieze formulering van een gedicht, definitie of korte toespraak. Ook kleine woorden en hun volgorde tellen mee.",
        "Precies onthouden bewijst niet dat je de inhoud begrijpt. Verduidelijk eerst de betekenis. Denkbeelden kunnen de volgorde ondersteunen, maar vervangen het oefenen van de precieze woorden niet.",
        "Begrijp de tekst en kies een korte, samenhangende passage.",
        "Lees die aandachtig en spreek haar eenmaal duidelijk uit.",
        "Verberg de tekst en zeg of schrijf haar uit je geheugen op.",
        "Vergelijk woord voor woord. Corrigeer weglatingen, verwisselingen en toegevoegde woorden.",
        "Oefen de volgende passage en daarna de overgang tussen beide. Begin soms in het midden.",
        "Haal de tekst later opnieuw op zonder te kijken. Maak de passage langer zodra je het huidige deel betrouwbaar kunt ophalen.",
        "In de ochtend open ik het raam. Frisse lucht stroomt de kamer binnen. Daarna begin ik mijn dag.",
        "De drie zinnen zijn drie oefeneenheden. Leer eerst de eerste, dan de tweede en hun overgang. Begin een latere poging ook bij «Frisse lucht…».",
        "Schrijf de drie zinnen zo precies mogelijk uit je geheugen op.",
        "Kies een korte passage waarvan de precieze woorden belangrijk voor je zijn. Vergelijk met de bron; een parafrase voldoet niet aan dit leerdoel."
      ],
      "tr": [
        "Bir metni sözcüğü sözcüğüne öğren",
        "Bir şiirin, tanımın veya kısa konuşmanın sözcüklerini aynen çalış. Küçük sözcükler ve sıraları da önemlidir.",
        "Sözcükleri aynen hatırlamak, içeriği anladığını kanıtlamaz. Önce anlamı netleştir. Hayali görüntüler fikirlerin sırasını destekleyebilir; ama asıl sözcükleri çalışmanın yerini tutmaz.",
        "Metni anla ve kısa, anlamlı bir bölüm seç.",
        "Dikkatle oku ve bir kez açıkça söyle.",
        "Gizle ve hafızandan söyle veya yaz.",
        "Sözcük sözcük karşılaştır. Atlanan, sırası değişen veya eklenen sözcükleri düzelt.",
        "Sonraki bölümü, sonra iki bölüm arasındaki geçişi çalış. Bazen ortadan başla.",
        "Daha sonra bakmadan yeniden hatırla. Mevcut bölüm güvenilir biçimde hatırlanınca uzunluğu artır.",
        "Sabah pencereyi açarım. Odaya temiz hava girer. Sonra günüme başlarım.",
        "Üç cümle üç çalışma birimidir. Önce ilkini, sonra ikincisini ve aralarındaki geçişi öğren. Sonraki bir denemeye «Odaya temiz hava…» kısmından da başla.",
        "Üç cümleyi mümkün olduğunca tam olarak hafızandan yaz.",
        "Sözcüklerini aynen öğrenmek istediğin kısa bir bölüm seç. Aslıyla kendin karşılaştır; anlamı başka sözcüklerle anlatmak bu öğrenme hedefini karşılamaz."
      ],
      "ar": [
        "تعلّم النص كلمة بكلمة",
        "تدرّب على الألفاظ الدقيقة لقصيدة أو تعريف أو خطاب قصير. الكلمات الصغيرة وترتيبها مهمان أيضًا.",
        "الاسترجاع الحرفي لا يثبت الفهم. وضّح المعنى أولًا. قد تدعم الصور الذهنية ترتيب الأفكار، لكنها لا تعوّض تدريب الألفاظ الأصلية.",
        "افهم النص واختر فقرة قصيرة ذات معنى.",
        "اقرأها بانتباه وانطقها بوضوح مرة واحدة.",
        "أخفها وقلها أو اكتبها من الذاكرة.",
        "قارن كلمة بكلمة. صحّح الحذف وتبديل الترتيب والكلمات المضافة.",
        "تدرّب على الفقرة التالية ثم الانتقال بينهما. ابدأ أحيانًا من الوسط.",
        "استرجعها لاحقًا دون النظر. أطِل الفقرة عندما تصبح قادرًا على استرجاع الجزء الحالي بثقة.",
        "في الصباح أفتح النافذة. يدخل الهواء المنعش إلى الغرفة. ثم أبدأ يومي.",
        "الجمل الثلاث وحدات تدريب ثلاث. تعلّم الأولى ثم الثانية والانتقال بينهما. ابدأ محاولة لاحقة أيضًا من «يدخل الهواء المنعش…».",
        "اكتب الجمل الثلاث من الذاكرة بأكبر دقة ممكنة.",
        "اختر فقرة قصيرة تحتاج إلى ألفاظها الدقيقة. قارنها بالأصل بنفسك؛ إعادة المعنى بكلمات أخرى لا تحقق هذا الهدف."
      ],
      "zh": [
        "逐字学习文本",
        "练习诗歌、定义或短篇演讲中的精确用词。小词及其顺序同样重要。",
        "逐字回忆并不能证明理解。首先应明确其含义。心理图像可能帮助理解思想顺序，但无法替代实际用词的练习。",
        "理解文本，然后选择一段简短且有意义的段落。",
        "仔细阅读并清晰地说出一次。",
        "隐藏文本，然后从记忆中说出或写出。",
        "逐字对比。纠正遗漏、顺序变化和额外添加的词语。",
        "练习下一段内容，然后练习段落之间的过渡。有时可以从中间开始。",
        "稍后不看原文，再次回忆。当当前部分记忆可靠时，延伸段落内容。",
        "早上我打开窗户。新鲜空气流入房间。然后我开始新的一天。",
        "三个句子是三个练习单元。先学第一句，再学第二句和它们之间的衔接。之后也试着从“新鲜空气……”开始回忆。",
        "尽可能准确地从记忆中写出这三个句子。",
        "选择一段你认为用词重要的短文。自己将其与原文对比；改写版本无法达到此特定目标。"
      ],
      "ja": [
        "文章を一語ずつ正確に覚える",
        "詩、定義、短いスピーチなどの正確な語句を練習します。短い語やその順序も大切です。",
        "正確に思い出せても、意味を理解している証拠にはなりません。先に意味を確認しましょう。イメージは順序を助けても、実際の語句の練習に代わるものではありません。",
        "文章を理解し、短く意味のまとまった部分を選びましょう。",
        "注意深く読み、一度はっきり声に出しましょう。",
        "隠して、記憶から言うか書くかしてみましょう。",
        "一語ずつ比較し、抜け、順序の違い、余計な語を修正しましょう。",
        "次の部分を練習し、両者のつながりも練習しましょう。時には途中から始めます。",
        "後で原文を見ずに思い出しましょう。今の部分を確実に思い出せるようになったら長くします。",
        "朝、私は窓を開けます。新鮮な空気が部屋に流れ込みます。それから一日を始めます。",
        "3つの文が3つの練習単位です。最初の文、次の文、そのつながりを練習しましょう。後の試行では「新鮮な空気…」からも始めてみます。",
        "3つの文を、できるだけ正確に記憶から書きましょう。",
        "正確な語句が必要な短い文章を選び、自分で原文と比較しましょう。言い換えでは、この学習目標を満たしません。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "active-recall",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-active-recall-fr-visual-9612e89c9536.mp4",
    "bytes": 1328986,
    "sha256": "9612e89c9536fbc8f75725d17ac66fcc7d87ebd5ebe1dde12edcad5340a95df0",
    "duration": 94.68,
    "cues": [
      {
        "start": 0.0,
        "end": 3.32
      },
      {
        "start": 3.32,
        "end": 17.36
      },
      {
        "start": 17.36,
        "end": 30.76
      },
      {
        "start": 30.76,
        "end": 34.48
      },
      {
        "start": 34.48,
        "end": 38.88
      },
      {
        "start": 38.88,
        "end": 42.36
      },
      {
        "start": 42.36,
        "end": 47.2
      },
      {
        "start": 47.2,
        "end": 50.48
      },
      {
        "start": 50.48,
        "end": 57.72
      },
      {
        "start": 57.72,
        "end": 69.12
      },
      {
        "start": 69.12,
        "end": 80.92
      },
      {
        "start": 80.92,
        "end": 86.32
      },
      {
        "start": 86.32,
        "end": 94.68
      }
    ],
    "recallBoundary": 85.35175833333334,
    "captions": {
      "de": [
        "Aktives Abrufen",
        "Du versuchst, eine Information ohne Vorlage wiederzugeben. Dabei erkennst du, was du selbst abrufen kannst und wo du noch nacharbeiten musst. Das hilft bei Fakten, Begriffen und Zusammenhängen.",
        "Dass dir eine gelesene Antwort bekannt vorkommt, heißt nicht, dass du sie selbst abrufen kannst. Ein misslungener Versuch ist kein Endurteil: Prüfe die richtige Antwort, kläre sie und versuche es erneut. Häufiges Raten ohne Rückmeldung kann Fehler festigen.",
        "Wähle eine kleine, verstandene Information.",
        "Stelle eine klare Frage, die sich aus dem Material beantworten lässt.",
        "Lege die Vorlage weg und antworte, bevor du nachsiehst.",
        "Vergleiche deine Antwort mit dem Original. Korrigiere fehlende oder falsche Teile.",
        "Verdecke die richtige Antwort und versuche den Abruf noch einmal.",
        "Prüfe später erneut. Nur sofort wiederholen kann sich leicht anfühlen, ohne dauerhaftes Behalten zu zeigen.",
        "Frage: Warum kühlt verdunstendes Wasser eine Oberfläche?\nAntwort: Zum Verdunsten wird Energie benötigt. Diese Energie wird der Oberfläche und ihrer Umgebung als Wärme entzogen.",
        "Lies und verstehe zunächst die Antwort. Decke sie dann ab und beantworte die Frage selbst. „Wasser kühlt“ allein erklärt den Zusammenhang noch nicht; entscheidend sind Energiebedarf und Wärmeentzug.",
        "Warum kann verdunstendes Wasser eine Oberfläche kühlen? Erkläre den Zusammenhang ohne Vorlage.",
        "Formuliere zu deinem eigenen Material eine konkrete Frage. Antworte zunächst ohne Vorlage, vergleiche danach und versuche es später erneut. Die App nutzt Abrufversuche auch in ihren Trainingseinheiten."
      ],
      "en": [
        "Active recall",
        "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
        "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
        "Choose a small piece of information you understand.",
        "Ask a clear question that the material answers.",
        "Put the source away and answer before checking.",
        "Compare with the original. Correct missing or mistaken parts.",
        "Hide the answer and try retrieving it again.",
        "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention.",
        "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
        "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
        "Why can evaporating water cool a surface? Explain without looking.",
        "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions."
      ],
      "fr": [
        "Pratiquer le rappel actif",
        "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi deux choses : ce que tu peux rappeler toi-même, et ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations.",
        "Reconnaître une réponse en la lisant ne signifie pas savoir la retrouver. Un échec n’est pas un verdict : vérifie et comprends la bonne réponse, puis réessaie. Deviner plusieurs fois sans correction peut renforcer des erreurs.",
        "Choisis une petite quantité d’information que tu comprends.",
        "Pose une question précise à laquelle le contenu permet de répondre.",
        "Écarte la source et réponds avant de vérifier.",
        "Compare avec l’original. Corrige les éléments manquants ou erronés.",
        "Cache la réponse et essaie de la rappeler à nouveau.",
        "Teste-toi aussi plus tard. Répéter immédiatement peut sembler facile sans démontrer une mémorisation durable.",
        "Question : pourquoi l’eau qui s’évapore peut-elle refroidir une surface ?\nRéponse : l’évaporation demande de l’énergie. Cette énergie est prélevée sous forme de chaleur dans la surface et son environnement.",
        "Commence par lire et comprendre la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels.",
        "Pourquoi l’eau qui s’évapore peut-elle refroidir une surface ? Explique le lien sans regarder.",
        "Formule une question précise sur ton propre contenu. Réponds sans regarder, compare ensuite et réessaie plus tard. ANITEW utilise aussi le rappel dans ses séances d’entraînement."
      ],
      "es": [
        "Recuperación activa",
        "Intenta recordar la información sin mirar la fuente. Así compruebas qué puedes recuperar de memoria y qué necesita más práctica. Sirve para hechos, conceptos y relaciones.",
        "Reconocer una respuesta al leerla no significa que puedas recuperarla tú mismo. Un intento fallido no es un juicio definitivo: revisa y entiende la respuesta correcta, luego inténtalo de nuevo. Repetir suposiciones sin retroalimentación puede reforzar errores.",
        "Elige un pequeño fragmento de información que entiendas.",
        "Formula una pregunta clara que el material permita responder.",
        "Pon la fuente lejos y responde antes de verificar.",
        "Compara con el original. Corrige partes faltantes o erróneas.",
        "Oculta la respuesta y trata de recuperarla nuevamente.",
        "Compruébalo también más tarde. Repetir de inmediato puede resultar fácil sin demostrar que lo recuerdas a largo plazo.",
        "Pregunta: ¿Por qué puede el agua que se evapora enfriar una superficie? Respuesta: La evaporación requiere energía. Esa energía se toma de la superficie y su entorno en forma de calor.",
        "Primero lee y comprende la respuesta. Luego ocúltala y responde por tu cuenta. Decir solo «el agua enfría» no explica la relación: importan la energía necesaria y la transferencia de calor.",
        "¿Por qué puede el agua que se evapora enfriar una superficie? Explícalo sin mirar.",
        "Escribe una pregunta específica sobre tu propio material. Responde sin mirar, compárala después, y luego inténtala nuevamente más tarde. ANITEW también utiliza intentos de recuperación en sus sesiones de entrenamiento."
      ],
      "it": [
        "Richiamo attivo",
        "Prova a ricordare l'informazione senza guardare la fonte. Questo mostra cosa riesci a ricordare e cosa necessita di ulteriore lavoro. Usa questo per fatti, concetti e relazioni.",
        "Riconoscere una risposta mentre la leggi non significa che tu possa ricordarla da solo. Un tentativo fallito non è una conclusione definitiva: verifica e capisci la risposta corretta, poi riprova. Ripetere tentativi di indovinare senza feedback può consolidare errori.",
        "Scegli un piccolo pezzo di informazione che capisci.",
        "Formula una domanda chiara a cui il materiale permette di rispondere.",
        "Nascondi la fonte e rispondi prima di controllare.",
        "Confronta con l'originale. Correggi parti mancanti o errate.",
        "Nascondi la risposta e prova a ricordarla nuovamente.",
        "Mettiti alla prova anche più tardi. Ripetere subito può sembrare facile senza dimostrare che ricorderai a lungo.",
        "Domanda: Perché l'evaporazione dell'acqua raffredda una superficie?\nRisposta: L'evaporazione richiede energia. Questa energia viene estratta dalla superficie e dagli ambienti circostanti sotto forma di calore.",
        "Prima leggi e comprendi la risposta. Poi nascondila e rispondi con parole tue. Dire solo «l’acqua raffredda» non spiega il rapporto: contano l’energia necessaria e il trasferimento di calore.",
        "Perché l'evaporazione dell'acqua raffredda una superficie? Spiega senza guardare.",
        "Scrivi una domanda precisa sul tuo materiale. Rispondi senza guardare, confronta la risposta e riprova più tardi. Anche ANITEW usa tentativi di richiamo nelle sessioni di allenamento."
      ],
      "pt": [
        "Recordação ativa",
        "Tente recuperar a informação sem olhar para a fonte. Isso mostra o que você consegue lembrar e o que precisa de mais trabalho. Use isso para fatos, conceitos e relações.",
        "Reconhecer a resposta ao ler não significa que você consiga recuperá-la sozinho. Um erro não é uma conclusão final: verifique e entenda a resposta correta, depois tente novamente. Adivinhar repetidamente sem feedback pode reforçar erros.",
        "Escolha um pequeno trecho de informação que você entende.",
        "Pergunte claramente algo que o material responda.",
        "Ponha a fonte de lado e responda antes de verificar.",
        "Compare com a versão original. Corrija partes ausentes ou incorretas.",
        "Esconda a resposta e tente recuperá-la novamente.",
        "Teste-se mais tarde também. A repetição imediata pode parecer fácil, mas não demonstra retenção duradoura.",
        "Pergunta: Por que a evaporação da água resfria uma superfície?\nResposta: A evaporação exige energia. Essa energia é retirada da superfície e do ambiente ao redor na forma de calor.",
        "Leia e compreenda primeiro a resposta. Depois, esconda-a e responda por conta própria. Dizer apenas «a água esfria» não explica a relação: são importantes a energia necessária e a transferência de calor.",
        "Por que a evaporação da água resfria uma superfície? Explique sem olhar.",
        "Escreva uma pergunta específica sobre o seu próprio conteúdo. Responda sem olhar, compare depois e tente novamente mais tarde. O ANITEW também utiliza tentativas de recuperação em suas sessões de treinamento."
      ],
      "nl": [
        "Actief ophalen uit het geheugen",
        "Probeer informatie op te halen zonder naar de bron te kijken. Zo merk je wat je zelf kunt herinneren en wat meer oefening nodig heeft. Dit werkt voor feiten, begrippen en verbanden.",
        "Een antwoord herkennen tijdens het lezen betekent niet dat je het zelf kunt ophalen. Een mislukte poging is geen eindoordeel: controleer en begrijp het juiste antwoord en probeer opnieuw. Herhaald gokken zonder feedback kan fouten versterken.",
        "Kies een klein stukje informatie dat je begrijpt.",
        "Stel een duidelijke vraag die met de leerstof te beantwoorden is.",
        "Zet de bron weg en antwoord voordat je het controleert.",
        "Vergelijk met de oorspronkelijke tekst. Corrigeer ontbrekende of verkeerde delen.",
        "Verberg het antwoord en probeer het opnieuw uit je geheugen op te halen.",
        "Test jezelf ook later. Direct herhalen kan makkelijk voelen zonder aan te tonen dat je iets blijvend onthoudt.",
        "Vraag: Waarom koelt het verdampen van water een oppervlak?\nAntwoord: Verdampen vereist energie. Die energie wordt uit het oppervlak en de omgeving opgenomen als warmte.",
        "Lees en begrijp eerst het antwoord. Verberg het daarna en beantwoord zelf de vraag. Alleen «water koelt» verklaart het verband niet: de benodigde energie en de warmteoverdracht zijn belangrijk.",
        "Waarom koelt het verdampen van water een oppervlak? Leg het zonder te kijken uit.",
        "Stel een gerichte vraag over je eigen leerstof. Antwoord zonder te kijken, vergelijk daarna en probeer het later opnieuw. ANITEW gebruikt ook ophaalpogingen in de trainingen."
      ],
      "tr": [
        "Aktif hatırlama",
        "Kaynağa bakmadan bilgiyi hatırlamayı dene. Böylece neyi kendi başına hatırlayabildiğini, neyin daha fazla çalışma gerektirdiğini görürsün. Yöntem; bilgiler, kavramlar ve ilişkiler için kullanılabilir.",
        "Okurken bir cevabı tanımak, onu kendi başına hatırlayabilmek değildir. Başarısız bir deneme son karar değildir: doğru cevabı kontrol et, anla ve yeniden dene. Geri bildirim almadan tekrar tekrar tahmin etmek hataları pekiştirebilir.",
        "Anladığın küçük bir bilgi parçası seç.",
        "Bu bilgiyle cevaplanabilecek açık bir soru oluştur.",
        "Kaynağı kaldır ve kontrol etmeden önce cevap ver.",
        "Aslıyla karşılaştır. Eksik veya yanlış kısımları düzelt.",
        "Cevabı gizle ve tekrar hatırlamayı dene.",
        "Kendini daha sonra da sına. Hemen tekrarlamak kolay gelebilir, ama kalıcı olarak hatırladığını göstermeyebilir.",
        "Soru: Buharlaşan su bir yüzeyi neden soğutabilir? Cevap: Buharlaşma enerji gerektirir. Bu enerji yüzeyden ve çevresinden ısı olarak alınır.",
        "Önce cevabı oku ve anla. Sonra gizleyerek soruyu kendi başına cevapla. Yalnızca «su soğutur» demek ilişkiyi açıklamaz; gereken enerji ve ısı aktarımı önemlidir.",
        "Buharlaşan su bir yüzeyi neden soğutabilir? Bakmadan açıkla.",
        "Kendi çalışma malzemen hakkında belirli bir soru yaz. Bakmadan cevapla, sonra karşılaştır ve daha sonra yeniden dene. ANITEW de alıştırmalarında hatırlama denemeleri kullanır."
      ],
      "ar": [
        "الاسترجاع النشط",
        "حاول تذكّر المعلومات دون النظر إلى مصدرها. هكذا تعرف ما تستطيع استرجاعه وما يحتاج إلى مزيد من التدريب. يصلح ذلك للحقائق والمفاهيم والعلاقات.",
        "التعرّف على الإجابة أثناء قراءتها لا يعني أنك تستطيع استرجاعها وحدك. المحاولة غير الناجحة ليست حكمًا نهائيًا: تحقّق من الإجابة الصحيحة وافهمها ثم حاول مجددًا. تكرار التخمين دون تصحيح قد يرسّخ الأخطاء.",
        "اختر معلومة صغيرة تفهمها.",
        "ضع سؤالًا واضحًا يجيب عنه المحتوى.",
        "أبعد المصدر وأجب قبل التحقّق.",
        "قارن بالأصل وصحّح الأجزاء الناقصة أو الخاطئة.",
        "أخفِ الإجابة وحاول استرجاعها مجددًا.",
        "اختبر نفسك لاحقًا أيضًا. قد يبدو التكرار الفوري سهلًا دون أن يدل على بقاء المعلومة طويلًا.",
        "السؤال: لماذا يمكن للماء المتبخر أن يبرّد سطحًا؟ الإجابة: يحتاج التبخر إلى طاقة، تُؤخذ من السطح ومحيطه على شكل حرارة.",
        "اقرأ الإجابة وافهمها أولًا، ثم أخفها وأجب بنفسك. عبارة «الماء يبرّد» وحدها لا تفسّر العلاقة؛ المهم هو الحاجة إلى الطاقة وانتقال الحرارة.",
        "لماذا يمكن للماء المتبخر أن يبرّد سطحًا؟ اشرح دون النظر إلى المصدر.",
        "اكتب سؤالًا محددًا عن مادتك. أجب دون النظر، ثم قارن وحاول لاحقًا. تستخدم ANITEW أيضًا محاولات الاسترجاع في جلسات التدريب."
      ],
      "zh": [
        "主动回忆",
        "尝试在不查看来源的情况下回忆信息。这能揭示你能够想到什么内容，以及哪些部分还需要加强。这种方法适用于事实、概念和关系。",
        "仅仅在阅读时识别出答案，并不意味着你能独立回忆出来。一次失败的尝试并不等于最终结论：要检查并理解正确答案，然后再次尝试。反复猜测而没有反馈，可能会强化错误。",
        "选择一个你已经理解的小部分内容。",
        "提出一个明确的问题，该材料能对此进行解答。",
        "将来源隐藏起来，先自行作答，再核对。",
        "与原文对比，修正遗漏或错误的部分。",
        "隐藏答案，再尝试回忆一遍。",
        "之后也应进行自我测试。即时重复可能感觉容易，但并不能说明长期记忆效果。",
        "问题：为什么水的蒸发能冷却表面？\n答案：蒸发需要能量。这部分能量来自表面及其周围环境的热量。",
        "先阅读并理解答案，然后隐藏答案，自己回答问题。仅说‘水会冷却’并不能解释其原理：能量需求和热量传递才是关键。",
        "为什么水的蒸发能冷却表面？在不查看的情况下解释一下。",
        "针对你自己的学习内容，提出一个具体问题。在不查看的情况下回答，之后进行对比，然后过一段时间再尝试一次。ANITEW在训练中也使用了回忆尝试。"
      ],
      "ja": [
        "自力で思い出す練習",
        "情報の元を確認せずに情報を思い出すようにする。これにより、自分が思いつくことと、まだ学習が必要な部分を確認できる。事実、概念、関係性に対して使う。",
        "答えを読んだときに認識できたからといって、自分自身でそれを思い出すことができるとは限らない。失敗した試みは最終的な判断ではない：正しい答えを確認し、理解した上で再試行する。フィードバックのない繰り返した予想は誤りを強化する可能性がある。",
        "理解している情報の小さな部分を選ぼう。",
        "教材の内容で答えられる、明確な質問を作りましょう。",
        "元を隠し、答えを確認する前に自分で答えよう。",
        "元の内容と比較し、欠けている部分や誤った部分を修正する。",
        "答えを隠して、再び自分で思い出してみよう。",
        "時間を置いてからも確かめましょう。直後の繰り返しは簡単に感じても、長く覚えている証拠にはなりません。",
        "質問：なぜ水の蒸発が表面を冷やすのか？\n答え：蒸発にはエネルギーが必要である。そのエネルギーは表面および周囲から熱として奪われる。",
        "まず答えを読んで理解し、隠してから自分で答えましょう。「水が冷やす」だけでは関係を説明できません。必要なエネルギーと熱の移動が重要です。",
        "なぜ水の蒸発が表面を冷やすのか？元の材料を確認せずに説明しよう。",
        "自分の教材について具体的な質問を作りましょう。見ずに答え、答え合わせをし、後でもう一度試します。ANITEWの練習でも、自力で思い出す試みを使います。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "spaced-practice",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-spaced-practice-fr-visual-324a10797779.mp4",
    "bytes": 1568565,
    "sha256": "324a10797779d1ba5bcc586b8a423f696eed6cde2cc42e32bda2c18ecdb1f074",
    "duration": 106.56,
    "cues": [
      {
        "start": 0.0,
        "end": 2.76
      },
      {
        "start": 2.76,
        "end": 14.6
      },
      {
        "start": 14.6,
        "end": 28.96
      },
      {
        "start": 28.96,
        "end": 33.68
      },
      {
        "start": 33.68,
        "end": 36.84
      },
      {
        "start": 36.84,
        "end": 40.2
      },
      {
        "start": 40.2,
        "end": 48.08
      },
      {
        "start": 48.08,
        "end": 52.24
      },
      {
        "start": 52.24,
        "end": 60.08
      },
      {
        "start": 60.08,
        "end": 75.08
      },
      {
        "start": 75.08,
        "end": 86.72
      },
      {
        "start": 86.72,
        "end": 94.68
      },
      {
        "start": 94.68,
        "end": 106.56
      }
    ],
    "recallBoundary": 93.70666645,
    "captions": {
      "de": [
        "Verteiltes Wiederholen",
        "Du verteilst Abrufversuche auf mehrere Zeitpunkte. Damit prüfst du das Behalten nach einer Pause, statt eine Antwort nur unmittelbar nach dem Lesen zu wiederholen.",
        "Es gibt keinen festen Abstand, der für alle Inhalte und Menschen passt. Schwierigkeit, Vorwissen und gewünschte Behaltedauer spielen eine Rolle. Diese kurze Übung erklärt das Vorgehen; langfristiges Behalten zeigt sich erst bei späteren Abrufen.",
        "Lerne eine überschaubare Information und prüfe sie einmal ohne Vorlage.",
        "Plane einen späteren Abruf mit zeitlichem Abstand.",
        "Versuche zuerst selbst zu antworten, bevor du die Lösung öffnest.",
        "Bei einem Fehler: Bedeutung klären, korrigieren und wieder abrufen. Wähle den nächsten Abstand kürzer, wenn der Abruf zu schwer war.",
        "Wenn der Abruf zuverlässig gelingt, kann der nächste Abstand länger werden.",
        "Für gespeicherte Trainingsinhalte nutzt ANITEW bereits ein Wiederholungssystem. Folge den fälligen Wiedersehen statt parallel einen zweiten Plan zu führen.",
        "Mira lernt einen neuen Begriff. Sie erklärt ihn ohne Vorlage. Nach einer Pause versucht sie es erneut und bemerkt eine Lücke. Sie vergleicht mit der richtigen Erklärung, korrigiert die Lücke und setzt den nächsten Abruf früher an. Erst nach zuverlässigen Abrufen vergrößert sie den Abstand.",
        "Die Pause und der eigene Abruf sind entscheidend. Zehnmal direkt hintereinander zu lesen ersetzt keinen späteren Abruf. Miras Fehler zeigt ihr, wo sie nacharbeiten und den Abstand anpassen sollte.",
        "Beschreibe Miras Vorgehen: Was tut sie vor dem Nachsehen? Wie reagiert sie auf die Lücke? Wann kann der Abstand größer werden?",
        "Nutze die fälligen Wiedersehen für deine gespeicherten Trainingsinhalte. Für Material außerhalb der App plane einen späteren Selbsttest; passe den Abstand an den tatsächlichen Abruf an. Ein abgeschlossener Lesekurs legt noch keine neuen Wiederholungskarten an."
      ],
      "en": [
        "Spaced practice",
        "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
        "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
        "Learn a manageable piece of information and retrieve it once without looking.",
        "Plan another retrieval attempt after a delay.",
        "Try answering before you reveal the solution.",
        "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "As retrieval becomes reliable, the next interval can increase.",
        "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule.",
        "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
        "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
        "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
        "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards."
      ],
      "fr": [
        "Espacer les révisions",
        "Répartis les tentatives de rappel dans le temps. Après une pause, essaie de retrouver la réponse. Tu vérifies ainsi ce que tu as retenu. Répéter immédiatement une réponse que tu viens de lire ne suffit pas.",
        "Aucun intervalle ne convient à tous les contenus et à toutes les personnes. La difficulté, les connaissances antérieures et la durée de rétention souhaitée comptent. Cet exercice explique la démarche ; seuls des rappels ultérieurs permettent de vérifier la rétention dans le temps.",
        "Apprends une information limitée et essaie de la rappeler une fois sans modèle.",
        "Prévois une autre tentative après un délai.",
        "Essaie de répondre avant d’afficher la solution.",
        "Après une erreur, clarifie le sens, corrige et rappelle à nouveau. Raccourcis l’intervalle suivant si le rappel était trop difficile.",
        "Lorsque le rappel devient fiable, l’intervalle peut augmenter.",
        "ANITEW planifie déjà les révisions des éléments d’entraînement enregistrés. Suis les révisions dues plutôt que de créer un calendrier concurrent.",
        "Mira apprend une nouvelle notion et l’explique sans modèle. Après une pause, elle réessaie et découvre une lacune. Elle compare avec la bonne explication, corrige la lacune et prévoit le prochain essai plus tôt. Elle augmente l’intervalle seulement lorsque le rappel devient fiable.",
        "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. Grâce à son erreur, Mira sait ce qu’elle doit retravailler. Elle peut aussi adapter le délai avant son prochain essai.",
        "Décris la démarche de Mira : que fait-elle avant de vérifier ? Comment réagit-elle à la lacune ? Quand peut-elle augmenter l’intervalle ?",
        "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Ce cours ne crée aucune nouvelle carte de révision quand tu le termines."
      ],
      "es": [
        "Práctica espaciada",
        "Distribuye los intentos de recordar a lo largo del tiempo. Así compruebas lo que retienes después de una pausa, en vez de repetir la respuesta justo después de leerla.",
        "No existe un intervalo único que se adapte a todos los individuos y temas. La dificultad, el conocimiento previo y el periodo deseado de retención son factores importantes. Este ejercicio breve explica el enfoque; la retención duradera solo puede verificarse con intentos posteriores.",
        "Aprende una pequeña unidad de información y recuérdala una vez sin mirar.",
        "Planifica otro intento de recordarla después de una pausa.",
        "Intenta responder antes de revelar la solución.",
        "Después de un error, aclara el significado, corrige y vuelve a recordar. Acorta el siguiente intervalo si recordar resultó demasiado difícil.",
        "Cuando la recuperación se vuelve confiable, el intervalo siguiente puede aumentar.",
        "ANITEW ya programa repasos de los contenidos de entrenamiento guardados. Sigue los repasos pendientes en vez de mantener otro calendario paralelo.",
        "Mira aprende un nuevo concepto y lo explica sin mirar. Después de un descanso, intenta nuevamente y encuentra un vacío. Compara con la explicación correcta, corrige el vacío y programa el siguiente intento más pronto. Solo después de una recuperación confiable puede aumentar el intervalo.",
        "El retardo y el intento de recuperación importan. Leer diez veces seguidas no puede reemplazar un intento posterior de recuperación. El error le indica a Mira qué debe revisar y le ayuda a ajustar el intervalo.",
        "Describe el enfoque de Mira: ¿qué hace antes de verificar? ¿Cómo responde al vacío? ¿Cuándo puede aumentar el intervalo?",
        "Utiliza los repasos pendientes de los contenidos guardados. Para material externo a la app, planifica una prueba posterior y ajusta el intervalo según lo que realmente recuerdes. Completar este curso no crea tarjetas de repaso nuevas."
      ],
      "it": [
        "Pratica spaziata",
        "Distribuisci i tentativi di richiamo nel tempo. Così verifichi cosa ricordi dopo una pausa, anziché ripetere una risposta subito dopo averla letta.",
        "Non esiste un intervallo adatto a ogni persona e argomento. Contano difficoltà, conoscenze precedenti e durata desiderata del ricordo. Questo breve esercizio spiega il metodo; per verificare il ricordo duraturo servono tentativi successivi.",
        "Apprendi un pezzo di informazione gestibile e recuperalo una volta senza guardare.",
        "Pianifica un altro tentativo di recupero dopo un ritardo.",
        "Prova a rispondere prima di rivelare la soluzione.",
        "Dopo un errore, chiarisci il significato, correggilo e recupera nuovamente. Riduci l'intervallo successivo se il recupero era troppo difficile.",
        "Quando il recupero diventa affidabile, l'intervallo successivo può essere aumentato.",
        "ANITEW programma già i ripassi dei contenuti di allenamento salvati. Segui i ripassi in scadenza invece di mantenere un calendario parallelo.",
        "Mira impara un concetto nuovo e lo spiega senza guardare. Dopo una pausa riprova e scopre una lacuna. Confronta la risposta con la spiegazione corretta, corregge la lacuna e anticipa il tentativo successivo. Aumenta l’intervallo solo quando il richiamo diventa affidabile.",
        "Contano la pausa e il tentativo di richiamo. Leggere dieci volte di seguito non sostituisce un tentativo successivo. L’errore indica a Mira cosa ripassare e la aiuta ad adattare l’intervallo.",
        "Descrivi il metodo di Mira: cosa fa prima di controllare? Come reagisce alla lacuna? Quando può aumentare l’intervallo?",
        "Usa i ripassi in scadenza per i contenuti salvati. Per il materiale esterno all’app, programma una verifica successiva e adatta l’intervallo al richiamo effettivo. Completare questo corso non crea nuove schede di ripasso."
      ],
      "pt": [
        "Prática espaçada",
        "Distribua tentativas de recuperação ao longo do tempo. Isso testa a retenção após um atraso, e não apenas repete a resposta imediatamente após a leitura.",
        "Nenhum intervalo serve para todas as pessoas e assuntos. Importam a dificuldade, o conhecimento prévio e o tempo durante o qual se pretende recordar. Este exercício explica o método; a retenção duradoura só pode ser verificada com tentativas posteriores.",
        "Aprenda um pedaço de informação gerenciável e recupere-o uma vez sem olhar.",
        "Planeje outra tentativa de recuperação após um atraso.",
        "Tente responder antes de revelar a solução.",
        "Após um erro, esclareça o significado, corrija e recupere novamente. Reduza o próximo intervalo se a recuperação foi difícil.",
        "Quando a recuperação se torna confiável, o próximo intervalo pode ser aumentado.",
        "ANITEW já programa as revisões dos conteúdos de treino guardados. Siga as revisões previstas em vez de manter outro calendário paralelo.",
        "Mira aprende um conceito novo e explica-o sem olhar. Depois de uma pausa, tenta novamente e encontra uma lacuna. Compara com a explicação correta, corrige a lacuna e antecipa a tentativa seguinte. Só aumenta o intervalo quando consegue recordar de forma fiável.",
        "O atraso e a tentativa de recuperação importam. Ler dez vezes seguidas não substitui uma tentativa de recuperação posterior. O erro informa Mira o que revisar e ajuda-a a ajustar o intervalo.",
        "Descreva o método de Mira: o que ela faz antes de verificar? Como ela responde a uma lacuna? Quando pode aumentar o intervalo?",
        "Use as revisões previstas para os conteúdos de treino guardados. Para material externo à aplicação, planeie uma verificação posterior e ajuste o intervalo ao que realmente consegue recordar. Concluir este curso não cria novos cartões de revisão."
      ],
      "nl": [
        "Gespreid oefenen",
        "Verspreid ophaalpogingen over de tijd. Zo test je wat je na een pauze onthoudt, in plaats van een antwoord meteen na het lezen te herhalen.",
        "Geen enkel interval past bij iedereen en elk onderwerp. Moeilijkheid, voorkennis en de gewenste duur van het onthouden spelen mee. Deze korte oefening legt de aanpak uit; blijvend onthouden kun je alleen met latere pogingen toetsen.",
        "Leer een beheersbare hoeveelheid informatie en haal deze één keer op zonder te kijken.",
        "Plan een nieuwe ophaalpoging na een pauze.",
        "Probeer te antwoorden voordat je de oplossing bekijkt.",
        "Verduidelijk na een fout de betekenis, corrigeer en haal het antwoord opnieuw op. Verkort het volgende interval als ophalen te moeilijk was.",
        "Wanneer het ophalen betrouwbaar lukt, kun je het volgende interval vergroten.",
        "ANITEW plant al herhalingen voor opgeslagen trainingsinhoud. Volg de geplande herhalingen in plaats van een tweede schema bij te houden.",
        "Mira leert een nieuw begrip en legt het zonder voorbeeld uit. Na een pauze probeert ze het opnieuw en ontdekt een hiaat. Ze vergelijkt met de juiste uitleg, corrigeert het hiaat en plant de volgende poging eerder. Pas als het ophalen betrouwbaar lukt, vergroot ze het interval.",
        "De pauze en de ophaalpoging zijn belangrijk. Tien keer achter elkaar lezen vervangt geen latere ophaalpoging. De fout laat Mira zien wat ze moet herhalen en helpt haar het interval aan te passen.",
        "Beschrijf Mira’s aanpak: wat doet ze voordat ze controleert? Hoe reageert ze op het hiaat? Wanneer kan ze het interval vergroten?",
        "Gebruik de geplande herhalingen voor je opgeslagen trainingsinhoud. Plan voor materiaal buiten de app een latere zelftest en pas het interval aan op wat je werkelijk kunt ophalen. Het afronden van deze leescursus maakt geen nieuwe herhaalkaarten aan."
      ],
      "tr": [
        "Aralıklı çalışma",
        "Hatırlama denemelerini zamana yay. Böylece okuduktan hemen sonra cevabı tekrarlamak yerine bir aradan sonra neyi hatırladığını sınarsın.",
        "Her insan ve konu için uygun tek bir aralık yoktur. Zorluk, ön bilgi ve hedeflenen hatırlama süresi önemlidir. Bu kısa alıştırma yöntemi açıklar; kalıcı hatırlama ancak sonraki denemelerle sınanabilir.",
        "Yönetilebilir bir bilgi parçası öğren ve bir kez bakmadan hatırla.",
        "Bir aradan sonra yeni bir hatırlama denemesi planla.",
        "Çözümü açmadan önce cevaplamayı dene.",
        "Hata yaptıktan sonra anlamı netleştir, düzelt ve yeniden hatırla. Hatırlamak çok zor geldiyse sonraki aralığı kısalt.",
        "Hatırlama güvenilir hale geldikçe sonraki aralık uzatılabilir.",
        "ANITEW, kayıtlı çalışma öğeleri için zaten tekrarlar planlar. İkinci bir takvim oluşturmak yerine zamanı gelen tekrarları takip et.",
        "Mira yeni bir kavram öğrenir ve bakmadan açıklar. Bir aradan sonra yeniden dener ve bir eksik fark eder. Doğru açıklamayla karşılaştırır, eksiği giderir ve sonraki denemeyi daha erkene alır. Ancak güvenilir biçimde hatırlayabildiğinde aralığı uzatır.",
        "Ara vermek ve hatırlamayı denemek önemlidir. Art arda on kez okumak, daha sonra yapılacak bir hatırlama denemesinin yerini tutmaz. Hata, Mira’ya neyi gözden geçirmesi gerektiğini gösterir ve aralığı ayarlamasına yardımcı olur.",
        "Mira’nın yöntemini anlat: kontrol etmeden önce ne yapar? Eksikliğe nasıl karşılık verir? Aralığı ne zaman uzatabilir?",
        "Kayıtlı çalışma öğelerin için zamanı gelen tekrarları kullan. Uygulama dışındaki malzeme için daha sonra bir öz sınama planla ve aralığı gerçek hatırlamana göre ayarla. Bu okuma dersini tamamlamak yeni tekrar kartları oluşturmaz."
      ],
      "ar": [
        "التدريب المتباعد",
        "وزّع محاولات الاسترجاع على أوقات مختلفة. بذلك تختبر ما تتذكره بعد فترة، بدل تكرار الإجابة فور قراءتها.",
        "لا توجد فترة واحدة تناسب كل شخص وموضوع. تؤثر الصعوبة والمعرفة السابقة والمدة المطلوبة للاحتفاظ بالمعلومة. هذا التمرين يشرح الطريقة؛ أما التذكّر الطويل فيُختبر بمحاولات لاحقة.",
        "تعلّم معلومة محدودة واسترجعها مرة دون النظر.",
        "خطّط لمحاولة استرجاع أخرى بعد فترة.",
        "حاول الإجابة قبل إظهار الحل.",
        "بعد الخطأ، وضّح المعنى وصحّح ثم استرجع مجددًا. قصّر الفترة التالية إذا كان الاسترجاع شديد الصعوبة.",
        "عندما يصبح الاسترجاع موثوقًا، يمكن إطالة الفترة التالية.",
        "تجدول ANITEW بالفعل مراجعات لمحتوى التدريب المحفوظ. اتبع المراجعات المستحقة بدل إنشاء جدول موازٍ.",
        "تتعلّم ميرا مفهومًا جديدًا وتشرحه دون النظر. بعد استراحة تحاول مجددًا وتكتشف نقصًا. تقارن بالشرح الصحيح، وتصوّب النقص، وتقدّم موعد المحاولة التالية. لا تطيل الفترة إلا بعد أن يصبح الاسترجاع موثوقًا.",
        "الفترة الفاصلة ومحاولة الاسترجاع مهمتان. القراءة عشر مرات متتالية لا تعوّض محاولة استرجاع لاحقة. يوضّح الخطأ لميرا ما تحتاج إلى مراجعته ويساعدها على تعديل الفترة.",
        "صِف طريقة ميرا: ماذا تفعل قبل التحقّق؟ كيف تتعامل مع النقص؟ متى يمكنها إطالة الفترة؟",
        "استخدم المراجعات المستحقة لمحتواك المحفوظ. للمادة خارج التطبيق، خطّط لاختبار ذاتي لاحق وعدّل الفترة بحسب الاسترجاع الفعلي. إكمال هذا الدرس لا ينشئ بطاقات مراجعة جديدة."
      ],
      "zh": [
        "间隔练习",
        "将检索尝试分散到不同时间点。这种做法测试的是延迟后的记忆保持，而不是在阅读后立即重复答案。",
        "没有一个固定的时间间隔适合所有人和所有主题。难度、先前知识以及期望的记忆保持时间都起作用。这个简短的练习说明了方法；真正的长期记忆保持必须通过后续的尝试来验证。",
        "学习一小部分信息，并在不查看的情况下进行一次检索。",
        "计划在延迟后进行下一次检索尝试。",
        "在揭示答案之前，先尝试回答。",
        "在出错后，明确含义，纠正错误，再进行一次检索。如果检索困难，下次间隔时间应缩短。",
        "当检索变得可靠时，下一次间隔时间可以增加。",
        "ANITEW 已为保存的训练内容安排复习。请按到期安排复习，不要另建一套并行计划。",
        "Mira 学习一个新概念，并在不看原文的情况下解释。休息后她再次尝试，发现遗漏。她对照正确解释补上遗漏，并把下次尝试提前。只有在能够可靠回忆后，才延长间隔。",
        "延迟时间和检索尝试都很重要。连续阅读十遍无法替代后续的检索尝试。错误会告诉 Mira 哪些内容需要重新学习，并帮助她调整间隔时间。",
        "描述 Mira 的做法：在查看之前她做了什么？当发现差距时她如何应对？在什么情况下她可以增加间隔时间？",
        "使用到期的复习来管理你存储的训练项目。对于应用之外的内容，计划一次后续的自我测试，并根据实际检索结果调整间隔时间。完成本阅读课程并不会生成新的复习卡片。"
      ],
      "ja": [
        "間隔を空けて練習する",
        "思い出す練習を異なる時点に分けて行います。読んだ直後に答えを繰り返すだけでなく、時間を置いてから何を覚えているか確かめます。",
        "誰にでも、どの内容にも合う間隔はありません。難しさ、予備知識、覚えておきたい期間が関わります。この短い練習は方法の説明です。長く覚えているかは、後の試行で確かめます。",
        "無理なく扱える少量の情報を学び、一度見ずに思い出しましょう。",
        "時間を空けて、次に思い出す機会を計画しましょう。",
        "答えを表示する前に、自分で答えましょう。",
        "間違えたら意味を確認して修正し、もう一度思い出しましょう。難しすぎた場合は次の間隔を短くします。",
        "確実に思い出せるようになったら、次の間隔を長くできます。",
        "ANITEWは保存した練習項目の復習を既に予定しています。別の予定表を作らず、期限の来た復習に従いましょう。",
        "Miraは新しい概念を学び、資料を見ずに説明します。休憩後に再び試すと、抜けに気づきました。正しい説明と比べて修正し、次の試行を早めます。確実に思い出せるようになってから間隔を延ばします。",
        "時間を置くことと、思い出そうとすることが重要です。10回続けて読むことは、後で思い出す試みの代わりにはなりません。間違いはMiraに見直す箇所を教え、間隔の調整に役立ちます。",
        "Miraの方法を説明しましょう。答えを見る前に何をしますか。抜けにどう対処しますか。いつ間隔を延ばせますか。",
        "保存した練習項目には期限の来た復習を使いましょう。アプリ外の教材では後の自己テストを予定し、実際に思い出せた程度に合わせて間隔を調整します。この読書コースの修了で新しい復習カードは作られません。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "meaningful-groups",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-meaningful-groups-fr-visual-7a9163ed083b.mp4",
    "bytes": 1338019,
    "sha256": "7a9163ed083b0541ca8f4e1874eec30c52862a347dac5e59604bcfeade033be9",
    "duration": 93.28,
    "cues": [
      {
        "start": 0.0,
        "end": 1.84
      },
      {
        "start": 1.84,
        "end": 12.44
      },
      {
        "start": 12.44,
        "end": 23.68
      },
      {
        "start": 23.68,
        "end": 28.88
      },
      {
        "start": 28.88,
        "end": 32.48
      },
      {
        "start": 32.48,
        "end": 37.16
      },
      {
        "start": 37.16,
        "end": 40.84
      },
      {
        "start": 40.84,
        "end": 45.88
      },
      {
        "start": 45.88,
        "end": 50.68
      },
      {
        "start": 50.68,
        "end": 59.68
      },
      {
        "start": 59.68,
        "end": 75.28
      },
      {
        "start": 75.28,
        "end": 83.52
      },
      {
        "start": 83.52,
        "end": 93.28
      }
    ],
    "recallBoundary": 82.6113875,
    "captions": {
      "de": [
        "Sinnvolle Einheiten bilden",
        "Du ordnest einzelne Informationen in verständliche Gruppen. Eine passende Struktur kann dir helfen, Inhalte zu überblicken und beim Abruf systematisch nach ihnen zu suchen.",
        "Gruppieren allein garantiert keinen vollständigen Abruf. Die Gruppen müssen für dich sinnvoll sein; fremde Fachbegriffe werden nicht durch eine Überschrift verständlich. Wenn die ursprüngliche Reihenfolge zählt, musst du sie zusätzlich üben.",
        "Kläre, was du behalten möchtest: Inhalte, Reihenfolge oder beides.",
        "Suche Gemeinsamkeiten oder Beziehungen zwischen den Informationen.",
        "Bilde wenige übersichtliche Gruppen und gib jeder eine aussagekräftige Überschrift.",
        "Erkläre, warum die einzelnen Teile zu ihrer Gruppe gehören.",
        "Verdecke die Vorlage. Rufe zuerst die Gruppen und dann ihre Inhalte ab.",
        "Vergleiche mit dem Original, ergänze fehlende Teile und versuche es später erneut.",
        "Apfel · Hammer · Hemd · Birne · Säge · Jacke · Banane · Zange · Hose",
        "Eine mögliche Ordnung: Obst (Apfel, Birne, Banane), Werkzeug (Hammer, Säge, Zange), Kleidung (Hemd, Jacke, Hose). Die drei Überschriften geben dir Suchhilfen. In dieser Übung zählen alle neun Begriffe; ihre ursprüngliche Reihenfolge ist nicht das Lernziel.",
        "Nenne ohne Vorlage die drei Gruppen und möglichst alle neun Begriffe. Die Reihenfolge innerhalb einer Gruppe ist frei.",
        "Gliedere einen eigenen Abschnitt nach Gedanken oder eine Liste nach sinnvollen Kategorien. Erfinde keine Gruppen nur für eine bestimmte Anzahl. Prüfe immer auch den vollständigen Inhalt, nicht nur die Überschriften."
      ],
      "en": [
        "Build meaningful groups",
        "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
        "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
        "Clarify your goal: the content, its order, or both.",
        "Look for shared features or relationships.",
        "Create a few manageable groups with informative headings.",
        "Explain why each item belongs in its group.",
        "Hide the source. Recall the groups first, then their contents.",
        "Compare with the original, correct missing items and try again later.",
        "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
        "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
        "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
        "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings."
      ],
      "fr": [
        "Former des groupes cohérents",
        "Organise des informations en groupes compréhensibles. Une structure utile peut t’aider à voir l’ensemble et à chercher les éléments méthodiquement lors du rappel.",
        "Regrouper ne garantit pas un rappel complet. Les groupes doivent avoir un sens pour toi ; un titre ne suffit pas à expliquer des termes inconnus. Si l’ordre initial compte, travaille-le aussi.",
        "Précise ton objectif : le contenu, son ordre ou les deux.",
        "Cherche des caractéristiques communes ou des relations.",
        "Crée quelques groupes faciles à parcourir avec des titres informatifs.",
        "Explique pourquoi chaque élément appartient à son groupe.",
        "Cache la source. Ensuite, rappelle d’abord les groupes, puis leur contenu.",
        "Compare avec l’original, corrige les omissions et réessaie plus tard.",
        "Une pomme. Un marteau. Une chemise. Une poire. Une scie. Une veste. Une banane. Une pince. Un pantalon.",
        "Une organisation possible : fruits (pomme, poire, banane), outils (marteau, scie, pince), vêtements (chemise, veste, pantalon). Les titres servent d’indices. L’objectif est de retenir les neuf éléments, pas leur ordre initial.",
        "Rappelle les trois groupes et autant des neuf éléments que possible. Fais-le sans regarder la liste. L’ordre dans chaque groupe est libre.",
        "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie tout le contenu. Ne te limite pas aux titres."
      ],
      "es": [
        "Formar grupos significativos",
        "Organiza los elementos de información en grupos con significado. Una estructura útil puede ayudarte a entender el conjunto y a buscar la información de forma sistemática al recordar.",
        "El simple acto de agrupar no garantiza un recuerdo completo. Los grupos deben tener sentido para ti; un título no explica términos técnicos desconocidos. Si el orden original es importante, practícalo por separado.",
        "Aclara tu objetivo: el contenido, su orden o ambos.",
        "Busca características compartidas o relaciones.",
        "Crea unos pocos grupos manejables con títulos informativos.",
        "Explica por qué cada elemento pertenece a su grupo.",
        "Oculta la fuente. Recuerda los grupos primero, luego sus contenidos.",
        "Compara con el original, corrige los elementos faltantes y vuelve a intentarlo más tarde.",
        "Manzana · martillo · camisa · pera · sierra · chaqueta · plátano · alicates · pantalones",
        "Una organización posible: frutas (manzana, pera, plátano), herramientas (martillo, sierra, alicates) y ropa (camisa, chaqueta, pantalones). Los títulos sirven de pistas. El objetivo es recordar los nueve elementos, no su orden original.",
        "Recuerda los tres grupos y tantos de los nueve elementos como puedas sin mirar. El orden dentro de un grupo es a tu elección.",
        "Organiza tu propio texto por ideas o una lista por categorías significativas. No inventes grupos solo para alcanzar un número específico. Revisa el contenido completo así como los títulos."
      ],
      "it": [
        "Creare gruppi significativi",
        "Organizza pezzi individuali di informazione in gruppi significativi. Una struttura utile può aiutarti a vedere il materiale chiaramente e a cercarlo in modo sistematico durante il ricordo.",
        "Il semplice raggruppamento non garantisce un ricordo completo. I gruppi devono avere senso per te; un titolo non spiega termini tecnici sconosciuti. Se l'ordine originale è importante, esercitati separatamente su di esso.",
        "Definisci il tuo obiettivo: il contenuto, l'ordine o entrambi.",
        "Cerca caratteristiche o relazioni comuni.",
        "Crea pochi gruppi gestibili con titoli esplicativi.",
        "Spiega perché ogni elemento appartiene al suo gruppo.",
        "Nascondi la fonte. Ricorda i gruppi prima, poi i loro contenuti.",
        "Confronta con l'originale, correggi gli elementi mancanti e riprova più tardi.",
        "Mela · martello · camicia · pera · sega · giacca · banana · pinze · pantaloni",
        "Una possibile organizzazione: frutta (mela, pera, banana), attrezzi (martello, sega, pinze), abbigliamento (camicia, giacca, pantaloni). I titoli aiutano a cercare i ricordi. L’obiettivo è ricordare tutti e nove gli elementi, non il loro ordine iniziale.",
        "Ricorda i tre gruppi e quanti più elementi possibile dei nove, senza guardare. Puoi scegliere l’ordine all’interno di ciascun gruppo.",
        "Organizza il tuo testo secondo idee o una lista secondo categorie significative. Non creare gruppi solo per raggiungere un numero specifico. Verifica sia il contenuto completo che i titoli."
      ],
      "pt": [
        "Crie grupos significativos",
        "Organize peças individuais de informação em grupos significativos. Uma estrutura útil pode ajudá-lo a ver claramente o conteúdo e a buscar sistematicamente durante a recuperação.",
        "O simples ato de agrupar não assegura a recuperação completa. Os grupos devem ter sentido para você; um título não explica termos técnicos desconhecidos. Se a ordem original for importante, pratique separadamente.",
        "Defina seu objetivo: o conteúdo, a ordem ou ambos.",
        "Procure características compartilhadas ou relações.",
        "Crie poucos grupos gerenciáveis com títulos informativos.",
        "Explique por que cada item pertence a seu grupo.",
        "Oculte a fonte. Recupere os grupos primeiro, depois seus conteúdos.",
        "Compare com o original, corrija itens faltantes e tente novamente mais tarde.",
        "Maçã · martelo · camisa · pera · serra · casaco · banana · alicate · calças",
        "Uma organização possível: frutas (maçã, pera, banana), ferramentas (martelo, serra, alicate), roupas (camisa, casaco, calças). Os títulos servem como pistas. O objetivo é lembrar os nove elementos, não a ordem inicial.",
        "Recorde os três grupos e o maior número possível dos nove elementos, sem olhar. Pode escolher a ordem dentro de cada grupo.",
        "Organize seu texto por ideias ou uma lista por categorias significativas. Não crie grupos apenas para atingir um número específico. Verifique o conteúdo completo, bem como os títulos."
      ],
      "nl": [
        "Bouw betekenisvolle groepen",
        "Verdeel losse informatie in betekenisvolle groepen. Een bruikbare structuur kan helpen om de leerstof te overzien en tijdens het herinneren systematisch te zoeken.",
        "Alleen het groeperen zorgt niet voor volledige herinnering. De groepen moeten betekenis voor je hebben; een kopje legt geen onbekende technische termen uit. Als de oorspronkelijke volgorde belangrijk is, oefen dan die apart.",
        "Bepaal je doel: de inhoud, de volgorde of beide.",
        "Zoek naar gedeelde kenmerken of relaties.",
        "Maak een paar beheersbare groepen met informatieve koppen.",
        "Verklaar waarom elk item behoort tot zijn groep.",
        "Verberg de bron. Haal eerst de groepen op en daarna hun inhoud.",
        "Vergelijk met het origineel, vul ontbrekende elementen aan en probeer het later opnieuw.",
        "Appel · hamer · overhemd · peer · zaag · jas · banaan · tang · broek",
        "Een mogelijke indeling: fruit (appel, peer, banaan), gereedschap (hamer, zaag, tang), kleding (overhemd, jas, broek). De kopjes geven zoekaanwijzingen. Je probeert alle negen elementen te onthouden; de oorspronkelijke volgorde is niet het leerdoel.",
        "Haal zonder te kijken de drie groepen en zo veel mogelijk van de negen elementen op. De volgorde binnen elke groep mag je zelf kiezen.",
        "Organiseer je eigen tekst of lijst volgens ideeën of op basis van betekenisvolle categorieën. Maak geen groepen aan om een bepaald aantal te bereiken. Controleer zowel de volledige inhoud als de koppen."
      ],
      "tr": [
        "Anlamlı gruplar oluştur",
        "Tek tek bilgileri anlamlı gruplarda düzenle. Yararlı bir yapı, bütünü görmene ve hatırlarken sistemli aramana yardımcı olabilir.",
        "Gruplamak tek başına eksiksiz hatırlamayı garanti etmez. Gruplar senin için anlamlı olmalıdır; bir başlık, bilmediğin teknik terimleri açıklamaz. İlk sıra önemliyse onu ayrıca çalış.",
        "Hedefini netleştir: içerik, sıralama veya ikisi birden.",
        "Ortak özellikler veya ilişkiler ara.",
        "Açıklayıcı başlıkları olan, yönetilebilir birkaç grup oluştur.",
        "Her öğenin neden grubuna ait olduğunu açıkla.",
        "Kaynağı gizle. Önce grupları, sonra içeriklerini hatırla.",
        "Aslıyla karşılaştır, eksik öğeleri tamamla ve daha sonra yeniden dene.",
        "Elma · çekiç · gömlek · armut · testere · ceket · muz · pense · pantolon",
        "Olası bir düzen: meyveler (elma, armut, muz), aletler (çekiç, testere, pense), giysiler (gömlek, ceket, pantolon). Başlıklar arama ipuçları sağlar. Hedef dokuz öğenin tamamını hatırlamaktır; ilk sıra öğrenme hedefi değildir.",
        "Bakmadan üç grubu ve dokuz öğeden mümkün olduğunca çoğunu hatırla. Grup içindeki sırayı kendin seçebilirsin.",
        "Kendi metnini fikirlere, bir listeyi ise anlamlı kategorilere göre düzenle. Sadece belirli bir sayıya ulaşmak için grup oluşturma. Başlıkların yanında içeriğin tamamını da kontrol et."
      ],
      "ar": [
        "كوّن مجموعات ذات معنى",
        "نظّم عناصر المعلومات في مجموعات ذات معنى. قد تساعدك البنية المناسبة على فهم المحتوى والبحث فيه منهجيًا عند التذكّر.",
        "التجميع وحده لا يضمن التذكّر الكامل. يجب أن تكون المجموعات مفهومة لك؛ فالعنوان لا يشرح المصطلحات المجهولة. إذا كان الترتيب الأصلي مهمًا، فتدرّب عليه بشكل منفصل.",
        "حدّد هدفك: المحتوى أم ترتيبه أم كلاهما.",
        "ابحث عن صفات مشتركة أو علاقات.",
        "كوّن مجموعات قليلة يسهل التعامل معها، بعناوين واضحة.",
        "اشرح سبب انتماء كل عنصر إلى مجموعته.",
        "أخفِ المصدر. استرجع المجموعات أولًا ثم محتوياتها.",
        "قارن بالأصل، وأكمل العناصر الناقصة، ثم حاول لاحقًا.",
        "تفاحة · مطرقة · قميص · كمثرى · منشار · سترة · موزة · كماشة · بنطال",
        "تنظيم ممكن: فواكه (تفاحة، كمثرى، موزة)، أدوات (مطرقة، منشار، كماشة)، ملابس (قميص، سترة، بنطال). العناوين تعطي دلائل للبحث. الهدف هو تذكّر العناصر التسعة، وليس ترتيبها الأول.",
        "استرجع المجموعات الثلاث وأكبر عدد ممكن من العناصر التسعة دون النظر. يمكنك اختيار الترتيب داخل المجموعة.",
        "نظّم نصك حسب الأفكار أو قائمتك حسب فئات مفهومة. لا تخترع مجموعات لمجرد الوصول إلى عدد معين. تحقّق من كامل المحتوى إلى جانب العناوين."
      ],
      "zh": [
        "构建有意义的组群",
        "把零散信息组织成有意义的组。合适的结构可以帮助你理解整体内容，并在回忆时有条理地寻找信息。",
        "仅仅分组并不能保证完整回忆。组群必须对你有意义；标题不能解释陌生的技术术语。如果原始顺序重要，应单独练习。",
        "明确你的目标：内容本身、顺序，还是两者兼有？",
        "寻找共同特征或联系。",
        "创建几个可管理的组群，并配以有信息量的标题。",
        "解释每项内容为何属于它所在的组群。",
        "隐藏信息来源。先回忆组群，再回忆其内部内容。",
        "与原始内容对比，补全遗漏项，稍后重新尝试。",
        "苹果 · 锤子 · 衬衫 · 梨 · 锯子 · 夹克 · 香蕉 · 钳子 · 裤子",
        "一种分组方式：水果（苹果、梨、香蕉）、工具（锤子、锯子、钳子）、衣物（衬衫、夹克、裤子）。组名是寻找记忆的线索。目标是记住全部九项，不是它们最初的顺序。",
        "先回忆三个组群，尽可能多地回忆出九项内容，不看原文。组群内部的顺序由你决定。",
        "按意思划分自己的文章，或按有意义的类别整理清单。不要只为凑某个数量而分组。既要检查组名，也要检查完整内容。"
      ],
      "ja": [
        "意味のあるまとまりを作る",
        "個々の情報を意味のあるグループに整理する。有用な構造は、材料を明確に見ることができ、記憶の際に系統的に探すのを助けます。",
        "グループ化だけでは完全な記憶を保証しません。グループが自分にとって意味を持つ必要があります。見慣れない技術用語は、見出しで説明されません。元の順序が重要であれば、別途練習してください。",
        "目的を明確にしましょう：内容そのもの、順序、または両方です。",
        "共通の特徴や関係性を探してください。",
        "数少ない、管理しやすいグループを作り、説明のある見出しを付けてください。",
        "各項目がそのグループに属する理由を説明してください。",
        "元の情報を隠し、まずグループを、次にその中身を思い出しましょう。",
        "元の状態と比較し、欠落した項目を補正し、後に再試行してください。",
        "リンゴ · ハンマー · シャツ · 洋ナシ · のこぎり · ジャケット · バナナ · ペンチ · ズボン",
        "例えば、果物（リンゴ、洋ナシ、バナナ）、道具（ハンマー、のこぎり、ペンチ）、衣類（シャツ、ジャケット、ズボン）に分けられます。見出しは思い出す手掛かりです。目標は9項目すべてを覚えることで、最初の並び順ではありません。",
        "見ずに3つのグループと、9項目のうちできるだけ多くを思い出しましょう。グループ内の順番は自由です。",
        "自分の文章を、考え方やリストの項目を意味のあるカテゴリに分類して整理してください。特定の数に達するためだけにグループを無理に作らないでください。見出しだけでなく、全内容も確認してください。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "self-explanation",
    "coach": "rafael",
    "language": "fr",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-self-explanation-fr-visual-920ff20b787b.mp4",
    "bytes": 1500365,
    "sha256": "920ff20b787bb2862735b05a535f02e05ed7c02cde231552a63f688fa3bb9c79",
    "duration": 101.24,
    "cues": [
      {
        "start": 0.0,
        "end": 1.52
      },
      {
        "start": 1.52,
        "end": 12.08
      },
      {
        "start": 12.08,
        "end": 24.52
      },
      {
        "start": 24.52,
        "end": 28.36
      },
      {
        "start": 28.36,
        "end": 34.68
      },
      {
        "start": 34.68,
        "end": 39.6
      },
      {
        "start": 39.6,
        "end": 45.2
      },
      {
        "start": 45.2,
        "end": 49.92
      },
      {
        "start": 49.92,
        "end": 53.88
      },
      {
        "start": 53.88,
        "end": 67.4
      },
      {
        "start": 67.4,
        "end": 82.0
      },
      {
        "start": 82.0,
        "end": 89.88
      },
      {
        "start": 89.88,
        "end": 101.24
      }
    ],
    "recallBoundary": 88.94610833333334,
    "captions": {
      "de": [
        "Zusammenhänge selbst erklären",
        "Du erklärst mit eigenen Worten, warum ein Schritt sinnvoll ist oder wie zwei Aussagen zusammenhängen. So kannst du Verständnislücken entdecken, die beim bloßen Lesen unauffällig bleiben.",
        "Eine flüssige Erklärung kann trotzdem falsch sein. Prüfe sie an einer zuverlässigen Vorlage und kennzeichne Unsicherheit. Die Methode ergänzt das Üben; sie ersetzt weder Fachwissen noch eine Prüfung deiner Erklärung.",
        "Wähle einen überschaubaren Zusammenhang, den du verstehen möchtest.",
        "Frage: Warum folgt dieser Schritt? Was bleibt gleich? Was würde sich bei anderen Bedingungen ändern?",
        "Formuliere deine Erklärung ohne die Vorlage zu kopieren.",
        "Vergleiche sie mit der Begründung im Original. Trenne gesicherte Aussagen von Vermutungen.",
        "Korrigiere Lücken und wende die Erklärung auf ein ähnliches Beispiel an.",
        "Erkläre den Zusammenhang später noch einmal ohne Vorlage.",
        "Drei Viertel sind gleich viel wie sechs Achtel: 3/4 = 6/8. Wenn jedes der vier gleich großen Teile noch einmal halbiert wird, entstehen acht gleich große Teile. Die drei ausgewählten Viertel bestehen dann aus sechs Achteln. Die ausgewählte Menge bleibt gleich.",
        "„Oben und unten mal zwei“ beschreibt eine Rechenregel. Die Erklärung mit den halbierten Teilen begründet, warum sich der Wert nicht ändert. Zum Übertragen kannst du überlegen, weshalb 2/3 und 4/6 denselben Anteil beschreiben.",
        "Erkläre ohne Vorlage, warum 3/4 und 6/8 gleich viel sind. Übertrage die Begründung anschließend auf 2/3 und 4/6.",
        "Nimm einen Schritt aus deinem Lernstoff und erkläre, warum er gilt. Suche ein ähnliches Beispiel und prüfe deine Erklärung daran. Wenn du die Begründung nicht verlässlich prüfen kannst, halte die offene Frage fest, statt Sicherheit vorzutäuschen."
      ],
      "en": [
        "Explain relationships yourself",
        "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
        "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
        "Choose a manageable relationship you want to understand.",
        "Ask why the step follows, what stays the same and what would change under different conditions.",
        "Formulate an explanation without copying the source.",
        "Compare it with the original reasoning. Separate established facts from guesses.",
        "Correct gaps and apply your explanation to a similar example.",
        "Explain the relationship again later without looking.",
        "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
        "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
        "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
        "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain."
      ],
      "fr": [
        "Expliquer soi-même les relations",
        "Explique avec tes propres mots pourquoi une étape a du sens ou comment deux affirmations sont liées. Tu peux ainsi découvrir des lacunes qui passent inaperçues à la lecture.",
        "Une explication fluide peut être fausse. Vérifie-la dans une source fiable et reconnais les incertitudes. Cette méthode accompagne la pratique ; elle ne remplace ni les connaissances du sujet ni la vérification.",
        "Choisis une relation limitée que tu veux comprendre.",
        "Demande-toi pourquoi l’étape suit, ce qui reste identique et ce qui changerait dans d’autres conditions.",
        "Maintenant, explique avec tes propres mots. Ne copie pas la source.",
        "Compare avec le raisonnement original. Distingue les faits établis des suppositions.",
        "Corrige les lacunes et applique ton explication à un exemple similaire.",
        "Explique de nouveau la relation plus tard, sans regarder.",
        "Trois quarts valent six huitièmes : trois quarts sont égaux à six huitièmes. En coupant chacune des quatre parts égales en deux, on obtient huit parts égales. Les trois quarts sélectionnés deviennent six huitièmes. La quantité sélectionnée reste identique.",
        "« Multiplier le numérateur et le dénominateur par deux » décrit une règle. Couper les parts égales en deux explique pourquoi la valeur ne change pas. Pour transférer l’idée, cherche pourquoi deux tiers et quatre sixièmes représentent la même proportion.",
        "Explique sans modèle pourquoi trois quarts et six huitièmes sont égaux. Applique ensuite ton raisonnement à deux tiers et quatre sixièmes.",
        "Choisis une étape de ton cours et explique pourquoi elle est valable. Trouve un exemple similaire pour vérifier ton raisonnement. Si tu ne peux pas vérifier de façon fiable, note la question ouverte plutôt que de prétendre être certain."
      ],
      "es": [
        "Explica las relaciones por ti mismo",
        "Explica en tus propias palabras por qué un paso tiene sentido o cómo se relacionan dos afirmaciones. Esto puede revelar vacíos en el entendimiento que son fáciles de pasar por alto al leer.",
        "Una explicación fluida puede seguir siendo incorrecta. Verifícala contra una fuente confiable y reconoce la incertidumbre. Este método apoya la práctica; no reemplaza el conocimiento del tema ni la verificación de tu explicación.",
        "Elige una relación manejable que quieras entender.",
        "Pregúntate por qué se deduce ese paso, qué permanece igual y qué cambiaría en otras condiciones.",
        "Formula una explicación sin copiar la fuente.",
        "Compara tu explicación con el razonamiento original. Separa hechos establecidos de suposiciones.",
        "Corrige los vacíos y aplica tu explicación a un ejemplo similar.",
        "Explica nuevamente la relación más tarde sin mirar.",
        "Tres cuartos equivalen a seis octavos: 3/4 = 6/8. Al dividir por la mitad cada una de las cuatro partes iguales, se obtienen ocho partes iguales. Los tres cuartos seleccionados se convierten en seis octavos. La cantidad seleccionada no cambia.",
        "«Multiplicar el numerador y el denominador por dos» describe una regla. Dividir en partes iguales explica por qué el valor no cambia. Para transferir la idea, piensa por qué 2/3 y 4/6 representan la misma proporción.",
        "Explica sin mirar por qué 3/4 y 6/8 son iguales. Luego aplica tu razonamiento a 2/3 y 4/6.",
        "Elige un paso en tu material de estudio y explica por qué es válido. Encuentra un ejemplo similar y verifica tu explicación con él. Si no puedes verificar el razonamiento de forma confiable, registra la pregunta abierta en lugar de fingir certeza."
      ],
      "it": [
        "Spiega i collegamenti con parole tue",
        "Spiega con parole tue perché un passaggio ha senso o come si collegano due affermazioni. Puoi così scoprire lacune nella comprensione che sfuggono durante la lettura.",
        "Una spiegazione fluida può comunque essere errata. Controllala contro una fonte affidabile e riconosci l'incertezza. Questo metodo favorisce la pratica; non sostituisce conoscenze specifiche o il controllo della tua spiegazione.",
        "Scegli un collegamento circoscritto che vuoi capire.",
        "Chiediti perché il passaggio sia giustificato, cosa rimane costante e cosa cambierebbe in condizioni diverse.",
        "Formula una spiegazione senza copiare il testo originale.",
        "Confronta la spiegazione con il ragionamento originale. Distingui i fatti accertati dalle ipotesi.",
        "Correggi le lacune e applica la tua spiegazione a un esempio simile.",
        "Spiega nuovamente il collegamento più tardi, senza guardare.",
        "Tre quarti equivalgono a sei ottavi: 3/4 = 6/8. Dividendo a metà ciascuna delle quattro parti uguali, si ottengono otto parti uguali. I tre quarti selezionati diventano sei ottavi. La quantità selezionata rimane la stessa.",
        "«Moltiplicare numeratore e denominatore per due» descrive una regola. Dividere a metà le parti uguali spiega perché il valore non cambia. Applica l’idea: perché 2/3 e 4/6 rappresentano la stessa proporzione?",
        "Spiega senza guardare perché 3/4 e 6/8 sono uguali. Poi applica il tuo ragionamento a 2/3 e 4/6.",
        "Scegli un passaggio del materiale di studio e spiega perché è valido. Trova un esempio simile e verifica la tua spiegazione con esso. Se non riesci a verificare il ragionamento in modo affidabile, registra la domanda aperta invece di fingerti certo."
      ],
      "pt": [
        "Explique as relações com as suas palavras",
        "Explique com as suas palavras por que um passo faz sentido ou como duas afirmações se relacionam. Isso pode revelar lacunas de compreensão que passam despercebidas durante a leitura.",
        "Uma explicação fluente pode ainda estar errada. Verifique contra uma fonte confiável e reconheça a incerteza. Esse método apoia o treinamento; não substitui o conhecimento subjacente ou a verificação da explicação.",
        "Escolha uma relação que seja viável de entender.",
        "Pergunte por que o passo se segue, o que permanece o mesmo e o que mudaria sob condições diferentes.",
        "Formule uma explicação sem copiar a fonte.",
        "Compare com o raciocínio original. Separe fatos estabelecidos de especulações.",
        "Corrija lacunas e aplique sua explicação a um exemplo semelhante.",
        "Explique novamente a relação mais tarde, sem olhar.",
        "Três quartos equivalem a seis oitavos: 3/4 = 6/8. Ao dividir ao meio cada uma das quatro partes iguais, obtêm-se oito partes iguais. Os três quartos selecionados passam a ser seis oitavos. A quantidade selecionada permanece a mesma.",
        "«Multiplicar o numerador e o denominador por dois» descreve uma regra. Dividir ao meio as partes iguais explica por que o valor não muda. Aplique a ideia: por que 2/3 e 4/6 representam a mesma proporção?",
        "Explique sem olhar por que 3/4 e 6/8 são iguais. Depois, aplique o raciocínio a 2/3 e 4/6.",
        "Escolha um passo no seu material de estudo e explique por que ele é válido. Encontre um exemplo semelhante e verifique sua explicação com ele. Se não conseguir validar o raciocínio com confiança, registre a pergunta aberta em vez de fingir certeza."
      ],
      "nl": [
        "Verklaar de relatie zelf",
        "Leg in eigen woorden uit waarom een stap logisch is of hoe twee uitspraken samenhangen. Zo kun je hiaten in je begrip ontdekken die tijdens het lezen onopgemerkt blijven.",
        "Een vlotte uitleg kan nog steeds fout zijn. Controleer die aan de hand van een betrouwbare bron en erken onzekerheid. De methode ondersteunt oefenen, maar vervangt vakkennis of controle niet.",
        "Kies een beheersbare relatie die je wilt begrijpen.",
        "Vraag jezelf waarom de stap volgt, wat gelijk blijft en wat er verandert onder andere voorwaarden.",
        "Formuleer een uitleg zonder de bron te kopiëren.",
        "Vergelijk met de oorspronkelijke redenering. Maak onderscheid tussen vaststaande feiten en vermoedens.",
        "Corrigeer hiaten en pas je uitleg toe op een vergelijkbaar voorbeeld.",
        "Verklaar de relatie opnieuw later zonder te kijken.",
        "Drie kwart is gelijk aan zes achtsten: 3/4 = 6/8. Het halveren van elk van de vier gelijke delen maakt acht gelijke delen. De drie geselecteerde kwartstukken bestaan nu uit zes achtsten. Het geselecteerde deel blijft hetzelfde.",
        "‘Vermenigvuldig de boven- en onderkant met twee’ is een regel. Het halveren van de gelijke delen verklaart waarom de waarde niet verandert. Om het idee over te dragen, overweeg waarom 2/3 en 4/6 dezelfde verhouding tonen.",
        "Leg zonder te kijken uit waarom 3/4 en 6/8 gelijk zijn. Pas de redenering daarna toe op 2/3 en 4/6.",
        "Kies een stap uit je leerstof en verklaar waarom die geldt. Zoek een vergelijkbaar voorbeeld en controleer je uitleg daarbij. Als je de redenering niet betrouwbaar kunt bevestigen, noteer dan de open vraag in plaats van te suggereren dat je zeker bent."
      ],
      "tr": [
        "İlişkileri kendi sözlerinle açıkla",
        "Bir adımın neden anlamlı olduğunu veya iki ifadenin nasıl ilişkili olduğunu kendi sözlerinle açıkla. Böylece okurken gözden kaçan anlama eksiklerini fark edebilirsin.",
        "Akıcı bir açıklama yine de yanlış olabilir. Güvenilir bir kaynakla kontrol et ve belirsizlikleri kabul et. Bu yöntem çalışmayı destekler; konu bilgisinin veya açıklamayı kontrol etmenin yerini almaz.",
        "Anlamak istediğin, kapsamı sınırlı bir ilişki seç.",
        "Adımın neden geçerli olduğunu, neyin aynı kaldığını ve farklı koşullarda neyin değişeceğini sor.",
        "Kaynağı kopyalamadan bir açıklama oluştur.",
        "Asıl akıl yürütmeyle karşılaştır. Doğrulanmış bilgileri tahminlerden ayır.",
        "Eksikleri düzelt ve açıklamanı benzer bir örneğe uygula.",
        "İlişkiyi daha sonra bakmadan yeniden açıkla.",
        "Dörtte üç, sekizde altıya eşittir: 3/4 = 6/8. Dört eşit parçanın her birini ikiye bölersen sekiz eşit parça oluşur. Seçili üç çeyrek artık altı sekizlik parçadan oluşur. Seçilen miktar aynı kalır.",
        "«Payı ve paydayı ikiyle çarp» bir kuralı anlatır. Eşit parçaları ikiye bölmek, değerin neden değişmediğini açıklar. Bu fikri başka bir örneğe uygula: 2/3 ve 4/6 neden aynı oranı gösterir?",
        "3/4 ve 6/8’in neden eşit olduğunu bakmadan açıkla. Sonra aynı akıl yürütmeyi 2/3 ve 4/6’ya uygula.",
        "Öğrenme malzemenden bir adım seç ve neden geçerli olduğunu açıkla. Benzer bir örnek bulup açıklamanı onunla kontrol et. Akıl yürütmeyi güvenilir biçimde doğrulayamıyorsan kesinmiş gibi davranmak yerine açık soruyu kaydet."
      ],
      "ar": [
        "اشرح العلاقات بنفسك",
        "اشرح بكلماتك لماذا تكون خطوة منطقية أو كيف ترتبط عبارتان. قد يكشف ذلك ثغرات في الفهم لا تلاحظها أثناء القراءة.",
        "قد يكون الشرح سلسًا لكنه خاطئ. قارنه بمصدر موثوق واعترف بما لا تعرفه. تدعم هذه الطريقة التدريب، لكنها لا تحل محل المعرفة بالموضوع أو التحقّق من الشرح.",
        "اختر علاقة محددة تريد فهمها.",
        "اسأل لماذا تصح الخطوة، وما الذي يبقى ثابتًا، وما الذي يتغير في ظروف مختلفة.",
        "صغ شرحًا دون نسخ المصدر.",
        "قارن بالاستدلال الأصلي. ميّز الحقائق المثبتة عن التخمينات.",
        "صحّح الثغرات وطبّق شرحك على مثال مشابه.",
        "اشرح العلاقة لاحقًا مرة أخرى دون النظر إلى المصدر.",
        "ثلاثة أرباع تساوي ستة أثمان: 3/4 = 6/8. تقسيم كل جزء من الأجزاء الأربعة المتساوية إلى نصفين يعطي ثمانية أجزاء متساوية. تصبح الأرباع الثلاثة المختارة ستة أثمان، وتبقى الكمية المختارة نفسها.",
        "«اضرب البسط والمقام في اثنين» تصف قاعدة. تقسيم الأجزاء المتساوية إلى نصفين يفسّر ثبات القيمة. طبّق الفكرة: لماذا تعبّر 2/3 و4/6 عن النسبة نفسها؟",
        "اشرح دون النظر لماذا تتساوى 3/4 و6/8. ثم طبّق الاستدلال على 2/3 و4/6.",
        "اختر خطوة من مادتك واشرح سبب صحتها. تحقّق من شرحك بمثال مشابه. إذا تعذّر التحقّق من الاستدلال بثقة، فسجّل السؤال المفتوح بدل ادّعاء اليقين."
      ],
      "zh": [
        "自己解释关系",
        "用你自己的话说明某一步为何合理，或两个陈述之间的联系。这能揭示阅读时容易忽略的理解漏洞。",
        "流畅的解释仍可能出错。需对照可靠来源进行验证，并承认不确定性。此方法有助于练习，但不能替代专业知识或对解释的核查。",
        "选择一个你希望理解的、可操作的关系。",
        "追问这一步为何成立，什么保持不变，以及在不同条件下会发生什么变化。",
        "不抄袭原文，自行提出解释。",
        "与原文推理进行对比，区分已确立的事实与猜测。",
        "修正遗漏部分，并将其解释应用到相似的例子上。",
        "稍后在不看的情况下再次解释该关系。",
        "四分之三等于八分之六：3/4 = 6/8。把四个相等部分中的每一份再分成两半，就得到八个相等部分。原先选中的三份现在变成六份，选中的总量没有改变。",
        "“分子和分母都乘以二”是在描述规则。把每份等分为两半，才能解释数值为什么不变。再想一想：为什么 2/3 和 4/6 表示同样的比例？",
        "在不看的情况下解释为何3/4和6/8相等。然后将你的推理应用到2/3和4/6上。",
        "选择学习材料中的某一步，解释它为何成立。找到一个相似的例子并用它来验证你的解释。如果无法可靠验证推理，就记录下未解决的问题，而不是假装确定。"
      ],
      "ja": [
        "つながりを自分の言葉で説明する",
        "ある手順がなぜ妥当なのか、2つの説明がどうつながるのかを、自分の言葉で説明します。読むだけでは見逃す理解の抜けに気づけます。",
        "流暢な説明でも間違っていることがあります。信頼できる資料で確認し、不確かな点を認めましょう。この方法は学習を助けますが、知識や説明の確認に代わるものではありません。",
        "理解したい、範囲の限られた関係を選びましょう。",
        "なぜその手順が成り立つのか、何が変わらず、条件が違えば何が変わるのかを問いましょう。",
        "資料を写さず、自分で説明を組み立てましょう。",
        "元の理由づけと比べ、確かめられた事実と推測を分けましょう。",
        "抜けを修正し、似た例に説明を当てはめましょう。",
        "後で、資料を見ずにもう一度説明しましょう。",
        "4分の3は8分の6と同じです：3/4 = 6/8。4つの等しい部分をそれぞれ半分にすると、8つの等しい部分になります。選んだ3つの部分は6つになり、選んだ量は変わりません。",
        "「分子と分母を2倍する」は規則の説明です。等しい部分を半分に分けることで、値が変わらない理由が分かります。2/3と4/6が同じ割合を表す理由にも当てはめてみましょう。",
        "見ずに、3/4と6/8が等しい理由を説明しましょう。次に同じ考え方を2/3と4/6に当てはめましょう。",
        "教材の手順を1つ選び、成り立つ理由を説明しましょう。似た例で確かめます。理由を確実に検証できなければ、分かったふりをせず、未解決の疑問として記録しましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "active-recall",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-active-recall-de-visual-07da7b18b29d.mp4",
    "bytes": 1595023,
    "sha256": "07da7b18b29df8d203ab4bd3f67a7b7263970f1e3624d0e810fa15d8c8056256",
    "duration": 111.48,
    "recallBoundary": 96.548625,
    "cues": [
      {
        "start": 0.0,
        "end": 2.4
      },
      {
        "start": 2.4,
        "end": 15.32
      },
      {
        "start": 15.32,
        "end": 32.08
      },
      {
        "start": 32.08,
        "end": 35.92
      },
      {
        "start": 35.92,
        "end": 41.08
      },
      {
        "start": 41.08,
        "end": 45.76
      },
      {
        "start": 45.76,
        "end": 52.28
      },
      {
        "start": 52.28,
        "end": 57.24
      },
      {
        "start": 57.24,
        "end": 64.8
      },
      {
        "start": 64.8,
        "end": 77.6
      },
      {
        "start": 77.6,
        "end": 90.6
      },
      {
        "start": 90.6,
        "end": 97.48
      },
      {
        "start": 97.48,
        "end": 111.48
      }
    ],
    "captions": {
      "de": [
        "Aktives Abrufen",
        "Du versuchst, eine Information ohne Vorlage wiederzugeben. Dabei erkennst du, was du selbst abrufen kannst und wo du noch nacharbeiten musst. Das hilft bei Fakten, Begriffen und Zusammenhängen.",
        "Dass dir eine gelesene Antwort bekannt vorkommt, heißt nicht, dass du sie selbst abrufen kannst. Ein misslungener Versuch ist kein Endurteil: Prüfe die richtige Antwort, kläre sie und versuche es erneut. Häufiges Raten ohne Rückmeldung kann Fehler festigen.",
        "Wähle eine kleine, verstandene Information.",
        "Stelle eine klare Frage, die sich aus dem Material beantworten lässt.",
        "Lege die Vorlage weg und antworte, bevor du nachsiehst.",
        "Vergleiche deine Antwort mit dem Original. Korrigiere fehlende oder falsche Teile.",
        "Verdecke die richtige Antwort und versuche den Abruf noch einmal.",
        "Prüfe später erneut. Nur sofort wiederholen kann sich leicht anfühlen, ohne dauerhaftes Behalten zu zeigen.",
        "Frage: Warum kühlt verdunstendes Wasser eine Oberfläche?\nAntwort: Zum Verdunsten wird Energie benötigt. Diese Energie wird der Oberfläche und ihrer Umgebung als Wärme entzogen.",
        "Lies und verstehe zunächst die Antwort. Decke sie dann ab und beantworte die Frage selbst. „Wasser kühlt“ allein erklärt den Zusammenhang noch nicht; entscheidend sind Energiebedarf und Wärmeentzug.",
        "Warum kann verdunstendes Wasser eine Oberfläche kühlen? Erkläre den Zusammenhang ohne Vorlage.",
        "Formuliere zu deinem eigenen Material eine konkrete Frage. Antworte zunächst ohne Vorlage, vergleiche danach und versuche es später erneut. Die App nutzt Abrufversuche auch in ihren Trainingseinheiten."
      ],
      "en": [
        "Active recall",
        "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
        "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
        "Choose a small piece of information you understand.",
        "Ask a clear question that the material answers.",
        "Put the source away and answer before checking.",
        "Compare with the original. Correct missing or mistaken parts.",
        "Hide the answer and try retrieving it again.",
        "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention.",
        "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
        "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
        "Why can evaporating water cool a surface? Explain without looking.",
        "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions."
      ],
      "fr": [
        "Pratiquer le rappel actif",
        "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi ce que tu peux rappeler toi-même de ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations.",
        "Reconnaître une réponse en la lisant ne signifie pas savoir la retrouver. Un échec n’est pas un verdict : vérifie et comprends la bonne réponse, puis réessaie. Deviner plusieurs fois sans correction peut renforcer des erreurs.",
        "Choisis une petite quantité d’information que tu comprends.",
        "Pose une question précise à laquelle le contenu permet de répondre.",
        "Écarte la source et réponds avant de vérifier.",
        "Compare avec l’original. Corrige les éléments manquants ou erronés.",
        "Cache la réponse et essaie de la rappeler à nouveau.",
        "Teste-toi aussi plus tard. Répéter immédiatement peut sembler facile sans démontrer une mémorisation durable.",
        "Question : pourquoi l’eau qui s’évapore peut-elle refroidir une surface ?\nRéponse : l’évaporation demande de l’énergie. Cette énergie est prélevée sous forme de chaleur dans la surface et son environnement.",
        "Lis et comprends d’abord la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels.",
        "Pourquoi l’eau qui s’évapore peut-elle refroidir une surface ? Explique le lien sans regarder.",
        "Formule une question précise sur ton propre contenu. Réponds sans regarder, compare ensuite et réessaie plus tard. ANITEW utilise aussi le rappel dans ses séances d’entraînement."
      ],
      "es": [
        "Recuperación activa",
        "Intenta recordar la información sin mirar la fuente. Así compruebas qué puedes recuperar de memoria y qué necesita más práctica. Sirve para hechos, conceptos y relaciones.",
        "Reconocer una respuesta al leerla no significa que puedas recuperarla tú mismo. Un intento fallido no es un juicio definitivo: revisa y entiende la respuesta correcta, luego inténtalo de nuevo. Repetir suposiciones sin retroalimentación puede reforzar errores.",
        "Elige un pequeño fragmento de información que entiendas.",
        "Formula una pregunta clara que el material permita responder.",
        "Pon la fuente lejos y responde antes de verificar.",
        "Compara con el original. Corrige partes faltantes o erróneas.",
        "Oculta la respuesta y trata de recuperarla nuevamente.",
        "Compruébalo también más tarde. Repetir de inmediato puede resultar fácil sin demostrar que lo recuerdas a largo plazo.",
        "Pregunta: ¿Por qué puede el agua que se evapora enfriar una superficie? Respuesta: La evaporación requiere energía. Esa energía se toma de la superficie y su entorno en forma de calor.",
        "Primero lee y comprende la respuesta. Luego ocúltala y responde por tu cuenta. Decir solo «el agua enfría» no explica la relación: importan la energía necesaria y la transferencia de calor.",
        "¿Por qué puede el agua que se evapora enfriar una superficie? Explícalo sin mirar.",
        "Escribe una pregunta específica sobre tu propio material. Responde sin mirar, compárala después, y luego inténtala nuevamente más tarde. ANITEW también utiliza intentos de recuperación en sus sesiones de entrenamiento."
      ],
      "it": [
        "Richiamo attivo",
        "Prova a ricordare l'informazione senza guardare la fonte. Questo mostra cosa riesci a ricordare e cosa necessita di ulteriore lavoro. Usa questo per fatti, concetti e relazioni.",
        "Riconoscere una risposta mentre la leggi non significa che tu possa ricordarla da solo. Un tentativo fallito non è una conclusione definitiva: verifica e capisci la risposta corretta, poi riprova. Ripetere tentativi di indovinare senza feedback può consolidare errori.",
        "Scegli un piccolo pezzo di informazione che capisci.",
        "Formula una domanda chiara a cui il materiale permette di rispondere.",
        "Nascondi la fonte e rispondi prima di controllare.",
        "Confronta con l'originale. Correggi parti mancanti o errate.",
        "Nascondi la risposta e prova a ricordarla nuovamente.",
        "Mettiti alla prova anche più tardi. Ripetere subito può sembrare facile senza dimostrare che ricorderai a lungo.",
        "Domanda: Perché l'evaporazione dell'acqua raffredda una superficie?\nRisposta: L'evaporazione richiede energia. Questa energia viene estratta dalla superficie e dagli ambienti circostanti sotto forma di calore.",
        "Prima leggi e comprendi la risposta. Poi nascondila e rispondi con parole tue. Dire solo «l’acqua raffredda» non spiega il rapporto: contano l’energia necessaria e il trasferimento di calore.",
        "Perché l'evaporazione dell'acqua raffredda una superficie? Spiega senza guardare.",
        "Scrivi una domanda precisa sul tuo materiale. Rispondi senza guardare, confronta la risposta e riprova più tardi. Anche ANITEW usa tentativi di richiamo nelle sessioni di allenamento."
      ],
      "pt": [
        "Recordação ativa",
        "Tente recuperar a informação sem olhar para a fonte. Isso mostra o que você consegue lembrar e o que precisa de mais trabalho. Use isso para fatos, conceitos e relações.",
        "Reconhecer a resposta ao ler não significa que você consiga recuperá-la sozinho. Um erro não é uma conclusão final: verifique e entenda a resposta correta, depois tente novamente. Adivinhar repetidamente sem feedback pode reforçar erros.",
        "Escolha um pequeno trecho de informação que você entende.",
        "Pergunte claramente algo que o material responda.",
        "Ponha a fonte de lado e responda antes de verificar.",
        "Compare com a versão original. Corrija partes ausentes ou incorretas.",
        "Esconda a resposta e tente recuperá-la novamente.",
        "Teste-se mais tarde também. A repetição imediata pode parecer fácil, mas não demonstra retenção duradoura.",
        "Pergunta: Por que a evaporação da água resfria uma superfície?\nResposta: A evaporação exige energia. Essa energia é retirada da superfície e do ambiente ao redor na forma de calor.",
        "Leia e compreenda primeiro a resposta. Depois, esconda-a e responda por conta própria. Dizer apenas «a água esfria» não explica a relação: são importantes a energia necessária e a transferência de calor.",
        "Por que a evaporação da água resfria uma superfície? Explique sem olhar.",
        "Escreva uma pergunta específica sobre o seu próprio conteúdo. Responda sem olhar, compare depois e tente novamente mais tarde. O ANITEW também utiliza tentativas de recuperação em suas sessões de treinamento."
      ],
      "nl": [
        "Actief ophalen uit het geheugen",
        "Probeer informatie op te halen zonder naar de bron te kijken. Zo merk je wat je zelf kunt herinneren en wat meer oefening nodig heeft. Dit werkt voor feiten, begrippen en verbanden.",
        "Een antwoord herkennen tijdens het lezen betekent niet dat je het zelf kunt ophalen. Een mislukte poging is geen eindoordeel: controleer en begrijp het juiste antwoord en probeer opnieuw. Herhaald gokken zonder feedback kan fouten versterken.",
        "Kies een klein stukje informatie dat je begrijpt.",
        "Stel een duidelijke vraag die met de leerstof te beantwoorden is.",
        "Zet de bron weg en antwoord voordat je het controleert.",
        "Vergelijk met de oorspronkelijke tekst. Corrigeer ontbrekende of verkeerde delen.",
        "Verberg het antwoord en probeer het opnieuw uit je geheugen op te halen.",
        "Test jezelf ook later. Direct herhalen kan makkelijk voelen zonder aan te tonen dat je iets blijvend onthoudt.",
        "Vraag: Waarom koelt het verdampen van water een oppervlak?\nAntwoord: Verdampen vereist energie. Die energie wordt uit het oppervlak en de omgeving opgenomen als warmte.",
        "Lees en begrijp eerst het antwoord. Verberg het daarna en beantwoord zelf de vraag. Alleen «water koelt» verklaart het verband niet: de benodigde energie en de warmteoverdracht zijn belangrijk.",
        "Waarom koelt het verdampen van water een oppervlak? Leg het zonder te kijken uit.",
        "Stel een gerichte vraag over je eigen leerstof. Antwoord zonder te kijken, vergelijk daarna en probeer het later opnieuw. ANITEW gebruikt ook ophaalpogingen in de trainingen."
      ],
      "tr": [
        "Aktif hatırlama",
        "Kaynağa bakmadan bilgiyi hatırlamayı dene. Böylece neyi kendi başına hatırlayabildiğini, neyin daha fazla çalışma gerektirdiğini görürsün. Yöntem; bilgiler, kavramlar ve ilişkiler için kullanılabilir.",
        "Okurken bir cevabı tanımak, onu kendi başına hatırlayabilmek değildir. Başarısız bir deneme son karar değildir: doğru cevabı kontrol et, anla ve yeniden dene. Geri bildirim almadan tekrar tekrar tahmin etmek hataları pekiştirebilir.",
        "Anladığın küçük bir bilgi parçası seç.",
        "Bu bilgiyle cevaplanabilecek açık bir soru oluştur.",
        "Kaynağı kaldır ve kontrol etmeden önce cevap ver.",
        "Aslıyla karşılaştır. Eksik veya yanlış kısımları düzelt.",
        "Cevabı gizle ve tekrar hatırlamayı dene.",
        "Kendini daha sonra da sına. Hemen tekrarlamak kolay gelebilir, ama kalıcı olarak hatırladığını göstermeyebilir.",
        "Soru: Buharlaşan su bir yüzeyi neden soğutabilir? Cevap: Buharlaşma enerji gerektirir. Bu enerji yüzeyden ve çevresinden ısı olarak alınır.",
        "Önce cevabı oku ve anla. Sonra gizleyerek soruyu kendi başına cevapla. Yalnızca «su soğutur» demek ilişkiyi açıklamaz; gereken enerji ve ısı aktarımı önemlidir.",
        "Buharlaşan su bir yüzeyi neden soğutabilir? Bakmadan açıkla.",
        "Kendi çalışma malzemen hakkında belirli bir soru yaz. Bakmadan cevapla, sonra karşılaştır ve daha sonra yeniden dene. ANITEW de alıştırmalarında hatırlama denemeleri kullanır."
      ],
      "ar": [
        "الاسترجاع النشط",
        "حاول تذكّر المعلومات دون النظر إلى مصدرها. هكذا تعرف ما تستطيع استرجاعه وما يحتاج إلى مزيد من التدريب. يصلح ذلك للحقائق والمفاهيم والعلاقات.",
        "التعرّف على الإجابة أثناء قراءتها لا يعني أنك تستطيع استرجاعها وحدك. المحاولة غير الناجحة ليست حكمًا نهائيًا: تحقّق من الإجابة الصحيحة وافهمها ثم حاول مجددًا. تكرار التخمين دون تصحيح قد يرسّخ الأخطاء.",
        "اختر معلومة صغيرة تفهمها.",
        "ضع سؤالًا واضحًا يجيب عنه المحتوى.",
        "أبعد المصدر وأجب قبل التحقّق.",
        "قارن بالأصل وصحّح الأجزاء الناقصة أو الخاطئة.",
        "أخفِ الإجابة وحاول استرجاعها مجددًا.",
        "اختبر نفسك لاحقًا أيضًا. قد يبدو التكرار الفوري سهلًا دون أن يدل على بقاء المعلومة طويلًا.",
        "السؤال: لماذا يمكن للماء المتبخر أن يبرّد سطحًا؟ الإجابة: يحتاج التبخر إلى طاقة، تُؤخذ من السطح ومحيطه على شكل حرارة.",
        "اقرأ الإجابة وافهمها أولًا، ثم أخفها وأجب بنفسك. عبارة «الماء يبرّد» وحدها لا تفسّر العلاقة؛ المهم هو الحاجة إلى الطاقة وانتقال الحرارة.",
        "لماذا يمكن للماء المتبخر أن يبرّد سطحًا؟ اشرح دون النظر إلى المصدر.",
        "اكتب سؤالًا محددًا عن مادتك. أجب دون النظر، ثم قارن وحاول لاحقًا. تستخدم ANITEW أيضًا محاولات الاسترجاع في جلسات التدريب."
      ],
      "zh": [
        "主动回忆",
        "尝试在不查看来源的情况下回忆信息。这能揭示你能够想到什么内容，以及哪些部分还需要加强。这种方法适用于事实、概念和关系。",
        "仅仅在阅读时识别出答案，并不意味着你能独立回忆出来。一次失败的尝试并不等于最终结论：要检查并理解正确答案，然后再次尝试。反复猜测而没有反馈，可能会强化错误。",
        "选择一个你已经理解的小部分内容。",
        "提出一个明确的问题，该材料能对此进行解答。",
        "将来源隐藏起来，先自行作答，再核对。",
        "与原文对比，修正遗漏或错误的部分。",
        "隐藏答案，再尝试回忆一遍。",
        "之后也应进行自我测试。即时重复可能感觉容易，但并不能说明长期记忆效果。",
        "问题：为什么水的蒸发能冷却表面？\n答案：蒸发需要能量。这部分能量来自表面及其周围环境的热量。",
        "先阅读并理解答案，然后隐藏答案，自己回答问题。仅说‘水会冷却’并不能解释其原理：能量需求和热量传递才是关键。",
        "为什么水的蒸发能冷却表面？在不查看的情况下解释一下。",
        "针对你自己的学习内容，提出一个具体问题。在不查看的情况下回答，之后进行对比，然后过一段时间再尝试一次。ANITEW在训练中也使用了回忆尝试。"
      ],
      "ja": [
        "自力で思い出す練習",
        "情報の元を確認せずに情報を思い出すようにする。これにより、自分が思いつくことと、まだ学習が必要な部分を確認できる。事実、概念、関係性に対して使う。",
        "答えを読んだときに認識できたからといって、自分自身でそれを思い出すことができるとは限らない。失敗した試みは最終的な判断ではない：正しい答えを確認し、理解した上で再試行する。フィードバックのない繰り返した予想は誤りを強化する可能性がある。",
        "理解している情報の小さな部分を選ぼう。",
        "教材の内容で答えられる、明確な質問を作りましょう。",
        "元を隠し、答えを確認する前に自分で答えよう。",
        "元の内容と比較し、欠けている部分や誤った部分を修正する。",
        "答えを隠して、再び自分で思い出してみよう。",
        "時間を置いてからも確かめましょう。直後の繰り返しは簡単に感じても、長く覚えている証拠にはなりません。",
        "質問：なぜ水の蒸発が表面を冷やすのか？\n答え：蒸発にはエネルギーが必要である。そのエネルギーは表面および周囲から熱として奪われる。",
        "まず答えを読んで理解し、隠してから自分で答えましょう。「水が冷やす」だけでは関係を説明できません。必要なエネルギーと熱の移動が重要です。",
        "なぜ水の蒸発が表面を冷やすのか？元の材料を確認せずに説明しよう。",
        "自分の教材について具体的な質問を作りましょう。見ずに答え、答え合わせをし、後でもう一度試します。ANITEWの練習でも、自力で思い出す試みを使います。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "active-recall",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-active-recall-en-visual-64b9e309f3ef.mp4",
    "bytes": 1390559,
    "sha256": "64b9e309f3efb2fedea6781a69778f1b2ca0ace9c95c0e149e8fa0409442b950",
    "duration": 99.84,
    "recallBoundary": 85.979833,
    "cues": [
      {
        "start": 0.0,
        "end": 2.32
      },
      {
        "start": 2.32,
        "end": 13.8
      },
      {
        "start": 13.8,
        "end": 28.6
      },
      {
        "start": 28.6,
        "end": 32.6
      },
      {
        "start": 32.6,
        "end": 37.0
      },
      {
        "start": 37.0,
        "end": 40.88
      },
      {
        "start": 40.88,
        "end": 46.4
      },
      {
        "start": 46.4,
        "end": 50.16
      },
      {
        "start": 50.16,
        "end": 57.48
      },
      {
        "start": 57.48,
        "end": 69.52
      },
      {
        "start": 69.52,
        "end": 81.2
      },
      {
        "start": 81.2,
        "end": 86.64
      },
      {
        "start": 86.64,
        "end": 99.84
      }
    ],
    "captions": {
      "de": [
        "Aktives Abrufen",
        "Du versuchst, eine Information ohne Vorlage wiederzugeben. Dabei erkennst du, was du selbst abrufen kannst und wo du noch nacharbeiten musst. Das hilft bei Fakten, Begriffen und Zusammenhängen.",
        "Dass dir eine gelesene Antwort bekannt vorkommt, heißt nicht, dass du sie selbst abrufen kannst. Ein misslungener Versuch ist kein Endurteil: Prüfe die richtige Antwort, kläre sie und versuche es erneut. Häufiges Raten ohne Rückmeldung kann Fehler festigen.",
        "Wähle eine kleine, verstandene Information.",
        "Stelle eine klare Frage, die sich aus dem Material beantworten lässt.",
        "Lege die Vorlage weg und antworte, bevor du nachsiehst.",
        "Vergleiche deine Antwort mit dem Original. Korrigiere fehlende oder falsche Teile.",
        "Verdecke die richtige Antwort und versuche den Abruf noch einmal.",
        "Prüfe später erneut. Nur sofort wiederholen kann sich leicht anfühlen, ohne dauerhaftes Behalten zu zeigen.",
        "Frage: Warum kühlt verdunstendes Wasser eine Oberfläche?\nAntwort: Zum Verdunsten wird Energie benötigt. Diese Energie wird der Oberfläche und ihrer Umgebung als Wärme entzogen.",
        "Lies und verstehe zunächst die Antwort. Decke sie dann ab und beantworte die Frage selbst. „Wasser kühlt“ allein erklärt den Zusammenhang noch nicht; entscheidend sind Energiebedarf und Wärmeentzug.",
        "Warum kann verdunstendes Wasser eine Oberfläche kühlen? Erkläre den Zusammenhang ohne Vorlage.",
        "Formuliere zu deinem eigenen Material eine konkrete Frage. Antworte zunächst ohne Vorlage, vergleiche danach und versuche es später erneut. Die App nutzt Abrufversuche auch in ihren Trainingseinheiten."
      ],
      "en": [
        "Active recall",
        "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
        "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
        "Choose a small piece of information you understand.",
        "Ask a clear question that the material answers.",
        "Put the source away and answer before checking.",
        "Compare with the original. Correct missing or mistaken parts.",
        "Hide the answer and try retrieving it again.",
        "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention.",
        "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
        "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
        "Why can evaporating water cool a surface? Explain without looking.",
        "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions."
      ],
      "fr": [
        "Pratiquer le rappel actif",
        "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi ce que tu peux rappeler toi-même de ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations.",
        "Reconnaître une réponse en la lisant ne signifie pas savoir la retrouver. Un échec n’est pas un verdict : vérifie et comprends la bonne réponse, puis réessaie. Deviner plusieurs fois sans correction peut renforcer des erreurs.",
        "Choisis une petite quantité d’information que tu comprends.",
        "Pose une question précise à laquelle le contenu permet de répondre.",
        "Écarte la source et réponds avant de vérifier.",
        "Compare avec l’original. Corrige les éléments manquants ou erronés.",
        "Cache la réponse et essaie de la rappeler à nouveau.",
        "Teste-toi aussi plus tard. Répéter immédiatement peut sembler facile sans démontrer une mémorisation durable.",
        "Question : pourquoi l’eau qui s’évapore peut-elle refroidir une surface ?\nRéponse : l’évaporation demande de l’énergie. Cette énergie est prélevée sous forme de chaleur dans la surface et son environnement.",
        "Lis et comprends d’abord la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels.",
        "Pourquoi l’eau qui s’évapore peut-elle refroidir une surface ? Explique le lien sans regarder.",
        "Formule une question précise sur ton propre contenu. Réponds sans regarder, compare ensuite et réessaie plus tard. ANITEW utilise aussi le rappel dans ses séances d’entraînement."
      ],
      "es": [
        "Recuperación activa",
        "Intenta recordar la información sin mirar la fuente. Así compruebas qué puedes recuperar de memoria y qué necesita más práctica. Sirve para hechos, conceptos y relaciones.",
        "Reconocer una respuesta al leerla no significa que puedas recuperarla tú mismo. Un intento fallido no es un juicio definitivo: revisa y entiende la respuesta correcta, luego inténtalo de nuevo. Repetir suposiciones sin retroalimentación puede reforzar errores.",
        "Elige un pequeño fragmento de información que entiendas.",
        "Formula una pregunta clara que el material permita responder.",
        "Pon la fuente lejos y responde antes de verificar.",
        "Compara con el original. Corrige partes faltantes o erróneas.",
        "Oculta la respuesta y trata de recuperarla nuevamente.",
        "Compruébalo también más tarde. Repetir de inmediato puede resultar fácil sin demostrar que lo recuerdas a largo plazo.",
        "Pregunta: ¿Por qué puede el agua que se evapora enfriar una superficie? Respuesta: La evaporación requiere energía. Esa energía se toma de la superficie y su entorno en forma de calor.",
        "Primero lee y comprende la respuesta. Luego ocúltala y responde por tu cuenta. Decir solo «el agua enfría» no explica la relación: importan la energía necesaria y la transferencia de calor.",
        "¿Por qué puede el agua que se evapora enfriar una superficie? Explícalo sin mirar.",
        "Escribe una pregunta específica sobre tu propio material. Responde sin mirar, compárala después, y luego inténtala nuevamente más tarde. ANITEW también utiliza intentos de recuperación en sus sesiones de entrenamiento."
      ],
      "it": [
        "Richiamo attivo",
        "Prova a ricordare l'informazione senza guardare la fonte. Questo mostra cosa riesci a ricordare e cosa necessita di ulteriore lavoro. Usa questo per fatti, concetti e relazioni.",
        "Riconoscere una risposta mentre la leggi non significa che tu possa ricordarla da solo. Un tentativo fallito non è una conclusione definitiva: verifica e capisci la risposta corretta, poi riprova. Ripetere tentativi di indovinare senza feedback può consolidare errori.",
        "Scegli un piccolo pezzo di informazione che capisci.",
        "Formula una domanda chiara a cui il materiale permette di rispondere.",
        "Nascondi la fonte e rispondi prima di controllare.",
        "Confronta con l'originale. Correggi parti mancanti o errate.",
        "Nascondi la risposta e prova a ricordarla nuovamente.",
        "Mettiti alla prova anche più tardi. Ripetere subito può sembrare facile senza dimostrare che ricorderai a lungo.",
        "Domanda: Perché l'evaporazione dell'acqua raffredda una superficie?\nRisposta: L'evaporazione richiede energia. Questa energia viene estratta dalla superficie e dagli ambienti circostanti sotto forma di calore.",
        "Prima leggi e comprendi la risposta. Poi nascondila e rispondi con parole tue. Dire solo «l’acqua raffredda» non spiega il rapporto: contano l’energia necessaria e il trasferimento di calore.",
        "Perché l'evaporazione dell'acqua raffredda una superficie? Spiega senza guardare.",
        "Scrivi una domanda precisa sul tuo materiale. Rispondi senza guardare, confronta la risposta e riprova più tardi. Anche ANITEW usa tentativi di richiamo nelle sessioni di allenamento."
      ],
      "pt": [
        "Recordação ativa",
        "Tente recuperar a informação sem olhar para a fonte. Isso mostra o que você consegue lembrar e o que precisa de mais trabalho. Use isso para fatos, conceitos e relações.",
        "Reconhecer a resposta ao ler não significa que você consiga recuperá-la sozinho. Um erro não é uma conclusão final: verifique e entenda a resposta correta, depois tente novamente. Adivinhar repetidamente sem feedback pode reforçar erros.",
        "Escolha um pequeno trecho de informação que você entende.",
        "Pergunte claramente algo que o material responda.",
        "Ponha a fonte de lado e responda antes de verificar.",
        "Compare com a versão original. Corrija partes ausentes ou incorretas.",
        "Esconda a resposta e tente recuperá-la novamente.",
        "Teste-se mais tarde também. A repetição imediata pode parecer fácil, mas não demonstra retenção duradoura.",
        "Pergunta: Por que a evaporação da água resfria uma superfície?\nResposta: A evaporação exige energia. Essa energia é retirada da superfície e do ambiente ao redor na forma de calor.",
        "Leia e compreenda primeiro a resposta. Depois, esconda-a e responda por conta própria. Dizer apenas «a água esfria» não explica a relação: são importantes a energia necessária e a transferência de calor.",
        "Por que a evaporação da água resfria uma superfície? Explique sem olhar.",
        "Escreva uma pergunta específica sobre o seu próprio conteúdo. Responda sem olhar, compare depois e tente novamente mais tarde. O ANITEW também utiliza tentativas de recuperação em suas sessões de treinamento."
      ],
      "nl": [
        "Actief ophalen uit het geheugen",
        "Probeer informatie op te halen zonder naar de bron te kijken. Zo merk je wat je zelf kunt herinneren en wat meer oefening nodig heeft. Dit werkt voor feiten, begrippen en verbanden.",
        "Een antwoord herkennen tijdens het lezen betekent niet dat je het zelf kunt ophalen. Een mislukte poging is geen eindoordeel: controleer en begrijp het juiste antwoord en probeer opnieuw. Herhaald gokken zonder feedback kan fouten versterken.",
        "Kies een klein stukje informatie dat je begrijpt.",
        "Stel een duidelijke vraag die met de leerstof te beantwoorden is.",
        "Zet de bron weg en antwoord voordat je het controleert.",
        "Vergelijk met de oorspronkelijke tekst. Corrigeer ontbrekende of verkeerde delen.",
        "Verberg het antwoord en probeer het opnieuw uit je geheugen op te halen.",
        "Test jezelf ook later. Direct herhalen kan makkelijk voelen zonder aan te tonen dat je iets blijvend onthoudt.",
        "Vraag: Waarom koelt het verdampen van water een oppervlak?\nAntwoord: Verdampen vereist energie. Die energie wordt uit het oppervlak en de omgeving opgenomen als warmte.",
        "Lees en begrijp eerst het antwoord. Verberg het daarna en beantwoord zelf de vraag. Alleen «water koelt» verklaart het verband niet: de benodigde energie en de warmteoverdracht zijn belangrijk.",
        "Waarom koelt het verdampen van water een oppervlak? Leg het zonder te kijken uit.",
        "Stel een gerichte vraag over je eigen leerstof. Antwoord zonder te kijken, vergelijk daarna en probeer het later opnieuw. ANITEW gebruikt ook ophaalpogingen in de trainingen."
      ],
      "tr": [
        "Aktif hatırlama",
        "Kaynağa bakmadan bilgiyi hatırlamayı dene. Böylece neyi kendi başına hatırlayabildiğini, neyin daha fazla çalışma gerektirdiğini görürsün. Yöntem; bilgiler, kavramlar ve ilişkiler için kullanılabilir.",
        "Okurken bir cevabı tanımak, onu kendi başına hatırlayabilmek değildir. Başarısız bir deneme son karar değildir: doğru cevabı kontrol et, anla ve yeniden dene. Geri bildirim almadan tekrar tekrar tahmin etmek hataları pekiştirebilir.",
        "Anladığın küçük bir bilgi parçası seç.",
        "Bu bilgiyle cevaplanabilecek açık bir soru oluştur.",
        "Kaynağı kaldır ve kontrol etmeden önce cevap ver.",
        "Aslıyla karşılaştır. Eksik veya yanlış kısımları düzelt.",
        "Cevabı gizle ve tekrar hatırlamayı dene.",
        "Kendini daha sonra da sına. Hemen tekrarlamak kolay gelebilir, ama kalıcı olarak hatırladığını göstermeyebilir.",
        "Soru: Buharlaşan su bir yüzeyi neden soğutabilir? Cevap: Buharlaşma enerji gerektirir. Bu enerji yüzeyden ve çevresinden ısı olarak alınır.",
        "Önce cevabı oku ve anla. Sonra gizleyerek soruyu kendi başına cevapla. Yalnızca «su soğutur» demek ilişkiyi açıklamaz; gereken enerji ve ısı aktarımı önemlidir.",
        "Buharlaşan su bir yüzeyi neden soğutabilir? Bakmadan açıkla.",
        "Kendi çalışma malzemen hakkında belirli bir soru yaz. Bakmadan cevapla, sonra karşılaştır ve daha sonra yeniden dene. ANITEW de alıştırmalarında hatırlama denemeleri kullanır."
      ],
      "ar": [
        "الاسترجاع النشط",
        "حاول تذكّر المعلومات دون النظر إلى مصدرها. هكذا تعرف ما تستطيع استرجاعه وما يحتاج إلى مزيد من التدريب. يصلح ذلك للحقائق والمفاهيم والعلاقات.",
        "التعرّف على الإجابة أثناء قراءتها لا يعني أنك تستطيع استرجاعها وحدك. المحاولة غير الناجحة ليست حكمًا نهائيًا: تحقّق من الإجابة الصحيحة وافهمها ثم حاول مجددًا. تكرار التخمين دون تصحيح قد يرسّخ الأخطاء.",
        "اختر معلومة صغيرة تفهمها.",
        "ضع سؤالًا واضحًا يجيب عنه المحتوى.",
        "أبعد المصدر وأجب قبل التحقّق.",
        "قارن بالأصل وصحّح الأجزاء الناقصة أو الخاطئة.",
        "أخفِ الإجابة وحاول استرجاعها مجددًا.",
        "اختبر نفسك لاحقًا أيضًا. قد يبدو التكرار الفوري سهلًا دون أن يدل على بقاء المعلومة طويلًا.",
        "السؤال: لماذا يمكن للماء المتبخر أن يبرّد سطحًا؟ الإجابة: يحتاج التبخر إلى طاقة، تُؤخذ من السطح ومحيطه على شكل حرارة.",
        "اقرأ الإجابة وافهمها أولًا، ثم أخفها وأجب بنفسك. عبارة «الماء يبرّد» وحدها لا تفسّر العلاقة؛ المهم هو الحاجة إلى الطاقة وانتقال الحرارة.",
        "لماذا يمكن للماء المتبخر أن يبرّد سطحًا؟ اشرح دون النظر إلى المصدر.",
        "اكتب سؤالًا محددًا عن مادتك. أجب دون النظر، ثم قارن وحاول لاحقًا. تستخدم ANITEW أيضًا محاولات الاسترجاع في جلسات التدريب."
      ],
      "zh": [
        "主动回忆",
        "尝试在不查看来源的情况下回忆信息。这能揭示你能够想到什么内容，以及哪些部分还需要加强。这种方法适用于事实、概念和关系。",
        "仅仅在阅读时识别出答案，并不意味着你能独立回忆出来。一次失败的尝试并不等于最终结论：要检查并理解正确答案，然后再次尝试。反复猜测而没有反馈，可能会强化错误。",
        "选择一个你已经理解的小部分内容。",
        "提出一个明确的问题，该材料能对此进行解答。",
        "将来源隐藏起来，先自行作答，再核对。",
        "与原文对比，修正遗漏或错误的部分。",
        "隐藏答案，再尝试回忆一遍。",
        "之后也应进行自我测试。即时重复可能感觉容易，但并不能说明长期记忆效果。",
        "问题：为什么水的蒸发能冷却表面？\n答案：蒸发需要能量。这部分能量来自表面及其周围环境的热量。",
        "先阅读并理解答案，然后隐藏答案，自己回答问题。仅说‘水会冷却’并不能解释其原理：能量需求和热量传递才是关键。",
        "为什么水的蒸发能冷却表面？在不查看的情况下解释一下。",
        "针对你自己的学习内容，提出一个具体问题。在不查看的情况下回答，之后进行对比，然后过一段时间再尝试一次。ANITEW在训练中也使用了回忆尝试。"
      ],
      "ja": [
        "自力で思い出す練習",
        "情報の元を確認せずに情報を思い出すようにする。これにより、自分が思いつくことと、まだ学習が必要な部分を確認できる。事実、概念、関係性に対して使う。",
        "答えを読んだときに認識できたからといって、自分自身でそれを思い出すことができるとは限らない。失敗した試みは最終的な判断ではない：正しい答えを確認し、理解した上で再試行する。フィードバックのない繰り返した予想は誤りを強化する可能性がある。",
        "理解している情報の小さな部分を選ぼう。",
        "教材の内容で答えられる、明確な質問を作りましょう。",
        "元を隠し、答えを確認する前に自分で答えよう。",
        "元の内容と比較し、欠けている部分や誤った部分を修正する。",
        "答えを隠して、再び自分で思い出してみよう。",
        "時間を置いてからも確かめましょう。直後の繰り返しは簡単に感じても、長く覚えている証拠にはなりません。",
        "質問：なぜ水の蒸発が表面を冷やすのか？\n答え：蒸発にはエネルギーが必要である。そのエネルギーは表面および周囲から熱として奪われる。",
        "まず答えを読んで理解し、隠してから自分で答えましょう。「水が冷やす」だけでは関係を説明できません。必要なエネルギーと熱の移動が重要です。",
        "なぜ水の蒸発が表面を冷やすのか？元の材料を確認せずに説明しよう。",
        "自分の教材について具体的な質問を作りましょう。見ずに答え、答え合わせをし、後でもう一度試します。ANITEWの練習でも、自力で思い出す試みを使います。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "interleaved-practice",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-interleaved-practice-de-visual-8e8ac9a3af55.mp4",
    "bytes": 1665271,
    "sha256": "8e8ac9a3af557f627dfe09f209a0088f5e865e285bc6924f9748ebb2d3da026a",
    "duration": 112.36,
    "recallBoundary": 100.823833,
    "cues": [
      {
        "start": 0.0,
        "end": 3.28
      },
      {
        "start": 3.28,
        "end": 13.96
      },
      {
        "start": 13.96,
        "end": 26.8
      },
      {
        "start": 26.8,
        "end": 31.04
      },
      {
        "start": 31.04,
        "end": 35.2
      },
      {
        "start": 35.2,
        "end": 40.08
      },
      {
        "start": 40.08,
        "end": 44.96
      },
      {
        "start": 44.96,
        "end": 50.28
      },
      {
        "start": 50.28,
        "end": 72.36
      },
      {
        "start": 72.36,
        "end": 86.44
      },
      {
        "start": 86.44,
        "end": 101.64
      },
      {
        "start": 101.64,
        "end": 112.36
      }
    ],
    "captions": {
      "de": [
        "Passende Vorgehensweisen unterscheiden",
        "Beim gezielten Mischen wechselst du zwischen ähnlichen Aufgabentypen und entscheidest selbst, welches Vorgehen passt. So übst du auch die Auswahl einer Methode.",
        "Lerne neue Vorgehensweisen zuerst an klaren Beispielen. Wahlloses Themenwechseln oder Multitasking ist nicht dasselbe. Ob das Mischen hilft, hängt auch vom Material und deinem Vorwissen ab.",
        "Verstehe die einzelnen Vorgehensweisen zunächst getrennt.",
        "Mische anschließend wenige verwandte Aufgabentypen.",
        "Bestimme vor dem Rechnen oder Antworten, welcher Typ vorliegt und warum.",
        "Löse die Aufgabe und prüfe Auswahl und Ergebnis getrennt.",
        "Arbeite Fehler gezielt nach und kehre danach zur gemischten Übung zurück.",
        "Rechteck: Fläche = Länge × Breite. Dreieck: Fläche = Grundseite × zugehörige Höhe ÷ 2. Beispiel: Ein Rechteck mit 4 cm Länge und 3 cm Breite hat 12 cm². Ein Dreieck mit 4 cm Grundseite und 3 cm zugehöriger Höhe hat 6 cm².",
        "Gleiche Zahlen verlangen nicht automatisch dieselbe Rechnung. Die Figur entscheidet: Beim Dreieck gehört der Faktor ein Halb dazu. In gemischten Aufgaben muss die Aufgabenart erkannt werden, bevor die Regel angewandt wird.",
        "Aufgabe A: Dreieck mit Grundseite 6 cm und zugehöriger Höhe 4 cm. Aufgabe B: Rechteck mit Länge 6 cm und Breite 4 cm. Nenne jeweils die passende Regel und die Fläche.",
        "Wähle zwei oder drei bereits eingeführte, verwandte Aufgabentypen aus deinem Lernstoff. Mische sie und begründe vor jeder Lösung deine Auswahl des Vorgehens."
      ],
      "en": [
        "Choose between related approaches",
        "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
        "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
        "Understand each approach separately first.",
        "Then mix a few related task types.",
        "Before answering, identify the type and explain your choice.",
        "Solve the task and check your choice and result separately.",
        "Work on errors specifically, then return to mixed practice.",
        "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
        "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
        "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
        "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one."
      ],
      "fr": [
        "Choisir entre des démarches proches",
        "Mélange des types d’exercices proches et choisis toi-même la démarche adaptée. Tu travailles ainsi le choix de la méthode autant que son application.",
        "Apprends d’abord chaque démarche avec des exemples clairs. Changer de sujet au hasard ou faire plusieurs choses à la fois est différent. L’intérêt du mélange dépend du contenu et de tes connaissances antérieures.",
        "Comprends d’abord chaque démarche séparément.",
        "Mélange ensuite quelques types d’exercices proches.",
        "Avant de répondre, identifie le type et explique ton choix.",
        "Résous l’exercice et vérifie séparément ton choix et ton résultat.",
        "Retravaille les erreurs, puis reviens aux exercices mélangés.",
        "Rectangle : aire = longueur × largeur. Triangle : aire = base × hauteur correspondante ÷ 2. Un rectangle de 4 cm sur 3 cm a une aire de 12 cm². Un triangle de base 4 cm et de hauteur correspondante 3 cm a une aire de 6 cm².",
        "Des nombres identiques n’impliquent pas le même calcul. La figure détermine la règle : le triangle demande le facteur un demi. Dans un mélange d’exercices, il faut identifier le type avant d’appliquer la règle.",
        "Exercice A : triangle de base 6 cm et de hauteur correspondante 4 cm. Exercice B : rectangle de longueur 6 cm et de largeur 4 cm. Donne la règle et l’aire de chaque figure.",
        "Choisis deux ou trois types d’exercices proches que tu connais déjà. Mélange-les et justifie ta démarche avant chaque résolution."
      ],
      "es": [
        "Elige entre métodos relacionados",
        "Mezcle tipos relacionados de tareas y elija usted mismo el enfoque adecuado. Esto practica la selección de un método así como su aplicación.",
        "Aprenda nuevos enfoques a través de ejemplos claros. Cambiar de tema de forma aleatoria o multitarea es diferente. Los beneficios dependen del material y de su conocimiento previo.",
        "Entienda cada enfoque por separado primero.",
        "Luego combine un par de tipos de tareas relacionados.",
        "Antes de responder, identifique el tipo y explique su elección.",
        "Resuelva la tarea y verifique por separado su elección y resultado.",
        "Trabaje específicamente en los errores, luego regrese a la práctica mezclada.",
        "Rectángulo: área = longitud × anchura. Triángulo: área = base × altura correspondiente ÷ 2. Un rectángulo de 4 cm por 3 cm tiene un área de 12 cm². Un triángulo de base 4 cm y altura correspondiente 3 cm tiene un área de 6 cm².",
        "Los mismos números no implican el mismo cálculo. La figura determina la regla: en el triángulo hay que dividir entre dos. Al mezclar tareas, debes reconocer el tipo antes de aplicar la regla.",
        "Tarea A: un triángulo con base de 6 cm y altura correspondiente de 4 cm. Tarea B: un rectángulo de 6 cm de longitud y 4 cm de anchura. Proporcione la regla y el área para cada una.",
        "Elige dos o tres tipos de tareas relacionadas que ya hayas estudiado. Mézclalas y explica qué método corresponde antes de resolver cada una."
      ],
      "it": [
        "Scegli tra approcci correlati",
        "Alterna tipi di esercizio correlati e scegli il metodo adatto. In questo modo ti eserciti sia a scegliere un metodo sia ad applicarlo.",
        "Apprendi prima i nuovi approcci attraverso esempi chiari. Cambiare argomento in modo casuale o multitasking è diverso. I benefici dipendono dal materiale e dalle tue conoscenze precedenti.",
        "Capisci ogni approccio separatamente prima.",
        "Poi mescola alcuni tipi di compito correlati.",
        "Prima di rispondere, identifica il tipo e spiega il tuo ragionamento.",
        "Risolvi l’esercizio e controlla separatamente la scelta del metodo e il risultato.",
        "Lavora specificamente sugli errori, poi ritorna alla pratica mista.",
        "Rettangolo: area = lunghezza × larghezza. Triangolo: area = base × altezza corrispondente ÷ 2. Un rettangolo di 4 cm di lunghezza e 3 cm di larghezza ha un'area di 12 cm². Un triangolo con base 4 cm e altezza corrispondente 3 cm ha un'area di 6 cm².",
        "Gli stessi numeri non richiedono sempre lo stesso calcolo. La figura determina la regola: per il triangolo bisogna dividere per due. Gli esercizi misti richiedono di riconoscere il tipo prima di applicare una regola.",
        "Compito A: un triangolo con base 6 cm e altezza corrispondente 4 cm. Compito B: un rettangolo di 6 cm di lunghezza e 4 cm di larghezza. Fornisci la regola e l'area per ciascuno.",
        "Scegli due o tre tipi di compito correlati che hai già studiato. Mescolali e spiega quale approccio si adatta prima di risolvere ciascuno."
      ],
      "pt": [
        "Escolha entre abordagens relacionadas",
        "Misture tipos relacionados de tarefas e escolha o método apropriado sozinho. Isso pratica a seleção de um método e sua aplicação.",
        "Aprenda primeiramente as novas abordagens por meio de exemplos claros. Alterar de tópico aleatoriamente ou multitarefas é diferente. Os benefícios dependem do conteúdo e do seu conhecimento prévio.",
        "Entenda cada abordagem separadamente primeiro.",
        "Em seguida, misture alguns tipos de tarefa relacionados.",
        "Antes de responder, identifique o tipo e explique sua escolha.",
        "Resolva a tarefa e verifique separadamente sua escolha e resultado.",
        "Trabalhe especificamente com erros, depois retorne à prática mista.",
        "Retângulo: área = comprimento × largura. Triângulo: área = base × altura correspondente ÷ 2. Um retângulo de 4 cm de comprimento e 3 cm de largura tem área de 12 cm². Um triângulo com base de 4 cm e altura correspondente de 3 cm tem área de 6 cm².",
        "Números iguais não implicam cálculos idênticos. A forma determina a regra: o triângulo exige o fator um meio. Tarefas mistas exigem reconhecer o tipo antes de aplicar a regra.",
        "Tarefa A: um triângulo com base de 6 cm e altura correspondente de 4 cm. Tarefa B: um retângulo de 6 cm de comprimento e 4 cm de largura. Forneça a regra e a área para cada uma.",
        "Escolha dois ou três tipos de tarefa relacionados que já estudou. Misture-os e explique qual método é adequado antes de resolver cada tarefa."
      ],
      "nl": [
        "Kies tussen gerelateerde aanpakken",
        "Combineer gerelateerde soorten opgaven en kies zelf de juiste aanpak. Dit oefent het kiezen van een methode en het toepassen ervan.",
        "Leer nieuwe aanpakken eerst met duidelijke voorbeelden. Willekeurig van onderwerp wisselen of multitasken is iets anders. Het voordeel hangt af van de leerstof en je voorkennis.",
        "Begrijp eerst elke aanpak afzonderlijk.",
        "Meng daarna enkele verwante soorten opgaven.",
        "Voor het antwoorden bepaal je eerst het type en leg je keuze uit.",
        "Los de opgave op en controleer je keuze en resultaat apart.",
        "Werk gericht aan fouten en ga daarna terug naar gemengde oefening.",
        "Rechthoek: oppervlakte = lengte × breedte. Driehoek: oppervlakte = basis × overeenkomende hoogte ÷ 2. Een rechthoek van 4 cm lengte en 3 cm breedte heeft een oppervlakte van 12 cm². Een driehoek met basis 4 cm en overeenkomende hoogte  3 cm heeft een oppervlakte van 6 cm².",
        "Dezelfde getallen vragen niet altijd om dezelfde berekening. De vorm bepaalt de regel: bij een driehoek deel je door twee. Bij gemengde opgaven moet je het type herkennen voordat je de regel toepast.",
        "Opgave A: een driehoek met basis 6 cm en overeenkomende hoogte 4 cm. Opgave B: een rechthoek van 6 cm lengte en 4 cm breedte. Geef de regel en oppervlakte voor elk.",
        "Kies twee of drie gerelateerde opgaventypen die je al hebt bestudeerd. Combineer ze en leg uit welke aanpak past voordat je elke opgave oplost."
      ],
      "tr": [
        "İlgili yöntemler arasında seçim yap",
        "Birbiriyle ilişkili soru türlerini karıştır ve uygun yöntemi kendin seç. Böylece hem yöntem seçmeyi hem de uygulamayı çalışırsın.",
        "Yeni yöntemleri önce açık örneklerle öğren. Rastgele konu değiştirmek veya aynı anda birden çok iş yapmak farklıdır. Yararı, çalışma malzemesine ve önceki bilgine bağlıdır.",
        "Önce her yöntemi ayrı ayrı anla.",
        "Sonra birbiriyle ilişkili birkaç soru türünü karıştır.",
        "Cevaplamadan önce soru türünü belirle ve seçimini açıkla.",
        "Soruyu çöz; yöntem seçimini ve sonucu ayrı ayrı kontrol et.",
        "Hatalar üzerinde özellikle çalış, sonra karışık alıştırmalara dön.",
        "Dikdörtgen: alan = uzunluk × genişlik. Üçgen: alan = taban × karşılık gelen yükseklik ÷ 2. 4 cm uzunluğunda ve 3 cm genişliğinde bir dikdörtgenin alanı 12 cm²’dir. 4 cm tabanlı ve karşılık gelen yüksekliği 3 cm olan bir üçgenin alanı 6 cm²’dir.",
        "Aynı sayılar aynı hesabı gerektirmez. Kuralı şekil belirler: üçgende ikiye bölmek gerekir. Karışık sorularda kuralı uygulamadan önce soru türünü tanımak gerekir.",
        "Görev A: 6 cm tabanlı ve karşılık gelen yüksekliği 4 cm olan bir üçgen. Görev B: 6 cm uzunluğunda ve 4 cm genişliğinde bir dikdörtgen. Her ikisinde kural ve alanları verin.",
        "Daha önce öğrendiğin iki veya üç ilişkili soru türünü seç. Bunları karıştır ve her birini çözmeden önce hangi yöntemin uygun olduğunu açıkla."
      ],
      "ar": [
        "اختر بين طرق مترابطة",
        "امزج أنواعًا مترابطة من المسائل واختر بنفسك الطريقة المناسبة. بذلك تتدرّب على اختيار الطريقة وعلى تطبيقها.",
        "تعلّم الطرق الجديدة أولًا من أمثلة واضحة. التنقل العشوائي بين المواضيع أو أداء مهام متعددة في الوقت نفسه أمر مختلف. تعتمد الفائدة على المادة ومعرفتك السابقة.",
        "افهم كل طريقة على حدة أولًا.",
        "ثم امزج بضعة أنواع مترابطة من المسائل.",
        "قبل الإجابة، حدّد نوع المسألة واشرح اختيارك.",
        "حل المسألة وتحقّق من اختيار الطريقة ومن النتيجة كلٍّ على حدة.",
        "عالج الأخطاء تحديدًا ثم عد إلى التدريب المختلط.",
        "المستطيل: المساحة = الطول × العرض. المثلث: المساحة = القاعدة × الارتفاع المقابل ÷ 2. مستطيل طوله 4 سم وعرضه 3 سم مساحته 12 سم². مثلث قاعدته 4 سم وارتفاعه المقابل 3 سم مساحته 6 سم².",
        "تساوي الأعداد لا يعني استخدام الحساب نفسه. الشكل يحدّد القاعدة: المثلث يحتاج إلى القسمة على اثنين. في المسائل المختلطة يجب تمييز النوع قبل تطبيق القاعدة.",
        "المسألة أ: مثلث قاعدته 6 سم وارتفاعه المقابل 4 سم. المسألة ب: مستطيل طوله 6 سم وعرضه 4 سم. اذكر القاعدة والمساحة لكل منهما.",
        "اختر نوعين أو ثلاثة من المسائل المترابطة التي درستها. امزجها واشرح الطريقة المناسبة قبل حل كل مسألة."
      ],
      "zh": [
        "在相关方法之间进行选择",
        "混合练习几种相关的任务，并自行选择合适的方法。这样既练习选择方法，也练习应用方法。",
        "先通过清晰的例子学会每种新方法。随机切换主题或同时处理多个任务是另一回事。效果取决于学习内容和你已有的知识。",
        "先分别理解每种方法。",
        "然后混合几种相关类型的任务。",
        "在作答前，先确定任务类型并解释你的选择依据。",
        "完成任务并分别检查你的选择和结果是否正确。",
        "专门针对错误进行练习，然后再回到混合练习。",
        "矩形：面积 = 长 × 宽。三角形：面积 = 底 × 对应高 ÷ 2。一个长4厘米、宽3厘米的矩形面积为12平方厘米。一个底为4厘米、对应高为3厘米的三角形面积为6平方厘米。",
        "相同的数字并不意味着相同的计算过程。形状决定了规则：三角形需要乘以二分之一的因子。混合任务要求在应用规则前先识别出任务类型。",
        "任务A：一个底为6厘米、对应高为4厘米的三角形。任务B：一个长6厘米、宽4厘米的矩形。给出每种任务的规则和面积。",
        "选择你已经学习过的两种或三种相关任务类型，混合它们，并在求解前说明哪种方法更合适。"
      ],
      "ja": [
        "関連する方法を選び分ける",
        "関連するタスクの種類を混ぜて、自分自身で適切なアプローチを選択します。これにより、方法の選択およびその適用が練習されます。",
        "まず、明確な例を通じて新しいアプローチを学びます。トピックをランダムに切り替えたり、マルチタスクを実施するのは異なります。メリットは、素材や既存の知識に依存します。",
        "まず、それぞれのアプローチを個別に理解します。",
        "その後、関連するタスクのいくつかを混ぜます。",
        "答えを出す前に、タスクの種類を特定し、その選択理由を説明します。",
        "タスクを解き、その後、選択と結果を別々に確認します。",
        "誤りを特に取り上げて練習し、その後に混ぜた練習に戻ります。",
        "長方形：面積 = 長さ × 幅。三角形：面積 = 底辺 × 対応する高さ ÷ 2。長さ4cm、幅3cmの長方形は面積12cm²です。底辺4cm、対応する高さ3cmの三角形は面積6cm²です。",
        "数値が同じでも、計算方法が同じとは限りません。図形によって使う公式が決まり、三角形では2で割ります。問題を混ぜると、公式を使う前に問題の種類を見分ける必要があります。",
        "タスクA：底辺6cm、対応する高さ4cmの三角形。タスクB：長さ6cm、幅4cmの長方形。それぞれのルールと面積を示してください。",
        "すでに学んだ2つまたは3つの関連タスクタイプを選び、混ぜて、どのアプローチが適しているかを説明した上で、それぞれを解きます。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "interleaved-practice",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-interleaved-practice-en-visual-00c6edb5af66.mp4",
    "bytes": 1522670,
    "sha256": "00c6edb5af6685aa933b998f6afa3ad45eb31228f6dcd8d574ab9ab04ba4d769",
    "duration": 103.04,
    "recallBoundary": 93.178625,
    "cues": [
      {
        "start": 0.0,
        "end": 3.24
      },
      {
        "start": 3.24,
        "end": 11.64
      },
      {
        "start": 11.64,
        "end": 22.24
      },
      {
        "start": 22.24,
        "end": 25.84
      },
      {
        "start": 25.84,
        "end": 29.6
      },
      {
        "start": 29.6,
        "end": 35.28
      },
      {
        "start": 35.28,
        "end": 39.8
      },
      {
        "start": 39.8,
        "end": 45.24
      },
      {
        "start": 45.24,
        "end": 66.64
      },
      {
        "start": 66.64,
        "end": 79.36
      },
      {
        "start": 79.36,
        "end": 94.04
      },
      {
        "start": 94.04,
        "end": 103.04
      }
    ],
    "captions": {
      "de": [
        "Passende Vorgehensweisen unterscheiden",
        "Beim gezielten Mischen wechselst du zwischen ähnlichen Aufgabentypen und entscheidest selbst, welches Vorgehen passt. So übst du auch die Auswahl einer Methode.",
        "Lerne neue Vorgehensweisen zuerst an klaren Beispielen. Wahlloses Themenwechseln oder Multitasking ist nicht dasselbe. Ob das Mischen hilft, hängt auch vom Material und deinem Vorwissen ab.",
        "Verstehe die einzelnen Vorgehensweisen zunächst getrennt.",
        "Mische anschließend wenige verwandte Aufgabentypen.",
        "Bestimme vor dem Rechnen oder Antworten, welcher Typ vorliegt und warum.",
        "Löse die Aufgabe und prüfe Auswahl und Ergebnis getrennt.",
        "Arbeite Fehler gezielt nach und kehre danach zur gemischten Übung zurück.",
        "Rechteck: Fläche = Länge × Breite. Dreieck: Fläche = Grundseite × zugehörige Höhe ÷ 2. Beispiel: Ein Rechteck mit 4 cm Länge und 3 cm Breite hat 12 cm². Ein Dreieck mit 4 cm Grundseite und 3 cm zugehöriger Höhe hat 6 cm².",
        "Gleiche Zahlen verlangen nicht automatisch dieselbe Rechnung. Die Figur entscheidet: Beim Dreieck gehört der Faktor ein Halb dazu. In gemischten Aufgaben muss die Aufgabenart erkannt werden, bevor die Regel angewandt wird.",
        "Aufgabe A: Dreieck mit Grundseite 6 cm und zugehöriger Höhe 4 cm. Aufgabe B: Rechteck mit Länge 6 cm und Breite 4 cm. Nenne jeweils die passende Regel und die Fläche.",
        "Wähle zwei oder drei bereits eingeführte, verwandte Aufgabentypen aus deinem Lernstoff. Mische sie und begründe vor jeder Lösung deine Auswahl des Vorgehens."
      ],
      "en": [
        "Choose between related approaches",
        "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
        "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
        "Understand each approach separately first.",
        "Then mix a few related task types.",
        "Before answering, identify the type and explain your choice.",
        "Solve the task and check your choice and result separately.",
        "Work on errors specifically, then return to mixed practice.",
        "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
        "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
        "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
        "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one."
      ],
      "fr": [
        "Choisir entre des démarches proches",
        "Mélange des types d’exercices proches et choisis toi-même la démarche adaptée. Tu travailles ainsi le choix de la méthode autant que son application.",
        "Apprends d’abord chaque démarche avec des exemples clairs. Changer de sujet au hasard ou faire plusieurs choses à la fois est différent. L’intérêt du mélange dépend du contenu et de tes connaissances antérieures.",
        "Comprends d’abord chaque démarche séparément.",
        "Mélange ensuite quelques types d’exercices proches.",
        "Avant de répondre, identifie le type et explique ton choix.",
        "Résous l’exercice et vérifie séparément ton choix et ton résultat.",
        "Retravaille les erreurs, puis reviens aux exercices mélangés.",
        "Rectangle : aire = longueur × largeur. Triangle : aire = base × hauteur correspondante ÷ 2. Un rectangle de 4 cm sur 3 cm a une aire de 12 cm². Un triangle de base 4 cm et de hauteur correspondante 3 cm a une aire de 6 cm².",
        "Des nombres identiques n’impliquent pas le même calcul. La figure détermine la règle : le triangle demande le facteur un demi. Dans un mélange d’exercices, il faut identifier le type avant d’appliquer la règle.",
        "Exercice A : triangle de base 6 cm et de hauteur correspondante 4 cm. Exercice B : rectangle de longueur 6 cm et de largeur 4 cm. Donne la règle et l’aire de chaque figure.",
        "Choisis deux ou trois types d’exercices proches que tu connais déjà. Mélange-les et justifie ta démarche avant chaque résolution."
      ],
      "es": [
        "Elige entre métodos relacionados",
        "Mezcle tipos relacionados de tareas y elija usted mismo el enfoque adecuado. Esto practica la selección de un método así como su aplicación.",
        "Aprenda nuevos enfoques a través de ejemplos claros. Cambiar de tema de forma aleatoria o multitarea es diferente. Los beneficios dependen del material y de su conocimiento previo.",
        "Entienda cada enfoque por separado primero.",
        "Luego combine un par de tipos de tareas relacionados.",
        "Antes de responder, identifique el tipo y explique su elección.",
        "Resuelva la tarea y verifique por separado su elección y resultado.",
        "Trabaje específicamente en los errores, luego regrese a la práctica mezclada.",
        "Rectángulo: área = longitud × anchura. Triángulo: área = base × altura correspondiente ÷ 2. Un rectángulo de 4 cm por 3 cm tiene un área de 12 cm². Un triángulo de base 4 cm y altura correspondiente 3 cm tiene un área de 6 cm².",
        "Los mismos números no implican el mismo cálculo. La figura determina la regla: en el triángulo hay que dividir entre dos. Al mezclar tareas, debes reconocer el tipo antes de aplicar la regla.",
        "Tarea A: un triángulo con base de 6 cm y altura correspondiente de 4 cm. Tarea B: un rectángulo de 6 cm de longitud y 4 cm de anchura. Proporcione la regla y el área para cada una.",
        "Elige dos o tres tipos de tareas relacionadas que ya hayas estudiado. Mézclalas y explica qué método corresponde antes de resolver cada una."
      ],
      "it": [
        "Scegli tra approcci correlati",
        "Alterna tipi di esercizio correlati e scegli il metodo adatto. In questo modo ti eserciti sia a scegliere un metodo sia ad applicarlo.",
        "Apprendi prima i nuovi approcci attraverso esempi chiari. Cambiare argomento in modo casuale o multitasking è diverso. I benefici dipendono dal materiale e dalle tue conoscenze precedenti.",
        "Capisci ogni approccio separatamente prima.",
        "Poi mescola alcuni tipi di compito correlati.",
        "Prima di rispondere, identifica il tipo e spiega il tuo ragionamento.",
        "Risolvi l’esercizio e controlla separatamente la scelta del metodo e il risultato.",
        "Lavora specificamente sugli errori, poi ritorna alla pratica mista.",
        "Rettangolo: area = lunghezza × larghezza. Triangolo: area = base × altezza corrispondente ÷ 2. Un rettangolo di 4 cm di lunghezza e 3 cm di larghezza ha un'area di 12 cm². Un triangolo con base 4 cm e altezza corrispondente 3 cm ha un'area di 6 cm².",
        "Gli stessi numeri non richiedono sempre lo stesso calcolo. La figura determina la regola: per il triangolo bisogna dividere per due. Gli esercizi misti richiedono di riconoscere il tipo prima di applicare una regola.",
        "Compito A: un triangolo con base 6 cm e altezza corrispondente 4 cm. Compito B: un rettangolo di 6 cm di lunghezza e 4 cm di larghezza. Fornisci la regola e l'area per ciascuno.",
        "Scegli due o tre tipi di compito correlati che hai già studiato. Mescolali e spiega quale approccio si adatta prima di risolvere ciascuno."
      ],
      "pt": [
        "Escolha entre abordagens relacionadas",
        "Misture tipos relacionados de tarefas e escolha o método apropriado sozinho. Isso pratica a seleção de um método e sua aplicação.",
        "Aprenda primeiramente as novas abordagens por meio de exemplos claros. Alterar de tópico aleatoriamente ou multitarefas é diferente. Os benefícios dependem do conteúdo e do seu conhecimento prévio.",
        "Entenda cada abordagem separadamente primeiro.",
        "Em seguida, misture alguns tipos de tarefa relacionados.",
        "Antes de responder, identifique o tipo e explique sua escolha.",
        "Resolva a tarefa e verifique separadamente sua escolha e resultado.",
        "Trabalhe especificamente com erros, depois retorne à prática mista.",
        "Retângulo: área = comprimento × largura. Triângulo: área = base × altura correspondente ÷ 2. Um retângulo de 4 cm de comprimento e 3 cm de largura tem área de 12 cm². Um triângulo com base de 4 cm e altura correspondente de 3 cm tem área de 6 cm².",
        "Números iguais não implicam cálculos idênticos. A forma determina a regra: o triângulo exige o fator um meio. Tarefas mistas exigem reconhecer o tipo antes de aplicar a regra.",
        "Tarefa A: um triângulo com base de 6 cm e altura correspondente de 4 cm. Tarefa B: um retângulo de 6 cm de comprimento e 4 cm de largura. Forneça a regra e a área para cada uma.",
        "Escolha dois ou três tipos de tarefa relacionados que já estudou. Misture-os e explique qual método é adequado antes de resolver cada tarefa."
      ],
      "nl": [
        "Kies tussen gerelateerde aanpakken",
        "Combineer gerelateerde soorten opgaven en kies zelf de juiste aanpak. Dit oefent het kiezen van een methode en het toepassen ervan.",
        "Leer nieuwe aanpakken eerst met duidelijke voorbeelden. Willekeurig van onderwerp wisselen of multitasken is iets anders. Het voordeel hangt af van de leerstof en je voorkennis.",
        "Begrijp eerst elke aanpak afzonderlijk.",
        "Meng daarna enkele verwante soorten opgaven.",
        "Voor het antwoorden bepaal je eerst het type en leg je keuze uit.",
        "Los de opgave op en controleer je keuze en resultaat apart.",
        "Werk gericht aan fouten en ga daarna terug naar gemengde oefening.",
        "Rechthoek: oppervlakte = lengte × breedte. Driehoek: oppervlakte = basis × overeenkomende hoogte ÷ 2. Een rechthoek van 4 cm lengte en 3 cm breedte heeft een oppervlakte van 12 cm². Een driehoek met basis 4 cm en overeenkomende hoogte  3 cm heeft een oppervlakte van 6 cm².",
        "Dezelfde getallen vragen niet altijd om dezelfde berekening. De vorm bepaalt de regel: bij een driehoek deel je door twee. Bij gemengde opgaven moet je het type herkennen voordat je de regel toepast.",
        "Opgave A: een driehoek met basis 6 cm en overeenkomende hoogte 4 cm. Opgave B: een rechthoek van 6 cm lengte en 4 cm breedte. Geef de regel en oppervlakte voor elk.",
        "Kies twee of drie gerelateerde opgaventypen die je al hebt bestudeerd. Combineer ze en leg uit welke aanpak past voordat je elke opgave oplost."
      ],
      "tr": [
        "İlgili yöntemler arasında seçim yap",
        "Birbiriyle ilişkili soru türlerini karıştır ve uygun yöntemi kendin seç. Böylece hem yöntem seçmeyi hem de uygulamayı çalışırsın.",
        "Yeni yöntemleri önce açık örneklerle öğren. Rastgele konu değiştirmek veya aynı anda birden çok iş yapmak farklıdır. Yararı, çalışma malzemesine ve önceki bilgine bağlıdır.",
        "Önce her yöntemi ayrı ayrı anla.",
        "Sonra birbiriyle ilişkili birkaç soru türünü karıştır.",
        "Cevaplamadan önce soru türünü belirle ve seçimini açıkla.",
        "Soruyu çöz; yöntem seçimini ve sonucu ayrı ayrı kontrol et.",
        "Hatalar üzerinde özellikle çalış, sonra karışık alıştırmalara dön.",
        "Dikdörtgen: alan = uzunluk × genişlik. Üçgen: alan = taban × karşılık gelen yükseklik ÷ 2. 4 cm uzunluğunda ve 3 cm genişliğinde bir dikdörtgenin alanı 12 cm²’dir. 4 cm tabanlı ve karşılık gelen yüksekliği 3 cm olan bir üçgenin alanı 6 cm²’dir.",
        "Aynı sayılar aynı hesabı gerektirmez. Kuralı şekil belirler: üçgende ikiye bölmek gerekir. Karışık sorularda kuralı uygulamadan önce soru türünü tanımak gerekir.",
        "Görev A: 6 cm tabanlı ve karşılık gelen yüksekliği 4 cm olan bir üçgen. Görev B: 6 cm uzunluğunda ve 4 cm genişliğinde bir dikdörtgen. Her ikisinde kural ve alanları verin.",
        "Daha önce öğrendiğin iki veya üç ilişkili soru türünü seç. Bunları karıştır ve her birini çözmeden önce hangi yöntemin uygun olduğunu açıkla."
      ],
      "ar": [
        "اختر بين طرق مترابطة",
        "امزج أنواعًا مترابطة من المسائل واختر بنفسك الطريقة المناسبة. بذلك تتدرّب على اختيار الطريقة وعلى تطبيقها.",
        "تعلّم الطرق الجديدة أولًا من أمثلة واضحة. التنقل العشوائي بين المواضيع أو أداء مهام متعددة في الوقت نفسه أمر مختلف. تعتمد الفائدة على المادة ومعرفتك السابقة.",
        "افهم كل طريقة على حدة أولًا.",
        "ثم امزج بضعة أنواع مترابطة من المسائل.",
        "قبل الإجابة، حدّد نوع المسألة واشرح اختيارك.",
        "حل المسألة وتحقّق من اختيار الطريقة ومن النتيجة كلٍّ على حدة.",
        "عالج الأخطاء تحديدًا ثم عد إلى التدريب المختلط.",
        "المستطيل: المساحة = الطول × العرض. المثلث: المساحة = القاعدة × الارتفاع المقابل ÷ 2. مستطيل طوله 4 سم وعرضه 3 سم مساحته 12 سم². مثلث قاعدته 4 سم وارتفاعه المقابل 3 سم مساحته 6 سم².",
        "تساوي الأعداد لا يعني استخدام الحساب نفسه. الشكل يحدّد القاعدة: المثلث يحتاج إلى القسمة على اثنين. في المسائل المختلطة يجب تمييز النوع قبل تطبيق القاعدة.",
        "المسألة أ: مثلث قاعدته 6 سم وارتفاعه المقابل 4 سم. المسألة ب: مستطيل طوله 6 سم وعرضه 4 سم. اذكر القاعدة والمساحة لكل منهما.",
        "اختر نوعين أو ثلاثة من المسائل المترابطة التي درستها. امزجها واشرح الطريقة المناسبة قبل حل كل مسألة."
      ],
      "zh": [
        "在相关方法之间进行选择",
        "混合练习几种相关的任务，并自行选择合适的方法。这样既练习选择方法，也练习应用方法。",
        "先通过清晰的例子学会每种新方法。随机切换主题或同时处理多个任务是另一回事。效果取决于学习内容和你已有的知识。",
        "先分别理解每种方法。",
        "然后混合几种相关类型的任务。",
        "在作答前，先确定任务类型并解释你的选择依据。",
        "完成任务并分别检查你的选择和结果是否正确。",
        "专门针对错误进行练习，然后再回到混合练习。",
        "矩形：面积 = 长 × 宽。三角形：面积 = 底 × 对应高 ÷ 2。一个长4厘米、宽3厘米的矩形面积为12平方厘米。一个底为4厘米、对应高为3厘米的三角形面积为6平方厘米。",
        "相同的数字并不意味着相同的计算过程。形状决定了规则：三角形需要乘以二分之一的因子。混合任务要求在应用规则前先识别出任务类型。",
        "任务A：一个底为6厘米、对应高为4厘米的三角形。任务B：一个长6厘米、宽4厘米的矩形。给出每种任务的规则和面积。",
        "选择你已经学习过的两种或三种相关任务类型，混合它们，并在求解前说明哪种方法更合适。"
      ],
      "ja": [
        "関連する方法を選び分ける",
        "関連するタスクの種類を混ぜて、自分自身で適切なアプローチを選択します。これにより、方法の選択およびその適用が練習されます。",
        "まず、明確な例を通じて新しいアプローチを学びます。トピックをランダムに切り替えたり、マルチタスクを実施するのは異なります。メリットは、素材や既存の知識に依存します。",
        "まず、それぞれのアプローチを個別に理解します。",
        "その後、関連するタスクのいくつかを混ぜます。",
        "答えを出す前に、タスクの種類を特定し、その選択理由を説明します。",
        "タスクを解き、その後、選択と結果を別々に確認します。",
        "誤りを特に取り上げて練習し、その後に混ぜた練習に戻ります。",
        "長方形：面積 = 長さ × 幅。三角形：面積 = 底辺 × 対応する高さ ÷ 2。長さ4cm、幅3cmの長方形は面積12cm²です。底辺4cm、対応する高さ3cmの三角形は面積6cm²です。",
        "数値が同じでも、計算方法が同じとは限りません。図形によって使う公式が決まり、三角形では2で割ります。問題を混ぜると、公式を使う前に問題の種類を見分ける必要があります。",
        "タスクA：底辺6cm、対応する高さ4cmの三角形。タスクB：長さ6cm、幅4cmの長方形。それぞれのルールと面積を示してください。",
        "すでに学んだ2つまたは3つの関連タスクタイプを選び、混ぜて、どのアプローチが適しているかを説明した上で、それぞれを解きます。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "keyword-method",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-keyword-method-de-visual-c47b85aeb765.mp4",
    "bytes": 1372054,
    "sha256": "c47b85aeb765dd84438e4bf777db5068ff25d5a1ec62f787a52c511161d3cece",
    "duration": 96.04,
    "recallBoundary": 80.356,
    "cues": [
      {
        "start": 0.0,
        "end": 3.68
      },
      {
        "start": 3.68,
        "end": 15.28
      },
      {
        "start": 15.28,
        "end": 26.88
      },
      {
        "start": 26.88,
        "end": 31.44
      },
      {
        "start": 31.44,
        "end": 35.32
      },
      {
        "start": 35.32,
        "end": 40.4
      },
      {
        "start": 40.4,
        "end": 46.2
      },
      {
        "start": 46.2,
        "end": 52.96
      },
      {
        "start": 52.96,
        "end": 61.68
      },
      {
        "start": 61.68,
        "end": 73.04
      },
      {
        "start": 73.04,
        "end": 81.12
      },
      {
        "start": 81.12,
        "end": 96.04
      }
    ],
    "captions": {
      "de": [
        "Neue Vokabeln mit Schlüsselwörtern verbinden",
        "Ein ähnlich klingendes bekanntes Wort kann als Brücke zu einer fremdsprachigen Bedeutung dienen. Du verknüpfst das Schlüsselwort bildlich mit der Bedeutung und prüfst danach die echte Vokabel.",
        "Ein ähnlicher Klang ist keine korrekte Aussprache. Nicht für jedes Wort gibt es eine gute Brücke. Die Methode ersetzt weder Ausspracheprüfung noch Schreibweise und Verwendung im Satz.",
        "Prüfe Bedeutung und korrekte Aussprache der neuen Vokabel.",
        "Suche ein bekanntes Wort mit ähnlichem Klang.",
        "Verbinde dieses Schlüsselwort und die Bedeutung durch eine klare Vorstellung.",
        "Rufe die Bedeutung aus der Vokabel ab und danach die Vokabel aus der Bedeutung.",
        "Prüfe das Original: Aussprache, Schreibweise und ein passender Beispielsatz.",
        "Englisch: bell = Glocke. Beispielsatz: The bell rings. = Die Glocke läutet.",
        "Als deutsche Klangbrücke kann „bellen“ dienen: Du stellst dir eine Glocke vor, die wie ein Hund bellt. „Bellen“ ist die Eselsbrücke, nicht die englische Aussprache von bell.",
        "Welche englische Vokabel bedeutet Glocke? Schreibe die Vokabel, ihre Bedeutung und den Beispielsatz aus dem Gedächtnis.",
        "Teste die Technik an einer Vokabel, die du wirklich brauchst. Prüfe auch die Gegenrichtung: Kannst du aus der Bedeutung die fremdsprachige Form abrufen? Verwirrt dich das Schlüsselwort, ändere die Brücke oder nutze direktes Abrufen."
      ],
      "en": [
        "Connect vocabulary through keywords",
        "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
        "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
        "Check the new word’s meaning and correct pronunciation.",
        "Find a familiar word with a similar sound.",
        "Imagine a clear connection between that keyword and the meaning.",
        "Retrieve the meaning from the word, then the word from its meaning.",
        "Check the original pronunciation, spelling and an example sentence.",
        "English: bell = Glocke (German). Example: The bell rings. = Die Glocke läutet.",
        "The German word “bellen” can provide a sound cue: imagine a bell barking like a dog. “Bellen” is the mnemonic, not the English pronunciation of bell.",
        "Recall the example you heard without looking. Explain its meaning and how the memory cue works.",
        "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval."
      ],
      "fr": [
        "Relier le vocabulaire à des mots-clés",
        "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image, puis vérifie le mot à apprendre.",
        "Un son proche n’est pas une prononciation correcte. Certains mots ne se prêtent pas à cette technique. Vérifie séparément la prononciation, l’orthographe et l’emploi dans une phrase.",
        "Vérifie le sens et la prononciation correcte du nouveau mot.",
        "Cherche un mot connu au son proche.",
        "Imagine un lien clair entre ce mot-clé et le sens.",
        "Retrouve le sens à partir du mot, puis le mot à partir du sens.",
        "Vérifie la prononciation, l’orthographe et une phrase d’exemple.",
        "Anglais : bell = Glocke en allemand, « cloche » en français. Exemple : The bell rings. = Die Glocke läutet.",
        "Le mot allemand « bellen » peut servir d’indice sonore : imagine une cloche qui aboie comme un chien. « Bellen » est l’aide-mémoire, pas la prononciation anglaise de bell.",
        "Rappelle l’exemple entendu sans modèle. Explique son sens et le chemin de l’aide-mémoire.",
        "Essaie avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct."
      ],
      "es": [
        "Conecta el vocabulario a través de palabras clave",
        "Una palabra familiar con un sonido similar puede servir como puente para el significado de una palabra extranjera. Conecta la palabra clave y el significado en una imagen, luego verifica el término real.",
        "Un sonido similar no es la pronunciación correcta. Algunas palabras no ofrecen una palabra clave útil. Verifica la pronunciación, ortografía y uso en una oración por separado.",
        "Verifica el significado del nuevo vocablo y su pronunciación correcta.",
        "Busca una palabra familiar con un sonido similar.",
        "Imagina una conexión clara entre la palabra clave y el significado.",
        "Recupera el significado desde la palabra, luego la palabra desde su significado.",
        "Verifica la pronunciación original, ortografía y una oración de ejemplo.",
        "EN: bell = campana. “The bell rings.” = “La campana suena.”",
        "DE: bellen = ladrar. Imagina una campana que ladra como un perro. La palabra sirve de puente para recordar, no como modelo de pronunciación.",
        "Escribe de memoria la palabra extranjera, su significado y la frase de ejemplo.",
        "Prueba una palabra que realmente necesitas. Prueba también la dirección inversa: ¿puedes recuperar la forma extranjera a partir de su significado? Si la palabra clave te confunde, cambia el puente o usa la recuperación directa."
      ],
      "it": [
        "Collega il vocabolario attraverso parole chiave",
        "Una parola familiare con un suono simile può fornire un ponte per il significato di una parola straniera. Collega la parola chiave e il significato in un'immagine, poi verifica la parola reale.",
        "Un suono simile non è la pronuncia corretta. Alcune parole non offrono un'utile parola chiave. Verifica la pronuncia, l'ortografia e l'uso in una frase separatamente.",
        "Verifica il significato della parola nuova e la pronuncia corretta.",
        "Trova una parola familiare con un suono simile.",
        "Immagina un'associazione chiara tra la parola chiave e il significato.",
        "Ricava il significato dalla parola, poi la parola dal suo significato.",
        "Verifica la pronuncia originale, l'ortografia e un esempio di frase.",
        "EN: bell = campana. “The bell rings.” = “La campana suona.”",
        "DE: bellen = abbaiare. Immagina una campana che abbaia come un cane. La parola è un aiuto per ricordare, non un modello di pronuncia.",
        "Scrivi a memoria la parola straniera, il suo significato e la frase di esempio.",
        "Prova con una parola che ti serve davvero. Controlla anche il percorso inverso: riesci a ricordare la parola straniera partendo dal significato? Se la parola chiave ti confonde, cambia associazione oppure esercita direttamente il richiamo."
      ],
      "pt": [
        "Conecte o vocabulário por meio de palavras-chave",
        "Uma palavra familiar com som semelhante pode fornecer uma ponte para o significado de uma palavra estrangeira. Conecte a palavra-chave e o significado em uma imagem, em seguida, verifique a palavra real.",
        "Um som semelhante não é a pronúncia correta. Algumas palavras não oferecem uma palavra-chave útil. Verifique a pronúncia, ortografia e uso em uma frase separadamente.",
        "Verifique o significado da nova palavra e a pronúncia correta.",
        "Encontre uma palavra familiar com som semelhante.",
        "Imagine uma ligação clara entre a palavra-chave e o significado.",
        "Recupere o significado da palavra, em seguida, a palavra a partir do seu significado.",
        "Verifique a pronúncia original, ortografia e uma frase de exemplo.",
        "EN: bell = sino. “The bell rings.” = “O sino toca.”",
        "DE: bellen = ladrar. Imagina um sino a ladrar como um cão. A palavra é uma ajuda para recordar, não um modelo de pronúncia.",
        "Escreva de memória a palavra estrangeira, o significado e a frase de exemplo.",
        "Tente uma palavra que você realmente precisa. Teste a direção inversa também: é possível recuperar a forma estrangeira a partir do seu significado? Se a palavra-chave te confundir, mude a ponte ou use a recuperação direta."
      ],
      "nl": [
        "Verbind woorden met sleutelwoorden",
        "Een bekend woord met een vergelijkbare klank kan een brug vormen naar de betekenis van een vreemd woord. Verbind het sleutelwoord en de betekenis in een beeld en controleer daarna het echte woord.",
        "Een vergelijkbare klank is niet de juiste uitspraak. Sommige woorden hebben geen bruikbaar sleutelwoord. Controleer uitspraak, spelling en gebruik in een zin afzonderlijk.",
        "Controleer de betekenis en de juiste uitspraak van het nieuwe woord.",
        "Zoek een bekend woord met een gelijksoortig geluid.",
        "Stel je een duidelijke verbinding tussen het sleutelwoord en de betekenis voor.",
        "Haal de betekenis op vanuit het woord en daarna het woord vanuit de betekenis.",
        "Controleer de oorspronkelijke uitspraak, spelling en een voorbeeldzin.",
        "EN: bell = bel. “The bell rings.” = “De bel luidt.”",
        "DE: bellen = blaffen. Stel je een bel voor die blaft als een hond. Het woord is een geheugensteuntje, geen voorbeeld van de juiste uitspraak.",
        "Schrijf het vreemde woord, de betekenis en de voorbeeldzin uit je geheugen op.",
        "Probeer een woord dat je echt nodig hebt. Test ook de andere richting: kun je het vreemde woord vanuit de betekenis ophalen? Als het sleutelwoord verwarrend is, verander dan het geheugensteuntje of oefen het direct ophalen."
      ],
      "tr": [
        "Sözcükleri anahtar sözcüklerle ilişkilendir",
        "Benzer sesli, bildiğin bir sözcük yabancı bir sözcüğün anlamına köprü olabilir. Anahtar sözcükle anlamı bir görüntüde birleştir, sonra asıl sözcüğü kontrol et.",
        "Benzer ses, doğru telaffuz demek değildir. Her sözcük için yararlı bir anahtar sözcük bulunmaz. Telaffuzu, yazımı ve cümle içindeki kullanımı ayrı ayrı kontrol et.",
        "Yeni sözcüğün anlamını ve doğru telaffuzunu kontrol et.",
        "Benzer sesli, bildiğin bir sözcük bul.",
        "Anahtar sözcükle anlam arasında belirgin bir bağlantı hayal et.",
        "Sözcükten anlamını, sonra anlamından sözcüğü hatırla.",
        "Asıl telaffuzu, yazımı ve bir örnek cümleyi kontrol et.",
        "EN: bell = çan. “The bell rings.” = “Çan çalıyor.”",
        "DE: bellen = havlamak. Köpek gibi havlayan bir çan hayal et. Bu sözcük bir hatırlama ipucudur, doğru telaffuz örneği değildir.",
        "Yabancı sözcüğü, anlamını ve örnek cümleyi hafızandan yaz.",
        "Gerçekten ihtiyaç duyduğun bir sözcükle dene. Ters yönü de sına: anlamından yabancı sözcüğü hatırlayabiliyor musun? Anahtar sözcük kafanı karıştırıyorsa bağlantıyı değiştir veya doğrudan hatırlama çalış."
      ],
      "ar": [
        "اربط المفردات بكلمات مفتاحية",
        "قد تكون كلمة مألوفة ذات صوت مشابه جسرًا إلى معنى كلمة أجنبية. اربط الكلمة المفتاحية والمعنى بصورة ذهنية، ثم تحقّق من الكلمة الأصلية.",
        "تشابه الصوت لا يعني صحة النطق. بعض الكلمات لا يناسبها مفتاح مفيد. تحقّق من النطق والتهجئة والاستعمال في جملة كلٍّ على حدة.",
        "تحقّق من معنى الكلمة الجديدة ونطقها الصحيح.",
        "ابحث عن كلمة مألوفة ذات صوت مشابه.",
        "تخيّل ارتباطًا واضحًا بين الكلمة المفتاحية والمعنى.",
        "استرجع المعنى من الكلمة، ثم الكلمة من معناها.",
        "تحقّق من النطق الأصلي والتهجئة وجملة نموذجية.",
        "EN: bell = جرس. “The bell rings.” = “يرن الجرس.”",
        "DE: bellen = ينبح. تخيّل جرسًا ينبح مثل كلب. هذه الكلمة وسيلة للتذكّر، وليست نموذجًا للنطق الصحيح.",
        "اكتب الكلمة الأجنبية ومعناها والجملة النموذجية من الذاكرة.",
        "جرّب كلمة تحتاج إليها فعلًا. اختبر الاتجاه العكسي أيضًا: هل تستطيع استرجاع الكلمة الأجنبية من معناها؟ إذا أربكك المفتاح، غيّر الرابط أو تدرب على الاسترجاع المباشر."
      ],
      "zh": [
        "通过关键词连接词汇",
        "一个发音相似的熟悉单词可以作为连接外语单词意义的桥梁。在图像中将关键词与其意义关联，然后核对实际单词。",
        "相似发音并不等于正确发音。有些单词没有可用的关键词。需分别检查发音、拼写和在句子中的用法。",
        "核对新单词的意义和正确发音。",
        "寻找一个发音相似的熟悉单词。",
        "在脑海中清晰地建立该关键词与其意义之间的联系。",
        "从单词中回忆出其意义，再从意义中回忆出单词本身。",
        "核对原始发音、拼写以及一个例句。",
        "EN: bell = 铃. “The bell rings.” = “铃响了。”",
        "DE: bellen = 吠叫. 想象一只像狗一样吠叫的铃。 这个词是记忆线索，不是正确发音的范本。",
        "请凭记忆写出外语单词、词义和例句。",
        "尝试一个你真正需要的单词。测试反向过程：能否从其意义中回忆出外语形式？如果关键词让你困惑，可以改变桥梁或直接回忆。"
      ],
      "ja": [
        "キーワードで外国語の単語を結びつける",
        "音が似た既知の語が、外国語の意味に橋渡しを提供できる。キーワードと意味をイメージで結びつけ、その後実際にその語を確認しよう",
        "音が似ているとは正確な発音ではない。一部の語には有用なキーワードが存在しない。発音、スペル、文脈での使用をそれぞれ別々に確認しよう",
        "新しい語の意味と正しい発音を確認しよう",
        "音が似た既知の語を探そう",
        "そのキーワードと意味の間で明確なつながりをイメージしよう",
        "単語から意味を思い出し、次に意味から単語を思い出しましょう。",
        "元の発音、スペル、そして例文を確認しよう",
        "EN: bell = 鐘. “The bell rings.” = “鐘が鳴ります。”",
        "DE: bellen = ほえる. 犬のようにほえる鐘を想像してください。 この語は記憶の手掛かりであり、正しい発音の見本ではありません。",
        "外国語の単語と意味、例文を記憶から書きましょう。",
        "実際に必要な単語で試しましょう。意味から外国語の単語を思い出せるかも確かめます。キーワードが混乱の原因になるなら、別の連想に変えるか、直接思い出す練習をしましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "keyword-method",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-keyword-method-en-visual-55ac557297fd.mp4",
    "bytes": 1300366,
    "sha256": "55ac557297fdf8e5f48b45f91008c210a0c4e37aa2826c2eede14a6da1206aa8",
    "duration": 92.68,
    "recallBoundary": 79.388125,
    "cues": [
      {
        "start": 0.0,
        "end": 3.68
      },
      {
        "start": 3.68,
        "end": 14.2
      },
      {
        "start": 14.2,
        "end": 24.32
      },
      {
        "start": 24.32,
        "end": 29.08
      },
      {
        "start": 29.08,
        "end": 32.96
      },
      {
        "start": 32.96,
        "end": 37.44
      },
      {
        "start": 37.44,
        "end": 42.72
      },
      {
        "start": 42.72,
        "end": 48.08
      },
      {
        "start": 48.08,
        "end": 56.28
      },
      {
        "start": 56.28,
        "end": 72.56
      },
      {
        "start": 72.56,
        "end": 80.24
      },
      {
        "start": 80.24,
        "end": 92.68
      }
    ],
    "captions": {
      "de": [
        "Neue Vokabeln mit Schlüsselwörtern verbinden",
        "Ein ähnlich klingendes bekanntes Wort kann als Brücke zu einer fremdsprachigen Bedeutung dienen. Du verknüpfst das Schlüsselwort bildlich mit der Bedeutung und prüfst danach die echte Vokabel.",
        "Ein ähnlicher Klang ist keine korrekte Aussprache. Nicht für jedes Wort gibt es eine gute Brücke. Die Methode ersetzt weder Ausspracheprüfung noch Schreibweise und Verwendung im Satz.",
        "Prüfe Bedeutung und korrekte Aussprache der neuen Vokabel.",
        "Suche ein bekanntes Wort mit ähnlichem Klang.",
        "Verbinde dieses Schlüsselwort und die Bedeutung durch eine klare Vorstellung.",
        "Rufe die Bedeutung aus der Vokabel ab und danach die Vokabel aus der Bedeutung.",
        "Prüfe das Original: Aussprache, Schreibweise und ein passender Beispielsatz.",
        "Französisch: pain = Brot. Beispielsatz: Je mange du pain. = Ich esse Brot.",
        "Das englische Wort „pan“ kann als ungefähre Klangbrücke dienen: Stelle dir Brot vor, das aus einer Pfanne springt. Französisch „pain“ hat einen Nasalvokal und wird nicht wie englisch „pan“ oder „pain“ ausgesprochen. Die Brücke ist eine Merkhilfe, kein Aussprachemodell.",
        "Rufe das gehörte Beispiel ohne Vorlage ab. Erkläre die Bedeutung und den Weg der Merkhilfe.",
        "Teste die Technik an einer Vokabel, die du wirklich brauchst. Prüfe auch die Gegenrichtung: Kannst du aus der Bedeutung die fremdsprachige Form abrufen? Verwirrt dich das Schlüsselwort, ändere die Brücke oder nutze direktes Abrufen."
      ],
      "en": [
        "Connect vocabulary through keywords",
        "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
        "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
        "Check the new word’s meaning and correct pronunciation.",
        "Find a familiar word with a similar sound.",
        "Imagine a clear connection between that keyword and the meaning.",
        "Retrieve the meaning from the word, then the word from its meaning.",
        "Check the original pronunciation, spelling and an example sentence.",
        "French: pain = bread. Example: Je mange du pain. = I eat bread.",
        "The English word “pan” can be a rough sound cue: imagine bread leaping out of a pan. French pain has a nasal vowel and is not pronounced like English pan or pain. The cue is a memory bridge, not a pronunciation model.",
        "Which French word means bread? Write the word, its meaning and the example sentence from memory.",
        "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval."
      ],
      "fr": [
        "Relier le vocabulaire à des mots-clés",
        "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image, puis vérifie le mot à apprendre.",
        "Un son proche n’est pas une prononciation correcte. Certains mots ne se prêtent pas à cette technique. Vérifie séparément la prononciation, l’orthographe et l’emploi dans une phrase.",
        "Vérifie le sens et la prononciation correcte du nouveau mot.",
        "Cherche un mot connu au son proche.",
        "Imagine un lien clair entre ce mot-clé et le sens.",
        "Retrouve le sens à partir du mot, puis le mot à partir du sens.",
        "Vérifie la prononciation, l’orthographe et une phrase d’exemple.",
        "Français : pain = bread en anglais. Exemple : Je mange du pain. = I eat bread.",
        "Le mot anglais « pan » peut servir d’indice sonore approximatif : imagine du pain qui saute d’une poêle. Le français « pain » contient une voyelle nasale et ne se prononce pas comme les mots anglais « pan » ou « pain ». Cet indice aide à mémoriser, pas à prononcer.",
        "Rappelle l’exemple entendu sans modèle. Explique son sens et le chemin de l’aide-mémoire.",
        "Essaie avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct."
      ],
      "es": [
        "Conecta el vocabulario a través de palabras clave",
        "Una palabra familiar con un sonido similar puede servir como puente para el significado de una palabra extranjera. Conecta la palabra clave y el significado en una imagen, luego verifica el término real.",
        "Un sonido similar no es la pronunciación correcta. Algunas palabras no ofrecen una palabra clave útil. Verifica la pronunciación, ortografía y uso en una oración por separado.",
        "Verifica el significado del nuevo vocablo y su pronunciación correcta.",
        "Busca una palabra familiar con un sonido similar.",
        "Imagina una conexión clara entre la palabra clave y el significado.",
        "Recupera el significado desde la palabra, luego la palabra desde su significado.",
        "Verifica la pronunciación original, ortografía y una oración de ejemplo.",
        "FR: pain = pan. “Je mange du pain.” = “Como pan.”",
        "EN: pan = sartén. Imagina que el pan salta de una sartén. El francés pain tiene una vocal nasal; no se pronuncia como el inglés pan ni pain. La palabra sirve de puente para recordar, no como modelo de pronunciación.",
        "Escribe de memoria la palabra extranjera, su significado y la frase de ejemplo.",
        "Prueba una palabra que realmente necesitas. Prueba también la dirección inversa: ¿puedes recuperar la forma extranjera a partir de su significado? Si la palabra clave te confunde, cambia el puente o usa la recuperación directa."
      ],
      "it": [
        "Collega il vocabolario attraverso parole chiave",
        "Una parola familiare con un suono simile può fornire un ponte per il significato di una parola straniera. Collega la parola chiave e il significato in un'immagine, poi verifica la parola reale.",
        "Un suono simile non è la pronuncia corretta. Alcune parole non offrono un'utile parola chiave. Verifica la pronuncia, l'ortografia e l'uso in una frase separatamente.",
        "Verifica il significato della parola nuova e la pronuncia corretta.",
        "Trova una parola familiare con un suono simile.",
        "Immagina un'associazione chiara tra la parola chiave e il significato.",
        "Ricava il significato dalla parola, poi la parola dal suo significato.",
        "Verifica la pronuncia originale, l'ortografia e un esempio di frase.",
        "FR: pain = pane. “Je mange du pain.” = “Mangio pane.”",
        "EN: pan = padella. Immagina il pane che salta fuori da una padella. Il francese pain ha una vocale nasale e non si pronuncia come l’inglese pan o pain. La parola è un aiuto per ricordare, non un modello di pronuncia.",
        "Scrivi a memoria la parola straniera, il suo significato e la frase di esempio.",
        "Prova con una parola che ti serve davvero. Controlla anche il percorso inverso: riesci a ricordare la parola straniera partendo dal significato? Se la parola chiave ti confonde, cambia associazione oppure esercita direttamente il richiamo."
      ],
      "pt": [
        "Conecte o vocabulário por meio de palavras-chave",
        "Uma palavra familiar com som semelhante pode fornecer uma ponte para o significado de uma palavra estrangeira. Conecte a palavra-chave e o significado em uma imagem, em seguida, verifique a palavra real.",
        "Um som semelhante não é a pronúncia correta. Algumas palavras não oferecem uma palavra-chave útil. Verifique a pronúncia, ortografia e uso em uma frase separadamente.",
        "Verifique o significado da nova palavra e a pronúncia correta.",
        "Encontre uma palavra familiar com som semelhante.",
        "Imagine uma ligação clara entre a palavra-chave e o significado.",
        "Recupere o significado da palavra, em seguida, a palavra a partir do seu significado.",
        "Verifique a pronúncia original, ortografia e uma frase de exemplo.",
        "FR: pain = pão. “Je mange du pain.” = “Como pão.”",
        "EN: pan = frigideira. Imagina o pão a saltar de uma frigideira. O francês pain tem uma vogal nasal e não se pronuncia como o inglês pan ou pain. A palavra é uma ajuda para recordar, não um modelo de pronúncia.",
        "Escreva de memória a palavra estrangeira, o significado e a frase de exemplo.",
        "Tente uma palavra que você realmente precisa. Teste a direção inversa também: é possível recuperar a forma estrangeira a partir do seu significado? Se a palavra-chave te confundir, mude a ponte ou use a recuperação direta."
      ],
      "nl": [
        "Verbind woorden met sleutelwoorden",
        "Een bekend woord met een vergelijkbare klank kan een brug vormen naar de betekenis van een vreemd woord. Verbind het sleutelwoord en de betekenis in een beeld en controleer daarna het echte woord.",
        "Een vergelijkbare klank is niet de juiste uitspraak. Sommige woorden hebben geen bruikbaar sleutelwoord. Controleer uitspraak, spelling en gebruik in een zin afzonderlijk.",
        "Controleer de betekenis en de juiste uitspraak van het nieuwe woord.",
        "Zoek een bekend woord met een gelijksoortig geluid.",
        "Stel je een duidelijke verbinding tussen het sleutelwoord en de betekenis voor.",
        "Haal de betekenis op vanuit het woord en daarna het woord vanuit de betekenis.",
        "Controleer de oorspronkelijke uitspraak, spelling en een voorbeeldzin.",
        "FR: pain = brood. “Je mange du pain.” = “Ik eet brood.”",
        "EN: pan = pan. Stel je brood voor dat uit een pan springt. Het Franse pain heeft een nasale klinker en klinkt niet als het Engelse pan of pain. Het woord is een geheugensteuntje, geen voorbeeld van de juiste uitspraak.",
        "Schrijf het vreemde woord, de betekenis en de voorbeeldzin uit je geheugen op.",
        "Probeer een woord dat je echt nodig hebt. Test ook de andere richting: kun je het vreemde woord vanuit de betekenis ophalen? Als het sleutelwoord verwarrend is, verander dan het geheugensteuntje of oefen het direct ophalen."
      ],
      "tr": [
        "Sözcükleri anahtar sözcüklerle ilişkilendir",
        "Benzer sesli, bildiğin bir sözcük yabancı bir sözcüğün anlamına köprü olabilir. Anahtar sözcükle anlamı bir görüntüde birleştir, sonra asıl sözcüğü kontrol et.",
        "Benzer ses, doğru telaffuz demek değildir. Her sözcük için yararlı bir anahtar sözcük bulunmaz. Telaffuzu, yazımı ve cümle içindeki kullanımı ayrı ayrı kontrol et.",
        "Yeni sözcüğün anlamını ve doğru telaffuzunu kontrol et.",
        "Benzer sesli, bildiğin bir sözcük bul.",
        "Anahtar sözcükle anlam arasında belirgin bir bağlantı hayal et.",
        "Sözcükten anlamını, sonra anlamından sözcüğü hatırla.",
        "Asıl telaffuzu, yazımı ve bir örnek cümleyi kontrol et.",
        "FR: pain = ekmek. “Je mange du pain.” = “Ekmek yiyorum.”",
        "EN: pan = tava. Tavadan dışarı sıçrayan bir ekmek hayal et. Fransızca pain genizsi bir ünlü içerir; İngilizce pan ya da pain gibi telaffuz edilmez. Bu sözcük bir hatırlama ipucudur, doğru telaffuz örneği değildir.",
        "Yabancı sözcüğü, anlamını ve örnek cümleyi hafızandan yaz.",
        "Gerçekten ihtiyaç duyduğun bir sözcükle dene. Ters yönü de sına: anlamından yabancı sözcüğü hatırlayabiliyor musun? Anahtar sözcük kafanı karıştırıyorsa bağlantıyı değiştir veya doğrudan hatırlama çalış."
      ],
      "ar": [
        "اربط المفردات بكلمات مفتاحية",
        "قد تكون كلمة مألوفة ذات صوت مشابه جسرًا إلى معنى كلمة أجنبية. اربط الكلمة المفتاحية والمعنى بصورة ذهنية، ثم تحقّق من الكلمة الأصلية.",
        "تشابه الصوت لا يعني صحة النطق. بعض الكلمات لا يناسبها مفتاح مفيد. تحقّق من النطق والتهجئة والاستعمال في جملة كلٍّ على حدة.",
        "تحقّق من معنى الكلمة الجديدة ونطقها الصحيح.",
        "ابحث عن كلمة مألوفة ذات صوت مشابه.",
        "تخيّل ارتباطًا واضحًا بين الكلمة المفتاحية والمعنى.",
        "استرجع المعنى من الكلمة، ثم الكلمة من معناها.",
        "تحقّق من النطق الأصلي والتهجئة وجملة نموذجية.",
        "FR: pain = خبز. “Je mange du pain.” = “آكل خبزًا.”",
        "EN: pan = مقلاة. تخيّل خبزًا يقفز من مقلاة. تحتوي pain الفرنسية على صوت علّة أنفي، ولا تُنطق مثل pan أو pain بالإنجليزية. هذه الكلمة وسيلة للتذكّر، وليست نموذجًا للنطق الصحيح.",
        "اكتب الكلمة الأجنبية ومعناها والجملة النموذجية من الذاكرة.",
        "جرّب كلمة تحتاج إليها فعلًا. اختبر الاتجاه العكسي أيضًا: هل تستطيع استرجاع الكلمة الأجنبية من معناها؟ إذا أربكك المفتاح، غيّر الرابط أو تدرب على الاسترجاع المباشر."
      ],
      "zh": [
        "通过关键词连接词汇",
        "一个发音相似的熟悉单词可以作为连接外语单词意义的桥梁。在图像中将关键词与其意义关联，然后核对实际单词。",
        "相似发音并不等于正确发音。有些单词没有可用的关键词。需分别检查发音、拼写和在句子中的用法。",
        "核对新单词的意义和正确发音。",
        "寻找一个发音相似的熟悉单词。",
        "在脑海中清晰地建立该关键词与其意义之间的联系。",
        "从单词中回忆出其意义，再从意义中回忆出单词本身。",
        "核对原始发音、拼写以及一个例句。",
        "FR: pain = 面包. “Je mange du pain.” = “我吃面包。”",
        "EN: pan = 平底锅. 想象面包从平底锅里跳出来。 法语 pain 含有鼻化元音，发音并不像英语的 pan 或 pain。 这个词是记忆线索，不是正确发音的范本。",
        "请凭记忆写出外语单词、词义和例句。",
        "尝试一个你真正需要的单词。测试反向过程：能否从其意义中回忆出外语形式？如果关键词让你困惑，可以改变桥梁或直接回忆。"
      ],
      "ja": [
        "キーワードで外国語の単語を結びつける",
        "音が似た既知の語が、外国語の意味に橋渡しを提供できる。キーワードと意味をイメージで結びつけ、その後実際にその語を確認しよう",
        "音が似ているとは正確な発音ではない。一部の語には有用なキーワードが存在しない。発音、スペル、文脈での使用をそれぞれ別々に確認しよう",
        "新しい語の意味と正しい発音を確認しよう",
        "音が似た既知の語を探そう",
        "そのキーワードと意味の間で明確なつながりをイメージしよう",
        "単語から意味を思い出し、次に意味から単語を思い出しましょう。",
        "元の発音、スペル、そして例文を確認しよう",
        "FR: pain = パン. “Je mange du pain.” = “私はパンを食べます。”",
        "EN: pan = フライパン. フライパンからパンが飛び出す様子を想像してください。 フランス語の pain には鼻母音があり、英語の pan や pain と同じ発音ではありません。 この語は記憶の手掛かりであり、正しい発音の見本ではありません。",
        "外国語の単語と意味、例文を記憶から書きましょう。",
        "実際に必要な単語で試しましょう。意味から外国語の単語を思い出せるかも確かめます。キーワードが混乱の原因になるなら、別の連想に変えるか、直接思い出す練習をしましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "long-words",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-long-words-de-visual-2bb5ab97d897.mp4",
    "bytes": 1402694,
    "sha256": "2bb5ab97d897ef86b3e5b31bf7afe7c4792f722a6128eea7d101de79ffaa8333",
    "duration": 93.8,
    "recallBoundary": 80.949333,
    "cues": [
      {
        "start": 0.0,
        "end": 2.4
      },
      {
        "start": 2.4,
        "end": 10.96
      },
      {
        "start": 10.96,
        "end": 22.28
      },
      {
        "start": 22.28,
        "end": 25.68
      },
      {
        "start": 25.68,
        "end": 29.6
      },
      {
        "start": 29.6,
        "end": 34.76
      },
      {
        "start": 34.76,
        "end": 42.88
      },
      {
        "start": 42.88,
        "end": 48.08
      },
      {
        "start": 48.08,
        "end": 55.64
      },
      {
        "start": 55.64,
        "end": 58.36
      },
      {
        "start": 58.36,
        "end": 73.6
      },
      {
        "start": 73.6,
        "end": 81.8
      },
      {
        "start": 81.8,
        "end": 93.8
      }
    ],
    "captions": {
      "de": [
        "Lange Wörter sicher behalten",
        "Du zerlegst ein langes Wort in verständliche Bausteine, setzt sie wieder zusammen und übst Bedeutung, Aussprache und Schreibweise.",
        "Bedeutungsbausteine sind nicht immer Sprechsilben. Nicht jedes Fachwort lässt sich sofort sinnvoll zerlegen. Kläre unbekannte Teile und die korrekte Aussprache, bevor du sie übst.",
        "Kläre die Bedeutung des ganzen Wortes.",
        "Suche bekannte Bausteine und erkläre ihre Bedeutung.",
        "Achte auf Verbindungselemente wie das s in Versicherungsbeitrag.",
        "Sprich die Teile langsam und dann das ganze Wort flüssig. Sprechsilben können anders verlaufen als die Bedeutungsgrenzen.",
        "Verdecke die Vorlage, schreibe das ganze Wort und erkläre es.",
        "Vergleiche Schreibweise und Bedeutung. Übe unsichere Stellen und setze danach wieder das ganze Wort zusammen.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag. Gemeint ist der Beitrag zur Krankenversicherung. Das s verbindet Wortteile; es ist hier kein eigenes Bedeutungswort. Diese Aufteilung zeigt Bausteine, keine Silbentrennung.",
        "Schreibe das vollständige Wort aus dem Gedächtnis. Erkläre anschließend mündlich seine Bedeutung und sprich es flüssig aus.",
        "Wähle ein langes Wort aus deinem Alltag. Suche sinnvolle Bausteine und prüfe danach das vollständige Wort. Für andere Sprachen gelten deren Wortbildungs- und Ausspracheregeln."
      ],
      "en": [
        "Remember long words",
        "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
        "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
        "Clarify the meaning of the whole word.",
        "Identify familiar parts and explain what they contribute.",
        "Notice connecting elements such as the s in Versicherungsbeitrag.",
        "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "Hide the example, write the whole word and explain it.",
        "Check spelling and meaning. Practise uncertain parts, then put the whole word together again.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag: a health insurance contribution. The s connects word parts; it has no separate meaning here. These are meaning units, not syllables.",
        "Recall the example you heard without looking. Explain its meaning and how the memory cue works.",
        "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language."
      ],
      "fr": [
        "Retenir les mots longs",
        "Décompose un mot long en éléments compréhensibles, puis reconstitue-le. Travaille son sens, sa prononciation et son orthographe.",
        "Les éléments de sens ne correspondent pas toujours aux syllabes prononcées. Certains termes techniques sont entièrement nouveaux. Vérifie leur sens et leur prononciation avant de les travailler.",
        "Clarifie le sens du mot entier.",
        "Repère des éléments connus et explique leur rôle.",
        "Observe les éléments de liaison, comme le s dans Versicherungsbeitrag.",
        "Prononce les parties lentement, puis le mot entier avec fluidité. Les frontières syllabiques peuvent être différentes.",
        "Cache le modèle, écris le mot entier et explique-le.",
        "Vérifie l’orthographe et le sens. Travaille les parties incertaines, puis rassemble à nouveau le mot.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag : la cotisation à l’assurance maladie. Le s relie les éléments ; il ne porte pas de sens autonome ici. Ce découpage montre des éléments de sens, pas des syllabes.",
        "Rappelle l’exemple entendu sans modèle. Explique son sens et le chemin de l’aide-mémoire.",
        "Choisis un mot long utile dans ta vie. Repère ses éléments de sens, puis travaille le mot entier. Respecte les règles de formation et de prononciation de sa langue."
      ],
      "es": [
        "Recuerda las palabras largas",
        "Divide una palabra larga en partes con significado, vuelve a unirlas y practica su significado, pronunciación y escritura.",
        "Las partes significativas no siempre son sílabas habladas. Algunos términos técnicos son desconocidos en su totalidad. Verifica su significado y pronunciación antes de practicarlos.",
        "Aclara el significado de la palabra completa.",
        "Identifica partes conocidas y explica qué aportan.",
        "Nota los cambios ortográficos y elementos que las conectan.",
        "Pronuncia las partes despacio y después la palabra completa con fluidez. Los límites entre sílabas pueden diferir de los límites entre unidades de significado.",
        "Oculta el ejemplo, escribe la palabra completa y explica su significado.",
        "Comprueba la escritura y el significado. Practica las partes dudosas y después vuelve a unir la palabra completa.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — cotización al seguro médico. La s enlaza las partes y no tiene aquí un significado independiente. Son unidades de significado, no una transcripción de la pronunciación.",
        "Escribe la palabra completa de memoria. Luego explica su significado en voz alta y di la palabra con fluidez.",
        "Elige una palabra larga relevante para tu vida. Busca partes significativas, luego practica la palabra completa. Usa las reglas de formación y pronunciación del idioma."
      ],
      "it": [
        "Ricorda le parole lunghe",
        "Dividi una parola lunga in parti dotate di significato, riuniscile e pratica il significato, la pronuncia e la scrittura della parola intera.",
        "Le parti dotate di significato non coincidono sempre con le sillabe. Alcuni termini tecnici sono del tutto sconosciuti: verifica significato e pronuncia prima di esercitarti.",
        "Chiarisci il significato della parola intera.",
        "Identifica parti familiari e spiega il loro contributo.",
        "Osserva i cambiamenti ortografici e gli elementi di collegamento.",
        "Pronuncia lentamente le parti, poi la parola intera con scioltezza. I confini tra sillabe possono differire da quelli tra parti di significato.",
        "Nascondi l'esempio, scrivi la parola intera e spiegala.",
        "Verifica grafia e significato. Pratica le parti incerte, poi riunisci nuovamente la parola intera.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — contributo per l’assicurazione sanitaria. La s collega le parti e qui non ha un significato autonomo. Sono unità di significato, non una trascrizione della pronuncia.",
        "Scrivi la parola completa a memoria. Poi spiegane il significato ad alta voce e pronunciala con scioltezza.",
        "Scegli una parola lunga utile nella tua vita. Individua parti dotate di significato e poi esercita la parola intera. Rispetta le regole di formazione e pronuncia della sua lingua."
      ],
      "pt": [
        "Lembre-se de palavras longas",
        "Divida uma palavra longa em partes com significado, volte a juntá-las e pratique o significado, a pronúncia e a escrita da palavra completa.",
        "Partes significativas não são sempre sílabas faladas. Alguns termos técnicos são desconhecidos em sua totalidade. Verifique seu significado e pronúncia antes de praticar.",
        "Esclareça o significado da palavra inteira.",
        "Identifique partes familiares e explique o que elas contribuem.",
        "Observe mudanças na escrita e elementos que as conectam.",
        "Diga as partes lentamente, depois diga a palavra inteira com fluidez. Os limites das sílabas podem diferir dos limites do significado.",
        "Esconda o exemplo, escreva a palavra inteira e explique-a.",
        "Verifique a escrita e o significado. Pratique as partes incertas, depois reúna toda a palavra novamente.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — contribuição para o seguro de saúde. O s liga as partes e não tem aqui um significado autónomo. São unidades de significado, não uma transcrição da pronúncia.",
        "Escreva a palavra completa de memória. Depois, explique o significado em voz alta e pronuncie a palavra com fluidez.",
        "Escolha uma palavra longa relevante para sua vida. Encontre partes significativas, depois pratique a palavra inteira. Use as regras de formação e pronúncia da língua."
      ],
      "nl": [
        "Onthoud lange woorden",
        "Verdeel een lang woord in betekenisvolle delen, voeg die weer samen en oefen betekenis, uitspraak en spelling.",
        "Betekenisvolle delen zijn niet altijd lettergrepen. Sommige vaktermen zijn helemaal onbekend. Controleer hun betekenis en uitspraak voordat je oefent.",
        "Verduidelijk de betekenis van het hele woord.",
        "Identificeer bekende delen en leg uit wat ze bijdragen.",
        "Let op spellingveranderingen en verbindingselementen.",
        "Zeg de delen langzaam en daarna het hele woord vloeiend. Grenzen tussen lettergrepen kunnen anders liggen dan grenzen tussen betekenisdelen.",
        "Verberg het voorbeeld, schrijf het hele woord en leg het uit.",
        "Controleer spelling en betekenis. Oefen de onzekere delen en voeg het hele woord weer samen.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — bijdrage voor de ziektekostenverzekering. De s verbindt de delen en heeft hier geen zelfstandige betekenis. Dit zijn betekenisvolle delen, geen weergave van de uitspraak.",
        "Schrijf het hele woord uit je geheugen op. Leg daarna hardop de betekenis uit en spreek het vloeiend uit.",
        "Kies een lang woord dat voor jou nuttig is. Zoek betekenisvolle delen en oefen daarna het hele woord. Gebruik de woordvormings- en uitspraakregels van de betreffende taal."
      ],
      "tr": [
        "Uzun sözcükleri hatırla",
        "Uzun bir sözcüğü anlamlı parçalara ayır, yeniden birleştir ve anlamını, telaffuzunu ve yazımını çalış.",
        "Anlamlı parçalar her zaman hecelerle örtüşmez. Bazı teknik terimler tamamen yabancı olabilir. Çalışmadan önce anlamlarını ve telaffuzlarını kontrol et.",
        "Sözcüğün bütününün anlamını netleştir.",
        "Tanıdığın parçaları belirle ve anlama katkılarını açıkla.",
        "Yazım değişikliklerine ve birleştirici öğelere dikkat et.",
        "Parçaları yavaşça, sonra sözcüğün tamamını akıcı biçimde söyle. Hece sınırları anlam parçalarının sınırlarından farklı olabilir.",
        "Örneği gizle, sözcüğün tamamını yaz ve açıkla.",
        "Yazımı ve anlamı kontrol et. Emin olmadığın parçaları çalış, sonra sözcüğün tamamını yeniden birleştir.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — sağlık sigortası primi. s parçaları birbirine bağlar; burada bağımsız bir anlam taşımaz. Bunlar anlam birimleridir, telaffuzun yazıya aktarımı değildir.",
        "Sözcüğün tamamını hafızandan yaz. Sonra anlamını sesli açıkla ve sözcüğü akıcı biçimde söyle.",
        "Hayatında işine yarayan uzun bir sözcük seç. Anlamlı parçaları bul ve ardından sözcüğün tamamını çalış. Sözcüğün ait olduğu dilin sözcük oluşturma ve telaffuz kurallarını kullan."
      ],
      "ar": [
        "تذكّر الكلمات الطويلة",
        "قسّم كلمة طويلة إلى أجزاء ذات معنى، ثم أعد تركيبها وتدرّب على معناها ونطقها وتهجئتها.",
        "الأجزاء ذات المعنى لا تتطابق دائمًا مع المقاطع الصوتية. قد تكون بعض المصطلحات التقنية غير مألوفة بالكامل. تحقّق من معناها ونطقها قبل التدريب.",
        "وضّح معنى الكلمة كاملة.",
        "حدّد الأجزاء المألوفة واشرح ما تضيفه إلى المعنى.",
        "لاحظ تغيّرات التهجئة وعناصر الربط.",
        "انطق الأجزاء ببطء، ثم الكلمة كاملة بسلاسة. قد تختلف حدود المقاطع الصوتية عن حدود أجزاء المعنى.",
        "أخفِ المثال واكتب الكلمة كاملة واشرحها.",
        "تحقّق من التهجئة والمعنى. تدرّب على الأجزاء غير الواضحة ثم أعد تركيب الكلمة كاملة.",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — اشتراك التأمين الصحي. يربط الحرف s أجزاء الكلمة، وليس له هنا معنى مستقل. هذه وحدات للمعنى، وليست كتابة صوتية للنطق.",
        "اكتب الكلمة كاملة من الذاكرة. ثم اشرح معناها بصوت عالٍ وانطقها بسلاسة.",
        "اختر كلمة طويلة مفيدة في حياتك. حدّد أجزاءها ذات المعنى ثم تدرّب على الكلمة كاملة. اتبع قواعد بناء الكلمات ونطقها في لغتها."
      ],
      "zh": [
        "记住长词",
        "将一个长词拆分成有意义的部分，重新组合并练习其含义、发音和拼写。",
        "有意义的部分不一定与音节重合。有些专业术语可能完全陌生。练习前应先核实它们的含义和发音。",
        "明确整个词的含义。",
        "找出熟悉的部分并解释它们的贡献。",
        "注意拼写变化和连接元素。",
        "先缓慢地说出各个部分，再流畅地说出整个词。音节边界可能与语义边界不同。",
        "隐藏例子，写出整个词并解释它。",
        "检查拼写和含义。先练习不确定的部分，然后重新拼出整个词。",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — 医疗保险缴费. s 连接各个部分，在这里没有独立的词义。 这些是意义单位，不是发音标注。",
        "从记忆中写出完整单词。然后大声解释其含义并流畅地读出来。",
        "选择一个与你生活相关的长词。找出有意义的部分，然后练习整个词。使用该词语言的构词和发音规则。"
      ],
      "ja": [
        "長い単語を覚える",
        "長い単語を意味のある部分に分割し、それらを再構成して、意味、発音、スペルを練習しよう。",
        "意味のある部分は必ずしも発音される音節とは限らない。いくつかの専門用語は、まったく未知である。その意味と発音を確認した上で練習しよう。",
        "全体の単語の意味を明確にしよう。",
        "馴染みのある部分を特定し、それぞれがどんな貢献をしているか説明しよう。",
        "スペルの変化やつながり要素に注意を払おう。",
        "部分をゆっくりと発音してから、全体を流暢に発音しよう。音節の境界は意味の境界とは必ずしも一致しない。",
        "例を隠し、全体の単語を書き、その意味を説明しよう。",
        "スペルと意味を確認し、不安な部分を練習した後、全体の単語を再構成しよう。",
        "Krankenversicherungsbeitrag",
        "Kranken | versicherung | s | beitrag — 健康保険料. s は部分をつなぐ要素で、ここでは独立した意味を持ちません。 これは意味のまとまりであり、発音表記ではありません。",
        "記憶から完全な単語を書こう。その後、その意味を口に出して説明し、流暢に発音しよう。",
        "生活に関連する長い単語を選び、意味のある部分を特定した後、全体の単語を練習しよう。その言語の単語形成および発音ルールを使用しよう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "long-words",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-long-words-en-visual-a9f8ee33ebc3.mp4",
    "bytes": 1258006,
    "sha256": "a9f8ee33ebc3e642d3480d6049dc14e5d390c04bf4098a937efb48e3042fb471",
    "duration": 90.44,
    "recallBoundary": 78.024667,
    "cues": [
      {
        "start": 0.0,
        "end": 2.16
      },
      {
        "start": 2.16,
        "end": 10.52
      },
      {
        "start": 10.52,
        "end": 21.2
      },
      {
        "start": 21.2,
        "end": 24.64
      },
      {
        "start": 24.64,
        "end": 28.6
      },
      {
        "start": 28.6,
        "end": 32.92
      },
      {
        "start": 32.92,
        "end": 41.32
      },
      {
        "start": 41.32,
        "end": 46.16
      },
      {
        "start": 46.16,
        "end": 53.16
      },
      {
        "start": 53.16,
        "end": 55.8
      },
      {
        "start": 55.8,
        "end": 72.0
      },
      {
        "start": 72.0,
        "end": 79.04
      },
      {
        "start": 79.04,
        "end": 90.44
      }
    ],
    "captions": {
      "de": [
        "Lange Wörter sicher behalten",
        "Du zerlegst ein langes Wort in verständliche Bausteine, setzt sie wieder zusammen und übst Bedeutung, Aussprache und Schreibweise.",
        "Bedeutungsbausteine sind nicht immer Sprechsilben. Nicht jedes Fachwort lässt sich sofort sinnvoll zerlegen. Kläre unbekannte Teile und die korrekte Aussprache, bevor du sie übst.",
        "Kläre die Bedeutung des ganzen Wortes.",
        "Suche bekannte Bausteine und erkläre ihre Bedeutung.",
        "Achte auf Änderungen der Schreibweise und auf Verbindungselemente.",
        "Sprich die Teile langsam und dann das ganze Wort flüssig. Sprechsilben können anders verlaufen als die Bedeutungsgrenzen.",
        "Verdecke die Vorlage, schreibe das ganze Wort und erkläre es.",
        "Vergleiche Schreibweise und Bedeutung. Übe unsichere Stellen und setze danach wieder das ganze Wort zusammen.",
        "unpredictability",
        "un | predict | ability: die Eigenschaft, schwer oder gar nicht vorhersagbar zu sein. Das letzte e von „predictable“ bleibt in „unpredictability“ nicht erhalten. Dies sind hilfreiche Bedeutungsbausteine, keine Ausspracheanleitung.",
        "Rufe das gehörte Beispiel ohne Vorlage ab. Erkläre die Bedeutung und den Weg der Merkhilfe.",
        "Wähle ein langes Wort aus deinem Alltag. Suche sinnvolle Bausteine und prüfe danach das vollständige Wort. Für andere Sprachen gelten deren Wortbildungs- und Ausspracheregeln."
      ],
      "en": [
        "Remember long words",
        "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
        "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
        "Clarify the meaning of the whole word.",
        "Identify familiar parts and explain what they contribute.",
        "Notice spelling changes and connecting elements.",
        "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "Hide the example, write the whole word and explain it.",
        "Check spelling and meaning. Practise uncertain parts, then put the whole word together again.",
        "unpredictability",
        "un | predict | ability: the quality of being difficult or impossible to predict. The final e of “predictable” does not remain in “unpredictability”. These are useful meaning units, not a pronunciation guide.",
        "Write the complete word from memory. Then explain its meaning aloud and say it fluently.",
        "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language."
      ],
      "fr": [
        "Retenir les mots longs",
        "Décompose un mot long en éléments compréhensibles, puis reconstitue-le. Travaille son sens, sa prononciation et son orthographe.",
        "Les éléments de sens ne correspondent pas toujours aux syllabes prononcées. Certains termes techniques sont entièrement nouveaux. Vérifie leur sens et leur prononciation avant de les travailler.",
        "Clarifie le sens du mot entier.",
        "Repère des éléments connus et explique leur rôle.",
        "Observe les changements d’orthographe et les éléments de liaison.",
        "Prononce les parties lentement, puis le mot entier avec fluidité. Les frontières syllabiques peuvent être différentes.",
        "Cache le modèle, écris le mot entier et explique-le.",
        "Vérifie l’orthographe et le sens. Travaille les parties incertaines, puis rassemble à nouveau le mot.",
        "unpredictability",
        "un | predict | ability : le caractère difficile ou impossible à prévoir. Le e final de « predictable » disparaît dans « unpredictability ». Ce sont des unités de sens utiles, pas un guide de prononciation.",
        "Rappelle l’exemple entendu sans modèle. Explique son sens et le chemin de l’aide-mémoire.",
        "Choisis un mot long utile dans ta vie. Repère ses éléments de sens, puis travaille le mot entier. Respecte les règles de formation et de prononciation de sa langue."
      ],
      "es": [
        "Recuerda las palabras largas",
        "Divide una palabra larga en partes con significado, vuelve a unirlas y practica su significado, pronunciación y escritura.",
        "Las partes significativas no siempre son sílabas habladas. Algunos términos técnicos son desconocidos en su totalidad. Verifica su significado y pronunciación antes de practicarlos.",
        "Aclara el significado de la palabra completa.",
        "Identifica partes conocidas y explica qué aportan.",
        "Nota los cambios ortográficos y elementos que las conectan.",
        "Pronuncia las partes despacio y después la palabra completa con fluidez. Los límites entre sílabas pueden diferir de los límites entre unidades de significado.",
        "Oculta el ejemplo, escribe la palabra completa y explica su significado.",
        "Comprueba la escritura y el significado. Practica las partes dudosas y después vuelve a unir la palabra completa.",
        "unpredictability",
        "un | predict | ability — imprevisibilidad: cualidad de ser difícil o imposible de prever. La e final de «predictable» desaparece en «unpredictability». Son unidades de significado, no una transcripción de la pronunciación.",
        "Escribe la palabra completa de memoria. Luego explica su significado en voz alta y di la palabra con fluidez.",
        "Elige una palabra larga relevante para tu vida. Busca partes significativas, luego practica la palabra completa. Usa las reglas de formación y pronunciación del idioma."
      ],
      "it": [
        "Ricorda le parole lunghe",
        "Dividi una parola lunga in parti dotate di significato, riuniscile e pratica il significato, la pronuncia e la scrittura della parola intera.",
        "Le parti dotate di significato non coincidono sempre con le sillabe. Alcuni termini tecnici sono del tutto sconosciuti: verifica significato e pronuncia prima di esercitarti.",
        "Chiarisci il significato della parola intera.",
        "Identifica parti familiari e spiega il loro contributo.",
        "Osserva i cambiamenti ortografici e gli elementi di collegamento.",
        "Pronuncia lentamente le parti, poi la parola intera con scioltezza. I confini tra sillabe possono differire da quelli tra parti di significato.",
        "Nascondi l'esempio, scrivi la parola intera e spiegala.",
        "Verifica grafia e significato. Pratica le parti incerte, poi riunisci nuovamente la parola intera.",
        "unpredictability",
        "un | predict | ability — imprevedibilità: caratteristica di ciò che è difficile o impossibile da prevedere. La e finale di «predictable» scompare in «unpredictability». Sono unità di significato, non una trascrizione della pronuncia.",
        "Scrivi la parola completa a memoria. Poi spiegane il significato ad alta voce e pronunciala con scioltezza.",
        "Scegli una parola lunga utile nella tua vita. Individua parti dotate di significato e poi esercita la parola intera. Rispetta le regole di formazione e pronuncia della sua lingua."
      ],
      "pt": [
        "Lembre-se de palavras longas",
        "Divida uma palavra longa em partes com significado, volte a juntá-las e pratique o significado, a pronúncia e a escrita da palavra completa.",
        "Partes significativas não são sempre sílabas faladas. Alguns termos técnicos são desconhecidos em sua totalidade. Verifique seu significado e pronúncia antes de praticar.",
        "Esclareça o significado da palavra inteira.",
        "Identifique partes familiares e explique o que elas contribuem.",
        "Observe mudanças na escrita e elementos que as conectam.",
        "Diga as partes lentamente, depois diga a palavra inteira com fluidez. Os limites das sílabas podem diferir dos limites do significado.",
        "Esconda o exemplo, escreva a palavra inteira e explique-a.",
        "Verifique a escrita e o significado. Pratique as partes incertas, depois reúna toda a palavra novamente.",
        "unpredictability",
        "un | predict | ability — imprevisibilidade: qualidade do que é difícil ou impossível de prever. O e final de «predictable» desaparece em «unpredictability». São unidades de significado, não uma transcrição da pronúncia.",
        "Escreva a palavra completa de memória. Depois, explique o significado em voz alta e pronuncie a palavra com fluidez.",
        "Escolha uma palavra longa relevante para sua vida. Encontre partes significativas, depois pratique a palavra inteira. Use as regras de formação e pronúncia da língua."
      ],
      "nl": [
        "Onthoud lange woorden",
        "Verdeel een lang woord in betekenisvolle delen, voeg die weer samen en oefen betekenis, uitspraak en spelling.",
        "Betekenisvolle delen zijn niet altijd lettergrepen. Sommige vaktermen zijn helemaal onbekend. Controleer hun betekenis en uitspraak voordat je oefent.",
        "Verduidelijk de betekenis van het hele woord.",
        "Identificeer bekende delen en leg uit wat ze bijdragen.",
        "Let op spellingveranderingen en verbindingselementen.",
        "Zeg de delen langzaam en daarna het hele woord vloeiend. Grenzen tussen lettergrepen kunnen anders liggen dan grenzen tussen betekenisdelen.",
        "Verberg het voorbeeld, schrijf het hele woord en leg het uit.",
        "Controleer spelling en betekenis. Oefen de onzekere delen en voeg het hele woord weer samen.",
        "unpredictability",
        "un | predict | ability — onvoorspelbaarheid: moeilijk of onmogelijk te voorspellen zijn. De laatste e van ‘predictable’ verdwijnt in ‘unpredictability’. Dit zijn betekenisvolle delen, geen weergave van de uitspraak.",
        "Schrijf het hele woord uit je geheugen op. Leg daarna hardop de betekenis uit en spreek het vloeiend uit.",
        "Kies een lang woord dat voor jou nuttig is. Zoek betekenisvolle delen en oefen daarna het hele woord. Gebruik de woordvormings- en uitspraakregels van de betreffende taal."
      ],
      "tr": [
        "Uzun sözcükleri hatırla",
        "Uzun bir sözcüğü anlamlı parçalara ayır, yeniden birleştir ve anlamını, telaffuzunu ve yazımını çalış.",
        "Anlamlı parçalar her zaman hecelerle örtüşmez. Bazı teknik terimler tamamen yabancı olabilir. Çalışmadan önce anlamlarını ve telaffuzlarını kontrol et.",
        "Sözcüğün bütününün anlamını netleştir.",
        "Tanıdığın parçaları belirle ve anlama katkılarını açıkla.",
        "Yazım değişikliklerine ve birleştirici öğelere dikkat et.",
        "Parçaları yavaşça, sonra sözcüğün tamamını akıcı biçimde söyle. Hece sınırları anlam parçalarının sınırlarından farklı olabilir.",
        "Örneği gizle, sözcüğün tamamını yaz ve açıkla.",
        "Yazımı ve anlamı kontrol et. Emin olmadığın parçaları çalış, sonra sözcüğün tamamını yeniden birleştir.",
        "unpredictability",
        "un | predict | ability — öngörülemezlik: öngörülmesi zor veya imkânsız olma özelliği. predictable sözcüğünün sonundaki e, unpredictability sözcüğünde yer almaz. Bunlar anlam birimleridir, telaffuzun yazıya aktarımı değildir.",
        "Sözcüğün tamamını hafızandan yaz. Sonra anlamını sesli açıkla ve sözcüğü akıcı biçimde söyle.",
        "Hayatında işine yarayan uzun bir sözcük seç. Anlamlı parçaları bul ve ardından sözcüğün tamamını çalış. Sözcüğün ait olduğu dilin sözcük oluşturma ve telaffuz kurallarını kullan."
      ],
      "ar": [
        "تذكّر الكلمات الطويلة",
        "قسّم كلمة طويلة إلى أجزاء ذات معنى، ثم أعد تركيبها وتدرّب على معناها ونطقها وتهجئتها.",
        "الأجزاء ذات المعنى لا تتطابق دائمًا مع المقاطع الصوتية. قد تكون بعض المصطلحات التقنية غير مألوفة بالكامل. تحقّق من معناها ونطقها قبل التدريب.",
        "وضّح معنى الكلمة كاملة.",
        "حدّد الأجزاء المألوفة واشرح ما تضيفه إلى المعنى.",
        "لاحظ تغيّرات التهجئة وعناصر الربط.",
        "انطق الأجزاء ببطء، ثم الكلمة كاملة بسلاسة. قد تختلف حدود المقاطع الصوتية عن حدود أجزاء المعنى.",
        "أخفِ المثال واكتب الكلمة كاملة واشرحها.",
        "تحقّق من التهجئة والمعنى. تدرّب على الأجزاء غير الواضحة ثم أعد تركيب الكلمة كاملة.",
        "unpredictability",
        "un | predict | ability — عدم القابلية للتنبؤ: صعوبة أو استحالة التنبؤ بشيء. لا يبقى الحرف e الأخير من predictable في كلمة unpredictability. هذه وحدات للمعنى، وليست كتابة صوتية للنطق.",
        "اكتب الكلمة كاملة من الذاكرة. ثم اشرح معناها بصوت عالٍ وانطقها بسلاسة.",
        "اختر كلمة طويلة مفيدة في حياتك. حدّد أجزاءها ذات المعنى ثم تدرّب على الكلمة كاملة. اتبع قواعد بناء الكلمات ونطقها في لغتها."
      ],
      "zh": [
        "记住长词",
        "将一个长词拆分成有意义的部分，重新组合并练习其含义、发音和拼写。",
        "有意义的部分不一定与音节重合。有些专业术语可能完全陌生。练习前应先核实它们的含义和发音。",
        "明确整个词的含义。",
        "找出熟悉的部分并解释它们的贡献。",
        "注意拼写变化和连接元素。",
        "先缓慢地说出各个部分，再流畅地说出整个词。音节边界可能与语义边界不同。",
        "隐藏例子，写出整个词并解释它。",
        "检查拼写和含义。先练习不确定的部分，然后重新拼出整个词。",
        "unpredictability",
        "un | predict | ability — 不可预测性：难以或无法预测的性质. predictable 末尾的 e 在 unpredictability 中不再保留。 这些是意义单位，不是发音标注。",
        "从记忆中写出完整单词。然后大声解释其含义并流畅地读出来。",
        "选择一个与你生活相关的长词。找出有意义的部分，然后练习整个词。使用该词语言的构词和发音规则。"
      ],
      "ja": [
        "長い単語を覚える",
        "長い単語を意味のある部分に分割し、それらを再構成して、意味、発音、スペルを練習しよう。",
        "意味のある部分は必ずしも発音される音節とは限らない。いくつかの専門用語は、まったく未知である。その意味と発音を確認した上で練習しよう。",
        "全体の単語の意味を明確にしよう。",
        "馴染みのある部分を特定し、それぞれがどんな貢献をしているか説明しよう。",
        "スペルの変化やつながり要素に注意を払おう。",
        "部分をゆっくりと発音してから、全体を流暢に発音しよう。音節の境界は意味の境界とは必ずしも一致しない。",
        "例を隠し、全体の単語を書き、その意味を説明しよう。",
        "スペルと意味を確認し、不安な部分を練習した後、全体の単語を再構成しよう。",
        "unpredictability",
        "un | predict | ability — 予測不可能性：予測が難しい、またはできないという性質. predictable の最後の e は unpredictability では残りません。 これは意味のまとまりであり、発音表記ではありません。",
        "記憶から完全な単語を書こう。その後、その意味を口に出して説明し、流暢に発音しよう。",
        "生活に関連する長い単語を選び、意味のある部分を特定した後、全体の単語を練習しよう。その言語の単語形成および発音ルールを使用しよう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "meaningful-groups",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-meaningful-groups-de-visual-1d66e5cd233c.mp4",
    "bytes": 1650261,
    "sha256": "1d66e5cd233cf08720e5083fc134258230fcd668bfbce89454eac0449a7f0701",
    "duration": 112.84,
    "recallBoundary": 97.90683299999999,
    "cues": [
      {
        "start": 0.0,
        "end": 2.8
      },
      {
        "start": 2.8,
        "end": 14.4
      },
      {
        "start": 14.4,
        "end": 29.44
      },
      {
        "start": 29.44,
        "end": 35.6
      },
      {
        "start": 35.6,
        "end": 40.88
      },
      {
        "start": 40.88,
        "end": 46.52
      },
      {
        "start": 46.52,
        "end": 52.0
      },
      {
        "start": 52.0,
        "end": 57.48
      },
      {
        "start": 57.48,
        "end": 64.08
      },
      {
        "start": 64.08,
        "end": 70.84
      },
      {
        "start": 70.84,
        "end": 90.48
      },
      {
        "start": 90.48,
        "end": 98.88
      },
      {
        "start": 98.88,
        "end": 112.84
      }
    ],
    "captions": {
      "de": [
        "Sinnvolle Einheiten bilden",
        "Du ordnest einzelne Informationen in verständliche Gruppen. Eine passende Struktur kann dir helfen, Inhalte zu überblicken und beim Abruf systematisch nach ihnen zu suchen.",
        "Gruppieren allein garantiert keinen vollständigen Abruf. Die Gruppen müssen für dich sinnvoll sein; fremde Fachbegriffe werden nicht durch eine Überschrift verständlich. Wenn die ursprüngliche Reihenfolge zählt, musst du sie zusätzlich üben.",
        "Kläre, was du behalten möchtest: Inhalte, Reihenfolge oder beides.",
        "Suche Gemeinsamkeiten oder Beziehungen zwischen den Informationen.",
        "Bilde wenige übersichtliche Gruppen und gib jeder eine aussagekräftige Überschrift.",
        "Erkläre, warum die einzelnen Teile zu ihrer Gruppe gehören.",
        "Verdecke die Vorlage. Rufe zuerst die Gruppen und dann ihre Inhalte ab.",
        "Vergleiche mit dem Original, ergänze fehlende Teile und versuche es später erneut.",
        "Apfel · Hammer · Hemd · Birne · Säge · Jacke · Banane · Zange · Hose",
        "Eine mögliche Ordnung: Obst (Apfel, Birne, Banane), Werkzeug (Hammer, Säge, Zange), Kleidung (Hemd, Jacke, Hose). Die drei Überschriften geben dir Suchhilfen. In dieser Übung zählen alle neun Begriffe; ihre ursprüngliche Reihenfolge ist nicht das Lernziel.",
        "Nenne ohne Vorlage die drei Gruppen und möglichst alle neun Begriffe. Die Reihenfolge innerhalb einer Gruppe ist frei.",
        "Gliedere einen eigenen Abschnitt nach Gedanken oder eine Liste nach sinnvollen Kategorien. Erfinde keine Gruppen nur für eine bestimmte Anzahl. Prüfe immer auch den vollständigen Inhalt, nicht nur die Überschriften."
      ],
      "en": [
        "Build meaningful groups",
        "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
        "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
        "Clarify your goal: the content, its order, or both.",
        "Look for shared features or relationships.",
        "Create a few manageable groups with informative headings.",
        "Explain why each item belongs in its group.",
        "Hide the source. Recall the groups first, then their contents.",
        "Compare with the original, correct missing items and try again later.",
        "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
        "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
        "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
        "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings."
      ],
      "fr": [
        "Former des groupes cohérents",
        "Organise des informations en groupes compréhensibles. Une structure utile peut t’aider à voir l’ensemble et à chercher les éléments méthodiquement lors du rappel.",
        "Regrouper ne garantit pas un rappel complet. Les groupes doivent avoir un sens pour toi ; un titre ne suffit pas à expliquer des termes inconnus. Si l’ordre initial compte, travaille-le aussi.",
        "Précise ton objectif : le contenu, son ordre ou les deux.",
        "Cherche des caractéristiques communes ou des relations.",
        "Crée quelques groupes faciles à parcourir avec des titres informatifs.",
        "Explique pourquoi chaque élément appartient à son groupe.",
        "Cache la source. Rappelle d’abord les groupes, puis leur contenu.",
        "Compare avec l’original, corrige les omissions et réessaie plus tard.",
        "Pomme · marteau · chemise · poire · scie · veste · banane · pince · pantalon",
        "Une organisation possible : fruits (pomme, poire, banane), outils (marteau, scie, pince), vêtements (chemise, veste, pantalon). Les titres servent d’indices. L’objectif est de retenir les neuf éléments, pas leur ordre initial.",
        "Rappelle les trois groupes et autant des neuf éléments que possible, sans regarder. L’ordre dans chaque groupe est libre.",
        "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie le contenu complet, pas seulement les titres."
      ],
      "es": [
        "Formar grupos significativos",
        "Organiza los elementos de información en grupos con significado. Una estructura útil puede ayudarte a entender el conjunto y a buscar la información de forma sistemática al recordar.",
        "El simple acto de agrupar no garantiza un recuerdo completo. Los grupos deben tener sentido para ti; un título no explica términos técnicos desconocidos. Si el orden original es importante, practícalo por separado.",
        "Aclara tu objetivo: el contenido, su orden o ambos.",
        "Busca características compartidas o relaciones.",
        "Crea unos pocos grupos manejables con títulos informativos.",
        "Explica por qué cada elemento pertenece a su grupo.",
        "Oculta la fuente. Recuerda los grupos primero, luego sus contenidos.",
        "Compara con el original, corrige los elementos faltantes y vuelve a intentarlo más tarde.",
        "Manzana · martillo · camisa · pera · sierra · chaqueta · plátano · alicates · pantalones",
        "Una organización posible: frutas (manzana, pera, plátano), herramientas (martillo, sierra, alicates) y ropa (camisa, chaqueta, pantalones). Los títulos sirven de pistas. El objetivo es recordar los nueve elementos, no su orden original.",
        "Recuerda los tres grupos y tantos de los nueve elementos como puedas sin mirar. El orden dentro de un grupo es a tu elección.",
        "Organiza tu propio texto por ideas o una lista por categorías significativas. No inventes grupos solo para alcanzar un número específico. Revisa el contenido completo así como los títulos."
      ],
      "it": [
        "Creare gruppi significativi",
        "Organizza pezzi individuali di informazione in gruppi significativi. Una struttura utile può aiutarti a vedere il materiale chiaramente e a cercarlo in modo sistematico durante il ricordo.",
        "Il semplice raggruppamento non garantisce un ricordo completo. I gruppi devono avere senso per te; un titolo non spiega termini tecnici sconosciuti. Se l'ordine originale è importante, esercitati separatamente su di esso.",
        "Definisci il tuo obiettivo: il contenuto, l'ordine o entrambi.",
        "Cerca caratteristiche o relazioni comuni.",
        "Crea pochi gruppi gestibili con titoli esplicativi.",
        "Spiega perché ogni elemento appartiene al suo gruppo.",
        "Nascondi la fonte. Ricorda i gruppi prima, poi i loro contenuti.",
        "Confronta con l'originale, correggi gli elementi mancanti e riprova più tardi.",
        "Mela · martello · camicia · pera · sega · giacca · banana · pinze · pantaloni",
        "Una possibile organizzazione: frutta (mela, pera, banana), attrezzi (martello, sega, pinze), abbigliamento (camicia, giacca, pantaloni). I titoli aiutano a cercare i ricordi. L’obiettivo è ricordare tutti e nove gli elementi, non il loro ordine iniziale.",
        "Ricorda i tre gruppi e quanti più elementi possibile dei nove, senza guardare. Puoi scegliere l’ordine all’interno di ciascun gruppo.",
        "Organizza il tuo testo secondo idee o una lista secondo categorie significative. Non creare gruppi solo per raggiungere un numero specifico. Verifica sia il contenuto completo che i titoli."
      ],
      "pt": [
        "Crie grupos significativos",
        "Organize peças individuais de informação em grupos significativos. Uma estrutura útil pode ajudá-lo a ver claramente o conteúdo e a buscar sistematicamente durante a recuperação.",
        "O simples ato de agrupar não assegura a recuperação completa. Os grupos devem ter sentido para você; um título não explica termos técnicos desconhecidos. Se a ordem original for importante, pratique separadamente.",
        "Defina seu objetivo: o conteúdo, a ordem ou ambos.",
        "Procure características compartilhadas ou relações.",
        "Crie poucos grupos gerenciáveis com títulos informativos.",
        "Explique por que cada item pertence a seu grupo.",
        "Oculte a fonte. Recupere os grupos primeiro, depois seus conteúdos.",
        "Compare com o original, corrija itens faltantes e tente novamente mais tarde.",
        "Maçã · martelo · camisa · pera · serra · casaco · banana · alicate · calças",
        "Uma organização possível: frutas (maçã, pera, banana), ferramentas (martelo, serra, alicate), roupas (camisa, casaco, calças). Os títulos servem como pistas. O objetivo é lembrar os nove elementos, não a ordem inicial.",
        "Recorde os três grupos e o maior número possível dos nove elementos, sem olhar. Pode escolher a ordem dentro de cada grupo.",
        "Organize seu texto por ideias ou uma lista por categorias significativas. Não crie grupos apenas para atingir um número específico. Verifique o conteúdo completo, bem como os títulos."
      ],
      "nl": [
        "Bouw betekenisvolle groepen",
        "Verdeel losse informatie in betekenisvolle groepen. Een bruikbare structuur kan helpen om de leerstof te overzien en tijdens het herinneren systematisch te zoeken.",
        "Alleen het groeperen zorgt niet voor volledige herinnering. De groepen moeten betekenis voor je hebben; een kopje legt geen onbekende technische termen uit. Als de oorspronkelijke volgorde belangrijk is, oefen dan die apart.",
        "Bepaal je doel: de inhoud, de volgorde of beide.",
        "Zoek naar gedeelde kenmerken of relaties.",
        "Maak een paar beheersbare groepen met informatieve koppen.",
        "Verklaar waarom elk item behoort tot zijn groep.",
        "Verberg de bron. Haal eerst de groepen op en daarna hun inhoud.",
        "Vergelijk met het origineel, vul ontbrekende elementen aan en probeer het later opnieuw.",
        "Appel · hamer · overhemd · peer · zaag · jas · banaan · tang · broek",
        "Een mogelijke indeling: fruit (appel, peer, banaan), gereedschap (hamer, zaag, tang), kleding (overhemd, jas, broek). De kopjes geven zoekaanwijzingen. Je probeert alle negen elementen te onthouden; de oorspronkelijke volgorde is niet het leerdoel.",
        "Haal zonder te kijken de drie groepen en zo veel mogelijk van de negen elementen op. De volgorde binnen elke groep mag je zelf kiezen.",
        "Organiseer je eigen tekst of lijst volgens ideeën of op basis van betekenisvolle categorieën. Maak geen groepen aan om een bepaald aantal te bereiken. Controleer zowel de volledige inhoud als de koppen."
      ],
      "tr": [
        "Anlamlı gruplar oluştur",
        "Tek tek bilgileri anlamlı gruplarda düzenle. Yararlı bir yapı, bütünü görmene ve hatırlarken sistemli aramana yardımcı olabilir.",
        "Gruplamak tek başına eksiksiz hatırlamayı garanti etmez. Gruplar senin için anlamlı olmalıdır; bir başlık, bilmediğin teknik terimleri açıklamaz. İlk sıra önemliyse onu ayrıca çalış.",
        "Hedefini netleştir: içerik, sıralama veya ikisi birden.",
        "Ortak özellikler veya ilişkiler ara.",
        "Açıklayıcı başlıkları olan, yönetilebilir birkaç grup oluştur.",
        "Her öğenin neden grubuna ait olduğunu açıkla.",
        "Kaynağı gizle. Önce grupları, sonra içeriklerini hatırla.",
        "Aslıyla karşılaştır, eksik öğeleri tamamla ve daha sonra yeniden dene.",
        "Elma · çekiç · gömlek · armut · testere · ceket · muz · pense · pantolon",
        "Olası bir düzen: meyveler (elma, armut, muz), aletler (çekiç, testere, pense), giysiler (gömlek, ceket, pantolon). Başlıklar arama ipuçları sağlar. Hedef dokuz öğenin tamamını hatırlamaktır; ilk sıra öğrenme hedefi değildir.",
        "Bakmadan üç grubu ve dokuz öğeden mümkün olduğunca çoğunu hatırla. Grup içindeki sırayı kendin seçebilirsin.",
        "Kendi metnini fikirlere, bir listeyi ise anlamlı kategorilere göre düzenle. Sadece belirli bir sayıya ulaşmak için grup oluşturma. Başlıkların yanında içeriğin tamamını da kontrol et."
      ],
      "ar": [
        "كوّن مجموعات ذات معنى",
        "نظّم عناصر المعلومات في مجموعات ذات معنى. قد تساعدك البنية المناسبة على فهم المحتوى والبحث فيه منهجيًا عند التذكّر.",
        "التجميع وحده لا يضمن التذكّر الكامل. يجب أن تكون المجموعات مفهومة لك؛ فالعنوان لا يشرح المصطلحات المجهولة. إذا كان الترتيب الأصلي مهمًا، فتدرّب عليه بشكل منفصل.",
        "حدّد هدفك: المحتوى أم ترتيبه أم كلاهما.",
        "ابحث عن صفات مشتركة أو علاقات.",
        "كوّن مجموعات قليلة يسهل التعامل معها، بعناوين واضحة.",
        "اشرح سبب انتماء كل عنصر إلى مجموعته.",
        "أخفِ المصدر. استرجع المجموعات أولًا ثم محتوياتها.",
        "قارن بالأصل، وأكمل العناصر الناقصة، ثم حاول لاحقًا.",
        "تفاحة · مطرقة · قميص · كمثرى · منشار · سترة · موزة · كماشة · بنطال",
        "تنظيم ممكن: فواكه (تفاحة، كمثرى، موزة)، أدوات (مطرقة، منشار، كماشة)، ملابس (قميص، سترة، بنطال). العناوين تعطي دلائل للبحث. الهدف هو تذكّر العناصر التسعة، وليس ترتيبها الأول.",
        "استرجع المجموعات الثلاث وأكبر عدد ممكن من العناصر التسعة دون النظر. يمكنك اختيار الترتيب داخل المجموعة.",
        "نظّم نصك حسب الأفكار أو قائمتك حسب فئات مفهومة. لا تخترع مجموعات لمجرد الوصول إلى عدد معين. تحقّق من كامل المحتوى إلى جانب العناوين."
      ],
      "zh": [
        "构建有意义的组群",
        "把零散信息组织成有意义的组。合适的结构可以帮助你理解整体内容，并在回忆时有条理地寻找信息。",
        "仅仅分组并不能保证完整回忆。组群必须对你有意义；标题不能解释陌生的技术术语。如果原始顺序重要，应单独练习。",
        "明确你的目标：内容本身、顺序，还是两者兼有？",
        "寻找共同特征或联系。",
        "创建几个可管理的组群，并配以有信息量的标题。",
        "解释每项内容为何属于它所在的组群。",
        "隐藏信息来源。先回忆组群，再回忆其内部内容。",
        "与原始内容对比，补全遗漏项，稍后重新尝试。",
        "苹果 · 锤子 · 衬衫 · 梨 · 锯子 · 夹克 · 香蕉 · 钳子 · 裤子",
        "一种分组方式：水果（苹果、梨、香蕉）、工具（锤子、锯子、钳子）、衣物（衬衫、夹克、裤子）。组名是寻找记忆的线索。目标是记住全部九项，不是它们最初的顺序。",
        "先回忆三个组群，尽可能多地回忆出九项内容，不看原文。组群内部的顺序由你决定。",
        "按意思划分自己的文章，或按有意义的类别整理清单。不要只为凑某个数量而分组。既要检查组名，也要检查完整内容。"
      ],
      "ja": [
        "意味のあるまとまりを作る",
        "個々の情報を意味のあるグループに整理する。有用な構造は、材料を明確に見ることができ、記憶の際に系統的に探すのを助けます。",
        "グループ化だけでは完全な記憶を保証しません。グループが自分にとって意味を持つ必要があります。見慣れない技術用語は、見出しで説明されません。元の順序が重要であれば、別途練習してください。",
        "目的を明確にしましょう：内容そのもの、順序、または両方です。",
        "共通の特徴や関係性を探してください。",
        "数少ない、管理しやすいグループを作り、説明のある見出しを付けてください。",
        "各項目がそのグループに属する理由を説明してください。",
        "元の情報を隠し、まずグループを、次にその中身を思い出しましょう。",
        "元の状態と比較し、欠落した項目を補正し、後に再試行してください。",
        "リンゴ · ハンマー · シャツ · 洋ナシ · のこぎり · ジャケット · バナナ · ペンチ · ズボン",
        "例えば、果物（リンゴ、洋ナシ、バナナ）、道具（ハンマー、のこぎり、ペンチ）、衣類（シャツ、ジャケット、ズボン）に分けられます。見出しは思い出す手掛かりです。目標は9項目すべてを覚えることで、最初の並び順ではありません。",
        "見ずに3つのグループと、9項目のうちできるだけ多くを思い出しましょう。グループ内の順番は自由です。",
        "自分の文章を、考え方やリストの項目を意味のあるカテゴリに分類して整理してください。特定の数に達するためだけにグループを無理に作らないでください。見出しだけでなく、全内容も確認してください。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "meaningful-groups",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-meaningful-groups-en-visual-7c65fcea1329.mp4",
    "bytes": 1472227,
    "sha256": "7c65fcea13296104f8fef31145003d6d91773b99041ea6db35b5c6c605ebca88",
    "duration": 103.48,
    "recallBoundary": 90.63825,
    "cues": [
      {
        "start": 0.0,
        "end": 2.72
      },
      {
        "start": 2.72,
        "end": 13.36
      },
      {
        "start": 13.36,
        "end": 26.0
      },
      {
        "start": 26.0,
        "end": 31.4
      },
      {
        "start": 31.4,
        "end": 35.44
      },
      {
        "start": 35.44,
        "end": 39.84
      },
      {
        "start": 39.84,
        "end": 43.96
      },
      {
        "start": 43.96,
        "end": 49.16
      },
      {
        "start": 49.16,
        "end": 55.08
      },
      {
        "start": 55.08,
        "end": 64.24
      },
      {
        "start": 64.24,
        "end": 83.56
      },
      {
        "start": 83.56,
        "end": 91.56
      },
      {
        "start": 91.56,
        "end": 103.48
      }
    ],
    "captions": {
      "de": [
        "Sinnvolle Einheiten bilden",
        "Du ordnest einzelne Informationen in verständliche Gruppen. Eine passende Struktur kann dir helfen, Inhalte zu überblicken und beim Abruf systematisch nach ihnen zu suchen.",
        "Gruppieren allein garantiert keinen vollständigen Abruf. Die Gruppen müssen für dich sinnvoll sein; fremde Fachbegriffe werden nicht durch eine Überschrift verständlich. Wenn die ursprüngliche Reihenfolge zählt, musst du sie zusätzlich üben.",
        "Kläre, was du behalten möchtest: Inhalte, Reihenfolge oder beides.",
        "Suche Gemeinsamkeiten oder Beziehungen zwischen den Informationen.",
        "Bilde wenige übersichtliche Gruppen und gib jeder eine aussagekräftige Überschrift.",
        "Erkläre, warum die einzelnen Teile zu ihrer Gruppe gehören.",
        "Verdecke die Vorlage. Rufe zuerst die Gruppen und dann ihre Inhalte ab.",
        "Vergleiche mit dem Original, ergänze fehlende Teile und versuche es später erneut.",
        "Apfel · Hammer · Hemd · Birne · Säge · Jacke · Banane · Zange · Hose",
        "Eine mögliche Ordnung: Obst (Apfel, Birne, Banane), Werkzeug (Hammer, Säge, Zange), Kleidung (Hemd, Jacke, Hose). Die drei Überschriften geben dir Suchhilfen. In dieser Übung zählen alle neun Begriffe; ihre ursprüngliche Reihenfolge ist nicht das Lernziel.",
        "Nenne ohne Vorlage die drei Gruppen und möglichst alle neun Begriffe. Die Reihenfolge innerhalb einer Gruppe ist frei.",
        "Gliedere einen eigenen Abschnitt nach Gedanken oder eine Liste nach sinnvollen Kategorien. Erfinde keine Gruppen nur für eine bestimmte Anzahl. Prüfe immer auch den vollständigen Inhalt, nicht nur die Überschriften."
      ],
      "en": [
        "Build meaningful groups",
        "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
        "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
        "Clarify your goal: the content, its order, or both.",
        "Look for shared features or relationships.",
        "Create a few manageable groups with informative headings.",
        "Explain why each item belongs in its group.",
        "Hide the source. Recall the groups first, then their contents.",
        "Compare with the original, correct missing items and try again later.",
        "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
        "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
        "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
        "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings."
      ],
      "fr": [
        "Former des groupes cohérents",
        "Organise des informations en groupes compréhensibles. Une structure utile peut t’aider à voir l’ensemble et à chercher les éléments méthodiquement lors du rappel.",
        "Regrouper ne garantit pas un rappel complet. Les groupes doivent avoir un sens pour toi ; un titre ne suffit pas à expliquer des termes inconnus. Si l’ordre initial compte, travaille-le aussi.",
        "Précise ton objectif : le contenu, son ordre ou les deux.",
        "Cherche des caractéristiques communes ou des relations.",
        "Crée quelques groupes faciles à parcourir avec des titres informatifs.",
        "Explique pourquoi chaque élément appartient à son groupe.",
        "Cache la source. Rappelle d’abord les groupes, puis leur contenu.",
        "Compare avec l’original, corrige les omissions et réessaie plus tard.",
        "Pomme · marteau · chemise · poire · scie · veste · banane · pince · pantalon",
        "Une organisation possible : fruits (pomme, poire, banane), outils (marteau, scie, pince), vêtements (chemise, veste, pantalon). Les titres servent d’indices. L’objectif est de retenir les neuf éléments, pas leur ordre initial.",
        "Rappelle les trois groupes et autant des neuf éléments que possible, sans regarder. L’ordre dans chaque groupe est libre.",
        "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie le contenu complet, pas seulement les titres."
      ],
      "es": [
        "Formar grupos significativos",
        "Organiza los elementos de información en grupos con significado. Una estructura útil puede ayudarte a entender el conjunto y a buscar la información de forma sistemática al recordar.",
        "El simple acto de agrupar no garantiza un recuerdo completo. Los grupos deben tener sentido para ti; un título no explica términos técnicos desconocidos. Si el orden original es importante, practícalo por separado.",
        "Aclara tu objetivo: el contenido, su orden o ambos.",
        "Busca características compartidas o relaciones.",
        "Crea unos pocos grupos manejables con títulos informativos.",
        "Explica por qué cada elemento pertenece a su grupo.",
        "Oculta la fuente. Recuerda los grupos primero, luego sus contenidos.",
        "Compara con el original, corrige los elementos faltantes y vuelve a intentarlo más tarde.",
        "Manzana · martillo · camisa · pera · sierra · chaqueta · plátano · alicates · pantalones",
        "Una organización posible: frutas (manzana, pera, plátano), herramientas (martillo, sierra, alicates) y ropa (camisa, chaqueta, pantalones). Los títulos sirven de pistas. El objetivo es recordar los nueve elementos, no su orden original.",
        "Recuerda los tres grupos y tantos de los nueve elementos como puedas sin mirar. El orden dentro de un grupo es a tu elección.",
        "Organiza tu propio texto por ideas o una lista por categorías significativas. No inventes grupos solo para alcanzar un número específico. Revisa el contenido completo así como los títulos."
      ],
      "it": [
        "Creare gruppi significativi",
        "Organizza pezzi individuali di informazione in gruppi significativi. Una struttura utile può aiutarti a vedere il materiale chiaramente e a cercarlo in modo sistematico durante il ricordo.",
        "Il semplice raggruppamento non garantisce un ricordo completo. I gruppi devono avere senso per te; un titolo non spiega termini tecnici sconosciuti. Se l'ordine originale è importante, esercitati separatamente su di esso.",
        "Definisci il tuo obiettivo: il contenuto, l'ordine o entrambi.",
        "Cerca caratteristiche o relazioni comuni.",
        "Crea pochi gruppi gestibili con titoli esplicativi.",
        "Spiega perché ogni elemento appartiene al suo gruppo.",
        "Nascondi la fonte. Ricorda i gruppi prima, poi i loro contenuti.",
        "Confronta con l'originale, correggi gli elementi mancanti e riprova più tardi.",
        "Mela · martello · camicia · pera · sega · giacca · banana · pinze · pantaloni",
        "Una possibile organizzazione: frutta (mela, pera, banana), attrezzi (martello, sega, pinze), abbigliamento (camicia, giacca, pantaloni). I titoli aiutano a cercare i ricordi. L’obiettivo è ricordare tutti e nove gli elementi, non il loro ordine iniziale.",
        "Ricorda i tre gruppi e quanti più elementi possibile dei nove, senza guardare. Puoi scegliere l’ordine all’interno di ciascun gruppo.",
        "Organizza il tuo testo secondo idee o una lista secondo categorie significative. Non creare gruppi solo per raggiungere un numero specifico. Verifica sia il contenuto completo che i titoli."
      ],
      "pt": [
        "Crie grupos significativos",
        "Organize peças individuais de informação em grupos significativos. Uma estrutura útil pode ajudá-lo a ver claramente o conteúdo e a buscar sistematicamente durante a recuperação.",
        "O simples ato de agrupar não assegura a recuperação completa. Os grupos devem ter sentido para você; um título não explica termos técnicos desconhecidos. Se a ordem original for importante, pratique separadamente.",
        "Defina seu objetivo: o conteúdo, a ordem ou ambos.",
        "Procure características compartilhadas ou relações.",
        "Crie poucos grupos gerenciáveis com títulos informativos.",
        "Explique por que cada item pertence a seu grupo.",
        "Oculte a fonte. Recupere os grupos primeiro, depois seus conteúdos.",
        "Compare com o original, corrija itens faltantes e tente novamente mais tarde.",
        "Maçã · martelo · camisa · pera · serra · casaco · banana · alicate · calças",
        "Uma organização possível: frutas (maçã, pera, banana), ferramentas (martelo, serra, alicate), roupas (camisa, casaco, calças). Os títulos servem como pistas. O objetivo é lembrar os nove elementos, não a ordem inicial.",
        "Recorde os três grupos e o maior número possível dos nove elementos, sem olhar. Pode escolher a ordem dentro de cada grupo.",
        "Organize seu texto por ideias ou uma lista por categorias significativas. Não crie grupos apenas para atingir um número específico. Verifique o conteúdo completo, bem como os títulos."
      ],
      "nl": [
        "Bouw betekenisvolle groepen",
        "Verdeel losse informatie in betekenisvolle groepen. Een bruikbare structuur kan helpen om de leerstof te overzien en tijdens het herinneren systematisch te zoeken.",
        "Alleen het groeperen zorgt niet voor volledige herinnering. De groepen moeten betekenis voor je hebben; een kopje legt geen onbekende technische termen uit. Als de oorspronkelijke volgorde belangrijk is, oefen dan die apart.",
        "Bepaal je doel: de inhoud, de volgorde of beide.",
        "Zoek naar gedeelde kenmerken of relaties.",
        "Maak een paar beheersbare groepen met informatieve koppen.",
        "Verklaar waarom elk item behoort tot zijn groep.",
        "Verberg de bron. Haal eerst de groepen op en daarna hun inhoud.",
        "Vergelijk met het origineel, vul ontbrekende elementen aan en probeer het later opnieuw.",
        "Appel · hamer · overhemd · peer · zaag · jas · banaan · tang · broek",
        "Een mogelijke indeling: fruit (appel, peer, banaan), gereedschap (hamer, zaag, tang), kleding (overhemd, jas, broek). De kopjes geven zoekaanwijzingen. Je probeert alle negen elementen te onthouden; de oorspronkelijke volgorde is niet het leerdoel.",
        "Haal zonder te kijken de drie groepen en zo veel mogelijk van de negen elementen op. De volgorde binnen elke groep mag je zelf kiezen.",
        "Organiseer je eigen tekst of lijst volgens ideeën of op basis van betekenisvolle categorieën. Maak geen groepen aan om een bepaald aantal te bereiken. Controleer zowel de volledige inhoud als de koppen."
      ],
      "tr": [
        "Anlamlı gruplar oluştur",
        "Tek tek bilgileri anlamlı gruplarda düzenle. Yararlı bir yapı, bütünü görmene ve hatırlarken sistemli aramana yardımcı olabilir.",
        "Gruplamak tek başına eksiksiz hatırlamayı garanti etmez. Gruplar senin için anlamlı olmalıdır; bir başlık, bilmediğin teknik terimleri açıklamaz. İlk sıra önemliyse onu ayrıca çalış.",
        "Hedefini netleştir: içerik, sıralama veya ikisi birden.",
        "Ortak özellikler veya ilişkiler ara.",
        "Açıklayıcı başlıkları olan, yönetilebilir birkaç grup oluştur.",
        "Her öğenin neden grubuna ait olduğunu açıkla.",
        "Kaynağı gizle. Önce grupları, sonra içeriklerini hatırla.",
        "Aslıyla karşılaştır, eksik öğeleri tamamla ve daha sonra yeniden dene.",
        "Elma · çekiç · gömlek · armut · testere · ceket · muz · pense · pantolon",
        "Olası bir düzen: meyveler (elma, armut, muz), aletler (çekiç, testere, pense), giysiler (gömlek, ceket, pantolon). Başlıklar arama ipuçları sağlar. Hedef dokuz öğenin tamamını hatırlamaktır; ilk sıra öğrenme hedefi değildir.",
        "Bakmadan üç grubu ve dokuz öğeden mümkün olduğunca çoğunu hatırla. Grup içindeki sırayı kendin seçebilirsin.",
        "Kendi metnini fikirlere, bir listeyi ise anlamlı kategorilere göre düzenle. Sadece belirli bir sayıya ulaşmak için grup oluşturma. Başlıkların yanında içeriğin tamamını da kontrol et."
      ],
      "ar": [
        "كوّن مجموعات ذات معنى",
        "نظّم عناصر المعلومات في مجموعات ذات معنى. قد تساعدك البنية المناسبة على فهم المحتوى والبحث فيه منهجيًا عند التذكّر.",
        "التجميع وحده لا يضمن التذكّر الكامل. يجب أن تكون المجموعات مفهومة لك؛ فالعنوان لا يشرح المصطلحات المجهولة. إذا كان الترتيب الأصلي مهمًا، فتدرّب عليه بشكل منفصل.",
        "حدّد هدفك: المحتوى أم ترتيبه أم كلاهما.",
        "ابحث عن صفات مشتركة أو علاقات.",
        "كوّن مجموعات قليلة يسهل التعامل معها، بعناوين واضحة.",
        "اشرح سبب انتماء كل عنصر إلى مجموعته.",
        "أخفِ المصدر. استرجع المجموعات أولًا ثم محتوياتها.",
        "قارن بالأصل، وأكمل العناصر الناقصة، ثم حاول لاحقًا.",
        "تفاحة · مطرقة · قميص · كمثرى · منشار · سترة · موزة · كماشة · بنطال",
        "تنظيم ممكن: فواكه (تفاحة، كمثرى، موزة)، أدوات (مطرقة، منشار، كماشة)، ملابس (قميص، سترة، بنطال). العناوين تعطي دلائل للبحث. الهدف هو تذكّر العناصر التسعة، وليس ترتيبها الأول.",
        "استرجع المجموعات الثلاث وأكبر عدد ممكن من العناصر التسعة دون النظر. يمكنك اختيار الترتيب داخل المجموعة.",
        "نظّم نصك حسب الأفكار أو قائمتك حسب فئات مفهومة. لا تخترع مجموعات لمجرد الوصول إلى عدد معين. تحقّق من كامل المحتوى إلى جانب العناوين."
      ],
      "zh": [
        "构建有意义的组群",
        "把零散信息组织成有意义的组。合适的结构可以帮助你理解整体内容，并在回忆时有条理地寻找信息。",
        "仅仅分组并不能保证完整回忆。组群必须对你有意义；标题不能解释陌生的技术术语。如果原始顺序重要，应单独练习。",
        "明确你的目标：内容本身、顺序，还是两者兼有？",
        "寻找共同特征或联系。",
        "创建几个可管理的组群，并配以有信息量的标题。",
        "解释每项内容为何属于它所在的组群。",
        "隐藏信息来源。先回忆组群，再回忆其内部内容。",
        "与原始内容对比，补全遗漏项，稍后重新尝试。",
        "苹果 · 锤子 · 衬衫 · 梨 · 锯子 · 夹克 · 香蕉 · 钳子 · 裤子",
        "一种分组方式：水果（苹果、梨、香蕉）、工具（锤子、锯子、钳子）、衣物（衬衫、夹克、裤子）。组名是寻找记忆的线索。目标是记住全部九项，不是它们最初的顺序。",
        "先回忆三个组群，尽可能多地回忆出九项内容，不看原文。组群内部的顺序由你决定。",
        "按意思划分自己的文章，或按有意义的类别整理清单。不要只为凑某个数量而分组。既要检查组名，也要检查完整内容。"
      ],
      "ja": [
        "意味のあるまとまりを作る",
        "個々の情報を意味のあるグループに整理する。有用な構造は、材料を明確に見ることができ、記憶の際に系統的に探すのを助けます。",
        "グループ化だけでは完全な記憶を保証しません。グループが自分にとって意味を持つ必要があります。見慣れない技術用語は、見出しで説明されません。元の順序が重要であれば、別途練習してください。",
        "目的を明確にしましょう：内容そのもの、順序、または両方です。",
        "共通の特徴や関係性を探してください。",
        "数少ない、管理しやすいグループを作り、説明のある見出しを付けてください。",
        "各項目がそのグループに属する理由を説明してください。",
        "元の情報を隠し、まずグループを、次にその中身を思い出しましょう。",
        "元の状態と比較し、欠落した項目を補正し、後に再試行してください。",
        "リンゴ · ハンマー · シャツ · 洋ナシ · のこぎり · ジャケット · バナナ · ペンチ · ズボン",
        "例えば、果物（リンゴ、洋ナシ、バナナ）、道具（ハンマー、のこぎり、ペンチ）、衣類（シャツ、ジャケット、ズボン）に分けられます。見出しは思い出す手掛かりです。目標は9項目すべてを覚えることで、最初の並び順ではありません。",
        "見ずに3つのグループと、9項目のうちできるだけ多くを思い出しましょう。グループ内の順番は自由です。",
        "自分の文章を、考え方やリストの項目を意味のあるカテゴリに分類して整理してください。特定の数に達するためだけにグループを無理に作らないでください。見出しだけでなく、全内容も確認してください。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "method-of-loci",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-method-of-loci-de-visual-71a1aa109f03.mp4",
    "bytes": 1417030,
    "sha256": "71a1aa109f033031199f152ade71fee4e4a19bab2e36fb940515352ef35d1253",
    "duration": 96.04,
    "recallBoundary": 82.78875,
    "cues": [
      {
        "start": 0.0,
        "end": 3.32
      },
      {
        "start": 3.32,
        "end": 13.32
      },
      {
        "start": 13.32,
        "end": 25.72
      },
      {
        "start": 25.72,
        "end": 30.28
      },
      {
        "start": 30.28,
        "end": 36.4
      },
      {
        "start": 36.4,
        "end": 42.48
      },
      {
        "start": 42.48,
        "end": 47.92
      },
      {
        "start": 47.92,
        "end": 53.52
      },
      {
        "start": 53.52,
        "end": 61.6
      },
      {
        "start": 61.6,
        "end": 76.84
      },
      {
        "start": 76.84,
        "end": 83.64
      },
      {
        "start": 83.64,
        "end": 96.04
      }
    ],
    "captions": {
      "de": [
        "Orte als Gedächtnisstützen nutzen",
        "Bei der Loci-Methode legst du vorgestellte Inhalte an feste Orte eines vertrauten Weges. Beim gedanklichen Abgehen helfen die Orte, die Inhalte wiederzufinden.",
        "Lerne zuerst einen stabilen Weg. Zu viele ähnliche Bilder am selben Ort können sich verwechseln. Die Orte unterstützen Struktur und Reihenfolge, nicht automatisch exakte Formulierungen.",
        "Wähle einen vertrauten Weg mit klar unterscheidbaren Stationen.",
        "Lege eine feste Reihenfolge fest und gehe sie einmal ohne Lerninhalt durch.",
        "Verbinde pro Station einen Begriff durch ein deutliches vorgestelltes Ereignis mit dem Ort.",
        "Gehe die Stationen ohne Vorlage ab und nenne die Begriffe.",
        "Vergleiche den Abruf. Verbessere verwechselbare Orte oder schwache Bilder.",
        "Beispielweg: Haustür → Schuhregal → Küchentisch. Begriffe: Brot → Seife → Kerze.",
        "An der Haustür klemmt ein riesiges Brot. Das Schuhregal quillt vor Seifenschaum über. Auf dem Küchentisch steht eine leuchtende Kerze. Der Weg dient hier nur als Beispiel; für eigenes Lernen eignet sich ein tatsächlich vertrauter Weg.",
        "Gehe die drei Stationen gedanklich ab. Schreibe zu jeder Station den zugehörigen Begriff.",
        "Lege im bestehenden Gedächtnispalast der App deinen vertrauten Weg an oder nutze einen vorhandenen. Beginne mit wenigen Stationen und prüfe, ob du jeden Ort sicher unterscheiden kannst."
      ],
      "en": [
        "Use places as memory cues",
        "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
        "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
        "Choose a familiar route with clearly distinct locations.",
        "Fix their order and rehearse the route without learning material.",
        "Connect one item to each location through a vivid imagined event.",
        "Walk the route without looking and name the items.",
        "Compare your recall and improve confusing locations or weak images.",
        "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
        "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
        "Mentally visit the three locations. Write the item associated with each location.",
        "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them."
      ],
      "fr": [
        "Utiliser les lieux comme indices",
        "Avec la méthode des loci, tu places mentalement des contenus à des endroits fixes d’un trajet familier. Parcourir ce trajet dans ta tête fournit des indices pour les retrouver.",
        "Apprends d’abord un trajet stable. Des images semblables au même endroit peuvent se confondre. Les lieux soutiennent la structure et l’ordre, mais pas automatiquement la formulation exacte.",
        "Choisis un trajet familier avec des endroits clairement distincts.",
        "Fixe leur ordre et répète le trajet sans contenu à apprendre.",
        "Associe un élément à chaque endroit par un événement imaginé marquant.",
        "Parcours le trajet sans modèle et nomme les éléments.",
        "Compare ton rappel et améliore les lieux confus ou les images peu efficaces.",
        "Trajet d’exemple : porte d’entrée → meuble à chaussures → table de cuisine. Éléments : pain → savon → bougie.",
        "Un pain géant bloque la porte. Le meuble à chaussures déborde de mousse de savon. Une bougie brille sur la table de cuisine. Ce trajet est seulement un exemple ; choisis un trajet réellement familier pour ton propre apprentissage.",
        "Visite mentalement les trois endroits. Écris l’élément associé à chacun.",
        "Dans le palais de mémoire existant de l’application, crée un trajet familier ou utilise un trajet proposé. Commence par quelques endroits et vérifie que tu les distingues clairement."
      ],
      "es": [
        "Utiliza lugares como pistas de memoria",
        "En el método de los lugares, colocas contenido imaginado en ubicaciones fijas a lo largo de un recorrido familiar. Al caminar por el recorrido en tu mente, obtienes pistas para recuperar la información.",
        "Aprende primero un recorrido estable. Las imágenes parecidas en el mismo lugar pueden confundirse. Los lugares ayudan con la estructura y el orden, pero no garantizan recordar las palabras exactas.",
        "Elige un recorrido familiar con ubicaciones claramente distintas.",
        "Fija el orden y repasa el recorrido sin incluir material de aprendizaje.",
        "Conecta un elemento con cada ubicación mediante un evento imaginado vívido.",
        "Camina por el recorrido sin mirar y nombra los elementos.",
        "Compara tu recuerdo y mejora ubicaciones confusas o imágenes débiles.",
        "Ejemplo de recorrido: puerta principal → estantería de zapatos → mesa de la cocina. Elementos: pan → jabón → vela.",
        "Un pan gigante bloquea la puerta principal. El zapatero rebosa espuma de jabón. Una vela brilla en la mesa de la cocina. Es solo un ejemplo: para aprender tu propio material, utiliza un recorrido que conozcas bien.",
        "Visita mentalmente las tres ubicaciones. Escribe el elemento asociado a cada una.",
        "Utiliza el palacio de la memoria existente en la app para crear un recorrido familiar o utiliza uno disponible. Comienza con unas pocas ubicaciones y verifica que puedas distinguirlas claramente."
      ],
      "it": [
        "Usa i luoghi come indizi per ricordare",
        "Nel metodo dei loci, collochi contenuti immaginati in punti fissi lungo un percorso familiare. Ripercorrerlo mentalmente fornisce indizi per ricordarli.",
        "Impara prima un percorso stabile. Immagini simili nello stesso luogo possono confondersi. I luoghi aiutano con struttura e ordine, ma non garantiscono il ricordo delle parole esatte.",
        "Scegli un percorso familiare con posizioni chiaramente distinte.",
        "Fissa l'ordine e ripeti il percorso senza materiale da imparare.",
        "Collega un elemento a ogni posizione attraverso un evento immaginato vivido.",
        "Cammina lungo il percorso senza guardare e nomina gli elementi.",
        "Confronta il tuo ricordo e migliora le posizioni confuse o le immagini deboli.",
        "Percorso di esempio: porta d’ingresso → scarpiera → tavolo della cucina. Elementi: pane → sapone → candela.",
        "Un pane gigante blocca la porta d’ingresso. La scarpiera trabocca di schiuma di sapone. Una candela brilla sul tavolo della cucina. È solo un esempio: per il tuo materiale, usa un percorso che conosci davvero.",
        "Visita mentalmente le tre posizioni. Scrivi l'elemento associato a ciascuna posizione.",
        "Usa il palazzo della memoria già presente nell’app per creare un percorso familiare o sceglierne uno disponibile. Inizia con pochi luoghi e verifica di distinguerli bene."
      ],
      "pt": [
        "Use lugares como pistas de memória",
        "No método das localizações, você coloca conteúdos imaginários em locais fixos ao longo de um percurso familiar. Caminhar pelo percurso na sua mente fornece pistas para recuperar o conteúdo.",
        "Aprenda primeiro um percurso estável. Imagens semelhantes no mesmo local podem causar confusão. Os locais ajudam com a estrutura e a ordem, mas não garantem recordar as palavras exatas.",
        "Escolha um percurso familiar com locais claramente distintos.",
        "Fixe a ordem e repita o percurso sem incluir material de aprendizagem.",
        "Ligue um item a cada localização por meio de um evento imaginário vívido.",
        "Caminhe pelo percurso sem olhar e nomeie os itens.",
        "Compare o que recordou e melhore os locais confusos ou as imagens pouco claras.",
        "Percurso de exemplo: porta da frente → sapateira → mesa da cozinha. Elementos: pão → sabão → vela.",
        "Um pão gigante bloqueia a porta da frente. A sapateira transborda de espuma de sabão. Uma vela brilha sobre a mesa da cozinha. É apenas um exemplo: para aprender o seu material, use um percurso que conheça bem.",
        "Visite mentalmente as três localizações. Escreva o item associado a cada localização.",
        "Use o palácio da memória da aplicação para criar um percurso familiar ou escolher um disponível. Comece com poucos locais e verifique se consegue distingui-los claramente."
      ],
      "nl": [
        "Gebruik plaatsen als geheugensteuntjes",
        "Bij de loci-methode plaats je denkbeeldige inhoud op vaste plekken langs een bekende route. Als je die route in gedachten aflegt, helpen de plekken je om de inhoud terug te vinden.",
        "Leer eerst een vaste route. Vergelijkbare beelden op dezelfde plek kunnen verwarring geven. Plaatsen ondersteunen structuur en volgorde, maar niet automatisch de precieze woorden.",
        "Kies een bekende route met duidelijk onderscheidende locaties.",
        "Leg de volgorde vast en oefen de route zonder leerstof.",
        "Verbind elk element met een plek door een levendige denkbeeldige gebeurtenis.",
        "Loop de route zonder te kijken en noem de items.",
        "Vergelijk wat je hebt opgehaald en verbeter verwarrende plekken of onduidelijke beelden.",
        "Voorbeeldroute: voordeur → schoenrek → keukentafel. Artikelen: brood → zeep → kaars.",
        "Een enorm brood blokkeert de voordeur. Het schoenenrek stroomt over van zeepschuim. Een kaars brandt op de keukentafel. Dit is alleen een voorbeeldroute; gebruik voor je eigen leerstof een route die je echt kent.",
        "Bezoek mentaal de drie locaties. Schrijf het item dat bij elke locatie hoort.",
        "Gebruik het bestaande geheugenpaleis in de app om een bekende route te maken of kies een beschikbare route. Begin met enkele plekken en controleer of je ze duidelijk uit elkaar kunt houden."
      ],
      "tr": [
        "Mekânları hatırlama ipucu olarak kullan",
        "Loci yönteminde, hayal ettiğin içerikleri tanıdık bir yol üzerindeki sabit yerlere yerleştirirsin. Yolu zihninde yürümek, içerikleri hatırlaman için ipuçları sağlar.",
        "Önce sabit bir yol öğren. Aynı yerdeki benzer görüntüler karışabilir. Yerler yapıyı ve sırayı destekler; sözcükleri aynen hatırlamayı kendiliğinden sağlamaz.",
        "Yerleri açıkça ayırt edilebilen, tanıdık bir yol seç.",
        "Sırayı sabitle ve öğrenilecek malzeme olmadan yolu çalış.",
        "Her yere bir öğeyi canlı bir hayali olayla bağla.",
        "Kaynağa bakmadan yolu zihninde yürü ve öğeleri söyle.",
        "Hatırladıklarını karşılaştır; karışan yerleri veya zayıf görüntüleri iyileştir.",
        "Örnek yol: giriş kapısı → ayakkabılık → mutfak masası. Öğeler: ekmek → sabun → mum.",
        "Dev bir ekmek giriş kapısını kapatır. Ayakkabılıktan sabun köpüğü taşar. Mutfak masasında bir mum yanar. Bu yalnızca örnek bir yoldur; kendi öğrenmen için gerçekten bildiğin bir yol kullan.",
        "Üç yeri zihninde ziyaret et. Her yerle ilişkilendirdiğin öğeyi yaz.",
        "Tanıdık bir yol oluşturmak veya mevcut birini seçmek için uygulamadaki hafıza sarayını kullan. Birkaç yerle başla ve bunları açıkça ayırt edebildiğini kontrol et."
      ],
      "ar": [
        "استخدم الأماكن دلائل للتذكّر",
        "في طريقة المواقع، تضع محتوى متخيّلًا في أماكن ثابتة على طريق مألوف. المرور بهذا الطريق ذهنيًا يوفّر دلائل لاسترجاعه.",
        "تعلّم طريقًا ثابتًا أولًا. قد تختلط الصور المتشابهة في المكان نفسه. تدعم الأماكن البنية والترتيب، لكنها لا تضمن حفظ الألفاظ نفسها.",
        "اختر طريقًا مألوفًا ذا أماكن يسهل تمييزها.",
        "ثبّت ترتيب الأماكن وتدرّب على الطريق دون مادة للحفظ.",
        "اربط كل عنصر بمكان من خلال حدث متخيّل واضح.",
        "مرّ بالطريق ذهنيًا دون النظر إلى المصدر واذكر العناصر.",
        "قارن ما استرجعته وحسّن الأماكن المربكة أو الصور الضعيفة.",
        "طريق نموذجي: باب المنزل → رف الأحذية → طاولة المطبخ. العناصر: خبز → صابون → شمعة.",
        "رغيف ضخم يسد باب المنزل. يفيض رف الأحذية برغوة الصابون. تضيء شمعة على طاولة المطبخ. هذا طريق نموذجي فقط؛ استخدم طريقًا تعرفه فعلًا لتعلّم مادتك.",
        "زر الأماكن الثلاثة ذهنيًا. اكتب العنصر المرتبط بكل مكان.",
        "استخدم قصر الذاكرة الموجود في التطبيق لإنشاء طريق مألوف أو اختيار طريق متاح. ابدأ بأماكن قليلة وتحقّق من قدرتك على تمييزها بوضوح."
      ],
      "zh": [
        "使用地点作为记忆提示",
        "在位置法中，你将想象中的内容放置在熟悉路线的固定位置上。在脑海中走一遍这条路线，可以作为提取信息的提示。",
        "先熟悉一条固定路线。同一地点上的相似图像可能混淆。地点有助于记住结构和顺序，但不能自动保证逐字记忆。",
        "选择一条熟悉的路线，且各个位置清晰分明。",
        "固定各位置的顺序，并在不学习内容的情况下反复练习路线。",
        "通过一个生动的想象事件，将每个物品与相应位置连接起来。",
        "不看原文，在脑海中沿路线前进并说出各项内容。",
        "将你的回忆结果进行对比，并改进容易混淆的位置或模糊的图像。",
        "示例路线：前门 → 鞋架 → 厨房餐桌。物品：面包 → 肥皂 → 蜡烛。",
        "一个巨大的面包挡住前门。鞋架溢出肥皂泡沫。厨房餐桌上亮着一支蜡烛。这只是示例；学习自己的内容时，请使用真正熟悉的路线。",
        "在脑海中依次访问这三个位置，写下与每个位置相关的物品。",
        "使用应用中已有的记忆宫殿创建一条熟悉的路线，或使用现有的路线。从几个位置开始，并确保你能清楚地区分它们。"
      ],
      "ja": [
        "場所を記憶の手掛かりにする",
        "場所法では、想像した内容を、よく知る道順の決まった場所に置きます。その道順を頭の中でたどると、内容を思い出す手掛かりになります。",
        "まず、安定したルートを学びます。同じ場所に似たイメージは混同されやすいです。場所は構造と順序を支えますが、自動的に正確な言葉を再現するわけではありません。",
        "明確で異なる場所を持つ、よく知っているルートを選ぶ",
        "場所の順序を固定し、学習内容なしでルートを繰り返し歩きます。",
        "各アイテムを、その場所と結びつけるために、鮮明な想定された出来事をつくります。",
        "資料を見ずに頭の中で道順をたどり、各項目を言いましょう。",
        "思い出の正確さを比較し、混同しやすい場所や弱いイメージを改善します。",
        "道順の例：玄関 → 靴棚 → 台所のテーブル。項目：パン → 石けん → ろうそく。",
        "巨大なパンが玄関をふさぎ、靴棚から石けんの泡があふれ、台所のテーブルではろうそくが光っています。これは例です。自分の学習には、本当によく知っている道順を使いましょう。",
        "3つの場所を心で訪ね、各場所に関連するアイテムを書き出します。",
        "アプリの既存の記憶の宮殿を使って、慣れ親しんだルートを作成するか、利用可能なルートを使う。最初は数か所から始め、それらが明確に区別できるか確認します。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "method-of-loci",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-method-of-loci-en-visual-12b469b8c5fa.mp4",
    "bytes": 1273971,
    "sha256": "12b469b8c5facf21f6e37b11a5cdccc6255478eb7fbd364c835b55576b631c09",
    "duration": 88.0,
    "recallBoundary": 76.209667,
    "cues": [
      {
        "start": 0.0,
        "end": 3.28
      },
      {
        "start": 3.28,
        "end": 13.88
      },
      {
        "start": 13.88,
        "end": 24.48
      },
      {
        "start": 24.48,
        "end": 28.72
      },
      {
        "start": 28.72,
        "end": 33.0
      },
      {
        "start": 33.0,
        "end": 38.6
      },
      {
        "start": 38.6,
        "end": 42.52
      },
      {
        "start": 42.52,
        "end": 48.0
      },
      {
        "start": 48.0,
        "end": 56.36
      },
      {
        "start": 56.36,
        "end": 70.44
      },
      {
        "start": 70.44,
        "end": 77.0
      },
      {
        "start": 77.0,
        "end": 88.0
      }
    ],
    "captions": {
      "de": [
        "Orte als Gedächtnisstützen nutzen",
        "Bei der Loci-Methode legst du vorgestellte Inhalte an feste Orte eines vertrauten Weges. Beim gedanklichen Abgehen helfen die Orte, die Inhalte wiederzufinden.",
        "Lerne zuerst einen stabilen Weg. Zu viele ähnliche Bilder am selben Ort können sich verwechseln. Die Orte unterstützen Struktur und Reihenfolge, nicht automatisch exakte Formulierungen.",
        "Wähle einen vertrauten Weg mit klar unterscheidbaren Stationen.",
        "Lege eine feste Reihenfolge fest und gehe sie einmal ohne Lerninhalt durch.",
        "Verbinde pro Station einen Begriff durch ein deutliches vorgestelltes Ereignis mit dem Ort.",
        "Gehe die Stationen ohne Vorlage ab und nenne die Begriffe.",
        "Vergleiche den Abruf. Verbessere verwechselbare Orte oder schwache Bilder.",
        "Beispielweg: Haustür → Schuhregal → Küchentisch. Begriffe: Brot → Seife → Kerze.",
        "An der Haustür klemmt ein riesiges Brot. Das Schuhregal quillt vor Seifenschaum über. Auf dem Küchentisch steht eine leuchtende Kerze. Der Weg dient hier nur als Beispiel; für eigenes Lernen eignet sich ein tatsächlich vertrauter Weg.",
        "Gehe die drei Stationen gedanklich ab. Schreibe zu jeder Station den zugehörigen Begriff.",
        "Lege im bestehenden Gedächtnispalast der App deinen vertrauten Weg an oder nutze einen vorhandenen. Beginne mit wenigen Stationen und prüfe, ob du jeden Ort sicher unterscheiden kannst."
      ],
      "en": [
        "Use places as memory cues",
        "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
        "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
        "Choose a familiar route with clearly distinct locations.",
        "Fix their order and rehearse the route without learning material.",
        "Connect one item to each location through a vivid imagined event.",
        "Walk the route without looking and name the items.",
        "Compare your recall and improve confusing locations or weak images.",
        "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
        "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
        "Mentally visit the three locations. Write the item associated with each location.",
        "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them."
      ],
      "fr": [
        "Utiliser les lieux comme indices",
        "Avec la méthode des loci, tu places mentalement des contenus à des endroits fixes d’un trajet familier. Parcourir ce trajet dans ta tête fournit des indices pour les retrouver.",
        "Apprends d’abord un trajet stable. Des images semblables au même endroit peuvent se confondre. Les lieux soutiennent la structure et l’ordre, mais pas automatiquement la formulation exacte.",
        "Choisis un trajet familier avec des endroits clairement distincts.",
        "Fixe leur ordre et répète le trajet sans contenu à apprendre.",
        "Associe un élément à chaque endroit par un événement imaginé marquant.",
        "Parcours le trajet sans modèle et nomme les éléments.",
        "Compare ton rappel et améliore les lieux confus ou les images peu efficaces.",
        "Trajet d’exemple : porte d’entrée → meuble à chaussures → table de cuisine. Éléments : pain → savon → bougie.",
        "Un pain géant bloque la porte. Le meuble à chaussures déborde de mousse de savon. Une bougie brille sur la table de cuisine. Ce trajet est seulement un exemple ; choisis un trajet réellement familier pour ton propre apprentissage.",
        "Visite mentalement les trois endroits. Écris l’élément associé à chacun.",
        "Dans le palais de mémoire existant de l’application, crée un trajet familier ou utilise un trajet proposé. Commence par quelques endroits et vérifie que tu les distingues clairement."
      ],
      "es": [
        "Utiliza lugares como pistas de memoria",
        "En el método de los lugares, colocas contenido imaginado en ubicaciones fijas a lo largo de un recorrido familiar. Al caminar por el recorrido en tu mente, obtienes pistas para recuperar la información.",
        "Aprende primero un recorrido estable. Las imágenes parecidas en el mismo lugar pueden confundirse. Los lugares ayudan con la estructura y el orden, pero no garantizan recordar las palabras exactas.",
        "Elige un recorrido familiar con ubicaciones claramente distintas.",
        "Fija el orden y repasa el recorrido sin incluir material de aprendizaje.",
        "Conecta un elemento con cada ubicación mediante un evento imaginado vívido.",
        "Camina por el recorrido sin mirar y nombra los elementos.",
        "Compara tu recuerdo y mejora ubicaciones confusas o imágenes débiles.",
        "Ejemplo de recorrido: puerta principal → estantería de zapatos → mesa de la cocina. Elementos: pan → jabón → vela.",
        "Un pan gigante bloquea la puerta principal. El zapatero rebosa espuma de jabón. Una vela brilla en la mesa de la cocina. Es solo un ejemplo: para aprender tu propio material, utiliza un recorrido que conozcas bien.",
        "Visita mentalmente las tres ubicaciones. Escribe el elemento asociado a cada una.",
        "Utiliza el palacio de la memoria existente en la app para crear un recorrido familiar o utiliza uno disponible. Comienza con unas pocas ubicaciones y verifica que puedas distinguirlas claramente."
      ],
      "it": [
        "Usa i luoghi come indizi per ricordare",
        "Nel metodo dei loci, collochi contenuti immaginati in punti fissi lungo un percorso familiare. Ripercorrerlo mentalmente fornisce indizi per ricordarli.",
        "Impara prima un percorso stabile. Immagini simili nello stesso luogo possono confondersi. I luoghi aiutano con struttura e ordine, ma non garantiscono il ricordo delle parole esatte.",
        "Scegli un percorso familiare con posizioni chiaramente distinte.",
        "Fissa l'ordine e ripeti il percorso senza materiale da imparare.",
        "Collega un elemento a ogni posizione attraverso un evento immaginato vivido.",
        "Cammina lungo il percorso senza guardare e nomina gli elementi.",
        "Confronta il tuo ricordo e migliora le posizioni confuse o le immagini deboli.",
        "Percorso di esempio: porta d’ingresso → scarpiera → tavolo della cucina. Elementi: pane → sapone → candela.",
        "Un pane gigante blocca la porta d’ingresso. La scarpiera trabocca di schiuma di sapone. Una candela brilla sul tavolo della cucina. È solo un esempio: per il tuo materiale, usa un percorso che conosci davvero.",
        "Visita mentalmente le tre posizioni. Scrivi l'elemento associato a ciascuna posizione.",
        "Usa il palazzo della memoria già presente nell’app per creare un percorso familiare o sceglierne uno disponibile. Inizia con pochi luoghi e verifica di distinguerli bene."
      ],
      "pt": [
        "Use lugares como pistas de memória",
        "No método das localizações, você coloca conteúdos imaginários em locais fixos ao longo de um percurso familiar. Caminhar pelo percurso na sua mente fornece pistas para recuperar o conteúdo.",
        "Aprenda primeiro um percurso estável. Imagens semelhantes no mesmo local podem causar confusão. Os locais ajudam com a estrutura e a ordem, mas não garantem recordar as palavras exatas.",
        "Escolha um percurso familiar com locais claramente distintos.",
        "Fixe a ordem e repita o percurso sem incluir material de aprendizagem.",
        "Ligue um item a cada localização por meio de um evento imaginário vívido.",
        "Caminhe pelo percurso sem olhar e nomeie os itens.",
        "Compare o que recordou e melhore os locais confusos ou as imagens pouco claras.",
        "Percurso de exemplo: porta da frente → sapateira → mesa da cozinha. Elementos: pão → sabão → vela.",
        "Um pão gigante bloqueia a porta da frente. A sapateira transborda de espuma de sabão. Uma vela brilha sobre a mesa da cozinha. É apenas um exemplo: para aprender o seu material, use um percurso que conheça bem.",
        "Visite mentalmente as três localizações. Escreva o item associado a cada localização.",
        "Use o palácio da memória da aplicação para criar um percurso familiar ou escolher um disponível. Comece com poucos locais e verifique se consegue distingui-los claramente."
      ],
      "nl": [
        "Gebruik plaatsen als geheugensteuntjes",
        "Bij de loci-methode plaats je denkbeeldige inhoud op vaste plekken langs een bekende route. Als je die route in gedachten aflegt, helpen de plekken je om de inhoud terug te vinden.",
        "Leer eerst een vaste route. Vergelijkbare beelden op dezelfde plek kunnen verwarring geven. Plaatsen ondersteunen structuur en volgorde, maar niet automatisch de precieze woorden.",
        "Kies een bekende route met duidelijk onderscheidende locaties.",
        "Leg de volgorde vast en oefen de route zonder leerstof.",
        "Verbind elk element met een plek door een levendige denkbeeldige gebeurtenis.",
        "Loop de route zonder te kijken en noem de items.",
        "Vergelijk wat je hebt opgehaald en verbeter verwarrende plekken of onduidelijke beelden.",
        "Voorbeeldroute: voordeur → schoenrek → keukentafel. Artikelen: brood → zeep → kaars.",
        "Een enorm brood blokkeert de voordeur. Het schoenenrek stroomt over van zeepschuim. Een kaars brandt op de keukentafel. Dit is alleen een voorbeeldroute; gebruik voor je eigen leerstof een route die je echt kent.",
        "Bezoek mentaal de drie locaties. Schrijf het item dat bij elke locatie hoort.",
        "Gebruik het bestaande geheugenpaleis in de app om een bekende route te maken of kies een beschikbare route. Begin met enkele plekken en controleer of je ze duidelijk uit elkaar kunt houden."
      ],
      "tr": [
        "Mekânları hatırlama ipucu olarak kullan",
        "Loci yönteminde, hayal ettiğin içerikleri tanıdık bir yol üzerindeki sabit yerlere yerleştirirsin. Yolu zihninde yürümek, içerikleri hatırlaman için ipuçları sağlar.",
        "Önce sabit bir yol öğren. Aynı yerdeki benzer görüntüler karışabilir. Yerler yapıyı ve sırayı destekler; sözcükleri aynen hatırlamayı kendiliğinden sağlamaz.",
        "Yerleri açıkça ayırt edilebilen, tanıdık bir yol seç.",
        "Sırayı sabitle ve öğrenilecek malzeme olmadan yolu çalış.",
        "Her yere bir öğeyi canlı bir hayali olayla bağla.",
        "Kaynağa bakmadan yolu zihninde yürü ve öğeleri söyle.",
        "Hatırladıklarını karşılaştır; karışan yerleri veya zayıf görüntüleri iyileştir.",
        "Örnek yol: giriş kapısı → ayakkabılık → mutfak masası. Öğeler: ekmek → sabun → mum.",
        "Dev bir ekmek giriş kapısını kapatır. Ayakkabılıktan sabun köpüğü taşar. Mutfak masasında bir mum yanar. Bu yalnızca örnek bir yoldur; kendi öğrenmen için gerçekten bildiğin bir yol kullan.",
        "Üç yeri zihninde ziyaret et. Her yerle ilişkilendirdiğin öğeyi yaz.",
        "Tanıdık bir yol oluşturmak veya mevcut birini seçmek için uygulamadaki hafıza sarayını kullan. Birkaç yerle başla ve bunları açıkça ayırt edebildiğini kontrol et."
      ],
      "ar": [
        "استخدم الأماكن دلائل للتذكّر",
        "في طريقة المواقع، تضع محتوى متخيّلًا في أماكن ثابتة على طريق مألوف. المرور بهذا الطريق ذهنيًا يوفّر دلائل لاسترجاعه.",
        "تعلّم طريقًا ثابتًا أولًا. قد تختلط الصور المتشابهة في المكان نفسه. تدعم الأماكن البنية والترتيب، لكنها لا تضمن حفظ الألفاظ نفسها.",
        "اختر طريقًا مألوفًا ذا أماكن يسهل تمييزها.",
        "ثبّت ترتيب الأماكن وتدرّب على الطريق دون مادة للحفظ.",
        "اربط كل عنصر بمكان من خلال حدث متخيّل واضح.",
        "مرّ بالطريق ذهنيًا دون النظر إلى المصدر واذكر العناصر.",
        "قارن ما استرجعته وحسّن الأماكن المربكة أو الصور الضعيفة.",
        "طريق نموذجي: باب المنزل → رف الأحذية → طاولة المطبخ. العناصر: خبز → صابون → شمعة.",
        "رغيف ضخم يسد باب المنزل. يفيض رف الأحذية برغوة الصابون. تضيء شمعة على طاولة المطبخ. هذا طريق نموذجي فقط؛ استخدم طريقًا تعرفه فعلًا لتعلّم مادتك.",
        "زر الأماكن الثلاثة ذهنيًا. اكتب العنصر المرتبط بكل مكان.",
        "استخدم قصر الذاكرة الموجود في التطبيق لإنشاء طريق مألوف أو اختيار طريق متاح. ابدأ بأماكن قليلة وتحقّق من قدرتك على تمييزها بوضوح."
      ],
      "zh": [
        "使用地点作为记忆提示",
        "在位置法中，你将想象中的内容放置在熟悉路线的固定位置上。在脑海中走一遍这条路线，可以作为提取信息的提示。",
        "先熟悉一条固定路线。同一地点上的相似图像可能混淆。地点有助于记住结构和顺序，但不能自动保证逐字记忆。",
        "选择一条熟悉的路线，且各个位置清晰分明。",
        "固定各位置的顺序，并在不学习内容的情况下反复练习路线。",
        "通过一个生动的想象事件，将每个物品与相应位置连接起来。",
        "不看原文，在脑海中沿路线前进并说出各项内容。",
        "将你的回忆结果进行对比，并改进容易混淆的位置或模糊的图像。",
        "示例路线：前门 → 鞋架 → 厨房餐桌。物品：面包 → 肥皂 → 蜡烛。",
        "一个巨大的面包挡住前门。鞋架溢出肥皂泡沫。厨房餐桌上亮着一支蜡烛。这只是示例；学习自己的内容时，请使用真正熟悉的路线。",
        "在脑海中依次访问这三个位置，写下与每个位置相关的物品。",
        "使用应用中已有的记忆宫殿创建一条熟悉的路线，或使用现有的路线。从几个位置开始，并确保你能清楚地区分它们。"
      ],
      "ja": [
        "場所を記憶の手掛かりにする",
        "場所法では、想像した内容を、よく知る道順の決まった場所に置きます。その道順を頭の中でたどると、内容を思い出す手掛かりになります。",
        "まず、安定したルートを学びます。同じ場所に似たイメージは混同されやすいです。場所は構造と順序を支えますが、自動的に正確な言葉を再現するわけではありません。",
        "明確で異なる場所を持つ、よく知っているルートを選ぶ",
        "場所の順序を固定し、学習内容なしでルートを繰り返し歩きます。",
        "各アイテムを、その場所と結びつけるために、鮮明な想定された出来事をつくります。",
        "資料を見ずに頭の中で道順をたどり、各項目を言いましょう。",
        "思い出の正確さを比較し、混同しやすい場所や弱いイメージを改善します。",
        "道順の例：玄関 → 靴棚 → 台所のテーブル。項目：パン → 石けん → ろうそく。",
        "巨大なパンが玄関をふさぎ、靴棚から石けんの泡があふれ、台所のテーブルではろうそくが光っています。これは例です。自分の学習には、本当によく知っている道順を使いましょう。",
        "3つの場所を心で訪ね、各場所に関連するアイテムを書き出します。",
        "アプリの既存の記憶の宮殿を使って、慣れ親しんだルートを作成するか、利用可能なルートを使う。最初は数か所から始め、それらが明確に区別できるか確認します。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "number-images",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-number-images-de-visual-48bfc64cabfe.mp4",
    "bytes": 1388495,
    "sha256": "48bfc64cabfe093da11536b9284dda071e3e5a81bc86fd1de4baa37623a79eb0",
    "duration": 95.24,
    "recallBoundary": 81.6725,
    "cues": [
      {
        "start": 0.0,
        "end": 3.0
      },
      {
        "start": 3.0,
        "end": 14.16
      },
      {
        "start": 14.16,
        "end": 27.52
      },
      {
        "start": 27.52,
        "end": 31.8
      },
      {
        "start": 31.8,
        "end": 35.28
      },
      {
        "start": 35.28,
        "end": 39.92
      },
      {
        "start": 39.92,
        "end": 46.0
      },
      {
        "start": 46.0,
        "end": 51.28
      },
      {
        "start": 51.28,
        "end": 59.44
      },
      {
        "start": 59.44,
        "end": 76.28
      },
      {
        "start": 76.28,
        "end": 82.52
      },
      {
        "start": 82.52,
        "end": 95.24
      }
    ],
    "captions": {
      "de": [
        "Zahlen in Bilder übersetzen",
        "Das Major-System ordnet Ziffern Konsonantenlaute zu. Daraus bildest du ein Wort und stellst dir ein Bild vor. Dieses Bild soll sich wieder in die Zahl zurückübersetzen lassen.",
        "Du musst die Zuordnungen zuerst lernen. Ein Bild ohne verlässliche Rückübersetzung hilft beim Zahlenabruf nicht. Dieser Einstieg übt nur zwei Ziffern; die vorhandenen Major-Lektionen vermitteln weitere Zuordnungen.",
        "Lerne zunächst wenige feste Ziffer-Laut-Paare.",
        "Lies die Laute in der Reihenfolge der Ziffern.",
        "Ergänze passende Vokale zu einem bildhaften Wort.",
        "Prüfe die Konsonantenlaute: Enthält das Wort zusätzliche zählende Laute?",
        "Rufe aus dem Bild das Wort und aus dessen Lauten wieder die Zahl ab.",
        "1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Tanne werden: t + n.",
        "Die Vokale zählen hier nicht. Das doppelt geschriebene n in Tanne ist ein Konsonantenlaut. Beim Rückweg erhältst du t → 1 und n → 2, also 12. Entscheidend ist der Klang, nicht die Anzahl geschriebener Buchstaben.",
        "Welche Zahl steckt im Bild Tanne? Erkläre den Rückweg über die beiden Konsonantenlaute.",
        "Übe die weiteren festen Zuordnungen in den bestehenden Major-Lektionen. Füge erst dann längere Zahlenfolgen hinzu. Prüfe bei jedem eigenen Bild den Rückweg zur exakten Zahl."
      ],
      "en": [
        "Turn numbers into images",
        "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
        "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
        "Learn a few fixed digit-to-sound pairs first.",
        "Read the sounds in the order of the digits.",
        "Add vowels to form a concrete word.",
        "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "Retrieve the word from the image and decode its sounds back into the number.",
        "1 → t/d; 2 → n. The number 12 can become an image of a fir tree, “Tanne” in German: t + n.",
        "In reverse, t gives 1 and n gives 2: this recovers 12. The consonant sounds of “Tanne” matter, not just its spelling.",
        "Recall the example you heard without looking. Explain its meaning and how the memory cue works.",
        "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number."
      ],
      "fr": [
        "Transformer les nombres en images",
        "Le système majeur associe des sons consonantiques aux chiffres. Tu formes un mot et imagines une image que tu peux ensuite reconvertir en nombre.",
        "Apprends d’abord les correspondances. Une image qui ne permet pas de retrouver exactement le nombre n’aide pas au rappel précis. Cette introduction utilise deux chiffres ; les leçons existantes du système majeur présentent d’autres correspondances.",
        "Apprends d’abord quelques correspondances fixes entre chiffres et sons.",
        "Lis les sons dans l’ordre des chiffres.",
        "Ajoute des voyelles pour former un mot concret.",
        "Vérifie si le mot contient d’autres consonnes prononcées qui coderaient des chiffres supplémentaires.",
        "Retrouve le mot à partir de l’image, puis le nombre à partir de ses sons.",
        "1 → t/d ; 2 → n. Le nombre 12 peut devenir l’image d’un sapin, « Tanne » en allemand : t + n.",
        "Dans l’autre sens, t donne 1 et n donne 2 : on retrouve 12. Ce sont les sons consonantiques de « Tanne » qui comptent, pas seulement les lettres.",
        "Rappelle l’exemple entendu sans modèle. Explique son sens et le chemin de l’aide-mémoire.",
        "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Vérifie que chaque image te ramène exactement au nombre voulu."
      ],
      "es": [
        "Convertir números en imágenes",
        "El sistema mayor asigna sonidos consonánticos a los dígitos. Úsalos para formar una palabra e imaginar una imagen que puedas volver a convertir en el número.",
        "Aprende los mapeos primero. Una imagen que no se pueda decodificar de forma fiable no ayuda en el recuerdo exacto del número. Esta introducción utiliza dos dígitos; las lecciones existentes sobre el Sistema Mayor enseñan mapeos adicionales.",
        "Aprende unos pocos pares fijos de dígito a sonido primero.",
        "Lee los sonidos en el orden de los dígitos.",
        "Agrega vocales para formar una palabra concreta.",
        "Verifica si la palabra contiene sonidos de consonantes adicionales que codificarían dígitos extra.",
        "Recupera la palabra desde la imagen y decodifica sus sonidos de nuevo en el número.",
        "1 → t/d; 2 → n. 12 → Tanne (abeto) → t + n.",
        "La vocal no cuenta aquí. En la dirección inversa, t da 1 y n da 2, recuperando 12. Importa la secuencia sonora, no solo las letras escritas.",
        "Tanne: ¿Qué número representa esta palabra? Explica cómo lo recuperas a partir de sus dos consonantes.",
        "Practica más correspondencias fijas en las lecciones existentes del sistema mayor antes de trabajar con números largos. Comprueba que cada imagen permita recuperar exactamente el número previsto."
      ],
      "it": [
        "Trasforma i numeri in immagini",
        "Il sistema maggiore associa suoni consonantici alle cifre. Usali per formare una parola e immaginare un’immagine che puoi riconvertire nel numero.",
        "Impara prima le corrispondenze. Un'immagine che non può essere decodificata in modo affidabile non aiuta nella memorizzazione precisa dei numeri. Questa introduzione utilizza due cifre; i corsi esistenti sul Sistema Maggiore insegnano ulteriori mappature.",
        "Impara prima alcune corrispondenze fisse tra cifre e suoni.",
        "Leggi i suoni nell'ordine dei numeri.",
        "Aggiungi vocali per formare una parola concreta.",
        "Verifica se la parola contiene suoni consonantici aggiuntivi che potrebbero codificare cifre extra.",
        "Ricorda la parola dall'immagine e decodifica i suoni per ottenere il numero.",
        "1 → t/d; 2 → n. 12 → Tanne (abete) → t + n.",
        "La vocale non conta qui. Nel senso inverso, t dà 1 e n dà 2, ripristinando 12. La sequenza sonora conta, non solo le lettere scritte.",
        "Tanne: Quale numero rappresenta questa parola? Spiega come lo ricavi dai due suoni consonantici.",
        "Pratica ulteriori mappature fisse nei corsi esistenti sul Sistema Maggiore prima di affrontare numeri più lunghi. Verifica che ogni immagine che crei decodifichi esattamente il numero inteso."
      ],
      "pt": [
        "Transforme números em imagens",
        "O sistema maior associa sons consonânticos a dígitos. Use-os para formar uma palavra e imaginar uma imagem que possa voltar a converter no número.",
        "Aprenda os mapeamentos primeiro. Uma imagem que não pode ser decodificada com precisão não ajuda na memória exata dos números. Esta introdução utiliza dois dígitos; as aulas existentes sobre o Major ensinam mapeamentos adicionais.",
        "Aprenda alguns pares fixos de dígito para som. ",
        "Leia os sons na ordem dos dígitos.",
        "Adicione vogais para formar uma palavra concreta.",
        "Verifique se a palavra contém sons consoantes adicionais que representariam dígitos extras.",
        "Recupere a palavra a partir da imagem e decodifique seus sons de volta para o número.",
        "1 → t/d; 2 → n. 12 → Tanne (abeto) → t + n.",
        "A vogal não conta aqui. Na direção inversa, t dá 1 e n dá 2, recuperando 12. A sequência sonora importa, não apenas as letras escritas.",
        "Tanne: Que número representa esta palavra? Explique como o recupera a partir dos dois sons consonânticos.",
        "Pratique mapeamentos fixos adicionais nas aulas existentes sobre o Major antes de lidar com números mais longos. Verifique que cada imagem que criar decodifique exatamente o número pretendido."
      ],
      "nl": [
        "Zet cijfers om in beelden",
        "Het Major-systeem koppelt medeklinkerklanken aan cijfers. Vorm daarmee een woord en een beeld dat je terug kunt vertalen naar het getal.",
        "Leer eerst de vaste koppelingen. Een beeld dat je niet betrouwbaar kunt ontcijferen, helpt niet bij het precies onthouden van getallen. Deze inleiding gebruikt twee cijfers; de bestaande Major-lessen leren verdere koppelingen.",
        "Leer eerst enkele vaste koppelingen tussen cijfers en klanken.",
        "Lees de klanken in de volgorde van de cijfers.",
        "Voeg klinkers toe om een concreet woord te vormen.",
        "Controleer of het woord extra medeklinkerklanken bevat die ook extra cijfers zouden weergeven.",
        "Haal het woord op vanuit het beeld en vertaal de klanken terug naar het getal.",
        "1 → t/d; 2 → n. 12 → Tanne (spar) → t + n.",
        "De klinker telt hier niet mee. Omgekeerd geeft t een 1 en n een 2: zo krijg je 12 terug. Het gaat om de klanken, niet alleen om de geschreven letters.",
        "Tanne: Welk getal stelt dit woord voor? Leg uit hoe je het via de twee medeklinkerklanken terugvindt.",
        "Oefen verdere vaste koppelingen in de bestaande Major-lessen voordat je langere getallen leert. Controleer of elk beeld precies het bedoelde getal oplevert."
      ],
      "tr": [
        "Sayıları görüntülere dönüştür",
        "Major sistemi, ünsüz sesleri rakamlarla eşleştirir. Bu seslerle bir sözcük oluştur ve tekrar sayıya çözülebilen bir görüntü hayal et.",
        "Önce eşleştirmeleri öğren. Güvenilir biçimde çözülemeyen bir görüntü, sayıyı tam hatırlamaya yardımcı olmaz. Bu giriş iki rakam kullanır; mevcut Major dersleri başka eşleştirmeler öğretir.",
        "Önce birkaç sabit rakam-ses eşleştirmesi öğren.",
        "Sesleri rakamların sırasıyla oku.",
        "Somut bir sözcük oluşturmak için ünlüler ekle.",
        "Sözcükte ek rakamları kodlayacak başka ünsüz sesler olup olmadığını kontrol et.",
        "Görüntüden sözcüğü hatırla ve seslerini yeniden sayıya çöz.",
        "1 → t/d; 2 → n. 12 → Tanne (köknar) → t + n.",
        "Burada ünlü sayılmaz. Ters yönde t, 1’i; n, 2’yi verir ve 12 geri elde edilir. Yalnızca yazılı harfler değil, ses dizisi önemlidir.",
        "Tanne: Bu sözcük hangi sayıyı temsil ediyor? İki ünsüz ses üzerinden sayıyı nasıl bulduğunu açıkla.",
        "Daha uzun sayılara geçmeden önce mevcut Major derslerinde diğer sabit eşleştirmeleri çalış. Oluşturduğun her görüntünün tam olarak amaçlanan sayıya çözüldüğünü kontrol et."
      ],
      "ar": [
        "حوّل الأعداد إلى صور",
        "يربط نظام ماجور أصوات الحروف الساكنة بالأرقام. استخدمها لتكوين كلمة وصورة ذهنية يمكن فكّها للعودة إلى العدد.",
        "تعلّم الروابط أولًا. الصورة التي لا تستطيع فكّها بثقة لا تساعد على تذكّر العدد بدقة. تستخدم هذه المقدمة رقمين؛ وتعلّم دروس ماجور الموجودة روابط إضافية.",
        "تعلّم أولًا بضعة روابط ثابتة بين الأرقام والأصوات.",
        "اقرأ الأصوات حسب ترتيب الأرقام.",
        "أضف أصوات العلّة لتكوين كلمة تشير إلى شيء محسوس.",
        "تحقّق من وجود أصوات ساكنة إضافية قد ترمز إلى أرقام زائدة.",
        "استرجع الكلمة من الصورة وفكّ أصواتها للعودة إلى العدد.",
        "1 → t/d; 2 → n. 12 → Tanne (شجرة تنّوب) → t + n.",
        "صوت العلّة لا يُحسب هنا. في الاتجاه العكسي يعطي t الرقم 1 ويعطي n الرقم 2، فنستعيد 12. المهم هو الأصوات، وليس الحروف المكتوبة فقط.",
        "Tanne: ما العدد الذي تمثّله هذه الكلمة؟ اشرح كيف تستعيده من الصوتين الساكنين.",
        "تدرّب على روابط ثابتة إضافية في دروس ماجور الموجودة قبل العمل على أعداد أطول. تحقّق من أن كل صورة تعيد العدد المقصود بدقة."
      ],
      "zh": [
        "把数字变成图像",
        "Major 编码系统把辅音与数字对应起来。用这些辅音组成词，再形成能反向还原出数字的图像。",
        "先学会固定对应关系。不能可靠还原的图像无助于准确记住数字。本入门练习使用两个数字；已有的 Major 课程会介绍更多对应关系。",
        "先学会几个固定的数字与辅音对应关系。",
        "按数字顺序读取音素。",
        "加上元音形成一个具体的词。",
        "检查这个词中是否包含额外的辅音音素，这些音素可能对应额外的数字。",
        "从图像中提取这个词，并将其中的音素解码回数字。",
        "1 → t/d; 2 → n. 12 → Tanne (冷杉) → t + n.",
        "这里元音不计。在反向过程中，t对应1，n对应2，从而恢复出12。音素的模式比单纯的文字更重要。",
        "Tanne: 这个词代表哪个数字？请说明怎样通过两个辅音还原数字。",
        "在处理更长的数字之前，先在已有的 Major 课程中练习更多固定对应关系。确认每幅图像都能准确还原成原定的数字。"
      ],
      "ja": [
        "数字をイメージに変える",
        "Major法は子音の音を数字に対応させる方法です。その音で単語を作り、元の数字に戻せるイメージを思い浮かべます。",
        "先に対応関係を覚えましょう。確実に数字に戻せないイメージは、正確な数字の記憶に役立ちません。ここでは2桁を扱います。既存のMajor法のレッスンでは、さらに多くの対応を学べます。",
        "まず数字と子音の決まった対応をいくつか覚えましょう。",
        "数字の順に音を読む。",
        "母音を加えて、具体的な物を表す単語を作りましょう。",
        "余計な数字を表す子音が単語に含まれていないか、確認しましょう。",
        "イメージから単語を思い出して、その音を数字に戻す。",
        "1 → t/d; 2 → n. 12 → Tanne (モミの木) → t + n.",
        "ここでは母音は数えません。逆にたどるとtは1、nは2なので、12に戻ります。文字だけでなく、子音の並びが重要です。",
        "Tanne: この単語はどの数字を表しますか。2つの子音から数字に戻す手順を説明しましょう。",
        "長い数字を扱う前に、既存のMajor法のレッスンで他の固定した対応も練習しましょう。作ったイメージから、意図した数字を正確に取り出せるか確認します。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "number-images",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-number-images-en-visual-effcc8342215.mp4",
    "bytes": 1226686,
    "sha256": "effcc834221597749ad4eb0f4dbb2fddd3cb871c00ca19f89c2081294b900705",
    "duration": 86.32,
    "recallBoundary": 74.800833,
    "cues": [
      {
        "start": 0.0,
        "end": 3.12
      },
      {
        "start": 3.12,
        "end": 12.24
      },
      {
        "start": 12.24,
        "end": 25.2
      },
      {
        "start": 25.2,
        "end": 29.16
      },
      {
        "start": 29.16,
        "end": 32.92
      },
      {
        "start": 32.92,
        "end": 36.36
      },
      {
        "start": 36.36,
        "end": 42.84
      },
      {
        "start": 42.84,
        "end": 47.88
      },
      {
        "start": 47.88,
        "end": 56.0
      },
      {
        "start": 56.0,
        "end": 68.8
      },
      {
        "start": 68.8,
        "end": 75.64
      },
      {
        "start": 75.64,
        "end": 86.32
      }
    ],
    "captions": {
      "de": [
        "Zahlen in Bilder übersetzen",
        "Das Major-System ordnet Ziffern Konsonantenlaute zu. Daraus bildest du ein Wort und stellst dir ein Bild vor. Dieses Bild soll sich wieder in die Zahl zurückübersetzen lassen.",
        "Du musst die Zuordnungen zuerst lernen. Ein Bild ohne verlässliche Rückübersetzung hilft beim Zahlenabruf nicht. Dieser Einstieg übt nur zwei Ziffern; die vorhandenen Major-Lektionen vermitteln weitere Zuordnungen.",
        "Lerne zunächst wenige feste Ziffer-Laut-Paare.",
        "Lies die Laute in der Reihenfolge der Ziffern.",
        "Ergänze passende Vokale zu einem bildhaften Wort.",
        "Prüfe die Konsonantenlaute: Enthält das Wort zusätzliche zählende Laute?",
        "Rufe aus dem Bild das Wort und aus dessen Lauten wieder die Zahl ab.",
        "1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Dose werden, englisch „tin“: t + n.",
        "Rückwärts ergibt t die 1 und n die 2, also wieder 12. Entscheidend sind die Konsonantenlaute des englischen Wortes „tin“, nicht nur die geschriebenen Buchstaben.",
        "Rufe das gehörte Beispiel ohne Vorlage ab. Erkläre die Bedeutung und den Weg der Merkhilfe.",
        "Übe die weiteren festen Zuordnungen in den bestehenden Major-Lektionen. Füge erst dann längere Zahlenfolgen hinzu. Prüfe bei jedem eigenen Bild den Rückweg zur exakten Zahl."
      ],
      "en": [
        "Turn numbers into images",
        "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
        "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
        "Learn a few fixed digit-to-sound pairs first.",
        "Read the sounds in the order of the digits.",
        "Add vowels to form a concrete word.",
        "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "Retrieve the word from the image and decode its sounds back into the number.",
        "1 → t/d; 2 → n. The number 12 can become an image of a tin: t + n.",
        "The vowel does not count here. In the reverse direction, t gives 1 and n gives 2, recovering 12. The sound pattern matters, not merely the written letters.",
        "Which number does the image of a tin encode? Explain the reverse path through the two consonant sounds.",
        "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number."
      ],
      "fr": [
        "Transformer les nombres en images",
        "Le système majeur associe des sons consonantiques aux chiffres. Tu formes un mot et imagines une image que tu peux ensuite reconvertir en nombre.",
        "Apprends d’abord les correspondances. Une image qui ne permet pas de retrouver exactement le nombre n’aide pas au rappel précis. Cette introduction utilise deux chiffres ; les leçons existantes du système majeur présentent d’autres correspondances.",
        "Apprends d’abord quelques correspondances fixes entre chiffres et sons.",
        "Lis les sons dans l’ordre des chiffres.",
        "Ajoute des voyelles pour former un mot concret.",
        "Vérifie si le mot contient d’autres consonnes prononcées qui coderaient des chiffres supplémentaires.",
        "Retrouve le mot à partir de l’image, puis le nombre à partir de ses sons.",
        "1 → t/d ; 2 → n. Le nombre 12 peut devenir l’image d’une boîte en métal, « tin » en anglais : t + n.",
        "Dans l’autre sens, t donne 1 et n donne 2 : on retrouve 12. Les sons consonantiques du mot anglais « tin » comptent, pas seulement les lettres.",
        "Rappelle l’exemple entendu sans modèle. Explique son sens et le chemin de l’aide-mémoire.",
        "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Vérifie que chaque image te ramène exactement au nombre voulu."
      ],
      "es": [
        "Convertir números en imágenes",
        "El sistema mayor asigna sonidos consonánticos a los dígitos. Úsalos para formar una palabra e imaginar una imagen que puedas volver a convertir en el número.",
        "Aprende los mapeos primero. Una imagen que no se pueda decodificar de forma fiable no ayuda en el recuerdo exacto del número. Esta introducción utiliza dos dígitos; las lecciones existentes sobre el Sistema Mayor enseñan mapeos adicionales.",
        "Aprende unos pocos pares fijos de dígito a sonido primero.",
        "Lee los sonidos en el orden de los dígitos.",
        "Agrega vocales para formar una palabra concreta.",
        "Verifica si la palabra contiene sonidos de consonantes adicionales que codificarían dígitos extra.",
        "Recupera la palabra desde la imagen y decodifica sus sonidos de nuevo en el número.",
        "1 → t/d; 2 → n. 12 → tin (lata) → t + n.",
        "La vocal no cuenta aquí. En la dirección inversa, t da 1 y n da 2, recuperando 12. Importa la secuencia sonora, no solo las letras escritas.",
        "tin: ¿Qué número representa esta palabra? Explica cómo lo recuperas a partir de sus dos consonantes.",
        "Practica más correspondencias fijas en las lecciones existentes del sistema mayor antes de trabajar con números largos. Comprueba que cada imagen permita recuperar exactamente el número previsto."
      ],
      "it": [
        "Trasforma i numeri in immagini",
        "Il sistema maggiore associa suoni consonantici alle cifre. Usali per formare una parola e immaginare un’immagine che puoi riconvertire nel numero.",
        "Impara prima le corrispondenze. Un'immagine che non può essere decodificata in modo affidabile non aiuta nella memorizzazione precisa dei numeri. Questa introduzione utilizza due cifre; i corsi esistenti sul Sistema Maggiore insegnano ulteriori mappature.",
        "Impara prima alcune corrispondenze fisse tra cifre e suoni.",
        "Leggi i suoni nell'ordine dei numeri.",
        "Aggiungi vocali per formare una parola concreta.",
        "Verifica se la parola contiene suoni consonantici aggiuntivi che potrebbero codificare cifre extra.",
        "Ricorda la parola dall'immagine e decodifica i suoni per ottenere il numero.",
        "1 → t/d; 2 → n. 12 → tin (scatola di latta) → t + n.",
        "La vocale non conta qui. Nel senso inverso, t dà 1 e n dà 2, ripristinando 12. La sequenza sonora conta, non solo le lettere scritte.",
        "tin: Quale numero rappresenta questa parola? Spiega come lo ricavi dai due suoni consonantici.",
        "Pratica ulteriori mappature fisse nei corsi esistenti sul Sistema Maggiore prima di affrontare numeri più lunghi. Verifica che ogni immagine che crei decodifichi esattamente il numero inteso."
      ],
      "pt": [
        "Transforme números em imagens",
        "O sistema maior associa sons consonânticos a dígitos. Use-os para formar uma palavra e imaginar uma imagem que possa voltar a converter no número.",
        "Aprenda os mapeamentos primeiro. Uma imagem que não pode ser decodificada com precisão não ajuda na memória exata dos números. Esta introdução utiliza dois dígitos; as aulas existentes sobre o Major ensinam mapeamentos adicionais.",
        "Aprenda alguns pares fixos de dígito para som. ",
        "Leia os sons na ordem dos dígitos.",
        "Adicione vogais para formar uma palavra concreta.",
        "Verifique se a palavra contém sons consoantes adicionais que representariam dígitos extras.",
        "Recupere a palavra a partir da imagem e decodifique seus sons de volta para o número.",
        "1 → t/d; 2 → n. 12 → tin (lata) → t + n.",
        "A vogal não conta aqui. Na direção inversa, t dá 1 e n dá 2, recuperando 12. A sequência sonora importa, não apenas as letras escritas.",
        "tin: Que número representa esta palavra? Explique como o recupera a partir dos dois sons consonânticos.",
        "Pratique mapeamentos fixos adicionais nas aulas existentes sobre o Major antes de lidar com números mais longos. Verifique que cada imagem que criar decodifique exatamente o número pretendido."
      ],
      "nl": [
        "Zet cijfers om in beelden",
        "Het Major-systeem koppelt medeklinkerklanken aan cijfers. Vorm daarmee een woord en een beeld dat je terug kunt vertalen naar het getal.",
        "Leer eerst de vaste koppelingen. Een beeld dat je niet betrouwbaar kunt ontcijferen, helpt niet bij het precies onthouden van getallen. Deze inleiding gebruikt twee cijfers; de bestaande Major-lessen leren verdere koppelingen.",
        "Leer eerst enkele vaste koppelingen tussen cijfers en klanken.",
        "Lees de klanken in de volgorde van de cijfers.",
        "Voeg klinkers toe om een concreet woord te vormen.",
        "Controleer of het woord extra medeklinkerklanken bevat die ook extra cijfers zouden weergeven.",
        "Haal het woord op vanuit het beeld en vertaal de klanken terug naar het getal.",
        "1 → t/d; 2 → n. 12 → tin (blik) → t + n.",
        "De klinker telt hier niet mee. Omgekeerd geeft t een 1 en n een 2: zo krijg je 12 terug. Het gaat om de klanken, niet alleen om de geschreven letters.",
        "tin: Welk getal stelt dit woord voor? Leg uit hoe je het via de twee medeklinkerklanken terugvindt.",
        "Oefen verdere vaste koppelingen in de bestaande Major-lessen voordat je langere getallen leert. Controleer of elk beeld precies het bedoelde getal oplevert."
      ],
      "tr": [
        "Sayıları görüntülere dönüştür",
        "Major sistemi, ünsüz sesleri rakamlarla eşleştirir. Bu seslerle bir sözcük oluştur ve tekrar sayıya çözülebilen bir görüntü hayal et.",
        "Önce eşleştirmeleri öğren. Güvenilir biçimde çözülemeyen bir görüntü, sayıyı tam hatırlamaya yardımcı olmaz. Bu giriş iki rakam kullanır; mevcut Major dersleri başka eşleştirmeler öğretir.",
        "Önce birkaç sabit rakam-ses eşleştirmesi öğren.",
        "Sesleri rakamların sırasıyla oku.",
        "Somut bir sözcük oluşturmak için ünlüler ekle.",
        "Sözcükte ek rakamları kodlayacak başka ünsüz sesler olup olmadığını kontrol et.",
        "Görüntüden sözcüğü hatırla ve seslerini yeniden sayıya çöz.",
        "1 → t/d; 2 → n. 12 → tin (teneke kutu) → t + n.",
        "Burada ünlü sayılmaz. Ters yönde t, 1’i; n, 2’yi verir ve 12 geri elde edilir. Yalnızca yazılı harfler değil, ses dizisi önemlidir.",
        "tin: Bu sözcük hangi sayıyı temsil ediyor? İki ünsüz ses üzerinden sayıyı nasıl bulduğunu açıkla.",
        "Daha uzun sayılara geçmeden önce mevcut Major derslerinde diğer sabit eşleştirmeleri çalış. Oluşturduğun her görüntünün tam olarak amaçlanan sayıya çözüldüğünü kontrol et."
      ],
      "ar": [
        "حوّل الأعداد إلى صور",
        "يربط نظام ماجور أصوات الحروف الساكنة بالأرقام. استخدمها لتكوين كلمة وصورة ذهنية يمكن فكّها للعودة إلى العدد.",
        "تعلّم الروابط أولًا. الصورة التي لا تستطيع فكّها بثقة لا تساعد على تذكّر العدد بدقة. تستخدم هذه المقدمة رقمين؛ وتعلّم دروس ماجور الموجودة روابط إضافية.",
        "تعلّم أولًا بضعة روابط ثابتة بين الأرقام والأصوات.",
        "اقرأ الأصوات حسب ترتيب الأرقام.",
        "أضف أصوات العلّة لتكوين كلمة تشير إلى شيء محسوس.",
        "تحقّق من وجود أصوات ساكنة إضافية قد ترمز إلى أرقام زائدة.",
        "استرجع الكلمة من الصورة وفكّ أصواتها للعودة إلى العدد.",
        "1 → t/d; 2 → n. 12 → tin (علبة معدنية) → t + n.",
        "صوت العلّة لا يُحسب هنا. في الاتجاه العكسي يعطي t الرقم 1 ويعطي n الرقم 2، فنستعيد 12. المهم هو الأصوات، وليس الحروف المكتوبة فقط.",
        "tin: ما العدد الذي تمثّله هذه الكلمة؟ اشرح كيف تستعيده من الصوتين الساكنين.",
        "تدرّب على روابط ثابتة إضافية في دروس ماجور الموجودة قبل العمل على أعداد أطول. تحقّق من أن كل صورة تعيد العدد المقصود بدقة."
      ],
      "zh": [
        "把数字变成图像",
        "Major 编码系统把辅音与数字对应起来。用这些辅音组成词，再形成能反向还原出数字的图像。",
        "先学会固定对应关系。不能可靠还原的图像无助于准确记住数字。本入门练习使用两个数字；已有的 Major 课程会介绍更多对应关系。",
        "先学会几个固定的数字与辅音对应关系。",
        "按数字顺序读取音素。",
        "加上元音形成一个具体的词。",
        "检查这个词中是否包含额外的辅音音素，这些音素可能对应额外的数字。",
        "从图像中提取这个词，并将其中的音素解码回数字。",
        "1 → t/d; 2 → n. 12 → tin (金属罐) → t + n.",
        "这里元音不计。在反向过程中，t对应1，n对应2，从而恢复出12。音素的模式比单纯的文字更重要。",
        "tin: 这个词代表哪个数字？请说明怎样通过两个辅音还原数字。",
        "在处理更长的数字之前，先在已有的 Major 课程中练习更多固定对应关系。确认每幅图像都能准确还原成原定的数字。"
      ],
      "ja": [
        "数字をイメージに変える",
        "Major法は子音の音を数字に対応させる方法です。その音で単語を作り、元の数字に戻せるイメージを思い浮かべます。",
        "先に対応関係を覚えましょう。確実に数字に戻せないイメージは、正確な数字の記憶に役立ちません。ここでは2桁を扱います。既存のMajor法のレッスンでは、さらに多くの対応を学べます。",
        "まず数字と子音の決まった対応をいくつか覚えましょう。",
        "数字の順に音を読む。",
        "母音を加えて、具体的な物を表す単語を作りましょう。",
        "余計な数字を表す子音が単語に含まれていないか、確認しましょう。",
        "イメージから単語を思い出して、その音を数字に戻す。",
        "1 → t/d; 2 → n. 12 → tin (金属の缶) → t + n.",
        "ここでは母音は数えません。逆にたどるとtは1、nは2なので、12に戻ります。文字だけでなく、子音の並びが重要です。",
        "tin: この単語はどの数字を表しますか。2つの子音から数字に戻す手順を説明しましょう。",
        "長い数字を扱う前に、既存のMajor法のレッスンで他の固定した対応も練習しましょう。作ったイメージから、意図した数字を正確に取り出せるか確認します。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "self-explanation",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-self-explanation-de-visual-5995d5e1f69c.mp4",
    "bytes": 1778132,
    "sha256": "5995d5e1f69c0bced0a0cde903c17715566d91f5e326f14b84f6b92d40a13a65",
    "duration": 122.08,
    "recallBoundary": 105.428708,
    "cues": [
      {
        "start": 0.0,
        "end": 2.96
      },
      {
        "start": 2.96,
        "end": 14.64
      },
      {
        "start": 14.64,
        "end": 28.52
      },
      {
        "start": 28.52,
        "end": 33.0
      },
      {
        "start": 33.0,
        "end": 41.6
      },
      {
        "start": 41.6,
        "end": 46.36
      },
      {
        "start": 46.36,
        "end": 52.96
      },
      {
        "start": 52.96,
        "end": 58.28
      },
      {
        "start": 58.28,
        "end": 62.96
      },
      {
        "start": 62.96,
        "end": 81.12
      },
      {
        "start": 81.12,
        "end": 96.0
      },
      {
        "start": 96.0,
        "end": 106.4
      },
      {
        "start": 106.4,
        "end": 122.08
      }
    ],
    "captions": {
      "de": [
        "Zusammenhänge selbst erklären",
        "Du erklärst mit eigenen Worten, warum ein Schritt sinnvoll ist oder wie zwei Aussagen zusammenhängen. So kannst du Verständnislücken entdecken, die beim bloßen Lesen unauffällig bleiben.",
        "Eine flüssige Erklärung kann trotzdem falsch sein. Prüfe sie an einer zuverlässigen Vorlage und kennzeichne Unsicherheit. Die Methode ergänzt das Üben; sie ersetzt weder Fachwissen noch eine Prüfung deiner Erklärung.",
        "Wähle einen überschaubaren Zusammenhang, den du verstehen möchtest.",
        "Frage: Warum folgt dieser Schritt? Was bleibt gleich? Was würde sich bei anderen Bedingungen ändern?",
        "Formuliere deine Erklärung ohne die Vorlage zu kopieren.",
        "Vergleiche sie mit der Begründung im Original. Trenne gesicherte Aussagen von Vermutungen.",
        "Korrigiere Lücken und wende die Erklärung auf ein ähnliches Beispiel an.",
        "Erkläre den Zusammenhang später noch einmal ohne Vorlage.",
        "Drei Viertel sind gleich viel wie sechs Achtel: 3/4 = 6/8. Wenn jedes der vier gleich großen Teile noch einmal halbiert wird, entstehen acht gleich große Teile. Die drei ausgewählten Viertel bestehen dann aus sechs Achteln. Die ausgewählte Menge bleibt gleich.",
        "„Oben und unten mal zwei“ beschreibt eine Rechenregel. Die Erklärung mit den halbierten Teilen begründet, warum sich der Wert nicht ändert. Zum Übertragen kannst du überlegen, weshalb 2/3 und 4/6 denselben Anteil beschreiben.",
        "Erkläre ohne Vorlage, warum 3/4 und 6/8 gleich viel sind. Übertrage die Begründung anschließend auf 2/3 und 4/6.",
        "Nimm einen Schritt aus deinem Lernstoff und erkläre, warum er gilt. Suche ein ähnliches Beispiel und prüfe deine Erklärung daran. Wenn du die Begründung nicht verlässlich prüfen kannst, halte die offene Frage fest, statt Sicherheit vorzutäuschen."
      ],
      "en": [
        "Explain relationships yourself",
        "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
        "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
        "Choose a manageable relationship you want to understand.",
        "Ask why the step follows, what stays the same and what would change under different conditions.",
        "Formulate an explanation without copying the source.",
        "Compare it with the original reasoning. Separate established facts from guesses.",
        "Correct gaps and apply your explanation to a similar example.",
        "Explain the relationship again later without looking.",
        "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
        "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
        "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
        "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain."
      ],
      "fr": [
        "Expliquer soi-même les relations",
        "Explique avec tes propres mots pourquoi une étape a du sens ou comment deux affirmations sont liées. Tu peux ainsi découvrir des lacunes qui passent inaperçues à la lecture.",
        "Une explication fluide peut être fausse. Vérifie-la dans une source fiable et reconnais les incertitudes. Cette méthode accompagne la pratique ; elle ne remplace ni les connaissances du sujet ni la vérification.",
        "Choisis une relation limitée que tu veux comprendre.",
        "Demande-toi pourquoi l’étape suit, ce qui reste identique et ce qui changerait dans d’autres conditions.",
        "Formule une explication sans copier la source.",
        "Compare avec le raisonnement original. Distingue les faits établis des suppositions.",
        "Corrige les lacunes et applique ton explication à un exemple similaire.",
        "Explique de nouveau la relation plus tard, sans regarder.",
        "Trois quarts valent six huitièmes : 3/4 = 6/8. En coupant chacune des quatre parts égales en deux, on obtient huit parts égales. Les trois quarts sélectionnés deviennent six huitièmes. La quantité sélectionnée reste identique.",
        "« Multiplier le numérateur et le dénominateur par deux » décrit une règle. Couper les parts égales en deux explique pourquoi la valeur ne change pas. Pour transférer l’idée, cherche pourquoi 2/3 et 4/6 représentent la même proportion.",
        "Explique sans modèle pourquoi 3/4 et 6/8 sont égaux. Applique ensuite ton raisonnement à 2/3 et 4/6.",
        "Choisis une étape de ton cours et explique pourquoi elle est valable. Trouve un exemple similaire pour vérifier ton raisonnement. Si tu ne peux pas vérifier de façon fiable, note la question ouverte plutôt que de prétendre être certain."
      ],
      "es": [
        "Explica las relaciones por ti mismo",
        "Explica en tus propias palabras por qué un paso tiene sentido o cómo se relacionan dos afirmaciones. Esto puede revelar vacíos en el entendimiento que son fáciles de pasar por alto al leer.",
        "Una explicación fluida puede seguir siendo incorrecta. Verifícala contra una fuente confiable y reconoce la incertidumbre. Este método apoya la práctica; no reemplaza el conocimiento del tema ni la verificación de tu explicación.",
        "Elige una relación manejable que quieras entender.",
        "Pregúntate por qué se deduce ese paso, qué permanece igual y qué cambiaría en otras condiciones.",
        "Formula una explicación sin copiar la fuente.",
        "Compara tu explicación con el razonamiento original. Separa hechos establecidos de suposiciones.",
        "Corrige los vacíos y aplica tu explicación a un ejemplo similar.",
        "Explica nuevamente la relación más tarde sin mirar.",
        "Tres cuartos equivalen a seis octavos: 3/4 = 6/8. Al dividir por la mitad cada una de las cuatro partes iguales, se obtienen ocho partes iguales. Los tres cuartos seleccionados se convierten en seis octavos. La cantidad seleccionada no cambia.",
        "«Multiplicar el numerador y el denominador por dos» describe una regla. Dividir en partes iguales explica por qué el valor no cambia. Para transferir la idea, piensa por qué 2/3 y 4/6 representan la misma proporción.",
        "Explica sin mirar por qué 3/4 y 6/8 son iguales. Luego aplica tu razonamiento a 2/3 y 4/6.",
        "Elige un paso en tu material de estudio y explica por qué es válido. Encuentra un ejemplo similar y verifica tu explicación con él. Si no puedes verificar el razonamiento de forma confiable, registra la pregunta abierta en lugar de fingir certeza."
      ],
      "it": [
        "Spiega i collegamenti con parole tue",
        "Spiega con parole tue perché un passaggio ha senso o come si collegano due affermazioni. Puoi così scoprire lacune nella comprensione che sfuggono durante la lettura.",
        "Una spiegazione fluida può comunque essere errata. Controllala contro una fonte affidabile e riconosci l'incertezza. Questo metodo favorisce la pratica; non sostituisce conoscenze specifiche o il controllo della tua spiegazione.",
        "Scegli un collegamento circoscritto che vuoi capire.",
        "Chiediti perché il passaggio sia giustificato, cosa rimane costante e cosa cambierebbe in condizioni diverse.",
        "Formula una spiegazione senza copiare il testo originale.",
        "Confronta la spiegazione con il ragionamento originale. Distingui i fatti accertati dalle ipotesi.",
        "Correggi le lacune e applica la tua spiegazione a un esempio simile.",
        "Spiega nuovamente il collegamento più tardi, senza guardare.",
        "Tre quarti equivalgono a sei ottavi: 3/4 = 6/8. Dividendo a metà ciascuna delle quattro parti uguali, si ottengono otto parti uguali. I tre quarti selezionati diventano sei ottavi. La quantità selezionata rimane la stessa.",
        "«Moltiplicare numeratore e denominatore per due» descrive una regola. Dividere a metà le parti uguali spiega perché il valore non cambia. Applica l’idea: perché 2/3 e 4/6 rappresentano la stessa proporzione?",
        "Spiega senza guardare perché 3/4 e 6/8 sono uguali. Poi applica il tuo ragionamento a 2/3 e 4/6.",
        "Scegli un passaggio del materiale di studio e spiega perché è valido. Trova un esempio simile e verifica la tua spiegazione con esso. Se non riesci a verificare il ragionamento in modo affidabile, registra la domanda aperta invece di fingerti certo."
      ],
      "pt": [
        "Explique as relações com as suas palavras",
        "Explique com as suas palavras por que um passo faz sentido ou como duas afirmações se relacionam. Isso pode revelar lacunas de compreensão que passam despercebidas durante a leitura.",
        "Uma explicação fluente pode ainda estar errada. Verifique contra uma fonte confiável e reconheça a incerteza. Esse método apoia o treinamento; não substitui o conhecimento subjacente ou a verificação da explicação.",
        "Escolha uma relação que seja viável de entender.",
        "Pergunte por que o passo se segue, o que permanece o mesmo e o que mudaria sob condições diferentes.",
        "Formule uma explicação sem copiar a fonte.",
        "Compare com o raciocínio original. Separe fatos estabelecidos de especulações.",
        "Corrija lacunas e aplique sua explicação a um exemplo semelhante.",
        "Explique novamente a relação mais tarde, sem olhar.",
        "Três quartos equivalem a seis oitavos: 3/4 = 6/8. Ao dividir ao meio cada uma das quatro partes iguais, obtêm-se oito partes iguais. Os três quartos selecionados passam a ser seis oitavos. A quantidade selecionada permanece a mesma.",
        "«Multiplicar o numerador e o denominador por dois» descreve uma regra. Dividir ao meio as partes iguais explica por que o valor não muda. Aplique a ideia: por que 2/3 e 4/6 representam a mesma proporção?",
        "Explique sem olhar por que 3/4 e 6/8 são iguais. Depois, aplique o raciocínio a 2/3 e 4/6.",
        "Escolha um passo no seu material de estudo e explique por que ele é válido. Encontre um exemplo semelhante e verifique sua explicação com ele. Se não conseguir validar o raciocínio com confiança, registre a pergunta aberta em vez de fingir certeza."
      ],
      "nl": [
        "Verklaar de relatie zelf",
        "Leg in eigen woorden uit waarom een stap logisch is of hoe twee uitspraken samenhangen. Zo kun je hiaten in je begrip ontdekken die tijdens het lezen onopgemerkt blijven.",
        "Een vlotte uitleg kan nog steeds fout zijn. Controleer die aan de hand van een betrouwbare bron en erken onzekerheid. De methode ondersteunt oefenen, maar vervangt vakkennis of controle niet.",
        "Kies een beheersbare relatie die je wilt begrijpen.",
        "Vraag jezelf waarom de stap volgt, wat gelijk blijft en wat er verandert onder andere voorwaarden.",
        "Formuleer een uitleg zonder de bron te kopiëren.",
        "Vergelijk met de oorspronkelijke redenering. Maak onderscheid tussen vaststaande feiten en vermoedens.",
        "Corrigeer hiaten en pas je uitleg toe op een vergelijkbaar voorbeeld.",
        "Verklaar de relatie opnieuw later zonder te kijken.",
        "Drie kwart is gelijk aan zes achtsten: 3/4 = 6/8. Het halveren van elk van de vier gelijke delen maakt acht gelijke delen. De drie geselecteerde kwartstukken bestaan nu uit zes achtsten. Het geselecteerde deel blijft hetzelfde.",
        "‘Vermenigvuldig de boven- en onderkant met twee’ is een regel. Het halveren van de gelijke delen verklaart waarom de waarde niet verandert. Om het idee over te dragen, overweeg waarom 2/3 en 4/6 dezelfde verhouding tonen.",
        "Leg zonder te kijken uit waarom 3/4 en 6/8 gelijk zijn. Pas de redenering daarna toe op 2/3 en 4/6.",
        "Kies een stap uit je leerstof en verklaar waarom die geldt. Zoek een vergelijkbaar voorbeeld en controleer je uitleg daarbij. Als je de redenering niet betrouwbaar kunt bevestigen, noteer dan de open vraag in plaats van te suggereren dat je zeker bent."
      ],
      "tr": [
        "İlişkileri kendi sözlerinle açıkla",
        "Bir adımın neden anlamlı olduğunu veya iki ifadenin nasıl ilişkili olduğunu kendi sözlerinle açıkla. Böylece okurken gözden kaçan anlama eksiklerini fark edebilirsin.",
        "Akıcı bir açıklama yine de yanlış olabilir. Güvenilir bir kaynakla kontrol et ve belirsizlikleri kabul et. Bu yöntem çalışmayı destekler; konu bilgisinin veya açıklamayı kontrol etmenin yerini almaz.",
        "Anlamak istediğin, kapsamı sınırlı bir ilişki seç.",
        "Adımın neden geçerli olduğunu, neyin aynı kaldığını ve farklı koşullarda neyin değişeceğini sor.",
        "Kaynağı kopyalamadan bir açıklama oluştur.",
        "Asıl akıl yürütmeyle karşılaştır. Doğrulanmış bilgileri tahminlerden ayır.",
        "Eksikleri düzelt ve açıklamanı benzer bir örneğe uygula.",
        "İlişkiyi daha sonra bakmadan yeniden açıkla.",
        "Dörtte üç, sekizde altıya eşittir: 3/4 = 6/8. Dört eşit parçanın her birini ikiye bölersen sekiz eşit parça oluşur. Seçili üç çeyrek artık altı sekizlik parçadan oluşur. Seçilen miktar aynı kalır.",
        "«Payı ve paydayı ikiyle çarp» bir kuralı anlatır. Eşit parçaları ikiye bölmek, değerin neden değişmediğini açıklar. Bu fikri başka bir örneğe uygula: 2/3 ve 4/6 neden aynı oranı gösterir?",
        "3/4 ve 6/8’in neden eşit olduğunu bakmadan açıkla. Sonra aynı akıl yürütmeyi 2/3 ve 4/6’ya uygula.",
        "Öğrenme malzemenden bir adım seç ve neden geçerli olduğunu açıkla. Benzer bir örnek bulup açıklamanı onunla kontrol et. Akıl yürütmeyi güvenilir biçimde doğrulayamıyorsan kesinmiş gibi davranmak yerine açık soruyu kaydet."
      ],
      "ar": [
        "اشرح العلاقات بنفسك",
        "اشرح بكلماتك لماذا تكون خطوة منطقية أو كيف ترتبط عبارتان. قد يكشف ذلك ثغرات في الفهم لا تلاحظها أثناء القراءة.",
        "قد يكون الشرح سلسًا لكنه خاطئ. قارنه بمصدر موثوق واعترف بما لا تعرفه. تدعم هذه الطريقة التدريب، لكنها لا تحل محل المعرفة بالموضوع أو التحقّق من الشرح.",
        "اختر علاقة محددة تريد فهمها.",
        "اسأل لماذا تصح الخطوة، وما الذي يبقى ثابتًا، وما الذي يتغير في ظروف مختلفة.",
        "صغ شرحًا دون نسخ المصدر.",
        "قارن بالاستدلال الأصلي. ميّز الحقائق المثبتة عن التخمينات.",
        "صحّح الثغرات وطبّق شرحك على مثال مشابه.",
        "اشرح العلاقة لاحقًا مرة أخرى دون النظر إلى المصدر.",
        "ثلاثة أرباع تساوي ستة أثمان: 3/4 = 6/8. تقسيم كل جزء من الأجزاء الأربعة المتساوية إلى نصفين يعطي ثمانية أجزاء متساوية. تصبح الأرباع الثلاثة المختارة ستة أثمان، وتبقى الكمية المختارة نفسها.",
        "«اضرب البسط والمقام في اثنين» تصف قاعدة. تقسيم الأجزاء المتساوية إلى نصفين يفسّر ثبات القيمة. طبّق الفكرة: لماذا تعبّر 2/3 و4/6 عن النسبة نفسها؟",
        "اشرح دون النظر لماذا تتساوى 3/4 و6/8. ثم طبّق الاستدلال على 2/3 و4/6.",
        "اختر خطوة من مادتك واشرح سبب صحتها. تحقّق من شرحك بمثال مشابه. إذا تعذّر التحقّق من الاستدلال بثقة، فسجّل السؤال المفتوح بدل ادّعاء اليقين."
      ],
      "zh": [
        "自己解释关系",
        "用你自己的话说明某一步为何合理，或两个陈述之间的联系。这能揭示阅读时容易忽略的理解漏洞。",
        "流畅的解释仍可能出错。需对照可靠来源进行验证，并承认不确定性。此方法有助于练习，但不能替代专业知识或对解释的核查。",
        "选择一个你希望理解的、可操作的关系。",
        "追问这一步为何成立，什么保持不变，以及在不同条件下会发生什么变化。",
        "不抄袭原文，自行提出解释。",
        "与原文推理进行对比，区分已确立的事实与猜测。",
        "修正遗漏部分，并将其解释应用到相似的例子上。",
        "稍后在不看的情况下再次解释该关系。",
        "四分之三等于八分之六：3/4 = 6/8。把四个相等部分中的每一份再分成两半，就得到八个相等部分。原先选中的三份现在变成六份，选中的总量没有改变。",
        "“分子和分母都乘以二”是在描述规则。把每份等分为两半，才能解释数值为什么不变。再想一想：为什么 2/3 和 4/6 表示同样的比例？",
        "在不看的情况下解释为何3/4和6/8相等。然后将你的推理应用到2/3和4/6上。",
        "选择学习材料中的某一步，解释它为何成立。找到一个相似的例子并用它来验证你的解释。如果无法可靠验证推理，就记录下未解决的问题，而不是假装确定。"
      ],
      "ja": [
        "つながりを自分の言葉で説明する",
        "ある手順がなぜ妥当なのか、2つの説明がどうつながるのかを、自分の言葉で説明します。読むだけでは見逃す理解の抜けに気づけます。",
        "流暢な説明でも間違っていることがあります。信頼できる資料で確認し、不確かな点を認めましょう。この方法は学習を助けますが、知識や説明の確認に代わるものではありません。",
        "理解したい、範囲の限られた関係を選びましょう。",
        "なぜその手順が成り立つのか、何が変わらず、条件が違えば何が変わるのかを問いましょう。",
        "資料を写さず、自分で説明を組み立てましょう。",
        "元の理由づけと比べ、確かめられた事実と推測を分けましょう。",
        "抜けを修正し、似た例に説明を当てはめましょう。",
        "後で、資料を見ずにもう一度説明しましょう。",
        "4分の3は8分の6と同じです：3/4 = 6/8。4つの等しい部分をそれぞれ半分にすると、8つの等しい部分になります。選んだ3つの部分は6つになり、選んだ量は変わりません。",
        "「分子と分母を2倍する」は規則の説明です。等しい部分を半分に分けることで、値が変わらない理由が分かります。2/3と4/6が同じ割合を表す理由にも当てはめてみましょう。",
        "見ずに、3/4と6/8が等しい理由を説明しましょう。次に同じ考え方を2/3と4/6に当てはめましょう。",
        "教材の手順を1つ選び、成り立つ理由を説明しましょう。似た例で確かめます。理由を確実に検証できなければ、分かったふりをせず、未解決の疑問として記録しましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "self-explanation",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-self-explanation-en-visual-a2f6b2ed1351.mp4",
    "bytes": 1547851,
    "sha256": "a2f6b2ed1351926199d5cd5b14145ff483a654eeda49b272fa65cf069a0d9cf6",
    "duration": 105.44,
    "recallBoundary": 89.972583,
    "cues": [
      {
        "start": 0.0,
        "end": 3.0
      },
      {
        "start": 3.0,
        "end": 12.8
      },
      {
        "start": 12.8,
        "end": 25.08
      },
      {
        "start": 25.08,
        "end": 29.32
      },
      {
        "start": 29.32,
        "end": 36.04
      },
      {
        "start": 36.04,
        "end": 40.32
      },
      {
        "start": 40.32,
        "end": 46.44
      },
      {
        "start": 46.44,
        "end": 51.4
      },
      {
        "start": 51.4,
        "end": 55.8
      },
      {
        "start": 55.8,
        "end": 69.28
      },
      {
        "start": 69.28,
        "end": 83.0
      },
      {
        "start": 83.0,
        "end": 90.92
      },
      {
        "start": 90.92,
        "end": 105.44
      }
    ],
    "captions": {
      "de": [
        "Zusammenhänge selbst erklären",
        "Du erklärst mit eigenen Worten, warum ein Schritt sinnvoll ist oder wie zwei Aussagen zusammenhängen. So kannst du Verständnislücken entdecken, die beim bloßen Lesen unauffällig bleiben.",
        "Eine flüssige Erklärung kann trotzdem falsch sein. Prüfe sie an einer zuverlässigen Vorlage und kennzeichne Unsicherheit. Die Methode ergänzt das Üben; sie ersetzt weder Fachwissen noch eine Prüfung deiner Erklärung.",
        "Wähle einen überschaubaren Zusammenhang, den du verstehen möchtest.",
        "Frage: Warum folgt dieser Schritt? Was bleibt gleich? Was würde sich bei anderen Bedingungen ändern?",
        "Formuliere deine Erklärung ohne die Vorlage zu kopieren.",
        "Vergleiche sie mit der Begründung im Original. Trenne gesicherte Aussagen von Vermutungen.",
        "Korrigiere Lücken und wende die Erklärung auf ein ähnliches Beispiel an.",
        "Erkläre den Zusammenhang später noch einmal ohne Vorlage.",
        "Drei Viertel sind gleich viel wie sechs Achtel: 3/4 = 6/8. Wenn jedes der vier gleich großen Teile noch einmal halbiert wird, entstehen acht gleich große Teile. Die drei ausgewählten Viertel bestehen dann aus sechs Achteln. Die ausgewählte Menge bleibt gleich.",
        "„Oben und unten mal zwei“ beschreibt eine Rechenregel. Die Erklärung mit den halbierten Teilen begründet, warum sich der Wert nicht ändert. Zum Übertragen kannst du überlegen, weshalb 2/3 und 4/6 denselben Anteil beschreiben.",
        "Erkläre ohne Vorlage, warum 3/4 und 6/8 gleich viel sind. Übertrage die Begründung anschließend auf 2/3 und 4/6.",
        "Nimm einen Schritt aus deinem Lernstoff und erkläre, warum er gilt. Suche ein ähnliches Beispiel und prüfe deine Erklärung daran. Wenn du die Begründung nicht verlässlich prüfen kannst, halte die offene Frage fest, statt Sicherheit vorzutäuschen."
      ],
      "en": [
        "Explain relationships yourself",
        "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
        "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
        "Choose a manageable relationship you want to understand.",
        "Ask why the step follows, what stays the same and what would change under different conditions.",
        "Formulate an explanation without copying the source.",
        "Compare it with the original reasoning. Separate established facts from guesses.",
        "Correct gaps and apply your explanation to a similar example.",
        "Explain the relationship again later without looking.",
        "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
        "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
        "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
        "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain."
      ],
      "fr": [
        "Expliquer soi-même les relations",
        "Explique avec tes propres mots pourquoi une étape a du sens ou comment deux affirmations sont liées. Tu peux ainsi découvrir des lacunes qui passent inaperçues à la lecture.",
        "Une explication fluide peut être fausse. Vérifie-la dans une source fiable et reconnais les incertitudes. Cette méthode accompagne la pratique ; elle ne remplace ni les connaissances du sujet ni la vérification.",
        "Choisis une relation limitée que tu veux comprendre.",
        "Demande-toi pourquoi l’étape suit, ce qui reste identique et ce qui changerait dans d’autres conditions.",
        "Formule une explication sans copier la source.",
        "Compare avec le raisonnement original. Distingue les faits établis des suppositions.",
        "Corrige les lacunes et applique ton explication à un exemple similaire.",
        "Explique de nouveau la relation plus tard, sans regarder.",
        "Trois quarts valent six huitièmes : 3/4 = 6/8. En coupant chacune des quatre parts égales en deux, on obtient huit parts égales. Les trois quarts sélectionnés deviennent six huitièmes. La quantité sélectionnée reste identique.",
        "« Multiplier le numérateur et le dénominateur par deux » décrit une règle. Couper les parts égales en deux explique pourquoi la valeur ne change pas. Pour transférer l’idée, cherche pourquoi 2/3 et 4/6 représentent la même proportion.",
        "Explique sans modèle pourquoi 3/4 et 6/8 sont égaux. Applique ensuite ton raisonnement à 2/3 et 4/6.",
        "Choisis une étape de ton cours et explique pourquoi elle est valable. Trouve un exemple similaire pour vérifier ton raisonnement. Si tu ne peux pas vérifier de façon fiable, note la question ouverte plutôt que de prétendre être certain."
      ],
      "es": [
        "Explica las relaciones por ti mismo",
        "Explica en tus propias palabras por qué un paso tiene sentido o cómo se relacionan dos afirmaciones. Esto puede revelar vacíos en el entendimiento que son fáciles de pasar por alto al leer.",
        "Una explicación fluida puede seguir siendo incorrecta. Verifícala contra una fuente confiable y reconoce la incertidumbre. Este método apoya la práctica; no reemplaza el conocimiento del tema ni la verificación de tu explicación.",
        "Elige una relación manejable que quieras entender.",
        "Pregúntate por qué se deduce ese paso, qué permanece igual y qué cambiaría en otras condiciones.",
        "Formula una explicación sin copiar la fuente.",
        "Compara tu explicación con el razonamiento original. Separa hechos establecidos de suposiciones.",
        "Corrige los vacíos y aplica tu explicación a un ejemplo similar.",
        "Explica nuevamente la relación más tarde sin mirar.",
        "Tres cuartos equivalen a seis octavos: 3/4 = 6/8. Al dividir por la mitad cada una de las cuatro partes iguales, se obtienen ocho partes iguales. Los tres cuartos seleccionados se convierten en seis octavos. La cantidad seleccionada no cambia.",
        "«Multiplicar el numerador y el denominador por dos» describe una regla. Dividir en partes iguales explica por qué el valor no cambia. Para transferir la idea, piensa por qué 2/3 y 4/6 representan la misma proporción.",
        "Explica sin mirar por qué 3/4 y 6/8 son iguales. Luego aplica tu razonamiento a 2/3 y 4/6.",
        "Elige un paso en tu material de estudio y explica por qué es válido. Encuentra un ejemplo similar y verifica tu explicación con él. Si no puedes verificar el razonamiento de forma confiable, registra la pregunta abierta en lugar de fingir certeza."
      ],
      "it": [
        "Spiega i collegamenti con parole tue",
        "Spiega con parole tue perché un passaggio ha senso o come si collegano due affermazioni. Puoi così scoprire lacune nella comprensione che sfuggono durante la lettura.",
        "Una spiegazione fluida può comunque essere errata. Controllala contro una fonte affidabile e riconosci l'incertezza. Questo metodo favorisce la pratica; non sostituisce conoscenze specifiche o il controllo della tua spiegazione.",
        "Scegli un collegamento circoscritto che vuoi capire.",
        "Chiediti perché il passaggio sia giustificato, cosa rimane costante e cosa cambierebbe in condizioni diverse.",
        "Formula una spiegazione senza copiare il testo originale.",
        "Confronta la spiegazione con il ragionamento originale. Distingui i fatti accertati dalle ipotesi.",
        "Correggi le lacune e applica la tua spiegazione a un esempio simile.",
        "Spiega nuovamente il collegamento più tardi, senza guardare.",
        "Tre quarti equivalgono a sei ottavi: 3/4 = 6/8. Dividendo a metà ciascuna delle quattro parti uguali, si ottengono otto parti uguali. I tre quarti selezionati diventano sei ottavi. La quantità selezionata rimane la stessa.",
        "«Moltiplicare numeratore e denominatore per due» descrive una regola. Dividere a metà le parti uguali spiega perché il valore non cambia. Applica l’idea: perché 2/3 e 4/6 rappresentano la stessa proporzione?",
        "Spiega senza guardare perché 3/4 e 6/8 sono uguali. Poi applica il tuo ragionamento a 2/3 e 4/6.",
        "Scegli un passaggio del materiale di studio e spiega perché è valido. Trova un esempio simile e verifica la tua spiegazione con esso. Se non riesci a verificare il ragionamento in modo affidabile, registra la domanda aperta invece di fingerti certo."
      ],
      "pt": [
        "Explique as relações com as suas palavras",
        "Explique com as suas palavras por que um passo faz sentido ou como duas afirmações se relacionam. Isso pode revelar lacunas de compreensão que passam despercebidas durante a leitura.",
        "Uma explicação fluente pode ainda estar errada. Verifique contra uma fonte confiável e reconheça a incerteza. Esse método apoia o treinamento; não substitui o conhecimento subjacente ou a verificação da explicação.",
        "Escolha uma relação que seja viável de entender.",
        "Pergunte por que o passo se segue, o que permanece o mesmo e o que mudaria sob condições diferentes.",
        "Formule uma explicação sem copiar a fonte.",
        "Compare com o raciocínio original. Separe fatos estabelecidos de especulações.",
        "Corrija lacunas e aplique sua explicação a um exemplo semelhante.",
        "Explique novamente a relação mais tarde, sem olhar.",
        "Três quartos equivalem a seis oitavos: 3/4 = 6/8. Ao dividir ao meio cada uma das quatro partes iguais, obtêm-se oito partes iguais. Os três quartos selecionados passam a ser seis oitavos. A quantidade selecionada permanece a mesma.",
        "«Multiplicar o numerador e o denominador por dois» descreve uma regra. Dividir ao meio as partes iguais explica por que o valor não muda. Aplique a ideia: por que 2/3 e 4/6 representam a mesma proporção?",
        "Explique sem olhar por que 3/4 e 6/8 são iguais. Depois, aplique o raciocínio a 2/3 e 4/6.",
        "Escolha um passo no seu material de estudo e explique por que ele é válido. Encontre um exemplo semelhante e verifique sua explicação com ele. Se não conseguir validar o raciocínio com confiança, registre a pergunta aberta em vez de fingir certeza."
      ],
      "nl": [
        "Verklaar de relatie zelf",
        "Leg in eigen woorden uit waarom een stap logisch is of hoe twee uitspraken samenhangen. Zo kun je hiaten in je begrip ontdekken die tijdens het lezen onopgemerkt blijven.",
        "Een vlotte uitleg kan nog steeds fout zijn. Controleer die aan de hand van een betrouwbare bron en erken onzekerheid. De methode ondersteunt oefenen, maar vervangt vakkennis of controle niet.",
        "Kies een beheersbare relatie die je wilt begrijpen.",
        "Vraag jezelf waarom de stap volgt, wat gelijk blijft en wat er verandert onder andere voorwaarden.",
        "Formuleer een uitleg zonder de bron te kopiëren.",
        "Vergelijk met de oorspronkelijke redenering. Maak onderscheid tussen vaststaande feiten en vermoedens.",
        "Corrigeer hiaten en pas je uitleg toe op een vergelijkbaar voorbeeld.",
        "Verklaar de relatie opnieuw later zonder te kijken.",
        "Drie kwart is gelijk aan zes achtsten: 3/4 = 6/8. Het halveren van elk van de vier gelijke delen maakt acht gelijke delen. De drie geselecteerde kwartstukken bestaan nu uit zes achtsten. Het geselecteerde deel blijft hetzelfde.",
        "‘Vermenigvuldig de boven- en onderkant met twee’ is een regel. Het halveren van de gelijke delen verklaart waarom de waarde niet verandert. Om het idee over te dragen, overweeg waarom 2/3 en 4/6 dezelfde verhouding tonen.",
        "Leg zonder te kijken uit waarom 3/4 en 6/8 gelijk zijn. Pas de redenering daarna toe op 2/3 en 4/6.",
        "Kies een stap uit je leerstof en verklaar waarom die geldt. Zoek een vergelijkbaar voorbeeld en controleer je uitleg daarbij. Als je de redenering niet betrouwbaar kunt bevestigen, noteer dan de open vraag in plaats van te suggereren dat je zeker bent."
      ],
      "tr": [
        "İlişkileri kendi sözlerinle açıkla",
        "Bir adımın neden anlamlı olduğunu veya iki ifadenin nasıl ilişkili olduğunu kendi sözlerinle açıkla. Böylece okurken gözden kaçan anlama eksiklerini fark edebilirsin.",
        "Akıcı bir açıklama yine de yanlış olabilir. Güvenilir bir kaynakla kontrol et ve belirsizlikleri kabul et. Bu yöntem çalışmayı destekler; konu bilgisinin veya açıklamayı kontrol etmenin yerini almaz.",
        "Anlamak istediğin, kapsamı sınırlı bir ilişki seç.",
        "Adımın neden geçerli olduğunu, neyin aynı kaldığını ve farklı koşullarda neyin değişeceğini sor.",
        "Kaynağı kopyalamadan bir açıklama oluştur.",
        "Asıl akıl yürütmeyle karşılaştır. Doğrulanmış bilgileri tahminlerden ayır.",
        "Eksikleri düzelt ve açıklamanı benzer bir örneğe uygula.",
        "İlişkiyi daha sonra bakmadan yeniden açıkla.",
        "Dörtte üç, sekizde altıya eşittir: 3/4 = 6/8. Dört eşit parçanın her birini ikiye bölersen sekiz eşit parça oluşur. Seçili üç çeyrek artık altı sekizlik parçadan oluşur. Seçilen miktar aynı kalır.",
        "«Payı ve paydayı ikiyle çarp» bir kuralı anlatır. Eşit parçaları ikiye bölmek, değerin neden değişmediğini açıklar. Bu fikri başka bir örneğe uygula: 2/3 ve 4/6 neden aynı oranı gösterir?",
        "3/4 ve 6/8’in neden eşit olduğunu bakmadan açıkla. Sonra aynı akıl yürütmeyi 2/3 ve 4/6’ya uygula.",
        "Öğrenme malzemenden bir adım seç ve neden geçerli olduğunu açıkla. Benzer bir örnek bulup açıklamanı onunla kontrol et. Akıl yürütmeyi güvenilir biçimde doğrulayamıyorsan kesinmiş gibi davranmak yerine açık soruyu kaydet."
      ],
      "ar": [
        "اشرح العلاقات بنفسك",
        "اشرح بكلماتك لماذا تكون خطوة منطقية أو كيف ترتبط عبارتان. قد يكشف ذلك ثغرات في الفهم لا تلاحظها أثناء القراءة.",
        "قد يكون الشرح سلسًا لكنه خاطئ. قارنه بمصدر موثوق واعترف بما لا تعرفه. تدعم هذه الطريقة التدريب، لكنها لا تحل محل المعرفة بالموضوع أو التحقّق من الشرح.",
        "اختر علاقة محددة تريد فهمها.",
        "اسأل لماذا تصح الخطوة، وما الذي يبقى ثابتًا، وما الذي يتغير في ظروف مختلفة.",
        "صغ شرحًا دون نسخ المصدر.",
        "قارن بالاستدلال الأصلي. ميّز الحقائق المثبتة عن التخمينات.",
        "صحّح الثغرات وطبّق شرحك على مثال مشابه.",
        "اشرح العلاقة لاحقًا مرة أخرى دون النظر إلى المصدر.",
        "ثلاثة أرباع تساوي ستة أثمان: 3/4 = 6/8. تقسيم كل جزء من الأجزاء الأربعة المتساوية إلى نصفين يعطي ثمانية أجزاء متساوية. تصبح الأرباع الثلاثة المختارة ستة أثمان، وتبقى الكمية المختارة نفسها.",
        "«اضرب البسط والمقام في اثنين» تصف قاعدة. تقسيم الأجزاء المتساوية إلى نصفين يفسّر ثبات القيمة. طبّق الفكرة: لماذا تعبّر 2/3 و4/6 عن النسبة نفسها؟",
        "اشرح دون النظر لماذا تتساوى 3/4 و6/8. ثم طبّق الاستدلال على 2/3 و4/6.",
        "اختر خطوة من مادتك واشرح سبب صحتها. تحقّق من شرحك بمثال مشابه. إذا تعذّر التحقّق من الاستدلال بثقة، فسجّل السؤال المفتوح بدل ادّعاء اليقين."
      ],
      "zh": [
        "自己解释关系",
        "用你自己的话说明某一步为何合理，或两个陈述之间的联系。这能揭示阅读时容易忽略的理解漏洞。",
        "流畅的解释仍可能出错。需对照可靠来源进行验证，并承认不确定性。此方法有助于练习，但不能替代专业知识或对解释的核查。",
        "选择一个你希望理解的、可操作的关系。",
        "追问这一步为何成立，什么保持不变，以及在不同条件下会发生什么变化。",
        "不抄袭原文，自行提出解释。",
        "与原文推理进行对比，区分已确立的事实与猜测。",
        "修正遗漏部分，并将其解释应用到相似的例子上。",
        "稍后在不看的情况下再次解释该关系。",
        "四分之三等于八分之六：3/4 = 6/8。把四个相等部分中的每一份再分成两半，就得到八个相等部分。原先选中的三份现在变成六份，选中的总量没有改变。",
        "“分子和分母都乘以二”是在描述规则。把每份等分为两半，才能解释数值为什么不变。再想一想：为什么 2/3 和 4/6 表示同样的比例？",
        "在不看的情况下解释为何3/4和6/8相等。然后将你的推理应用到2/3和4/6上。",
        "选择学习材料中的某一步，解释它为何成立。找到一个相似的例子并用它来验证你的解释。如果无法可靠验证推理，就记录下未解决的问题，而不是假装确定。"
      ],
      "ja": [
        "つながりを自分の言葉で説明する",
        "ある手順がなぜ妥当なのか、2つの説明がどうつながるのかを、自分の言葉で説明します。読むだけでは見逃す理解の抜けに気づけます。",
        "流暢な説明でも間違っていることがあります。信頼できる資料で確認し、不確かな点を認めましょう。この方法は学習を助けますが、知識や説明の確認に代わるものではありません。",
        "理解したい、範囲の限られた関係を選びましょう。",
        "なぜその手順が成り立つのか、何が変わらず、条件が違えば何が変わるのかを問いましょう。",
        "資料を写さず、自分で説明を組み立てましょう。",
        "元の理由づけと比べ、確かめられた事実と推測を分けましょう。",
        "抜けを修正し、似た例に説明を当てはめましょう。",
        "後で、資料を見ずにもう一度説明しましょう。",
        "4分の3は8分の6と同じです：3/4 = 6/8。4つの等しい部分をそれぞれ半分にすると、8つの等しい部分になります。選んだ3つの部分は6つになり、選んだ量は変わりません。",
        "「分子と分母を2倍する」は規則の説明です。等しい部分を半分に分けることで、値が変わらない理由が分かります。2/3と4/6が同じ割合を表す理由にも当てはめてみましょう。",
        "見ずに、3/4と6/8が等しい理由を説明しましょう。次に同じ考え方を2/3と4/6に当てはめましょう。",
        "教材の手順を1つ選び、成り立つ理由を説明しましょう。似た例で確かめます。理由を確実に検証できなければ、分かったふりをせず、未解決の疑問として記録しましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "spaced-practice",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-spaced-practice-de-visual-bae129d38128.mp4",
    "bytes": 1894976,
    "sha256": "bae129d3812855a3c469bb9be287753e91528e4530e6d68df63f69a6d376aa3e",
    "duration": 125.96,
    "recallBoundary": 108.739708,
    "cues": [
      {
        "start": 0.0,
        "end": 2.6
      },
      {
        "start": 2.6,
        "end": 13.16
      },
      {
        "start": 13.16,
        "end": 29.0
      },
      {
        "start": 29.0,
        "end": 34.6
      },
      {
        "start": 34.6,
        "end": 38.76
      },
      {
        "start": 38.76,
        "end": 43.76
      },
      {
        "start": 43.76,
        "end": 54.24
      },
      {
        "start": 54.24,
        "end": 59.36
      },
      {
        "start": 59.36,
        "end": 69.68
      },
      {
        "start": 69.68,
        "end": 87.68
      },
      {
        "start": 87.68,
        "end": 100.03999999999999
      },
      {
        "start": 100.03999999999999,
        "end": 109.6
      },
      {
        "start": 109.6,
        "end": 125.96000000000001
      }
    ],
    "captions": {
      "de": [
        "Verteiltes Wiederholen",
        "Du verteilst Abrufversuche auf mehrere Zeitpunkte. Damit prüfst du das Behalten nach einer Pause, statt eine Antwort nur unmittelbar nach dem Lesen zu wiederholen.",
        "Es gibt keinen festen Abstand, der für alle Inhalte und Menschen passt. Schwierigkeit, Vorwissen und gewünschte Behaltedauer spielen eine Rolle. Diese kurze Übung erklärt das Vorgehen; langfristiges Behalten zeigt sich erst bei späteren Abrufen.",
        "Lerne eine überschaubare Information und prüfe sie einmal ohne Vorlage.",
        "Plane einen späteren Abruf mit zeitlichem Abstand.",
        "Versuche zuerst selbst zu antworten, bevor du die Lösung öffnest.",
        "Bei einem Fehler: Bedeutung klären, korrigieren und wieder abrufen. Wähle den nächsten Abstand kürzer, wenn der Abruf zu schwer war.",
        "Wenn der Abruf zuverlässig gelingt, kann der nächste Abstand länger werden.",
        "Für gespeicherte Trainingsinhalte nutzt ANITEW bereits ein Wiederholungssystem. Folge den fälligen Wiedersehen statt parallel einen zweiten Plan zu führen.",
        "Mira lernt einen neuen Begriff. Sie erklärt ihn ohne Vorlage. Nach einer Pause versucht sie es erneut und bemerkt eine Lücke. Sie vergleicht mit der richtigen Erklärung, korrigiert die Lücke und setzt den nächsten Abruf früher an. Erst nach zuverlässigen Abrufen vergrößert sie den Abstand.",
        "Die Pause und der eigene Abruf sind entscheidend. Zehnmal direkt hintereinander zu lesen ersetzt keinen späteren Abruf. Miras Fehler zeigt ihr, wo sie nacharbeiten und den Abstand anpassen sollte.",
        "Beschreibe Miras Vorgehen: Was tut sie vor dem Nachsehen? Wie reagiert sie auf die Lücke? Wann kann der Abstand größer werden?",
        "Nutze die fälligen Wiedersehen für deine gespeicherten Trainingsinhalte. Für Material außerhalb der App plane einen späteren Selbsttest; passe den Abstand an den tatsächlichen Abruf an. Ein abgeschlossener Lesekurs legt noch keine neuen Wiederholungskarten an."
      ],
      "en": [
        "Spaced practice",
        "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
        "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
        "Learn a manageable piece of information and retrieve it once without looking.",
        "Plan another retrieval attempt after a delay.",
        "Try answering before you reveal the solution.",
        "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "As retrieval becomes reliable, the next interval can increase.",
        "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule.",
        "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
        "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
        "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
        "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards."
      ],
      "fr": [
        "Espacer les révisions",
        "Répartis les tentatives de rappel dans le temps. Tu vérifies ainsi ce qui reste après une pause, plutôt que de répéter une réponse juste après l’avoir lue.",
        "Aucun intervalle ne convient à tous les contenus et à toutes les personnes. La difficulté, les connaissances antérieures et la durée de rétention souhaitée comptent. Cet exercice explique la démarche ; seuls des rappels ultérieurs permettent de vérifier la rétention dans le temps.",
        "Apprends une information limitée et essaie de la rappeler une fois sans modèle.",
        "Prévois une autre tentative après un délai.",
        "Essaie de répondre avant d’afficher la solution.",
        "Après une erreur, clarifie le sens, corrige et rappelle à nouveau. Raccourcis l’intervalle suivant si le rappel était trop difficile.",
        "Lorsque le rappel devient fiable, l’intervalle peut augmenter.",
        "ANITEW planifie déjà les révisions des éléments d’entraînement enregistrés. Suis les révisions dues plutôt que de créer un calendrier concurrent.",
        "Mira apprend une nouvelle notion et l’explique sans modèle. Après une pause, elle réessaie et découvre une lacune. Elle compare avec la bonne explication, corrige la lacune et prévoit le prochain essai plus tôt. Elle augmente l’intervalle seulement lorsque le rappel devient fiable.",
        "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. L’erreur indique à Mira ce qu’elle doit retravailler et l’aide à adapter l’intervalle.",
        "Décris la démarche de Mira : que fait-elle avant de vérifier ? Comment réagit-elle à la lacune ? Quand peut-elle augmenter l’intervalle ?",
        "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Terminer ce cours ne crée pas de nouvelles cartes de révision."
      ],
      "es": [
        "Práctica espaciada",
        "Distribuye los intentos de recordar a lo largo del tiempo. Así compruebas lo que retienes después de una pausa, en vez de repetir la respuesta justo después de leerla.",
        "No existe un intervalo único que se adapte a todos los individuos y temas. La dificultad, el conocimiento previo y el periodo deseado de retención son factores importantes. Este ejercicio breve explica el enfoque; la retención duradera solo puede verificarse con intentos posteriores.",
        "Aprende una pequeña unidad de información y recuérdala una vez sin mirar.",
        "Planifica otro intento de recordarla después de una pausa.",
        "Intenta responder antes de revelar la solución.",
        "Después de un error, aclara el significado, corrige y vuelve a recordar. Acorta el siguiente intervalo si recordar resultó demasiado difícil.",
        "Cuando la recuperación se vuelve confiable, el intervalo siguiente puede aumentar.",
        "ANITEW ya programa repasos de los contenidos de entrenamiento guardados. Sigue los repasos pendientes en vez de mantener otro calendario paralelo.",
        "Mira aprende un nuevo concepto y lo explica sin mirar. Después de un descanso, intenta nuevamente y encuentra un vacío. Compara con la explicación correcta, corrige el vacío y programa el siguiente intento más pronto. Solo después de una recuperación confiable puede aumentar el intervalo.",
        "El retardo y el intento de recuperación importan. Leer diez veces seguidas no puede reemplazar un intento posterior de recuperación. El error le indica a Mira qué debe revisar y le ayuda a ajustar el intervalo.",
        "Describe el enfoque de Mira: ¿qué hace antes de verificar? ¿Cómo responde al vacío? ¿Cuándo puede aumentar el intervalo?",
        "Utiliza los repasos pendientes de los contenidos guardados. Para material externo a la app, planifica una prueba posterior y ajusta el intervalo según lo que realmente recuerdes. Completar este curso no crea tarjetas de repaso nuevas."
      ],
      "it": [
        "Pratica spaziata",
        "Distribuisci i tentativi di richiamo nel tempo. Così verifichi cosa ricordi dopo una pausa, anziché ripetere una risposta subito dopo averla letta.",
        "Non esiste un intervallo adatto a ogni persona e argomento. Contano difficoltà, conoscenze precedenti e durata desiderata del ricordo. Questo breve esercizio spiega il metodo; per verificare il ricordo duraturo servono tentativi successivi.",
        "Apprendi un pezzo di informazione gestibile e recuperalo una volta senza guardare.",
        "Pianifica un altro tentativo di recupero dopo un ritardo.",
        "Prova a rispondere prima di rivelare la soluzione.",
        "Dopo un errore, chiarisci il significato, correggilo e recupera nuovamente. Riduci l'intervallo successivo se il recupero era troppo difficile.",
        "Quando il recupero diventa affidabile, l'intervallo successivo può essere aumentato.",
        "ANITEW programma già i ripassi dei contenuti di allenamento salvati. Segui i ripassi in scadenza invece di mantenere un calendario parallelo.",
        "Mira impara un concetto nuovo e lo spiega senza guardare. Dopo una pausa riprova e scopre una lacuna. Confronta la risposta con la spiegazione corretta, corregge la lacuna e anticipa il tentativo successivo. Aumenta l’intervallo solo quando il richiamo diventa affidabile.",
        "Contano la pausa e il tentativo di richiamo. Leggere dieci volte di seguito non sostituisce un tentativo successivo. L’errore indica a Mira cosa ripassare e la aiuta ad adattare l’intervallo.",
        "Descrivi il metodo di Mira: cosa fa prima di controllare? Come reagisce alla lacuna? Quando può aumentare l’intervallo?",
        "Usa i ripassi in scadenza per i contenuti salvati. Per il materiale esterno all’app, programma una verifica successiva e adatta l’intervallo al richiamo effettivo. Completare questo corso non crea nuove schede di ripasso."
      ],
      "pt": [
        "Prática espaçada",
        "Distribua tentativas de recuperação ao longo do tempo. Isso testa a retenção após um atraso, e não apenas repete a resposta imediatamente após a leitura.",
        "Nenhum intervalo serve para todas as pessoas e assuntos. Importam a dificuldade, o conhecimento prévio e o tempo durante o qual se pretende recordar. Este exercício explica o método; a retenção duradoura só pode ser verificada com tentativas posteriores.",
        "Aprenda um pedaço de informação gerenciável e recupere-o uma vez sem olhar.",
        "Planeje outra tentativa de recuperação após um atraso.",
        "Tente responder antes de revelar a solução.",
        "Após um erro, esclareça o significado, corrija e recupere novamente. Reduza o próximo intervalo se a recuperação foi difícil.",
        "Quando a recuperação se torna confiável, o próximo intervalo pode ser aumentado.",
        "ANITEW já programa as revisões dos conteúdos de treino guardados. Siga as revisões previstas em vez de manter outro calendário paralelo.",
        "Mira aprende um conceito novo e explica-o sem olhar. Depois de uma pausa, tenta novamente e encontra uma lacuna. Compara com a explicação correta, corrige a lacuna e antecipa a tentativa seguinte. Só aumenta o intervalo quando consegue recordar de forma fiável.",
        "O atraso e a tentativa de recuperação importam. Ler dez vezes seguidas não substitui uma tentativa de recuperação posterior. O erro informa Mira o que revisar e ajuda-a a ajustar o intervalo.",
        "Descreva o método de Mira: o que ela faz antes de verificar? Como ela responde a uma lacuna? Quando pode aumentar o intervalo?",
        "Use as revisões previstas para os conteúdos de treino guardados. Para material externo à aplicação, planeie uma verificação posterior e ajuste o intervalo ao que realmente consegue recordar. Concluir este curso não cria novos cartões de revisão."
      ],
      "nl": [
        "Gespreid oefenen",
        "Verspreid ophaalpogingen over de tijd. Zo test je wat je na een pauze onthoudt, in plaats van een antwoord meteen na het lezen te herhalen.",
        "Geen enkel interval past bij iedereen en elk onderwerp. Moeilijkheid, voorkennis en de gewenste duur van het onthouden spelen mee. Deze korte oefening legt de aanpak uit; blijvend onthouden kun je alleen met latere pogingen toetsen.",
        "Leer een beheersbare hoeveelheid informatie en haal deze één keer op zonder te kijken.",
        "Plan een nieuwe ophaalpoging na een pauze.",
        "Probeer te antwoorden voordat je de oplossing bekijkt.",
        "Verduidelijk na een fout de betekenis, corrigeer en haal het antwoord opnieuw op. Verkort het volgende interval als ophalen te moeilijk was.",
        "Wanneer het ophalen betrouwbaar lukt, kun je het volgende interval vergroten.",
        "ANITEW plant al herhalingen voor opgeslagen trainingsinhoud. Volg de geplande herhalingen in plaats van een tweede schema bij te houden.",
        "Mira leert een nieuw begrip en legt het zonder voorbeeld uit. Na een pauze probeert ze het opnieuw en ontdekt een hiaat. Ze vergelijkt met de juiste uitleg, corrigeert het hiaat en plant de volgende poging eerder. Pas als het ophalen betrouwbaar lukt, vergroot ze het interval.",
        "De pauze en de ophaalpoging zijn belangrijk. Tien keer achter elkaar lezen vervangt geen latere ophaalpoging. De fout laat Mira zien wat ze moet herhalen en helpt haar het interval aan te passen.",
        "Beschrijf Mira’s aanpak: wat doet ze voordat ze controleert? Hoe reageert ze op het hiaat? Wanneer kan ze het interval vergroten?",
        "Gebruik de geplande herhalingen voor je opgeslagen trainingsinhoud. Plan voor materiaal buiten de app een latere zelftest en pas het interval aan op wat je werkelijk kunt ophalen. Het afronden van deze leescursus maakt geen nieuwe herhaalkaarten aan."
      ],
      "tr": [
        "Aralıklı çalışma",
        "Hatırlama denemelerini zamana yay. Böylece okuduktan hemen sonra cevabı tekrarlamak yerine bir aradan sonra neyi hatırladığını sınarsın.",
        "Her insan ve konu için uygun tek bir aralık yoktur. Zorluk, ön bilgi ve hedeflenen hatırlama süresi önemlidir. Bu kısa alıştırma yöntemi açıklar; kalıcı hatırlama ancak sonraki denemelerle sınanabilir.",
        "Yönetilebilir bir bilgi parçası öğren ve bir kez bakmadan hatırla.",
        "Bir aradan sonra yeni bir hatırlama denemesi planla.",
        "Çözümü açmadan önce cevaplamayı dene.",
        "Hata yaptıktan sonra anlamı netleştir, düzelt ve yeniden hatırla. Hatırlamak çok zor geldiyse sonraki aralığı kısalt.",
        "Hatırlama güvenilir hale geldikçe sonraki aralık uzatılabilir.",
        "ANITEW, kayıtlı çalışma öğeleri için zaten tekrarlar planlar. İkinci bir takvim oluşturmak yerine zamanı gelen tekrarları takip et.",
        "Mira yeni bir kavram öğrenir ve bakmadan açıklar. Bir aradan sonra yeniden dener ve bir eksik fark eder. Doğru açıklamayla karşılaştırır, eksiği giderir ve sonraki denemeyi daha erkene alır. Ancak güvenilir biçimde hatırlayabildiğinde aralığı uzatır.",
        "Ara vermek ve hatırlamayı denemek önemlidir. Art arda on kez okumak, daha sonra yapılacak bir hatırlama denemesinin yerini tutmaz. Hata, Mira’ya neyi gözden geçirmesi gerektiğini gösterir ve aralığı ayarlamasına yardımcı olur.",
        "Mira’nın yöntemini anlat: kontrol etmeden önce ne yapar? Eksikliğe nasıl karşılık verir? Aralığı ne zaman uzatabilir?",
        "Kayıtlı çalışma öğelerin için zamanı gelen tekrarları kullan. Uygulama dışındaki malzeme için daha sonra bir öz sınama planla ve aralığı gerçek hatırlamana göre ayarla. Bu okuma dersini tamamlamak yeni tekrar kartları oluşturmaz."
      ],
      "ar": [
        "التدريب المتباعد",
        "وزّع محاولات الاسترجاع على أوقات مختلفة. بذلك تختبر ما تتذكره بعد فترة، بدل تكرار الإجابة فور قراءتها.",
        "لا توجد فترة واحدة تناسب كل شخص وموضوع. تؤثر الصعوبة والمعرفة السابقة والمدة المطلوبة للاحتفاظ بالمعلومة. هذا التمرين يشرح الطريقة؛ أما التذكّر الطويل فيُختبر بمحاولات لاحقة.",
        "تعلّم معلومة محدودة واسترجعها مرة دون النظر.",
        "خطّط لمحاولة استرجاع أخرى بعد فترة.",
        "حاول الإجابة قبل إظهار الحل.",
        "بعد الخطأ، وضّح المعنى وصحّح ثم استرجع مجددًا. قصّر الفترة التالية إذا كان الاسترجاع شديد الصعوبة.",
        "عندما يصبح الاسترجاع موثوقًا، يمكن إطالة الفترة التالية.",
        "تجدول ANITEW بالفعل مراجعات لمحتوى التدريب المحفوظ. اتبع المراجعات المستحقة بدل إنشاء جدول موازٍ.",
        "تتعلّم ميرا مفهومًا جديدًا وتشرحه دون النظر. بعد استراحة تحاول مجددًا وتكتشف نقصًا. تقارن بالشرح الصحيح، وتصوّب النقص، وتقدّم موعد المحاولة التالية. لا تطيل الفترة إلا بعد أن يصبح الاسترجاع موثوقًا.",
        "الفترة الفاصلة ومحاولة الاسترجاع مهمتان. القراءة عشر مرات متتالية لا تعوّض محاولة استرجاع لاحقة. يوضّح الخطأ لميرا ما تحتاج إلى مراجعته ويساعدها على تعديل الفترة.",
        "صِف طريقة ميرا: ماذا تفعل قبل التحقّق؟ كيف تتعامل مع النقص؟ متى يمكنها إطالة الفترة؟",
        "استخدم المراجعات المستحقة لمحتواك المحفوظ. للمادة خارج التطبيق، خطّط لاختبار ذاتي لاحق وعدّل الفترة بحسب الاسترجاع الفعلي. إكمال هذا الدرس لا ينشئ بطاقات مراجعة جديدة."
      ],
      "zh": [
        "间隔练习",
        "将检索尝试分散到不同时间点。这种做法测试的是延迟后的记忆保持，而不是在阅读后立即重复答案。",
        "没有一个固定的时间间隔适合所有人和所有主题。难度、先前知识以及期望的记忆保持时间都起作用。这个简短的练习说明了方法；真正的长期记忆保持必须通过后续的尝试来验证。",
        "学习一小部分信息，并在不查看的情况下进行一次检索。",
        "计划在延迟后进行下一次检索尝试。",
        "在揭示答案之前，先尝试回答。",
        "在出错后，明确含义，纠正错误，再进行一次检索。如果检索困难，下次间隔时间应缩短。",
        "当检索变得可靠时，下一次间隔时间可以增加。",
        "ANITEW 已为保存的训练内容安排复习。请按到期安排复习，不要另建一套并行计划。",
        "Mira 学习一个新概念，并在不看原文的情况下解释。休息后她再次尝试，发现遗漏。她对照正确解释补上遗漏，并把下次尝试提前。只有在能够可靠回忆后，才延长间隔。",
        "延迟时间和检索尝试都很重要。连续阅读十遍无法替代后续的检索尝试。错误会告诉 Mira 哪些内容需要重新学习，并帮助她调整间隔时间。",
        "描述 Mira 的做法：在查看之前她做了什么？当发现差距时她如何应对？在什么情况下她可以增加间隔时间？",
        "使用到期的复习来管理你存储的训练项目。对于应用之外的内容，计划一次后续的自我测试，并根据实际检索结果调整间隔时间。完成本阅读课程并不会生成新的复习卡片。"
      ],
      "ja": [
        "間隔を空けて練習する",
        "思い出す練習を異なる時点に分けて行います。読んだ直後に答えを繰り返すだけでなく、時間を置いてから何を覚えているか確かめます。",
        "誰にでも、どの内容にも合う間隔はありません。難しさ、予備知識、覚えておきたい期間が関わります。この短い練習は方法の説明です。長く覚えているかは、後の試行で確かめます。",
        "無理なく扱える少量の情報を学び、一度見ずに思い出しましょう。",
        "時間を空けて、次に思い出す機会を計画しましょう。",
        "答えを表示する前に、自分で答えましょう。",
        "間違えたら意味を確認して修正し、もう一度思い出しましょう。難しすぎた場合は次の間隔を短くします。",
        "確実に思い出せるようになったら、次の間隔を長くできます。",
        "ANITEWは保存した練習項目の復習を既に予定しています。別の予定表を作らず、期限の来た復習に従いましょう。",
        "Miraは新しい概念を学び、資料を見ずに説明します。休憩後に再び試すと、抜けに気づきました。正しい説明と比べて修正し、次の試行を早めます。確実に思い出せるようになってから間隔を延ばします。",
        "時間を置くことと、思い出そうとすることが重要です。10回続けて読むことは、後で思い出す試みの代わりにはなりません。間違いはMiraに見直す箇所を教え、間隔の調整に役立ちます。",
        "Miraの方法を説明しましょう。答えを見る前に何をしますか。抜けにどう対処しますか。いつ間隔を延ばせますか。",
        "保存した練習項目には期限の来た復習を使いましょう。アプリ外の教材では後の自己テストを予定し、実際に思い出せた程度に合わせて間隔を調整します。この読書コースの修了で新しい復習カードは作られません。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "spaced-practice",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-spaced-practice-en-visual-85297877288e.mp4",
    "bytes": 1713919,
    "sha256": "85297877288ebf8484090634ac9bb1a3604ea6a54fc3a94a9786da80a71dbec0",
    "duration": 116.2,
    "recallBoundary": 101.000833,
    "cues": [
      {
        "start": 0.0,
        "end": 2.56
      },
      {
        "start": 2.56,
        "end": 12.2
      },
      {
        "start": 12.2,
        "end": 26.88
      },
      {
        "start": 26.88,
        "end": 32.76
      },
      {
        "start": 32.76,
        "end": 37.08
      },
      {
        "start": 37.08,
        "end": 40.88
      },
      {
        "start": 40.88,
        "end": 50.76
      },
      {
        "start": 50.76,
        "end": 56.32
      },
      {
        "start": 56.32,
        "end": 64.08
      },
      {
        "start": 64.08,
        "end": 80.48
      },
      {
        "start": 80.48,
        "end": 91.96
      },
      {
        "start": 91.96,
        "end": 102.0
      },
      {
        "start": 102.0,
        "end": 116.2
      }
    ],
    "captions": {
      "de": [
        "Verteiltes Wiederholen",
        "Du verteilst Abrufversuche auf mehrere Zeitpunkte. Damit prüfst du das Behalten nach einer Pause, statt eine Antwort nur unmittelbar nach dem Lesen zu wiederholen.",
        "Es gibt keinen festen Abstand, der für alle Inhalte und Menschen passt. Schwierigkeit, Vorwissen und gewünschte Behaltedauer spielen eine Rolle. Diese kurze Übung erklärt das Vorgehen; langfristiges Behalten zeigt sich erst bei späteren Abrufen.",
        "Lerne eine überschaubare Information und prüfe sie einmal ohne Vorlage.",
        "Plane einen späteren Abruf mit zeitlichem Abstand.",
        "Versuche zuerst selbst zu antworten, bevor du die Lösung öffnest.",
        "Bei einem Fehler: Bedeutung klären, korrigieren und wieder abrufen. Wähle den nächsten Abstand kürzer, wenn der Abruf zu schwer war.",
        "Wenn der Abruf zuverlässig gelingt, kann der nächste Abstand länger werden.",
        "Für gespeicherte Trainingsinhalte nutzt ANITEW bereits ein Wiederholungssystem. Folge den fälligen Wiedersehen statt parallel einen zweiten Plan zu führen.",
        "Mira lernt einen neuen Begriff. Sie erklärt ihn ohne Vorlage. Nach einer Pause versucht sie es erneut und bemerkt eine Lücke. Sie vergleicht mit der richtigen Erklärung, korrigiert die Lücke und setzt den nächsten Abruf früher an. Erst nach zuverlässigen Abrufen vergrößert sie den Abstand.",
        "Die Pause und der eigene Abruf sind entscheidend. Zehnmal direkt hintereinander zu lesen ersetzt keinen späteren Abruf. Miras Fehler zeigt ihr, wo sie nacharbeiten und den Abstand anpassen sollte.",
        "Beschreibe Miras Vorgehen: Was tut sie vor dem Nachsehen? Wie reagiert sie auf die Lücke? Wann kann der Abstand größer werden?",
        "Nutze die fälligen Wiedersehen für deine gespeicherten Trainingsinhalte. Für Material außerhalb der App plane einen späteren Selbsttest; passe den Abstand an den tatsächlichen Abruf an. Ein abgeschlossener Lesekurs legt noch keine neuen Wiederholungskarten an."
      ],
      "en": [
        "Spaced practice",
        "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
        "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
        "Learn a manageable piece of information and retrieve it once without looking.",
        "Plan another retrieval attempt after a delay.",
        "Try answering before you reveal the solution.",
        "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "As retrieval becomes reliable, the next interval can increase.",
        "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule.",
        "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
        "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
        "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
        "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards."
      ],
      "fr": [
        "Espacer les révisions",
        "Répartis les tentatives de rappel dans le temps. Tu vérifies ainsi ce qui reste après une pause, plutôt que de répéter une réponse juste après l’avoir lue.",
        "Aucun intervalle ne convient à tous les contenus et à toutes les personnes. La difficulté, les connaissances antérieures et la durée de rétention souhaitée comptent. Cet exercice explique la démarche ; seuls des rappels ultérieurs permettent de vérifier la rétention dans le temps.",
        "Apprends une information limitée et essaie de la rappeler une fois sans modèle.",
        "Prévois une autre tentative après un délai.",
        "Essaie de répondre avant d’afficher la solution.",
        "Après une erreur, clarifie le sens, corrige et rappelle à nouveau. Raccourcis l’intervalle suivant si le rappel était trop difficile.",
        "Lorsque le rappel devient fiable, l’intervalle peut augmenter.",
        "ANITEW planifie déjà les révisions des éléments d’entraînement enregistrés. Suis les révisions dues plutôt que de créer un calendrier concurrent.",
        "Mira apprend une nouvelle notion et l’explique sans modèle. Après une pause, elle réessaie et découvre une lacune. Elle compare avec la bonne explication, corrige la lacune et prévoit le prochain essai plus tôt. Elle augmente l’intervalle seulement lorsque le rappel devient fiable.",
        "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. L’erreur indique à Mira ce qu’elle doit retravailler et l’aide à adapter l’intervalle.",
        "Décris la démarche de Mira : que fait-elle avant de vérifier ? Comment réagit-elle à la lacune ? Quand peut-elle augmenter l’intervalle ?",
        "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Terminer ce cours ne crée pas de nouvelles cartes de révision."
      ],
      "es": [
        "Práctica espaciada",
        "Distribuye los intentos de recordar a lo largo del tiempo. Así compruebas lo que retienes después de una pausa, en vez de repetir la respuesta justo después de leerla.",
        "No existe un intervalo único que se adapte a todos los individuos y temas. La dificultad, el conocimiento previo y el periodo deseado de retención son factores importantes. Este ejercicio breve explica el enfoque; la retención duradera solo puede verificarse con intentos posteriores.",
        "Aprende una pequeña unidad de información y recuérdala una vez sin mirar.",
        "Planifica otro intento de recordarla después de una pausa.",
        "Intenta responder antes de revelar la solución.",
        "Después de un error, aclara el significado, corrige y vuelve a recordar. Acorta el siguiente intervalo si recordar resultó demasiado difícil.",
        "Cuando la recuperación se vuelve confiable, el intervalo siguiente puede aumentar.",
        "ANITEW ya programa repasos de los contenidos de entrenamiento guardados. Sigue los repasos pendientes en vez de mantener otro calendario paralelo.",
        "Mira aprende un nuevo concepto y lo explica sin mirar. Después de un descanso, intenta nuevamente y encuentra un vacío. Compara con la explicación correcta, corrige el vacío y programa el siguiente intento más pronto. Solo después de una recuperación confiable puede aumentar el intervalo.",
        "El retardo y el intento de recuperación importan. Leer diez veces seguidas no puede reemplazar un intento posterior de recuperación. El error le indica a Mira qué debe revisar y le ayuda a ajustar el intervalo.",
        "Describe el enfoque de Mira: ¿qué hace antes de verificar? ¿Cómo responde al vacío? ¿Cuándo puede aumentar el intervalo?",
        "Utiliza los repasos pendientes de los contenidos guardados. Para material externo a la app, planifica una prueba posterior y ajusta el intervalo según lo que realmente recuerdes. Completar este curso no crea tarjetas de repaso nuevas."
      ],
      "it": [
        "Pratica spaziata",
        "Distribuisci i tentativi di richiamo nel tempo. Così verifichi cosa ricordi dopo una pausa, anziché ripetere una risposta subito dopo averla letta.",
        "Non esiste un intervallo adatto a ogni persona e argomento. Contano difficoltà, conoscenze precedenti e durata desiderata del ricordo. Questo breve esercizio spiega il metodo; per verificare il ricordo duraturo servono tentativi successivi.",
        "Apprendi un pezzo di informazione gestibile e recuperalo una volta senza guardare.",
        "Pianifica un altro tentativo di recupero dopo un ritardo.",
        "Prova a rispondere prima di rivelare la soluzione.",
        "Dopo un errore, chiarisci il significato, correggilo e recupera nuovamente. Riduci l'intervallo successivo se il recupero era troppo difficile.",
        "Quando il recupero diventa affidabile, l'intervallo successivo può essere aumentato.",
        "ANITEW programma già i ripassi dei contenuti di allenamento salvati. Segui i ripassi in scadenza invece di mantenere un calendario parallelo.",
        "Mira impara un concetto nuovo e lo spiega senza guardare. Dopo una pausa riprova e scopre una lacuna. Confronta la risposta con la spiegazione corretta, corregge la lacuna e anticipa il tentativo successivo. Aumenta l’intervallo solo quando il richiamo diventa affidabile.",
        "Contano la pausa e il tentativo di richiamo. Leggere dieci volte di seguito non sostituisce un tentativo successivo. L’errore indica a Mira cosa ripassare e la aiuta ad adattare l’intervallo.",
        "Descrivi il metodo di Mira: cosa fa prima di controllare? Come reagisce alla lacuna? Quando può aumentare l’intervallo?",
        "Usa i ripassi in scadenza per i contenuti salvati. Per il materiale esterno all’app, programma una verifica successiva e adatta l’intervallo al richiamo effettivo. Completare questo corso non crea nuove schede di ripasso."
      ],
      "pt": [
        "Prática espaçada",
        "Distribua tentativas de recuperação ao longo do tempo. Isso testa a retenção após um atraso, e não apenas repete a resposta imediatamente após a leitura.",
        "Nenhum intervalo serve para todas as pessoas e assuntos. Importam a dificuldade, o conhecimento prévio e o tempo durante o qual se pretende recordar. Este exercício explica o método; a retenção duradoura só pode ser verificada com tentativas posteriores.",
        "Aprenda um pedaço de informação gerenciável e recupere-o uma vez sem olhar.",
        "Planeje outra tentativa de recuperação após um atraso.",
        "Tente responder antes de revelar a solução.",
        "Após um erro, esclareça o significado, corrija e recupere novamente. Reduza o próximo intervalo se a recuperação foi difícil.",
        "Quando a recuperação se torna confiável, o próximo intervalo pode ser aumentado.",
        "ANITEW já programa as revisões dos conteúdos de treino guardados. Siga as revisões previstas em vez de manter outro calendário paralelo.",
        "Mira aprende um conceito novo e explica-o sem olhar. Depois de uma pausa, tenta novamente e encontra uma lacuna. Compara com a explicação correta, corrige a lacuna e antecipa a tentativa seguinte. Só aumenta o intervalo quando consegue recordar de forma fiável.",
        "O atraso e a tentativa de recuperação importam. Ler dez vezes seguidas não substitui uma tentativa de recuperação posterior. O erro informa Mira o que revisar e ajuda-a a ajustar o intervalo.",
        "Descreva o método de Mira: o que ela faz antes de verificar? Como ela responde a uma lacuna? Quando pode aumentar o intervalo?",
        "Use as revisões previstas para os conteúdos de treino guardados. Para material externo à aplicação, planeie uma verificação posterior e ajuste o intervalo ao que realmente consegue recordar. Concluir este curso não cria novos cartões de revisão."
      ],
      "nl": [
        "Gespreid oefenen",
        "Verspreid ophaalpogingen over de tijd. Zo test je wat je na een pauze onthoudt, in plaats van een antwoord meteen na het lezen te herhalen.",
        "Geen enkel interval past bij iedereen en elk onderwerp. Moeilijkheid, voorkennis en de gewenste duur van het onthouden spelen mee. Deze korte oefening legt de aanpak uit; blijvend onthouden kun je alleen met latere pogingen toetsen.",
        "Leer een beheersbare hoeveelheid informatie en haal deze één keer op zonder te kijken.",
        "Plan een nieuwe ophaalpoging na een pauze.",
        "Probeer te antwoorden voordat je de oplossing bekijkt.",
        "Verduidelijk na een fout de betekenis, corrigeer en haal het antwoord opnieuw op. Verkort het volgende interval als ophalen te moeilijk was.",
        "Wanneer het ophalen betrouwbaar lukt, kun je het volgende interval vergroten.",
        "ANITEW plant al herhalingen voor opgeslagen trainingsinhoud. Volg de geplande herhalingen in plaats van een tweede schema bij te houden.",
        "Mira leert een nieuw begrip en legt het zonder voorbeeld uit. Na een pauze probeert ze het opnieuw en ontdekt een hiaat. Ze vergelijkt met de juiste uitleg, corrigeert het hiaat en plant de volgende poging eerder. Pas als het ophalen betrouwbaar lukt, vergroot ze het interval.",
        "De pauze en de ophaalpoging zijn belangrijk. Tien keer achter elkaar lezen vervangt geen latere ophaalpoging. De fout laat Mira zien wat ze moet herhalen en helpt haar het interval aan te passen.",
        "Beschrijf Mira’s aanpak: wat doet ze voordat ze controleert? Hoe reageert ze op het hiaat? Wanneer kan ze het interval vergroten?",
        "Gebruik de geplande herhalingen voor je opgeslagen trainingsinhoud. Plan voor materiaal buiten de app een latere zelftest en pas het interval aan op wat je werkelijk kunt ophalen. Het afronden van deze leescursus maakt geen nieuwe herhaalkaarten aan."
      ],
      "tr": [
        "Aralıklı çalışma",
        "Hatırlama denemelerini zamana yay. Böylece okuduktan hemen sonra cevabı tekrarlamak yerine bir aradan sonra neyi hatırladığını sınarsın.",
        "Her insan ve konu için uygun tek bir aralık yoktur. Zorluk, ön bilgi ve hedeflenen hatırlama süresi önemlidir. Bu kısa alıştırma yöntemi açıklar; kalıcı hatırlama ancak sonraki denemelerle sınanabilir.",
        "Yönetilebilir bir bilgi parçası öğren ve bir kez bakmadan hatırla.",
        "Bir aradan sonra yeni bir hatırlama denemesi planla.",
        "Çözümü açmadan önce cevaplamayı dene.",
        "Hata yaptıktan sonra anlamı netleştir, düzelt ve yeniden hatırla. Hatırlamak çok zor geldiyse sonraki aralığı kısalt.",
        "Hatırlama güvenilir hale geldikçe sonraki aralık uzatılabilir.",
        "ANITEW, kayıtlı çalışma öğeleri için zaten tekrarlar planlar. İkinci bir takvim oluşturmak yerine zamanı gelen tekrarları takip et.",
        "Mira yeni bir kavram öğrenir ve bakmadan açıklar. Bir aradan sonra yeniden dener ve bir eksik fark eder. Doğru açıklamayla karşılaştırır, eksiği giderir ve sonraki denemeyi daha erkene alır. Ancak güvenilir biçimde hatırlayabildiğinde aralığı uzatır.",
        "Ara vermek ve hatırlamayı denemek önemlidir. Art arda on kez okumak, daha sonra yapılacak bir hatırlama denemesinin yerini tutmaz. Hata, Mira’ya neyi gözden geçirmesi gerektiğini gösterir ve aralığı ayarlamasına yardımcı olur.",
        "Mira’nın yöntemini anlat: kontrol etmeden önce ne yapar? Eksikliğe nasıl karşılık verir? Aralığı ne zaman uzatabilir?",
        "Kayıtlı çalışma öğelerin için zamanı gelen tekrarları kullan. Uygulama dışındaki malzeme için daha sonra bir öz sınama planla ve aralığı gerçek hatırlamana göre ayarla. Bu okuma dersini tamamlamak yeni tekrar kartları oluşturmaz."
      ],
      "ar": [
        "التدريب المتباعد",
        "وزّع محاولات الاسترجاع على أوقات مختلفة. بذلك تختبر ما تتذكره بعد فترة، بدل تكرار الإجابة فور قراءتها.",
        "لا توجد فترة واحدة تناسب كل شخص وموضوع. تؤثر الصعوبة والمعرفة السابقة والمدة المطلوبة للاحتفاظ بالمعلومة. هذا التمرين يشرح الطريقة؛ أما التذكّر الطويل فيُختبر بمحاولات لاحقة.",
        "تعلّم معلومة محدودة واسترجعها مرة دون النظر.",
        "خطّط لمحاولة استرجاع أخرى بعد فترة.",
        "حاول الإجابة قبل إظهار الحل.",
        "بعد الخطأ، وضّح المعنى وصحّح ثم استرجع مجددًا. قصّر الفترة التالية إذا كان الاسترجاع شديد الصعوبة.",
        "عندما يصبح الاسترجاع موثوقًا، يمكن إطالة الفترة التالية.",
        "تجدول ANITEW بالفعل مراجعات لمحتوى التدريب المحفوظ. اتبع المراجعات المستحقة بدل إنشاء جدول موازٍ.",
        "تتعلّم ميرا مفهومًا جديدًا وتشرحه دون النظر. بعد استراحة تحاول مجددًا وتكتشف نقصًا. تقارن بالشرح الصحيح، وتصوّب النقص، وتقدّم موعد المحاولة التالية. لا تطيل الفترة إلا بعد أن يصبح الاسترجاع موثوقًا.",
        "الفترة الفاصلة ومحاولة الاسترجاع مهمتان. القراءة عشر مرات متتالية لا تعوّض محاولة استرجاع لاحقة. يوضّح الخطأ لميرا ما تحتاج إلى مراجعته ويساعدها على تعديل الفترة.",
        "صِف طريقة ميرا: ماذا تفعل قبل التحقّق؟ كيف تتعامل مع النقص؟ متى يمكنها إطالة الفترة؟",
        "استخدم المراجعات المستحقة لمحتواك المحفوظ. للمادة خارج التطبيق، خطّط لاختبار ذاتي لاحق وعدّل الفترة بحسب الاسترجاع الفعلي. إكمال هذا الدرس لا ينشئ بطاقات مراجعة جديدة."
      ],
      "zh": [
        "间隔练习",
        "将检索尝试分散到不同时间点。这种做法测试的是延迟后的记忆保持，而不是在阅读后立即重复答案。",
        "没有一个固定的时间间隔适合所有人和所有主题。难度、先前知识以及期望的记忆保持时间都起作用。这个简短的练习说明了方法；真正的长期记忆保持必须通过后续的尝试来验证。",
        "学习一小部分信息，并在不查看的情况下进行一次检索。",
        "计划在延迟后进行下一次检索尝试。",
        "在揭示答案之前，先尝试回答。",
        "在出错后，明确含义，纠正错误，再进行一次检索。如果检索困难，下次间隔时间应缩短。",
        "当检索变得可靠时，下一次间隔时间可以增加。",
        "ANITEW 已为保存的训练内容安排复习。请按到期安排复习，不要另建一套并行计划。",
        "Mira 学习一个新概念，并在不看原文的情况下解释。休息后她再次尝试，发现遗漏。她对照正确解释补上遗漏，并把下次尝试提前。只有在能够可靠回忆后，才延长间隔。",
        "延迟时间和检索尝试都很重要。连续阅读十遍无法替代后续的检索尝试。错误会告诉 Mira 哪些内容需要重新学习，并帮助她调整间隔时间。",
        "描述 Mira 的做法：在查看之前她做了什么？当发现差距时她如何应对？在什么情况下她可以增加间隔时间？",
        "使用到期的复习来管理你存储的训练项目。对于应用之外的内容，计划一次后续的自我测试，并根据实际检索结果调整间隔时间。完成本阅读课程并不会生成新的复习卡片。"
      ],
      "ja": [
        "間隔を空けて練習する",
        "思い出す練習を異なる時点に分けて行います。読んだ直後に答えを繰り返すだけでなく、時間を置いてから何を覚えているか確かめます。",
        "誰にでも、どの内容にも合う間隔はありません。難しさ、予備知識、覚えておきたい期間が関わります。この短い練習は方法の説明です。長く覚えているかは、後の試行で確かめます。",
        "無理なく扱える少量の情報を学び、一度見ずに思い出しましょう。",
        "時間を空けて、次に思い出す機会を計画しましょう。",
        "答えを表示する前に、自分で答えましょう。",
        "間違えたら意味を確認して修正し、もう一度思い出しましょう。難しすぎた場合は次の間隔を短くします。",
        "確実に思い出せるようになったら、次の間隔を長くできます。",
        "ANITEWは保存した練習項目の復習を既に予定しています。別の予定表を作らず、期限の来た復習に従いましょう。",
        "Miraは新しい概念を学び、資料を見ずに説明します。休憩後に再び試すと、抜けに気づきました。正しい説明と比べて修正し、次の試行を早めます。確実に思い出せるようになってから間隔を延ばします。",
        "時間を置くことと、思い出そうとすることが重要です。10回続けて読むことは、後で思い出す試みの代わりにはなりません。間違いはMiraに見直す箇所を教え、間隔の調整に役立ちます。",
        "Miraの方法を説明しましょう。答えを見る前に何をしますか。抜けにどう対処しますか。いつ間隔を延ばせますか。",
        "保存した練習項目には期限の来た復習を使いましょう。アプリ外の教材では後の自己テストを予定し、実際に思い出せた程度に合わせて間隔を調整します。この読書コースの修了で新しい復習カードは作られません。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "text-meaning",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-text-meaning-de-visual-16d8dfa7966c.mp4",
    "bytes": 1612544,
    "sha256": "16d8dfa7966ceed959a7a4881734feae94b6552e989702e4b5941fabd6313266",
    "duration": 111.2,
    "recallBoundary": 98.12929199999999,
    "cues": [
      {
        "start": 0.0,
        "end": 3.2
      },
      {
        "start": 3.2,
        "end": 13.04
      },
      {
        "start": 13.04,
        "end": 26.88
      },
      {
        "start": 26.88,
        "end": 31.32
      },
      {
        "start": 31.32,
        "end": 37.28
      },
      {
        "start": 37.28,
        "end": 43.88
      },
      {
        "start": 43.88,
        "end": 48.68
      },
      {
        "start": 48.68,
        "end": 56.4
      },
      {
        "start": 56.4,
        "end": 63.96
      },
      {
        "start": 63.96,
        "end": 80.04
      },
      {
        "start": 80.04,
        "end": 91.88
      },
      {
        "start": 91.88,
        "end": 99.08
      },
      {
        "start": 99.08,
        "end": 111.2
      }
    ],
    "captions": {
      "de": [
        "Lange Texte inhaltlich behalten",
        "Du lernst, die Aussagen und Zusammenhänge eines Textes ohne Vorlage wiederzugeben. Das hilft bei Sachtexten, Vorträgen und Prüfungsvorbereitung.",
        "Eine Zusammenfassung enthält nicht jedes Detail. Wenn genaue Zahlen oder Formulierungen wichtig sind, übe sie zusätzlich. Beginne mit einem kurzen Abschnitt; verlängere ihn erst, wenn du ihn erklären kannst.",
        "Lies einen Abschnitt und kläre unbekannte Begriffe.",
        "Teile ihn nach Gedanken auf. Gib jedem Gedanken eine kurze Überschrift.",
        "Formuliere eine Frage pro Abschnitt: Was passiert? Warum? Welche Folge hat es?",
        "Decke die Vorlage ab und beantworte die Fragen in eigenen Worten.",
        "Vergleiche mit dem Original: Welche Aussage fehlt, welche Verbindung ist falsch? Korrigiere gezielt.",
        "Rufe den Inhalt später erneut ab. Passe den Abstand daran an, wie sicher der Abruf gelingt.",
        "Eine Stadt pflanzt Bäume an einer viel befahrenen Straße. Ihre Kronen spenden Schatten. Wasser verdunstet über die Blätter und trägt zur Kühlung bei. Damit die Bäume bei Trockenheit gesund bleiben, brauchen sie ausreichend Wasser und Platz für ihre Wurzeln.",
        "Drei Sinnabschnitte: Maßnahme (Bäume pflanzen), Wirkung (Schatten und Verdunstung), Voraussetzung (Wasser und Wurzelraum). Die Gliederung hält den Zusammenhang fest.",
        "Erkläre ohne Vorlage: Welche Maßnahme wird beschrieben, wie wirkt sie und was braucht sie?",
        "Nimm einen eigenen kurzen Sachtext. Erstelle drei Leitfragen, lege den Text weg und beantworte sie. Steigere später die Länge, nicht nur die Anzahl der Wiederholungen."
      ],
      "en": [
        "Remember the meaning of long texts",
        "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
        "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
        "Read a passage and clarify unfamiliar terms.",
        "Group it by ideas and give each group a short heading.",
        "Ask a question for each part: what happens, why, and with what result?",
        "Hide the source and answer in your own words.",
        "Compare with the original. Correct missing ideas and mistaken connections.",
        "Recall it again later. Adjust the interval to how reliably you remember.",
        "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
        "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
        "Without looking, explain the action, how it works and what it requires.",
        "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length."
      ],
      "fr": [
        "Retenir le sens d’un texte long",
        "Apprends à restituer les idées et les liens d’un texte sans le regarder. Cette méthode convient aux textes documentaires, aux présentations et à la préparation d’un examen.",
        "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage et allonge-le lorsque tu sais l’expliquer.",
        "Lis un passage et clarifie les termes inconnus.",
        "Découpe-le en idées et donne un titre court à chacune.",
        "Pose une question par partie : que se passe-t-il, pourquoi et avec quelles conséquences ?",
        "Cache le texte et réponds avec tes propres mots.",
        "Compare avec l’original. Corrige les idées manquantes et les liens erronés.",
        "Essaie de nouveau plus tard. Adapte l’intervalle à la qualité de ton rappel.",
        "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. L’eau qui s’évapore par les feuilles contribue au refroidissement. Pour rester en bonne santé pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau et d’espace pour leurs racines.",
        "Trois parties : l’action (planter des arbres), les effets (ombre et évaporation) et les conditions (eau et espace pour les racines). Ce plan conserve les liens entre les idées.",
        "Sans regarder le texte, explique l’action décrite, ses effets et ses conditions.",
        "Choisis un court texte documentaire. Prépare trois questions, mets le texte de côté et réponds. Augmente progressivement la longueur du passage."
      ],
      "es": [
        "Recuerda el significado de textos largos",
        "Aprende a recordar las ideas y relaciones en un texto sin mirar. Usa esto para lectura factual, presentaciones y preparación de exámenes.",
        "Un resumen no conserva todos los detalles. Practica números o palabras exactas por separado cuando sea necesario. Comienza con un pasaje corto y aumenta su longitud después de que puedas explicarlo.",
        "Lee un fragmento y aclara los términos desconocidos.",
        "Agrúpalo por ideas y asigna un título breve a cada grupo.",
        "Formula una pregunta para cada parte: ¿qué ocurre, por qué y con qué resultado?",
        "Oculta la fuente y responde en tus propias palabras.",
        "Compara con el original. Corrige ideas faltantes y conexiones erróneas.",
        "Recuerda nuevamente más tarde. Ajusta el intervalo según la confiabilidad con la que lo recuerdas.",
        "Un pueblo planta árboles al lado de una carretera con tráfico intenso. Sus copas proporcionan sombra. El agua se evapora a través de las hojas y contribuye al enfriamiento. Para permanecer saludables en condiciones de sequía, los árboles necesitan suficiente agua y espacio para sus raíces.",
        "Tres grupos: acción (plantar árboles), efectos (sombra y evaporación) y requisitos (agua y espacio para las raíces). El esquema conserva su relación.",
        "Sin mirar, explica la acción, cómo funciona y qué requiere.",
        "Elige un breve texto factual propio. Escribe tres preguntas guía, pon el texto lejos y responde a ellas. Aumenta gradualmente su longitud."
      ],
      "it": [
        "Ricorda il significato dei testi lunghi",
        "Apprendi a ricordare le idee e le relazioni in un testo senza guardare. Usa questo per la lettura fattuale, le presentazioni e la preparazione degli esami.",
        "Un riassunto non preserva ogni dettaglio. Pratica numeri o parole esatte separatamente quando necessario. Inizia con un breve passaggio e aumenta la sua lunghezza dopo averne spiegato il contenuto.",
        "Leggi un passaggio e chiarisci termini sconosciuti.",
        "Organizzalo per idee e assegna a ciascun gruppo un breve titolo.",
        "Fai una domanda per ogni parte: cosa accade, perché e con quale risultato?",
        "Nascondi la fonte e rispondi in parole tue.",
        "Compara con l'originale. Correggi idee mancanti e connessioni errate.",
        "Richiama il contenuto più tardi. Adatta l’intervallo a quanto riesci a ricordare con sicurezza.",
        "Un comune pianta alberi accanto a una strada trafficata. Le chiome fanno ombra. L’acqua evapora dalle foglie e contribuisce al raffreddamento. Per restare sani durante la siccità, gli alberi hanno bisogno di acqua sufficiente e spazio per le radici.",
        "Tre gruppi: azione (piantare alberi), effetti (ombra ed evaporazione), requisiti (acqua e spazio per le radici). Lo schema conserva il rapporto tra questi elementi.",
        "Senza guardare, spiega l'azione, come funziona e cosa richiede.",
        "Scegli un breve testo fattuale di tua scelta. Scrivi tre domande guida, metti da parte il testo e rispondi a queste domande. Aumenta progressivamente la lunghezza."
      ],
      "pt": [
        "Lembre-se do significado de textos longos",
        "Aprenda a lembrar as ideias e as relações em um texto sem olhar. Use isso para leitura factual, apresentações e preparação para provas.",
        "Um resumo não preserva todos os detalhes. Pratique números ou frases exatas separadamente quando necessário. Comece com um trecho curto e aumente o comprimento depois que conseguir explicá-lo.",
        "Leia um trecho e esclareça termos desconhecidos.",
        "Agrupe por ideias e dê a cada grupo um título curto.",
        "Formule uma pergunta para cada parte: o que acontece, porquê e com que resultado?",
        "Oculte a fonte e responda em suas próprias palavras.",
        "Compare com o original. Corrija ideias faltantes e conexões incorretas.",
        "Lembre-se novamente mais tarde. Ajuste o intervalo de acordo com a confiabilidade da memória.",
        "Uma cidade planta árvores junto a uma estrada movimentada. As copas dão sombra. A água evapora pelas folhas e contribui para o arrefecimento. Para se manterem saudáveis durante a seca, as árvores precisam de água suficiente e espaço para as raízes.",
        "Três grupos: ação (plantar árvores), efeitos (sombra e evaporação) e requisitos (água e espaço para as raízes). O esboço preserva suas relações.",
        "Sem olhar, explique a ação, como ela funciona e o que exige.",
        "Escolha um breve texto factual de sua própria escolha. Escreva três perguntas orientadoras, coloque o texto de lado e responda a elas. Aumente gradualmente o comprimento."
      ],
      "nl": [
        "Onthoud de betekenis van lange teksten",
        "Leer de ideeën en verbanden in een tekst uit je geheugen op te halen. Gebruik dit voor informatieve teksten, presentaties en examenvoorbereiding.",
        "Een samenvatting bewaart niet elk detail. Oefen zo nodig exacte getallen of formuleringen apart. Begin met een korte passage en maak die langer zodra je haar kunt uitleggen.",
        "Lees een tekst en verduidelijk onbekende termen.",
        "Groepeer de tekst per idee en geef elke groep een kort kopje.",
        "Stel een vraag per deel: wat gebeurt er, waarom, en met welk resultaat?",
        "Verberg de bron en antwoord in je eigen woorden.",
        "Vergelijk met de oorspronkelijke tekst. Corrigeer ontbrekende ideeën en verkeerde verbindingen.",
        "Haal de inhoud later opnieuw op. Pas het interval aan aan hoe betrouwbaar je kunt herinneren.",
        "Een stad plant bomen langs een drukke weg. De boomkronen geven schaduw. Water verdampt via de bladeren en draagt bij aan verkoeling. Om gezond te blijven tijdens droogte hebben de bomen voldoende water en ruimte voor hun wortels nodig.",
        "Drie groepen: actie (bomen planten), effecten (schaduw en verdamping), en vereisten (water en wortelruimte). De structuur behoudt hun relatie.",
        "Zonder te kijken, leg uit wat de actie is, hoe het werkt en wat het vereist.",
        "Kies een korte feitelijke tekst van jezelf. Schrijf drie richtvragen, zet de tekst weg en beantwoord ze. Verhoog geleidelijk de lengte."
      ],
      "tr": [
        "Uzun metinlerin anlamını hatırla",
        "Bir metindeki fikirleri ve ilişkileri bakmadan hatırlamayı öğren. Bu, bilgi veren metinlerde, sunumlarda ve sınav hazırlığında kullanılabilir.",
        "Özet her ayrıntıyı korumaz. Gerekiyorsa kesin sayıları veya sözcükleri ayrıca çalış. Kısa bir bölümle başla; açıklayabildiğinde uzunluğu artır.",
        "Bir bölüm oku ve bilmediğin terimleri netleştir.",
        "Fikirlere göre grupla ve her gruba kısa bir başlık ver.",
        "Her bölüm için soru sor: ne oluyor, neden ve sonuç ne?",
        "Kaynağı gizle ve kendi sözlerinle cevapla.",
        "Aslıyla karşılaştır. Eksik fikirleri ve yanlış ilişkileri düzelt.",
        "Daha sonra yeniden hatırla. Aralığı ne kadar güvenilir hatırladığına göre ayarla.",
        "Bir şehir, yoğun bir yolun yanına ağaçlar diker. Ağaçların taçları gölge sağlar. Yapraklardan buharlaşan su serinlemeye katkıda bulunur. Kuraklıkta sağlıklı kalmak için ağaçların yeterli suya ve kökleri için alana ihtiyacı vardır.",
        "Üç grup: eylem (ağaç dikmek), etkiler (gölge ve buharlaşma), koşullar (su ve kök alanı). Bu yapı aralarındaki ilişkiyi korur.",
        "Bakmadan eylemi, nasıl etkili olduğunu ve neye ihtiyaç duyduğunu açıkla.",
        "Kısa bir bilgi metni seç. Üç yol gösterici soru yaz, metni kaldır ve soruları cevapla. Uzunluğu adım adım artır."
      ],
      "ar": [
        "تذكّر معنى النصوص الطويلة",
        "تعلّم استرجاع أفكار النص والعلاقات بينها دون النظر إليه. يفيد ذلك في النصوص المعلوماتية والعروض والتحضير للامتحانات.",
        "الملخّص لا يحتفظ بكل التفاصيل. تدرّب على الأرقام أو الألفاظ الدقيقة بشكل منفصل عند الحاجة. ابدأ بفقرة قصيرة وزد طولها بعد أن تستطيع شرحها.",
        "اقرأ فقرة ووضّح المصطلحات المجهولة.",
        "قسّمها حسب الأفكار وضع عنوانًا قصيرًا لكل مجموعة.",
        "اسأل عن كل جزء: ماذا يحدث، ولماذا، وما النتيجة؟",
        "أخفِ المصدر وأجب بكلماتك.",
        "قارن بالأصل. صحّح الأفكار الناقصة والروابط الخاطئة.",
        "استرجعها لاحقًا مرة أخرى. عدّل الفترة بحسب مدى موثوقية التذكّر.",
        "تزرع مدينة أشجارًا بجوار طريق مزدحم. توفّر تيجان الأشجار الظل. يتبخر الماء عبر الأوراق ويساهم في التبريد. للبقاء بصحة جيدة أثناء الجفاف، تحتاج الأشجار إلى ماء كافٍ ومساحة لجذورها.",
        "ثلاث مجموعات: الإجراء (زراعة الأشجار)، الآثار (الظل والتبخر)، والمتطلبات (الماء ومساحة الجذور). يحافظ المخطط على العلاقة بينها.",
        "اشرح دون النظر الإجراء وكيف يعمل وما يحتاج إليه.",
        "اختر نصًا معلوماتيًا قصيرًا. اكتب ثلاثة أسئلة إرشادية، وأبعد النص، ثم أجب. زد الطول تدريجيًا."
      ],
      "zh": [
        "记住长文本的含义",
        "学会在不看原文的情况下回忆文本中的观点和关系。这适用于事实性阅读、演讲和考试准备。",
        "摘要不会保留所有细节。需要时，应单独练习精确的数字或措辞。从短段落开始，当你能解释它时，逐步增加段落长度。",
        "阅读一段文字，并明确不熟悉的术语。",
        "按观点分组，并为每组拟定简短标题。",
        "为每个部分提出一个问题：发生了什么、为什么发生、结果如何？",
        "隐藏原文来源，用自己的话作答。",
        "与原文对比，修正遗漏的观点和错误的联系。",
        "稍后再次回忆，根据你记忆的可靠程度调整间隔时间。",
        "一个城镇在繁忙道路旁种树。树冠提供阴凉。水分经叶片蒸发，有助于降温。为了在干旱时保持健康，树木需要充足的水和根系生长空间。",
        "分为三组：行动（植树）、效果（遮荫和蒸发）和需求（水分和根部空间）。大纲保留了它们之间的关系。",
        "不看原文，解释该行动、其运作方式以及所需条件。",
        "选择一段适合自己的简短说明性文字。写下三个引导问题，收起原文再回答。逐步增加篇幅。"
      ],
      "ja": [
        "長い文章の意味を覚える",
        "原文を見ずに、文章の考えやつながりを思い出す練習です。説明文の学習、発表、試験準備に使えます。",
        "要約はすべての詳細を残すものではありません。正確な数字や語句が必要なら別に練習しましょう。短い段落から始め、説明できたら長くします。",
        "1つの段落を読み、知らない用語を確認しましょう。",
        "考えごとに分け、それぞれに短い見出しを付けましょう。",
        "各部分に質問を作りましょう。何が起きるのか、なぜか、どんな結果になるのか。",
        "原文を隠して、自分の言葉で答えましょう。",
        "原文と比べ、抜けた考えや間違ったつながりを修正しましょう。",
        "後でもう一度思い出しましょう。思い出せる確かさに合わせて間隔を調整します。",
        "ある町が交通量の多い道路沿いに木を植えます。枝葉が日陰を作り、葉から水が蒸発して冷却に役立ちます。乾燥時も健康を保つため、木には十分な水と根が伸びる空間が必要です。",
        "3つに分けられます。行動は植樹、効果は日陰と蒸発、必要条件は水と根の空間です。この整理で相互の関係を保てます。",
        "原文を見ずに、行動、その仕組み、必要条件を説明しましょう。",
        "自分の学習用の短い説明文を選びましょう。3つの問いを書き、原文を隠して答えます。少しずつ文章を長くしましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "text-meaning",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-text-meaning-en-visual-1dec9323d795.mp4",
    "bytes": 1409333,
    "sha256": "1dec9323d795873934da7ee93790f2c09b072069a53fe03153a183543d011223",
    "duration": 97.08,
    "recallBoundary": 86.036208,
    "cues": [
      {
        "start": 0.0,
        "end": 3.16
      },
      {
        "start": 3.16,
        "end": 13.12
      },
      {
        "start": 13.12,
        "end": 24.32
      },
      {
        "start": 24.32,
        "end": 28.4
      },
      {
        "start": 28.4,
        "end": 33.08
      },
      {
        "start": 33.08,
        "end": 39.2
      },
      {
        "start": 39.2,
        "end": 43.04
      },
      {
        "start": 43.04,
        "end": 48.96
      },
      {
        "start": 48.96,
        "end": 55.24
      },
      {
        "start": 55.24,
        "end": 70.08
      },
      {
        "start": 70.08,
        "end": 81.12
      },
      {
        "start": 81.12,
        "end": 87.04
      },
      {
        "start": 87.04,
        "end": 97.08
      }
    ],
    "captions": {
      "de": [
        "Lange Texte inhaltlich behalten",
        "Du lernst, die Aussagen und Zusammenhänge eines Textes ohne Vorlage wiederzugeben. Das hilft bei Sachtexten, Vorträgen und Prüfungsvorbereitung.",
        "Eine Zusammenfassung enthält nicht jedes Detail. Wenn genaue Zahlen oder Formulierungen wichtig sind, übe sie zusätzlich. Beginne mit einem kurzen Abschnitt; verlängere ihn erst, wenn du ihn erklären kannst.",
        "Lies einen Abschnitt und kläre unbekannte Begriffe.",
        "Teile ihn nach Gedanken auf. Gib jedem Gedanken eine kurze Überschrift.",
        "Formuliere eine Frage pro Abschnitt: Was passiert? Warum? Welche Folge hat es?",
        "Decke die Vorlage ab und beantworte die Fragen in eigenen Worten.",
        "Vergleiche mit dem Original: Welche Aussage fehlt, welche Verbindung ist falsch? Korrigiere gezielt.",
        "Rufe den Inhalt später erneut ab. Passe den Abstand daran an, wie sicher der Abruf gelingt.",
        "Eine Stadt pflanzt Bäume an einer viel befahrenen Straße. Ihre Kronen spenden Schatten. Wasser verdunstet über die Blätter und trägt zur Kühlung bei. Damit die Bäume bei Trockenheit gesund bleiben, brauchen sie ausreichend Wasser und Platz für ihre Wurzeln.",
        "Drei Sinnabschnitte: Maßnahme (Bäume pflanzen), Wirkung (Schatten und Verdunstung), Voraussetzung (Wasser und Wurzelraum). Die Gliederung hält den Zusammenhang fest.",
        "Erkläre ohne Vorlage: Welche Maßnahme wird beschrieben, wie wirkt sie und was braucht sie?",
        "Nimm einen eigenen kurzen Sachtext. Erstelle drei Leitfragen, lege den Text weg und beantworte sie. Steigere später die Länge, nicht nur die Anzahl der Wiederholungen."
      ],
      "en": [
        "Remember the meaning of long texts",
        "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
        "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
        "Read a passage and clarify unfamiliar terms.",
        "Group it by ideas and give each group a short heading.",
        "Ask a question for each part: what happens, why, and with what result?",
        "Hide the source and answer in your own words.",
        "Compare with the original. Correct missing ideas and mistaken connections.",
        "Recall it again later. Adjust the interval to how reliably you remember.",
        "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
        "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
        "Without looking, explain the action, how it works and what it requires.",
        "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length."
      ],
      "fr": [
        "Retenir le sens d’un texte long",
        "Apprends à restituer les idées et les liens d’un texte sans le regarder. Cette méthode convient aux textes documentaires, aux présentations et à la préparation d’un examen.",
        "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage et allonge-le lorsque tu sais l’expliquer.",
        "Lis un passage et clarifie les termes inconnus.",
        "Découpe-le en idées et donne un titre court à chacune.",
        "Pose une question par partie : que se passe-t-il, pourquoi et avec quelles conséquences ?",
        "Cache le texte et réponds avec tes propres mots.",
        "Compare avec l’original. Corrige les idées manquantes et les liens erronés.",
        "Essaie de nouveau plus tard. Adapte l’intervalle à la qualité de ton rappel.",
        "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. L’eau qui s’évapore par les feuilles contribue au refroidissement. Pour rester en bonne santé pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau et d’espace pour leurs racines.",
        "Trois parties : l’action (planter des arbres), les effets (ombre et évaporation) et les conditions (eau et espace pour les racines). Ce plan conserve les liens entre les idées.",
        "Sans regarder le texte, explique l’action décrite, ses effets et ses conditions.",
        "Choisis un court texte documentaire. Prépare trois questions, mets le texte de côté et réponds. Augmente progressivement la longueur du passage."
      ],
      "es": [
        "Recuerda el significado de textos largos",
        "Aprende a recordar las ideas y relaciones en un texto sin mirar. Usa esto para lectura factual, presentaciones y preparación de exámenes.",
        "Un resumen no conserva todos los detalles. Practica números o palabras exactas por separado cuando sea necesario. Comienza con un pasaje corto y aumenta su longitud después de que puedas explicarlo.",
        "Lee un fragmento y aclara los términos desconocidos.",
        "Agrúpalo por ideas y asigna un título breve a cada grupo.",
        "Formula una pregunta para cada parte: ¿qué ocurre, por qué y con qué resultado?",
        "Oculta la fuente y responde en tus propias palabras.",
        "Compara con el original. Corrige ideas faltantes y conexiones erróneas.",
        "Recuerda nuevamente más tarde. Ajusta el intervalo según la confiabilidad con la que lo recuerdas.",
        "Un pueblo planta árboles al lado de una carretera con tráfico intenso. Sus copas proporcionan sombra. El agua se evapora a través de las hojas y contribuye al enfriamiento. Para permanecer saludables en condiciones de sequía, los árboles necesitan suficiente agua y espacio para sus raíces.",
        "Tres grupos: acción (plantar árboles), efectos (sombra y evaporación) y requisitos (agua y espacio para las raíces). El esquema conserva su relación.",
        "Sin mirar, explica la acción, cómo funciona y qué requiere.",
        "Elige un breve texto factual propio. Escribe tres preguntas guía, pon el texto lejos y responde a ellas. Aumenta gradualmente su longitud."
      ],
      "it": [
        "Ricorda il significato dei testi lunghi",
        "Apprendi a ricordare le idee e le relazioni in un testo senza guardare. Usa questo per la lettura fattuale, le presentazioni e la preparazione degli esami.",
        "Un riassunto non preserva ogni dettaglio. Pratica numeri o parole esatte separatamente quando necessario. Inizia con un breve passaggio e aumenta la sua lunghezza dopo averne spiegato il contenuto.",
        "Leggi un passaggio e chiarisci termini sconosciuti.",
        "Organizzalo per idee e assegna a ciascun gruppo un breve titolo.",
        "Fai una domanda per ogni parte: cosa accade, perché e con quale risultato?",
        "Nascondi la fonte e rispondi in parole tue.",
        "Compara con l'originale. Correggi idee mancanti e connessioni errate.",
        "Richiama il contenuto più tardi. Adatta l’intervallo a quanto riesci a ricordare con sicurezza.",
        "Un comune pianta alberi accanto a una strada trafficata. Le chiome fanno ombra. L’acqua evapora dalle foglie e contribuisce al raffreddamento. Per restare sani durante la siccità, gli alberi hanno bisogno di acqua sufficiente e spazio per le radici.",
        "Tre gruppi: azione (piantare alberi), effetti (ombra ed evaporazione), requisiti (acqua e spazio per le radici). Lo schema conserva il rapporto tra questi elementi.",
        "Senza guardare, spiega l'azione, come funziona e cosa richiede.",
        "Scegli un breve testo fattuale di tua scelta. Scrivi tre domande guida, metti da parte il testo e rispondi a queste domande. Aumenta progressivamente la lunghezza."
      ],
      "pt": [
        "Lembre-se do significado de textos longos",
        "Aprenda a lembrar as ideias e as relações em um texto sem olhar. Use isso para leitura factual, apresentações e preparação para provas.",
        "Um resumo não preserva todos os detalhes. Pratique números ou frases exatas separadamente quando necessário. Comece com um trecho curto e aumente o comprimento depois que conseguir explicá-lo.",
        "Leia um trecho e esclareça termos desconhecidos.",
        "Agrupe por ideias e dê a cada grupo um título curto.",
        "Formule uma pergunta para cada parte: o que acontece, porquê e com que resultado?",
        "Oculte a fonte e responda em suas próprias palavras.",
        "Compare com o original. Corrija ideias faltantes e conexões incorretas.",
        "Lembre-se novamente mais tarde. Ajuste o intervalo de acordo com a confiabilidade da memória.",
        "Uma cidade planta árvores junto a uma estrada movimentada. As copas dão sombra. A água evapora pelas folhas e contribui para o arrefecimento. Para se manterem saudáveis durante a seca, as árvores precisam de água suficiente e espaço para as raízes.",
        "Três grupos: ação (plantar árvores), efeitos (sombra e evaporação) e requisitos (água e espaço para as raízes). O esboço preserva suas relações.",
        "Sem olhar, explique a ação, como ela funciona e o que exige.",
        "Escolha um breve texto factual de sua própria escolha. Escreva três perguntas orientadoras, coloque o texto de lado e responda a elas. Aumente gradualmente o comprimento."
      ],
      "nl": [
        "Onthoud de betekenis van lange teksten",
        "Leer de ideeën en verbanden in een tekst uit je geheugen op te halen. Gebruik dit voor informatieve teksten, presentaties en examenvoorbereiding.",
        "Een samenvatting bewaart niet elk detail. Oefen zo nodig exacte getallen of formuleringen apart. Begin met een korte passage en maak die langer zodra je haar kunt uitleggen.",
        "Lees een tekst en verduidelijk onbekende termen.",
        "Groepeer de tekst per idee en geef elke groep een kort kopje.",
        "Stel een vraag per deel: wat gebeurt er, waarom, en met welk resultaat?",
        "Verberg de bron en antwoord in je eigen woorden.",
        "Vergelijk met de oorspronkelijke tekst. Corrigeer ontbrekende ideeën en verkeerde verbindingen.",
        "Haal de inhoud later opnieuw op. Pas het interval aan aan hoe betrouwbaar je kunt herinneren.",
        "Een stad plant bomen langs een drukke weg. De boomkronen geven schaduw. Water verdampt via de bladeren en draagt bij aan verkoeling. Om gezond te blijven tijdens droogte hebben de bomen voldoende water en ruimte voor hun wortels nodig.",
        "Drie groepen: actie (bomen planten), effecten (schaduw en verdamping), en vereisten (water en wortelruimte). De structuur behoudt hun relatie.",
        "Zonder te kijken, leg uit wat de actie is, hoe het werkt en wat het vereist.",
        "Kies een korte feitelijke tekst van jezelf. Schrijf drie richtvragen, zet de tekst weg en beantwoord ze. Verhoog geleidelijk de lengte."
      ],
      "tr": [
        "Uzun metinlerin anlamını hatırla",
        "Bir metindeki fikirleri ve ilişkileri bakmadan hatırlamayı öğren. Bu, bilgi veren metinlerde, sunumlarda ve sınav hazırlığında kullanılabilir.",
        "Özet her ayrıntıyı korumaz. Gerekiyorsa kesin sayıları veya sözcükleri ayrıca çalış. Kısa bir bölümle başla; açıklayabildiğinde uzunluğu artır.",
        "Bir bölüm oku ve bilmediğin terimleri netleştir.",
        "Fikirlere göre grupla ve her gruba kısa bir başlık ver.",
        "Her bölüm için soru sor: ne oluyor, neden ve sonuç ne?",
        "Kaynağı gizle ve kendi sözlerinle cevapla.",
        "Aslıyla karşılaştır. Eksik fikirleri ve yanlış ilişkileri düzelt.",
        "Daha sonra yeniden hatırla. Aralığı ne kadar güvenilir hatırladığına göre ayarla.",
        "Bir şehir, yoğun bir yolun yanına ağaçlar diker. Ağaçların taçları gölge sağlar. Yapraklardan buharlaşan su serinlemeye katkıda bulunur. Kuraklıkta sağlıklı kalmak için ağaçların yeterli suya ve kökleri için alana ihtiyacı vardır.",
        "Üç grup: eylem (ağaç dikmek), etkiler (gölge ve buharlaşma), koşullar (su ve kök alanı). Bu yapı aralarındaki ilişkiyi korur.",
        "Bakmadan eylemi, nasıl etkili olduğunu ve neye ihtiyaç duyduğunu açıkla.",
        "Kısa bir bilgi metni seç. Üç yol gösterici soru yaz, metni kaldır ve soruları cevapla. Uzunluğu adım adım artır."
      ],
      "ar": [
        "تذكّر معنى النصوص الطويلة",
        "تعلّم استرجاع أفكار النص والعلاقات بينها دون النظر إليه. يفيد ذلك في النصوص المعلوماتية والعروض والتحضير للامتحانات.",
        "الملخّص لا يحتفظ بكل التفاصيل. تدرّب على الأرقام أو الألفاظ الدقيقة بشكل منفصل عند الحاجة. ابدأ بفقرة قصيرة وزد طولها بعد أن تستطيع شرحها.",
        "اقرأ فقرة ووضّح المصطلحات المجهولة.",
        "قسّمها حسب الأفكار وضع عنوانًا قصيرًا لكل مجموعة.",
        "اسأل عن كل جزء: ماذا يحدث، ولماذا، وما النتيجة؟",
        "أخفِ المصدر وأجب بكلماتك.",
        "قارن بالأصل. صحّح الأفكار الناقصة والروابط الخاطئة.",
        "استرجعها لاحقًا مرة أخرى. عدّل الفترة بحسب مدى موثوقية التذكّر.",
        "تزرع مدينة أشجارًا بجوار طريق مزدحم. توفّر تيجان الأشجار الظل. يتبخر الماء عبر الأوراق ويساهم في التبريد. للبقاء بصحة جيدة أثناء الجفاف، تحتاج الأشجار إلى ماء كافٍ ومساحة لجذورها.",
        "ثلاث مجموعات: الإجراء (زراعة الأشجار)، الآثار (الظل والتبخر)، والمتطلبات (الماء ومساحة الجذور). يحافظ المخطط على العلاقة بينها.",
        "اشرح دون النظر الإجراء وكيف يعمل وما يحتاج إليه.",
        "اختر نصًا معلوماتيًا قصيرًا. اكتب ثلاثة أسئلة إرشادية، وأبعد النص، ثم أجب. زد الطول تدريجيًا."
      ],
      "zh": [
        "记住长文本的含义",
        "学会在不看原文的情况下回忆文本中的观点和关系。这适用于事实性阅读、演讲和考试准备。",
        "摘要不会保留所有细节。需要时，应单独练习精确的数字或措辞。从短段落开始，当你能解释它时，逐步增加段落长度。",
        "阅读一段文字，并明确不熟悉的术语。",
        "按观点分组，并为每组拟定简短标题。",
        "为每个部分提出一个问题：发生了什么、为什么发生、结果如何？",
        "隐藏原文来源，用自己的话作答。",
        "与原文对比，修正遗漏的观点和错误的联系。",
        "稍后再次回忆，根据你记忆的可靠程度调整间隔时间。",
        "一个城镇在繁忙道路旁种树。树冠提供阴凉。水分经叶片蒸发，有助于降温。为了在干旱时保持健康，树木需要充足的水和根系生长空间。",
        "分为三组：行动（植树）、效果（遮荫和蒸发）和需求（水分和根部空间）。大纲保留了它们之间的关系。",
        "不看原文，解释该行动、其运作方式以及所需条件。",
        "选择一段适合自己的简短说明性文字。写下三个引导问题，收起原文再回答。逐步增加篇幅。"
      ],
      "ja": [
        "長い文章の意味を覚える",
        "原文を見ずに、文章の考えやつながりを思い出す練習です。説明文の学習、発表、試験準備に使えます。",
        "要約はすべての詳細を残すものではありません。正確な数字や語句が必要なら別に練習しましょう。短い段落から始め、説明できたら長くします。",
        "1つの段落を読み、知らない用語を確認しましょう。",
        "考えごとに分け、それぞれに短い見出しを付けましょう。",
        "各部分に質問を作りましょう。何が起きるのか、なぜか、どんな結果になるのか。",
        "原文を隠して、自分の言葉で答えましょう。",
        "原文と比べ、抜けた考えや間違ったつながりを修正しましょう。",
        "後でもう一度思い出しましょう。思い出せる確かさに合わせて間隔を調整します。",
        "ある町が交通量の多い道路沿いに木を植えます。枝葉が日陰を作り、葉から水が蒸発して冷却に役立ちます。乾燥時も健康を保つため、木には十分な水と根が伸びる空間が必要です。",
        "3つに分けられます。行動は植樹、効果は日陰と蒸発、必要条件は水と根の空間です。この整理で相互の関係を保てます。",
        "原文を見ずに、行動、その仕組み、必要条件を説明しましょう。",
        "自分の学習用の短い説明文を選びましょう。3つの問いを書き、原文を隠して答えます。少しずつ文章を長くしましょう。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "text-verbatim",
    "coach": "rafael",
    "language": "de",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-text-verbatim-de-visual-17acd8f748eb.mp4",
    "bytes": 1356902,
    "sha256": "17acd8f748eba30b8b45511da71e2f19f6b6f3427c5e0e0c5f7f64ef24b6ea87",
    "duration": 95.76,
    "recallBoundary": 83.49054199999999,
    "cues": [
      {
        "start": 0.0,
        "end": 3.0
      },
      {
        "start": 3.0,
        "end": 13.48
      },
      {
        "start": 13.48,
        "end": 25.72
      },
      {
        "start": 25.72,
        "end": 29.68
      },
      {
        "start": 29.68,
        "end": 33.8
      },
      {
        "start": 33.8,
        "end": 38.72
      },
      {
        "start": 38.72,
        "end": 46.28
      },
      {
        "start": 46.28,
        "end": 53.4
      },
      {
        "start": 53.4,
        "end": 59.92
      },
      {
        "start": 59.92,
        "end": 67.68
      },
      {
        "start": 67.68,
        "end": 79.92
      },
      {
        "start": 79.92,
        "end": 84.28
      },
      {
        "start": 84.28,
        "end": 95.76
      }
    ],
    "captions": {
      "de": [
        "Texte wortgetreu lernen",
        "Du übst den genauen Wortlaut, etwa für ein Gedicht, eine Definition oder einen kurzen Vortrag. Dabei zählen auch kleine Wörter und die Reihenfolge.",
        "Wortgetreuer Abruf beweist nicht, dass du den Inhalt verstanden hast. Kläre zuerst die Bedeutung. Ein Merkbilder-Weg kann die Reihenfolge stützen, ersetzt aber nicht das Üben des Wortlauts.",
        "Verstehe den Text und wähle eine kurze Sinneinheit.",
        "Lies sie aufmerksam und sprich sie einmal deutlich.",
        "Verdecke die Vorlage und sage oder schreibe sie aus dem Gedächtnis.",
        "Vergleiche Wort für Wort. Korrigiere Auslassungen, Vertauschungen und hinzugefügte Wörter.",
        "Übe die nächste Einheit und danach den Übergang zwischen beiden. Beginne gelegentlich in der Mitte.",
        "Wiederhole später ohne Vorlage. Verlängere den Abschnitt erst, wenn der aktuelle sicher gelingt.",
        "Am Morgen öffne ich das Fenster. Frische Luft strömt ins Zimmer. Danach beginne ich meinen Tag.",
        "Drei kurze Sätze bilden drei Übungseinheiten. Übe zuerst Satz eins, dann Satz zwei und schließlich ihren Übergang. Starte einen späteren Versuch auch mit „Frische Luft …“.",
        "Schreibe die drei Sätze möglichst genau aus dem Gedächtnis.",
        "Nutze eine eigene kurze Passage, die du wortgetreu brauchst. Prüfe den Wortlaut selbst am Original; eine bloß ähnliche Formulierung erfüllt dieses Lernziel nicht."
      ],
      "en": [
        "Learn a text word for word",
        "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
        "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
        "Understand the text and choose a short meaningful passage.",
        "Read it carefully and say it clearly once.",
        "Hide it and say or write it from memory.",
        "Compare word for word. Correct omissions, changes in order and added words.",
        "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "Recall it again later without looking. Extend the passage after the current part becomes reliable.",
        "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
        "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
        "Write the three sentences as accurately as you can from memory.",
        "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal."
      ],
      "fr": [
        "Apprendre un texte mot pour mot",
        "Travaille la formulation exacte d’un poème, d’une définition ou d’un court discours. Les petits mots et leur ordre comptent aussi.",
        "Réciter exactement ne prouve pas que tu as compris. Clarifie d’abord le sens. Des images mentales peuvent soutenir l’ordre des idées, mais elles ne remplacent pas le travail sur les mots.",
        "Comprends le texte et choisis un court passage cohérent.",
        "Lis-le attentivement et prononce-le clairement une fois.",
        "Cache-le, puis récite-le ou écris-le de mémoire.",
        "Compare mot à mot. Corrige les omissions, les inversions et les ajouts.",
        "Travaille le passage suivant, puis la transition entre les deux. Commence parfois au milieu.",
        "Essaie de nouveau plus tard sans modèle. Allonge le passage lorsque le rappel devient fiable.",
        "Le matin, j’ouvre la fenêtre. L’air frais entre dans la pièce. Ensuite, je commence ma journée.",
        "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Lors d’un autre essai, commence aussi par « L’air frais… ».",
        "Écris les trois phrases de mémoire en respectant leur formulation aussi précisément que possible.",
        "Choisis un court passage dont la formulation compte pour toi. Vérifie les mots dans l’original : une reformulation ne répond pas à cet objectif précis."
      ],
      "es": [
        "Aprende un texto palabra por palabra",
        "Practica las palabras exactas de un poema, una definición o un discurso breve. También importan las palabras pequeñas y su orden.",
        "El recuerdo exacto no demuestra comprensión. Asegúrate de entender primero el significado. Imágenes mentales pueden ayudar a recordar el orden de las ideas, pero no sustituyen la práctica del lenguaje exacto.",
        "Entiende el texto y elige un pasaje breve y significativo.",
        "Léelo con atención y dilo claramente una vez.",
        "Oculta el texto y di o escribe el contenido desde la memoria.",
        "Compara palabra por palabra. Corrige omisiones, cambios de orden y palabras añadidas.",
        "Practica el siguiente fragmento y después la transición entre ambos. Empieza a veces por la mitad.",
        "Vuelve a recordarlo más tarde sin mirar. Amplía el fragmento cuando recuerdes con seguridad el actual.",
        "En la mañana abro la ventana. El aire fresco fluye en la habitación. Luego comienzo mi día.",
        "Las tres oraciones forman tres unidades de práctica. Aprende la primera, luego la segunda y su transición. Comienza un intento posterior en «Aire fresco…» también.",
        "Escribe las tres oraciones con la mayor precisión posible desde la memoria.",
        "Elige un fragmento breve cuyas palabras exactas necesites aprender. Compáralo con el original: una paráfrasis no cumple este objetivo."
      ],
      "it": [
        "Impara un testo parola per parola",
        "Esercita le parole esatte di una poesia, una definizione o un breve discorso. Contano anche le parole piccole e il loro ordine.",
        "Ricordare le parole esatte non dimostra comprensione. Chiarisci prima il significato. Le immagini mentali possono aiutare con l’ordine delle idee, ma non sostituiscono l’esercizio delle parole stesse.",
        "Capisci il testo e scegli un breve passaggio significativo.",
        "Leggi attentamente il brano e pronuncialo chiaramente una volta.",
        "Nascondilo e ripetilo o scrivilo a memoria.",
        "Compara parola per parola. Correggi omissioni, cambi di ordine e parole aggiunte.",
        "Esercita il brano successivo, poi il collegamento tra i due. Ogni tanto inizia da metà testo.",
        "Richiama il testo più tardi senza guardare. Allunga il brano quando ricordi con sicurezza quello attuale.",
        "Alla mattina apro la finestra. L'aria fresca entra in camera. Poi inizio il giorno.",
        "Le tre frasi formano tre unità di esercizio. Impara la prima, poi la seconda e il loro collegamento. In un tentativo successivo parti anche da «L’aria fresca…».",
        "Scrivi le tre frasi a memoria nel modo più preciso possibile.",
        "Scegli un breve brano di cui ti servono le parole esatte. Confrontalo con l’originale: una parafrasi non soddisfa questo obiettivo."
      ],
      "pt": [
        "Aprenda um texto palavra por palavra",
        "Pratique a formulação exata de um poema, definição ou discurso curto. As palavras pequenas e a sua ordem importam também.",
        "Recordar as palavras exatas não prova a compreensão. Esclareça primeiro o significado. As imagens mentais podem ajudar com a ordem das ideias, mas não substituem a prática das palavras originais.",
        "Compreenda o texto e escolha um trecho curto e significativo.",
        "Leia com atenção e diga claramente uma vez.",
        "Esconda-o e diga ou escreva de memória.",
        "Compare palavra por palavra. Corrija omissões, mudanças de ordem e palavras adicionadas.",
        "Pratique o próximo trecho, depois a transição entre eles. Às vezes, comece no meio.",
        "Recorde o texto novamente mais tarde, sem olhar. Aumente o trecho quando conseguir recordar com segurança o atual.",
        "Na manhã, abro a janela. O ar fresco entra na sala. Depois, começo o dia.",
        "As três frases formam três unidades de prática. Aprenda a primeira, depois a segunda e a transição entre ambas. Num ensaio posterior, comece também em «O ar fresco…».",
        "Escreva as três frases com a maior precisão possível de memória.",
        "Escolha um trecho curto cuja formulação importa para você. Compare com a fonte original; uma paráfrase não atende a este objetivo particular."
      ],
      "nl": [
        "Leer een tekst woord voor woord",
        "Oefen de precieze formulering van een gedicht, definitie of korte toespraak. Ook kleine woorden en hun volgorde tellen mee.",
        "Precies onthouden bewijst niet dat je de inhoud begrijpt. Verduidelijk eerst de betekenis. Denkbeelden kunnen de volgorde ondersteunen, maar vervangen het oefenen van de precieze woorden niet.",
        "Begrijp de tekst en kies een korte, samenhangende passage.",
        "Lees die aandachtig en spreek haar eenmaal duidelijk uit.",
        "Verberg de tekst en zeg of schrijf haar uit je geheugen op.",
        "Vergelijk woord voor woord. Corrigeer weglatingen, verwisselingen en toegevoegde woorden.",
        "Oefen de volgende passage en daarna de overgang tussen beide. Begin soms in het midden.",
        "Haal de tekst later opnieuw op zonder te kijken. Maak de passage langer zodra je het huidige deel betrouwbaar kunt ophalen.",
        "In de ochtend open ik het raam. Frisse lucht stroomt de kamer binnen. Daarna begin ik mijn dag.",
        "De drie zinnen zijn drie oefeneenheden. Leer eerst de eerste, dan de tweede en hun overgang. Begin een latere poging ook bij «Frisse lucht…».",
        "Schrijf de drie zinnen zo precies mogelijk uit je geheugen op.",
        "Kies een korte passage waarvan de precieze woorden belangrijk voor je zijn. Vergelijk met de bron; een parafrase voldoet niet aan dit leerdoel."
      ],
      "tr": [
        "Bir metni sözcüğü sözcüğüne öğren",
        "Bir şiirin, tanımın veya kısa konuşmanın sözcüklerini aynen çalış. Küçük sözcükler ve sıraları da önemlidir.",
        "Sözcükleri aynen hatırlamak, içeriği anladığını kanıtlamaz. Önce anlamı netleştir. Hayali görüntüler fikirlerin sırasını destekleyebilir; ama asıl sözcükleri çalışmanın yerini tutmaz.",
        "Metni anla ve kısa, anlamlı bir bölüm seç.",
        "Dikkatle oku ve bir kez açıkça söyle.",
        "Gizle ve hafızandan söyle veya yaz.",
        "Sözcük sözcük karşılaştır. Atlanan, sırası değişen veya eklenen sözcükleri düzelt.",
        "Sonraki bölümü, sonra iki bölüm arasındaki geçişi çalış. Bazen ortadan başla.",
        "Daha sonra bakmadan yeniden hatırla. Mevcut bölüm güvenilir biçimde hatırlanınca uzunluğu artır.",
        "Sabah pencereyi açarım. Odaya temiz hava girer. Sonra günüme başlarım.",
        "Üç cümle üç çalışma birimidir. Önce ilkini, sonra ikincisini ve aralarındaki geçişi öğren. Sonraki bir denemeye «Odaya temiz hava…» kısmından da başla.",
        "Üç cümleyi mümkün olduğunca tam olarak hafızandan yaz.",
        "Sözcüklerini aynen öğrenmek istediğin kısa bir bölüm seç. Aslıyla kendin karşılaştır; anlamı başka sözcüklerle anlatmak bu öğrenme hedefini karşılamaz."
      ],
      "ar": [
        "تعلّم النص كلمة بكلمة",
        "تدرّب على الألفاظ الدقيقة لقصيدة أو تعريف أو خطاب قصير. الكلمات الصغيرة وترتيبها مهمان أيضًا.",
        "الاسترجاع الحرفي لا يثبت الفهم. وضّح المعنى أولًا. قد تدعم الصور الذهنية ترتيب الأفكار، لكنها لا تعوّض تدريب الألفاظ الأصلية.",
        "افهم النص واختر فقرة قصيرة ذات معنى.",
        "اقرأها بانتباه وانطقها بوضوح مرة واحدة.",
        "أخفها وقلها أو اكتبها من الذاكرة.",
        "قارن كلمة بكلمة. صحّح الحذف وتبديل الترتيب والكلمات المضافة.",
        "تدرّب على الفقرة التالية ثم الانتقال بينهما. ابدأ أحيانًا من الوسط.",
        "استرجعها لاحقًا دون النظر. أطِل الفقرة عندما تصبح قادرًا على استرجاع الجزء الحالي بثقة.",
        "في الصباح أفتح النافذة. يدخل الهواء المنعش إلى الغرفة. ثم أبدأ يومي.",
        "الجمل الثلاث وحدات تدريب ثلاث. تعلّم الأولى ثم الثانية والانتقال بينهما. ابدأ محاولة لاحقة أيضًا من «يدخل الهواء المنعش…».",
        "اكتب الجمل الثلاث من الذاكرة بأكبر دقة ممكنة.",
        "اختر فقرة قصيرة تحتاج إلى ألفاظها الدقيقة. قارنها بالأصل بنفسك؛ إعادة المعنى بكلمات أخرى لا تحقق هذا الهدف."
      ],
      "zh": [
        "逐字学习文本",
        "练习诗歌、定义或短篇演讲中的精确用词。小词及其顺序同样重要。",
        "逐字回忆并不能证明理解。首先应明确其含义。心理图像可能帮助理解思想顺序，但无法替代实际用词的练习。",
        "理解文本，然后选择一段简短且有意义的段落。",
        "仔细阅读并清晰地说出一次。",
        "隐藏文本，然后从记忆中说出或写出。",
        "逐字对比。纠正遗漏、顺序变化和额外添加的词语。",
        "练习下一段内容，然后练习段落之间的过渡。有时可以从中间开始。",
        "稍后不看原文，再次回忆。当当前部分记忆可靠时，延伸段落内容。",
        "早上我打开窗户。新鲜空气流入房间。然后我开始新的一天。",
        "三个句子是三个练习单元。先学第一句，再学第二句和它们之间的衔接。之后也试着从“新鲜空气……”开始回忆。",
        "尽可能准确地从记忆中写出这三个句子。",
        "选择一段你认为用词重要的短文。自己将其与原文对比；改写版本无法达到此特定目标。"
      ],
      "ja": [
        "文章を一語ずつ正確に覚える",
        "詩、定義、短いスピーチなどの正確な語句を練習します。短い語やその順序も大切です。",
        "正確に思い出せても、意味を理解している証拠にはなりません。先に意味を確認しましょう。イメージは順序を助けても、実際の語句の練習に代わるものではありません。",
        "文章を理解し、短く意味のまとまった部分を選びましょう。",
        "注意深く読み、一度はっきり声に出しましょう。",
        "隠して、記憶から言うか書くかしてみましょう。",
        "一語ずつ比較し、抜け、順序の違い、余計な語を修正しましょう。",
        "次の部分を練習し、両者のつながりも練習しましょう。時には途中から始めます。",
        "後で原文を見ずに思い出しましょう。今の部分を確実に思い出せるようになったら長くします。",
        "朝、私は窓を開けます。新鮮な空気が部屋に流れ込みます。それから一日を始めます。",
        "3つの文が3つの練習単位です。最初の文、次の文、そのつながりを練習しましょう。後の試行では「新鮮な空気…」からも始めてみます。",
        "3つの文を、できるだけ正確に記憶から書きましょう。",
        "正確な語句が必要な短い文章を選び、自分で原文と比較しましょう。言い換えでは、この学習目標を満たしません。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW name reference · Thorsten · CC0",
        "url": "https://github.com/thorstenMueller/Thorsten-Voice",
        "license": "CC0"
      }
    ]
  },
  {
    "course": "text-verbatim",
    "coach": "rafael",
    "language": "en",
    "presentation": "illustrated",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-text-verbatim-en-visual-4ccbcf977a86.mp4",
    "bytes": 1206768,
    "sha256": "4ccbcf977a86e60d6dd7a167dc23850ce01046a61ff12663a07ae4081483bd88",
    "duration": 86.4,
    "recallBoundary": 76.46312499999999,
    "cues": [
      {
        "start": 0.0,
        "end": 3.4
      },
      {
        "start": 3.4,
        "end": 12.0
      },
      {
        "start": 12.0,
        "end": 23.28
      },
      {
        "start": 23.28,
        "end": 27.48
      },
      {
        "start": 27.48,
        "end": 31.6
      },
      {
        "start": 31.6,
        "end": 35.28
      },
      {
        "start": 35.28,
        "end": 42.16
      },
      {
        "start": 42.16,
        "end": 48.64
      },
      {
        "start": 48.64,
        "end": 55.56
      },
      {
        "start": 55.56,
        "end": 62.76
      },
      {
        "start": 62.76,
        "end": 72.52
      },
      {
        "start": 72.52,
        "end": 77.48
      },
      {
        "start": 77.48,
        "end": 86.4
      }
    ],
    "captions": {
      "de": [
        "Texte wortgetreu lernen",
        "Du übst den genauen Wortlaut, etwa für ein Gedicht, eine Definition oder einen kurzen Vortrag. Dabei zählen auch kleine Wörter und die Reihenfolge.",
        "Wortgetreuer Abruf beweist nicht, dass du den Inhalt verstanden hast. Kläre zuerst die Bedeutung. Ein Merkbilder-Weg kann die Reihenfolge stützen, ersetzt aber nicht das Üben des Wortlauts.",
        "Verstehe den Text und wähle eine kurze Sinneinheit.",
        "Lies sie aufmerksam und sprich sie einmal deutlich.",
        "Verdecke die Vorlage und sage oder schreibe sie aus dem Gedächtnis.",
        "Vergleiche Wort für Wort. Korrigiere Auslassungen, Vertauschungen und hinzugefügte Wörter.",
        "Übe die nächste Einheit und danach den Übergang zwischen beiden. Beginne gelegentlich in der Mitte.",
        "Wiederhole später ohne Vorlage. Verlängere den Abschnitt erst, wenn der aktuelle sicher gelingt.",
        "Am Morgen öffne ich das Fenster. Frische Luft strömt ins Zimmer. Danach beginne ich meinen Tag.",
        "Drei kurze Sätze bilden drei Übungseinheiten. Übe zuerst Satz eins, dann Satz zwei und schließlich ihren Übergang. Starte einen späteren Versuch auch mit „Frische Luft …“.",
        "Schreibe die drei Sätze möglichst genau aus dem Gedächtnis.",
        "Nutze eine eigene kurze Passage, die du wortgetreu brauchst. Prüfe den Wortlaut selbst am Original; eine bloß ähnliche Formulierung erfüllt dieses Lernziel nicht."
      ],
      "en": [
        "Learn a text word for word",
        "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
        "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
        "Understand the text and choose a short meaningful passage.",
        "Read it carefully and say it clearly once.",
        "Hide it and say or write it from memory.",
        "Compare word for word. Correct omissions, changes in order and added words.",
        "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "Recall it again later without looking. Extend the passage after the current part becomes reliable.",
        "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
        "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
        "Write the three sentences as accurately as you can from memory.",
        "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal."
      ],
      "fr": [
        "Apprendre un texte mot pour mot",
        "Travaille la formulation exacte d’un poème, d’une définition ou d’un court discours. Les petits mots et leur ordre comptent aussi.",
        "Réciter exactement ne prouve pas que tu as compris. Clarifie d’abord le sens. Des images mentales peuvent soutenir l’ordre des idées, mais elles ne remplacent pas le travail sur les mots.",
        "Comprends le texte et choisis un court passage cohérent.",
        "Lis-le attentivement et prononce-le clairement une fois.",
        "Cache-le, puis récite-le ou écris-le de mémoire.",
        "Compare mot à mot. Corrige les omissions, les inversions et les ajouts.",
        "Travaille le passage suivant, puis la transition entre les deux. Commence parfois au milieu.",
        "Essaie de nouveau plus tard sans modèle. Allonge le passage lorsque le rappel devient fiable.",
        "Le matin, j’ouvre la fenêtre. L’air frais entre dans la pièce. Ensuite, je commence ma journée.",
        "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Lors d’un autre essai, commence aussi par « L’air frais… ».",
        "Écris les trois phrases de mémoire en respectant leur formulation aussi précisément que possible.",
        "Choisis un court passage dont la formulation compte pour toi. Vérifie les mots dans l’original : une reformulation ne répond pas à cet objectif précis."
      ],
      "es": [
        "Aprende un texto palabra por palabra",
        "Practica las palabras exactas de un poema, una definición o un discurso breve. También importan las palabras pequeñas y su orden.",
        "El recuerdo exacto no demuestra comprensión. Asegúrate de entender primero el significado. Imágenes mentales pueden ayudar a recordar el orden de las ideas, pero no sustituyen la práctica del lenguaje exacto.",
        "Entiende el texto y elige un pasaje breve y significativo.",
        "Léelo con atención y dilo claramente una vez.",
        "Oculta el texto y di o escribe el contenido desde la memoria.",
        "Compara palabra por palabra. Corrige omisiones, cambios de orden y palabras añadidas.",
        "Practica el siguiente fragmento y después la transición entre ambos. Empieza a veces por la mitad.",
        "Vuelve a recordarlo más tarde sin mirar. Amplía el fragmento cuando recuerdes con seguridad el actual.",
        "En la mañana abro la ventana. El aire fresco fluye en la habitación. Luego comienzo mi día.",
        "Las tres oraciones forman tres unidades de práctica. Aprende la primera, luego la segunda y su transición. Comienza un intento posterior en «Aire fresco…» también.",
        "Escribe las tres oraciones con la mayor precisión posible desde la memoria.",
        "Elige un fragmento breve cuyas palabras exactas necesites aprender. Compáralo con el original: una paráfrasis no cumple este objetivo."
      ],
      "it": [
        "Impara un testo parola per parola",
        "Esercita le parole esatte di una poesia, una definizione o un breve discorso. Contano anche le parole piccole e il loro ordine.",
        "Ricordare le parole esatte non dimostra comprensione. Chiarisci prima il significato. Le immagini mentali possono aiutare con l’ordine delle idee, ma non sostituiscono l’esercizio delle parole stesse.",
        "Capisci il testo e scegli un breve passaggio significativo.",
        "Leggi attentamente il brano e pronuncialo chiaramente una volta.",
        "Nascondilo e ripetilo o scrivilo a memoria.",
        "Compara parola per parola. Correggi omissioni, cambi di ordine e parole aggiunte.",
        "Esercita il brano successivo, poi il collegamento tra i due. Ogni tanto inizia da metà testo.",
        "Richiama il testo più tardi senza guardare. Allunga il brano quando ricordi con sicurezza quello attuale.",
        "Alla mattina apro la finestra. L'aria fresca entra in camera. Poi inizio il giorno.",
        "Le tre frasi formano tre unità di esercizio. Impara la prima, poi la seconda e il loro collegamento. In un tentativo successivo parti anche da «L’aria fresca…».",
        "Scrivi le tre frasi a memoria nel modo più preciso possibile.",
        "Scegli un breve brano di cui ti servono le parole esatte. Confrontalo con l’originale: una parafrasi non soddisfa questo obiettivo."
      ],
      "pt": [
        "Aprenda um texto palavra por palavra",
        "Pratique a formulação exata de um poema, definição ou discurso curto. As palavras pequenas e a sua ordem importam também.",
        "Recordar as palavras exatas não prova a compreensão. Esclareça primeiro o significado. As imagens mentais podem ajudar com a ordem das ideias, mas não substituem a prática das palavras originais.",
        "Compreenda o texto e escolha um trecho curto e significativo.",
        "Leia com atenção e diga claramente uma vez.",
        "Esconda-o e diga ou escreva de memória.",
        "Compare palavra por palavra. Corrija omissões, mudanças de ordem e palavras adicionadas.",
        "Pratique o próximo trecho, depois a transição entre eles. Às vezes, comece no meio.",
        "Recorde o texto novamente mais tarde, sem olhar. Aumente o trecho quando conseguir recordar com segurança o atual.",
        "Na manhã, abro a janela. O ar fresco entra na sala. Depois, começo o dia.",
        "As três frases formam três unidades de prática. Aprenda a primeira, depois a segunda e a transição entre ambas. Num ensaio posterior, comece também em «O ar fresco…».",
        "Escreva as três frases com a maior precisão possível de memória.",
        "Escolha um trecho curto cuja formulação importa para você. Compare com a fonte original; uma paráfrase não atende a este objetivo particular."
      ],
      "nl": [
        "Leer een tekst woord voor woord",
        "Oefen de precieze formulering van een gedicht, definitie of korte toespraak. Ook kleine woorden en hun volgorde tellen mee.",
        "Precies onthouden bewijst niet dat je de inhoud begrijpt. Verduidelijk eerst de betekenis. Denkbeelden kunnen de volgorde ondersteunen, maar vervangen het oefenen van de precieze woorden niet.",
        "Begrijp de tekst en kies een korte, samenhangende passage.",
        "Lees die aandachtig en spreek haar eenmaal duidelijk uit.",
        "Verberg de tekst en zeg of schrijf haar uit je geheugen op.",
        "Vergelijk woord voor woord. Corrigeer weglatingen, verwisselingen en toegevoegde woorden.",
        "Oefen de volgende passage en daarna de overgang tussen beide. Begin soms in het midden.",
        "Haal de tekst later opnieuw op zonder te kijken. Maak de passage langer zodra je het huidige deel betrouwbaar kunt ophalen.",
        "In de ochtend open ik het raam. Frisse lucht stroomt de kamer binnen. Daarna begin ik mijn dag.",
        "De drie zinnen zijn drie oefeneenheden. Leer eerst de eerste, dan de tweede en hun overgang. Begin een latere poging ook bij «Frisse lucht…».",
        "Schrijf de drie zinnen zo precies mogelijk uit je geheugen op.",
        "Kies een korte passage waarvan de precieze woorden belangrijk voor je zijn. Vergelijk met de bron; een parafrase voldoet niet aan dit leerdoel."
      ],
      "tr": [
        "Bir metni sözcüğü sözcüğüne öğren",
        "Bir şiirin, tanımın veya kısa konuşmanın sözcüklerini aynen çalış. Küçük sözcükler ve sıraları da önemlidir.",
        "Sözcükleri aynen hatırlamak, içeriği anladığını kanıtlamaz. Önce anlamı netleştir. Hayali görüntüler fikirlerin sırasını destekleyebilir; ama asıl sözcükleri çalışmanın yerini tutmaz.",
        "Metni anla ve kısa, anlamlı bir bölüm seç.",
        "Dikkatle oku ve bir kez açıkça söyle.",
        "Gizle ve hafızandan söyle veya yaz.",
        "Sözcük sözcük karşılaştır. Atlanan, sırası değişen veya eklenen sözcükleri düzelt.",
        "Sonraki bölümü, sonra iki bölüm arasındaki geçişi çalış. Bazen ortadan başla.",
        "Daha sonra bakmadan yeniden hatırla. Mevcut bölüm güvenilir biçimde hatırlanınca uzunluğu artır.",
        "Sabah pencereyi açarım. Odaya temiz hava girer. Sonra günüme başlarım.",
        "Üç cümle üç çalışma birimidir. Önce ilkini, sonra ikincisini ve aralarındaki geçişi öğren. Sonraki bir denemeye «Odaya temiz hava…» kısmından da başla.",
        "Üç cümleyi mümkün olduğunca tam olarak hafızandan yaz.",
        "Sözcüklerini aynen öğrenmek istediğin kısa bir bölüm seç. Aslıyla kendin karşılaştır; anlamı başka sözcüklerle anlatmak bu öğrenme hedefini karşılamaz."
      ],
      "ar": [
        "تعلّم النص كلمة بكلمة",
        "تدرّب على الألفاظ الدقيقة لقصيدة أو تعريف أو خطاب قصير. الكلمات الصغيرة وترتيبها مهمان أيضًا.",
        "الاسترجاع الحرفي لا يثبت الفهم. وضّح المعنى أولًا. قد تدعم الصور الذهنية ترتيب الأفكار، لكنها لا تعوّض تدريب الألفاظ الأصلية.",
        "افهم النص واختر فقرة قصيرة ذات معنى.",
        "اقرأها بانتباه وانطقها بوضوح مرة واحدة.",
        "أخفها وقلها أو اكتبها من الذاكرة.",
        "قارن كلمة بكلمة. صحّح الحذف وتبديل الترتيب والكلمات المضافة.",
        "تدرّب على الفقرة التالية ثم الانتقال بينهما. ابدأ أحيانًا من الوسط.",
        "استرجعها لاحقًا دون النظر. أطِل الفقرة عندما تصبح قادرًا على استرجاع الجزء الحالي بثقة.",
        "في الصباح أفتح النافذة. يدخل الهواء المنعش إلى الغرفة. ثم أبدأ يومي.",
        "الجمل الثلاث وحدات تدريب ثلاث. تعلّم الأولى ثم الثانية والانتقال بينهما. ابدأ محاولة لاحقة أيضًا من «يدخل الهواء المنعش…».",
        "اكتب الجمل الثلاث من الذاكرة بأكبر دقة ممكنة.",
        "اختر فقرة قصيرة تحتاج إلى ألفاظها الدقيقة. قارنها بالأصل بنفسك؛ إعادة المعنى بكلمات أخرى لا تحقق هذا الهدف."
      ],
      "zh": [
        "逐字学习文本",
        "练习诗歌、定义或短篇演讲中的精确用词。小词及其顺序同样重要。",
        "逐字回忆并不能证明理解。首先应明确其含义。心理图像可能帮助理解思想顺序，但无法替代实际用词的练习。",
        "理解文本，然后选择一段简短且有意义的段落。",
        "仔细阅读并清晰地说出一次。",
        "隐藏文本，然后从记忆中说出或写出。",
        "逐字对比。纠正遗漏、顺序变化和额外添加的词语。",
        "练习下一段内容，然后练习段落之间的过渡。有时可以从中间开始。",
        "稍后不看原文，再次回忆。当当前部分记忆可靠时，延伸段落内容。",
        "早上我打开窗户。新鲜空气流入房间。然后我开始新的一天。",
        "三个句子是三个练习单元。先学第一句，再学第二句和它们之间的衔接。之后也试着从“新鲜空气……”开始回忆。",
        "尽可能准确地从记忆中写出这三个句子。",
        "选择一段你认为用词重要的短文。自己将其与原文对比；改写版本无法达到此特定目标。"
      ],
      "ja": [
        "文章を一語ずつ正確に覚える",
        "詩、定義、短いスピーチなどの正確な語句を練習します。短い語やその順序も大切です。",
        "正確に思い出せても、意味を理解している証拠にはなりません。先に意味を確認しましょう。イメージは順序を助けても、実際の語句の練習に代わるものではありません。",
        "文章を理解し、短く意味のまとまった部分を選びましょう。",
        "注意深く読み、一度はっきり声に出しましょう。",
        "隠して、記憶から言うか書くかしてみましょう。",
        "一語ずつ比較し、抜け、順序の違い、余計な語を修正しましょう。",
        "次の部分を練習し、両者のつながりも練習しましょう。時には途中から始めます。",
        "後で原文を見ずに思い出しましょう。今の部分を確実に思い出せるようになったら長くします。",
        "朝、私は窓を開けます。新鮮な空気が部屋に流れ込みます。それから一日を始めます。",
        "3つの文が3つの練習単位です。最初の文、次の文、そのつながりを練習しましょう。後の試行では「新鮮な空気…」からも始めてみます。",
        "3つの文を、できるだけ正確に記憶から書きましょう。",
        "正確な語句が必要な短い文章を選び、自分で原文と比較しましょう。言い換えでは、この学習目標を満たしません。"
      ]
    },
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Qwen3-TTS · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "Synthetic voice reference · Qwen VoiceDesign · Apache 2.0",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "method-of-loci",
    "coach": "rafael",
    "language": "fr",
    "mime": "video/mp4",
    "presentation": "illustrated",
    "src": "/course-media/video/atta-method-of-loci-fr-visual-ca703efe15ce.mp4",
    "bytes": 1161366,
    "sha256": "ca703efe15ce244b4dafecb2ace759a8c7caaf202c947f1744fae91466cc5b77",
    "duration": 78.52,
    "cues": [
      {
        "start": 0.0,
        "end": 1.68
      },
      {
        "start": 1.68,
        "end": 11.8
      },
      {
        "start": 11.8,
        "end": 22.08
      },
      {
        "start": 22.08,
        "end": 26.52
      },
      {
        "start": 26.52,
        "end": 31.08
      },
      {
        "start": 31.08,
        "end": 35.52
      },
      {
        "start": 35.52,
        "end": 39.24
      },
      {
        "start": 39.24,
        "end": 46.16
      },
      {
        "start": 46.16,
        "end": 53.04
      },
      {
        "start": 53.04,
        "end": 65.4
      },
      {
        "start": 65.4,
        "end": 70.36
      },
      {
        "start": 70.36,
        "end": 78.52
      }
    ],
    "captions": {
      "de": [
        "Orte als Gedächtnisstützen nutzen",
        "Bei der Loci-Methode legst du vorgestellte Inhalte an feste Orte eines vertrauten Weges. Beim gedanklichen Abgehen helfen die Orte, die Inhalte wiederzufinden.",
        "Lerne zuerst einen stabilen Weg. Zu viele ähnliche Bilder am selben Ort können sich verwechseln. Die Orte unterstützen Struktur und Reihenfolge, nicht automatisch exakte Formulierungen.",
        "Wähle einen vertrauten Weg mit klar unterscheidbaren Stationen.",
        "Lege eine feste Reihenfolge fest und gehe sie einmal ohne Lerninhalt durch.",
        "Verbinde pro Station einen Begriff durch ein deutliches vorgestelltes Ereignis mit dem Ort.",
        "Gehe die Stationen ohne Vorlage ab und nenne die Begriffe.",
        "Vergleiche den Abruf. Verbessere verwechselbare Orte oder schwache Bilder.",
        "Beispielweg: Haustür → Schuhregal → Küchentisch. Begriffe: Brot → Seife → Kerze.",
        "An der Haustür klemmt ein riesiges Brot. Das Schuhregal quillt vor Seifenschaum über. Auf dem Küchentisch steht eine leuchtende Kerze. Der Weg dient hier nur als Beispiel; für eigenes Lernen eignet sich ein tatsächlich vertrauter Weg.",
        "Gehe die drei Stationen gedanklich ab. Schreibe zu jeder Station den zugehörigen Begriff.",
        "Lege im bestehenden Gedächtnispalast der App deinen vertrauten Weg an oder nutze einen vorhandenen. Beginne mit wenigen Stationen und prüfe, ob du jeden Ort sicher unterscheiden kannst."
      ],
      "en": [
        "Use places as memory cues",
        "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
        "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
        "Choose a familiar route with clearly distinct locations.",
        "Fix their order and rehearse the route without learning material.",
        "Connect one item to each location through a vivid imagined event.",
        "Walk the route without looking and name the items.",
        "Compare your recall and improve confusing locations or weak images.",
        "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
        "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
        "Mentally visit the three locations. Write the item associated with each location.",
        "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them."
      ],
      "fr": [
        "Utiliser les lieux comme indices",
        "Avec la méthode des loci, tu places mentalement des contenus à des endroits fixes d’un trajet familier. Parcourir ce trajet dans ta tête fournit des indices pour les retrouver.",
        "Apprends d’abord un trajet stable. Des images semblables au même endroit peuvent se confondre. Les lieux soutiennent la structure et l’ordre, mais pas automatiquement la formulation exacte.",
        "Choisis un trajet familier avec des endroits clairement distincts.",
        "Fixe leur ordre. Répète ensuite le trajet sans contenu à apprendre.",
        "Associe un élément à chaque endroit par un événement imaginé marquant.",
        "Parcours le trajet sans modèle et nomme les éléments.",
        "Vérifie les éléments retrouvés avec la liste initiale. Améliore ensuite les lieux confus ou les images peu efficaces.",
        "Trajet d’exemple : porte d’entrée → meuble à chaussures → table de cuisine. Éléments : pain → savon → bougie.",
        "Un pain géant bloque la porte. Le meuble à chaussures déborde de mousse de savon. Une bougie brille sur la table de cuisine. Ce trajet est seulement un exemple ; choisis un trajet réellement familier pour ton propre apprentissage.",
        "Visite mentalement les trois endroits. Puis écris l’élément associé à chacun.",
        "Dans le palais de mémoire existant de l’application, crée un trajet familier ou utilise un trajet proposé. Commence par quelques endroits et vérifie que tu les distingues clairement."
      ],
      "es": [
        "Utiliza lugares como pistas de memoria",
        "En el método de los lugares, colocas contenido imaginado en ubicaciones fijas a lo largo de un recorrido familiar. Al caminar por el recorrido en tu mente, obtienes pistas para recuperar la información.",
        "Aprende primero un recorrido estable. Las imágenes parecidas en el mismo lugar pueden confundirse. Los lugares ayudan con la estructura y el orden, pero no garantizan recordar las palabras exactas.",
        "Elige un recorrido familiar con ubicaciones claramente distintas.",
        "Fija el orden y repasa el recorrido sin incluir material de aprendizaje.",
        "Conecta un elemento con cada ubicación mediante un evento imaginado vívido.",
        "Camina por el recorrido sin mirar y nombra los elementos.",
        "Compara tu recuerdo y mejora ubicaciones confusas o imágenes débiles.",
        "Ejemplo de recorrido: puerta principal → estantería de zapatos → mesa de la cocina. Elementos: pan → jabón → vela.",
        "Un pan gigante bloquea la puerta principal. El zapatero rebosa espuma de jabón. Una vela brilla en la mesa de la cocina. Es solo un ejemplo: para aprender tu propio material, utiliza un recorrido que conozcas bien.",
        "Visita mentalmente las tres ubicaciones. Escribe el elemento asociado a cada una.",
        "Utiliza el palacio de la memoria existente en la app para crear un recorrido familiar o utiliza uno disponible. Comienza con unas pocas ubicaciones y verifica que puedas distinguirlas claramente."
      ],
      "it": [
        "Usa i luoghi come indizi per ricordare",
        "Nel metodo dei loci, collochi contenuti immaginati in punti fissi lungo un percorso familiare. Ripercorrerlo mentalmente fornisce indizi per ricordarli.",
        "Impara prima un percorso stabile. Immagini simili nello stesso luogo possono confondersi. I luoghi aiutano con struttura e ordine, ma non garantiscono il ricordo delle parole esatte.",
        "Scegli un percorso familiare con posizioni chiaramente distinte.",
        "Fissa l'ordine e ripeti il percorso senza materiale da imparare.",
        "Collega un elemento a ogni posizione attraverso un evento immaginato vivido.",
        "Cammina lungo il percorso senza guardare e nomina gli elementi.",
        "Confronta il tuo ricordo e migliora le posizioni confuse o le immagini deboli.",
        "Percorso di esempio: porta d’ingresso → scarpiera → tavolo della cucina. Elementi: pane → sapone → candela.",
        "Un pane gigante blocca la porta d’ingresso. La scarpiera trabocca di schiuma di sapone. Una candela brilla sul tavolo della cucina. È solo un esempio: per il tuo materiale, usa un percorso che conosci davvero.",
        "Visita mentalmente le tre posizioni. Scrivi l'elemento associato a ciascuna posizione.",
        "Usa il palazzo della memoria già presente nell’app per creare un percorso familiare o sceglierne uno disponibile. Inizia con pochi luoghi e verifica di distinguerli bene."
      ],
      "pt": [
        "Use lugares como pistas de memória",
        "No método das localizações, você coloca conteúdos imaginários em locais fixos ao longo de um percurso familiar. Caminhar pelo percurso na sua mente fornece pistas para recuperar o conteúdo.",
        "Aprenda primeiro um percurso estável. Imagens semelhantes no mesmo local podem causar confusão. Os locais ajudam com a estrutura e a ordem, mas não garantem recordar as palavras exatas.",
        "Escolha um percurso familiar com locais claramente distintos.",
        "Fixe a ordem e repita o percurso sem incluir material de aprendizagem.",
        "Ligue um item a cada localização por meio de um evento imaginário vívido.",
        "Caminhe pelo percurso sem olhar e nomeie os itens.",
        "Compare o que recordou e melhore os locais confusos ou as imagens pouco claras.",
        "Percurso de exemplo: porta da frente → sapateira → mesa da cozinha. Elementos: pão → sabão → vela.",
        "Um pão gigante bloqueia a porta da frente. A sapateira transborda de espuma de sabão. Uma vela brilha sobre a mesa da cozinha. É apenas um exemplo: para aprender o seu material, use um percurso que conheça bem.",
        "Visite mentalmente as três localizações. Escreva o item associado a cada localização.",
        "Use o palácio da memória da aplicação para criar um percurso familiar ou escolher um disponível. Comece com poucos locais e verifique se consegue distingui-los claramente."
      ],
      "nl": [
        "Gebruik plaatsen als geheugensteuntjes",
        "Bij de loci-methode plaats je denkbeeldige inhoud op vaste plekken langs een bekende route. Als je die route in gedachten aflegt, helpen de plekken je om de inhoud terug te vinden.",
        "Leer eerst een vaste route. Vergelijkbare beelden op dezelfde plek kunnen verwarring geven. Plaatsen ondersteunen structuur en volgorde, maar niet automatisch de precieze woorden.",
        "Kies een bekende route met duidelijk onderscheidende locaties.",
        "Leg de volgorde vast en oefen de route zonder leerstof.",
        "Verbind elk element met een plek door een levendige denkbeeldige gebeurtenis.",
        "Loop de route zonder te kijken en noem de items.",
        "Vergelijk wat je hebt opgehaald en verbeter verwarrende plekken of onduidelijke beelden.",
        "Voorbeeldroute: voordeur → schoenrek → keukentafel. Artikelen: brood → zeep → kaars.",
        "Een enorm brood blokkeert de voordeur. Het schoenenrek stroomt over van zeepschuim. Een kaars brandt op de keukentafel. Dit is alleen een voorbeeldroute; gebruik voor je eigen leerstof een route die je echt kent.",
        "Bezoek mentaal de drie locaties. Schrijf het item dat bij elke locatie hoort.",
        "Gebruik het bestaande geheugenpaleis in de app om een bekende route te maken of kies een beschikbare route. Begin met enkele plekken en controleer of je ze duidelijk uit elkaar kunt houden."
      ],
      "tr": [
        "Mekânları hatırlama ipucu olarak kullan",
        "Loci yönteminde, hayal ettiğin içerikleri tanıdık bir yol üzerindeki sabit yerlere yerleştirirsin. Yolu zihninde yürümek, içerikleri hatırlaman için ipuçları sağlar.",
        "Önce sabit bir yol öğren. Aynı yerdeki benzer görüntüler karışabilir. Yerler yapıyı ve sırayı destekler; sözcükleri aynen hatırlamayı kendiliğinden sağlamaz.",
        "Yerleri açıkça ayırt edilebilen, tanıdık bir yol seç.",
        "Sırayı sabitle ve öğrenilecek malzeme olmadan yolu çalış.",
        "Her yere bir öğeyi canlı bir hayali olayla bağla.",
        "Kaynağa bakmadan yolu zihninde yürü ve öğeleri söyle.",
        "Hatırladıklarını karşılaştır; karışan yerleri veya zayıf görüntüleri iyileştir.",
        "Örnek yol: giriş kapısı → ayakkabılık → mutfak masası. Öğeler: ekmek → sabun → mum.",
        "Dev bir ekmek giriş kapısını kapatır. Ayakkabılıktan sabun köpüğü taşar. Mutfak masasında bir mum yanar. Bu yalnızca örnek bir yoldur; kendi öğrenmen için gerçekten bildiğin bir yol kullan.",
        "Üç yeri zihninde ziyaret et. Her yerle ilişkilendirdiğin öğeyi yaz.",
        "Tanıdık bir yol oluşturmak veya mevcut birini seçmek için uygulamadaki hafıza sarayını kullan. Birkaç yerle başla ve bunları açıkça ayırt edebildiğini kontrol et."
      ],
      "ar": [
        "استخدم الأماكن دلائل للتذكّر",
        "في طريقة المواقع، تضع محتوى متخيّلًا في أماكن ثابتة على طريق مألوف. المرور بهذا الطريق ذهنيًا يوفّر دلائل لاسترجاعه.",
        "تعلّم طريقًا ثابتًا أولًا. قد تختلط الصور المتشابهة في المكان نفسه. تدعم الأماكن البنية والترتيب، لكنها لا تضمن حفظ الألفاظ نفسها.",
        "اختر طريقًا مألوفًا ذا أماكن يسهل تمييزها.",
        "ثبّت ترتيب الأماكن وتدرّب على الطريق دون مادة للحفظ.",
        "اربط كل عنصر بمكان من خلال حدث متخيّل واضح.",
        "مرّ بالطريق ذهنيًا دون النظر إلى المصدر واذكر العناصر.",
        "قارن ما استرجعته وحسّن الأماكن المربكة أو الصور الضعيفة.",
        "طريق نموذجي: باب المنزل → رف الأحذية → طاولة المطبخ. العناصر: خبز → صابون → شمعة.",
        "رغيف ضخم يسد باب المنزل. يفيض رف الأحذية برغوة الصابون. تضيء شمعة على طاولة المطبخ. هذا طريق نموذجي فقط؛ استخدم طريقًا تعرفه فعلًا لتعلّم مادتك.",
        "زر الأماكن الثلاثة ذهنيًا. اكتب العنصر المرتبط بكل مكان.",
        "استخدم قصر الذاكرة الموجود في التطبيق لإنشاء طريق مألوف أو اختيار طريق متاح. ابدأ بأماكن قليلة وتحقّق من قدرتك على تمييزها بوضوح."
      ],
      "zh": [
        "使用地点作为记忆提示",
        "在位置法中，你将想象中的内容放置在熟悉路线的固定位置上。在脑海中走一遍这条路线，可以作为提取信息的提示。",
        "先熟悉一条固定路线。同一地点上的相似图像可能混淆。地点有助于记住结构和顺序，但不能自动保证逐字记忆。",
        "选择一条熟悉的路线，且各个位置清晰分明。",
        "固定各位置的顺序，并在不学习内容的情况下反复练习路线。",
        "通过一个生动的想象事件，将每个物品与相应位置连接起来。",
        "不看原文，在脑海中沿路线前进并说出各项内容。",
        "将你的回忆结果进行对比，并改进容易混淆的位置或模糊的图像。",
        "示例路线：前门 → 鞋架 → 厨房餐桌。物品：面包 → 肥皂 → 蜡烛。",
        "一个巨大的面包挡住前门。鞋架溢出肥皂泡沫。厨房餐桌上亮着一支蜡烛。这只是示例；学习自己的内容时，请使用真正熟悉的路线。",
        "在脑海中依次访问这三个位置，写下与每个位置相关的物品。",
        "使用应用中已有的记忆宫殿创建一条熟悉的路线，或使用现有的路线。从几个位置开始，并确保你能清楚地区分它们。"
      ],
      "ja": [
        "場所を記憶の手掛かりにする",
        "場所法では、想像した内容を、よく知る道順の決まった場所に置きます。その道順を頭の中でたどると、内容を思い出す手掛かりになります。",
        "まず、安定したルートを学びます。同じ場所に似たイメージは混同されやすいです。場所は構造と順序を支えますが、自動的に正確な言葉を再現するわけではありません。",
        "明確で異なる場所を持つ、よく知っているルートを選ぶ",
        "場所の順序を固定し、学習内容なしでルートを繰り返し歩きます。",
        "各アイテムを、その場所と結びつけるために、鮮明な想定された出来事をつくります。",
        "資料を見ずに頭の中で道順をたどり、各項目を言いましょう。",
        "思い出の正確さを比較し、混同しやすい場所や弱いイメージを改善します。",
        "道順の例：玄関 → 靴棚 → 台所のテーブル。項目：パン → 石けん → ろうそく。",
        "巨大なパンが玄関をふさぎ、靴棚から石けんの泡があふれ、台所のテーブルではろうそくが光っています。これは例です。自分の学習には、本当によく知っている道順を使いましょう。",
        "3つの場所を心で訪ね、各場所に関連するアイテムを書き出します。",
        "アプリの既存の記憶の宮殿を使って、慣れ親しんだルートを作成するか、利用可能なルートを使う。最初は数か所から始め、それらが明確に区別できるか確認します。"
      ]
    },
    "recallBoundary": 69.41480833333333,
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "number-images",
    "coach": "rafael",
    "language": "fr",
    "mime": "video/mp4",
    "presentation": "illustrated",
    "src": "/course-media/video/atta-number-images-fr-visual-75fb3807cd47.mp4",
    "bytes": 1273876,
    "sha256": "75fb3807cd47e3fcc7a19cf4eb7a863e23e4d8dbec49d4fde0dc0d836ab9fa54",
    "duration": 88.84,
    "cues": [
      {
        "start": 0.0,
        "end": 3.44
      },
      {
        "start": 3.44,
        "end": 12.56
      },
      {
        "start": 12.56,
        "end": 25.68
      },
      {
        "start": 25.68,
        "end": 30.0
      },
      {
        "start": 30.0,
        "end": 33.04
      },
      {
        "start": 33.04,
        "end": 36.56
      },
      {
        "start": 36.56,
        "end": 41.68
      },
      {
        "start": 41.68,
        "end": 46.44
      },
      {
        "start": 46.44,
        "end": 59.24
      },
      {
        "start": 59.24,
        "end": 75.08
      },
      {
        "start": 75.08,
        "end": 80.92
      },
      {
        "start": 80.92,
        "end": 88.84
      }
    ],
    "captions": {
      "de": [
        "Zahlen in Bilder übersetzen",
        "Das Major-System ordnet Ziffern Konsonantenlaute zu. Daraus bildest du ein Wort und stellst dir ein Bild vor. Dieses Bild soll sich wieder in die Zahl zurückübersetzen lassen.",
        "Du musst die Zuordnungen zuerst lernen. Ein Bild ohne verlässliche Rückübersetzung hilft beim Zahlenabruf nicht. Dieser Einstieg übt nur zwei Ziffern; die vorhandenen Major-Lektionen vermitteln weitere Zuordnungen.",
        "Lerne zunächst wenige feste Ziffer-Laut-Paare.",
        "Lies die Laute in der Reihenfolge der Ziffern.",
        "Ergänze passende Vokale zu einem bildhaften Wort.",
        "Prüfe die Konsonantenlaute: Enthält das Wort zusätzliche zählende Laute?",
        "Rufe aus dem Bild das Wort und aus dessen Lauten wieder die Zahl ab.",
        "1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Tonne Sand werden, französisch „tonne“: t + n.",
        "Rückwärts ergibt t die 1 und n die 2, also wieder 12. Entscheidend sind die Konsonantenlaute des französischen Wortes „tonne“, nicht nur die geschriebenen Buchstaben.",
        "Rufe das gehörte Beispiel ohne Vorlage ab. Erkläre die Bedeutung und den Weg der Merkhilfe.",
        "Übe die weiteren festen Zuordnungen in den bestehenden Major-Lektionen. Füge erst dann längere Zahlenfolgen hinzu. Prüfe bei jedem eigenen Bild den Rückweg zur exakten Zahl."
      ],
      "en": [
        "Turn numbers into images",
        "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
        "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
        "Learn a few fixed digit-to-sound pairs first.",
        "Read the sounds in the order of the digits.",
        "Add vowels to form a concrete word.",
        "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "Retrieve the word from the image and decode its sounds back into the number.",
        "1 → t/d; 2 → n. The number 12 can become an image of a tonne of sand, “tonne” in French: t + n.",
        "In reverse, t gives 1 and n gives 2: this recovers 12. The consonant sounds of the French word “tonne” matter, not just the written letters.",
        "Recall the example you heard without looking. Explain its meaning and how the memory cue works.",
        "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number."
      ],
      "fr": [
        "Transformer les nombres en images",
        "Le système majeur associe des sons consonantiques aux chiffres. Tu formes un mot et imagines une image que tu peux ensuite reconvertir en nombre.",
        "Apprends d’abord les correspondances. Une image qui ne permet pas de retrouver exactement le nombre n’aide pas au rappel précis. Cette introduction utilise deux chiffres ; les leçons existantes du système majeur présentent d’autres correspondances.",
        "Apprends d’abord quelques correspondances fixes entre chiffres et sons.",
        "Lis les sons, dans l’ordre des chiffres.",
        "Ajoute des voyelles pour former un mot concret.",
        "Vérifie si le mot contient d’autres consonnes prononcées qui coderaient des chiffres supplémentaires.",
        "Retrouve le mot à partir de l’image, puis le nombre à partir de ses sons.",
        "Pour le chiffre un, utilise le premier son de tapis ou de dos. Pour le chiffre deux, utilise le premier son de nez. Pour douze, imagine une tonne de sable. Dans tonne, tu retrouves le son initial de tapis, puis celui de nez.",
        "Dans cet exercice, les voyelles ne comptent pas. Le mot tonne s’écrit avec deux lettres identiques au milieu, mais elles représentent un seul son. Le premier son consonantique code un. Le second code deux. Tu retrouves douze. On compte les sons, pas le nombre de lettres.",
        "Quel nombre code l’image d’une tonne de sable ? Explique le retour par les deux consonnes prononcées.",
        "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Assure-toi que chaque image te ramène exactement au nombre voulu."
      ],
      "es": [
        "Convertir números en imágenes",
        "El sistema mayor asigna sonidos consonánticos a los dígitos. Úsalos para formar una palabra e imaginar una imagen que puedas volver a convertir en el número.",
        "Aprende los mapeos primero. Una imagen que no se pueda decodificar de forma fiable no ayuda en el recuerdo exacto del número. Esta introducción utiliza dos dígitos; las lecciones existentes sobre el Sistema Mayor enseñan mapeos adicionales.",
        "Aprende unos pocos pares fijos de dígito a sonido primero.",
        "Lee los sonidos en el orden de los dígitos.",
        "Agrega vocales para formar una palabra concreta.",
        "Verifica si la palabra contiene sonidos de consonantes adicionales que codificarían dígitos extra.",
        "Recupera la palabra desde la imagen y decodifica sus sonidos de nuevo en el número.",
        "1 → t/d; 2 → n. 12 → tonne (tonelada de arena) → t + n.",
        "La vocal no cuenta aquí. En la dirección inversa, t da 1 y n da 2, recuperando 12. Importa la secuencia sonora, no solo las letras escritas.",
        "tonne: ¿Qué número representa esta palabra? Explica cómo lo recuperas a partir de sus dos consonantes.",
        "Practica más correspondencias fijas en las lecciones existentes del sistema mayor antes de trabajar con números largos. Comprueba que cada imagen permita recuperar exactamente el número previsto."
      ],
      "it": [
        "Trasforma i numeri in immagini",
        "Il sistema maggiore associa suoni consonantici alle cifre. Usali per formare una parola e immaginare un’immagine che puoi riconvertire nel numero.",
        "Impara prima le corrispondenze. Un'immagine che non può essere decodificata in modo affidabile non aiuta nella memorizzazione precisa dei numeri. Questa introduzione utilizza due cifre; i corsi esistenti sul Sistema Maggiore insegnano ulteriori mappature.",
        "Impara prima alcune corrispondenze fisse tra cifre e suoni.",
        "Leggi i suoni nell'ordine dei numeri.",
        "Aggiungi vocali per formare una parola concreta.",
        "Verifica se la parola contiene suoni consonantici aggiuntivi che potrebbero codificare cifre extra.",
        "Ricorda la parola dall'immagine e decodifica i suoni per ottenere il numero.",
        "1 → t/d; 2 → n. 12 → tonne (tonnellata di sabbia) → t + n.",
        "La vocale non conta qui. Nel senso inverso, t dà 1 e n dà 2, ripristinando 12. La sequenza sonora conta, non solo le lettere scritte.",
        "tonne: Quale numero rappresenta questa parola? Spiega come lo ricavi dai due suoni consonantici.",
        "Pratica ulteriori mappature fisse nei corsi esistenti sul Sistema Maggiore prima di affrontare numeri più lunghi. Verifica che ogni immagine che crei decodifichi esattamente il numero inteso."
      ],
      "pt": [
        "Transforme números em imagens",
        "O sistema maior associa sons consonânticos a dígitos. Use-os para formar uma palavra e imaginar uma imagem que possa voltar a converter no número.",
        "Aprenda os mapeamentos primeiro. Uma imagem que não pode ser decodificada com precisão não ajuda na memória exata dos números. Esta introdução utiliza dois dígitos; as aulas existentes sobre o Major ensinam mapeamentos adicionais.",
        "Aprenda alguns pares fixos de dígito para som. ",
        "Leia os sons na ordem dos dígitos.",
        "Adicione vogais para formar uma palavra concreta.",
        "Verifique se a palavra contém sons consoantes adicionais que representariam dígitos extras.",
        "Recupere a palavra a partir da imagem e decodifique seus sons de volta para o número.",
        "1 → t/d; 2 → n. 12 → tonne (tonelada de areia) → t + n.",
        "A vogal não conta aqui. Na direção inversa, t dá 1 e n dá 2, recuperando 12. A sequência sonora importa, não apenas as letras escritas.",
        "tonne: Que número representa esta palavra? Explique como o recupera a partir dos dois sons consonânticos.",
        "Pratique mapeamentos fixos adicionais nas aulas existentes sobre o Major antes de lidar com números mais longos. Verifique que cada imagem que criar decodifique exatamente o número pretendido."
      ],
      "nl": [
        "Zet cijfers om in beelden",
        "Het Major-systeem koppelt medeklinkerklanken aan cijfers. Vorm daarmee een woord en een beeld dat je terug kunt vertalen naar het getal.",
        "Leer eerst de vaste koppelingen. Een beeld dat je niet betrouwbaar kunt ontcijferen, helpt niet bij het precies onthouden van getallen. Deze inleiding gebruikt twee cijfers; de bestaande Major-lessen leren verdere koppelingen.",
        "Leer eerst enkele vaste koppelingen tussen cijfers en klanken.",
        "Lees de klanken in de volgorde van de cijfers.",
        "Voeg klinkers toe om een concreet woord te vormen.",
        "Controleer of het woord extra medeklinkerklanken bevat die ook extra cijfers zouden weergeven.",
        "Haal het woord op vanuit het beeld en vertaal de klanken terug naar het getal.",
        "1 → t/d; 2 → n. 12 → tonne (ton zand) → t + n.",
        "De klinker telt hier niet mee. Omgekeerd geeft t een 1 en n een 2: zo krijg je 12 terug. Het gaat om de klanken, niet alleen om de geschreven letters.",
        "tonne: Welk getal stelt dit woord voor? Leg uit hoe je het via de twee medeklinkerklanken terugvindt.",
        "Oefen verdere vaste koppelingen in de bestaande Major-lessen voordat je langere getallen leert. Controleer of elk beeld precies het bedoelde getal oplevert."
      ],
      "tr": [
        "Sayıları görüntülere dönüştür",
        "Major sistemi, ünsüz sesleri rakamlarla eşleştirir. Bu seslerle bir sözcük oluştur ve tekrar sayıya çözülebilen bir görüntü hayal et.",
        "Önce eşleştirmeleri öğren. Güvenilir biçimde çözülemeyen bir görüntü, sayıyı tam hatırlamaya yardımcı olmaz. Bu giriş iki rakam kullanır; mevcut Major dersleri başka eşleştirmeler öğretir.",
        "Önce birkaç sabit rakam-ses eşleştirmesi öğren.",
        "Sesleri rakamların sırasıyla oku.",
        "Somut bir sözcük oluşturmak için ünlüler ekle.",
        "Sözcükte ek rakamları kodlayacak başka ünsüz sesler olup olmadığını kontrol et.",
        "Görüntüden sözcüğü hatırla ve seslerini yeniden sayıya çöz.",
        "1 → t/d; 2 → n. 12 → tonne (bir ton kum) → t + n.",
        "Burada ünlü sayılmaz. Ters yönde t, 1’i; n, 2’yi verir ve 12 geri elde edilir. Yalnızca yazılı harfler değil, ses dizisi önemlidir.",
        "tonne: Bu sözcük hangi sayıyı temsil ediyor? İki ünsüz ses üzerinden sayıyı nasıl bulduğunu açıkla.",
        "Daha uzun sayılara geçmeden önce mevcut Major derslerinde diğer sabit eşleştirmeleri çalış. Oluşturduğun her görüntünün tam olarak amaçlanan sayıya çözüldüğünü kontrol et."
      ],
      "ar": [
        "حوّل الأعداد إلى صور",
        "يربط نظام ماجور أصوات الحروف الساكنة بالأرقام. استخدمها لتكوين كلمة وصورة ذهنية يمكن فكّها للعودة إلى العدد.",
        "تعلّم الروابط أولًا. الصورة التي لا تستطيع فكّها بثقة لا تساعد على تذكّر العدد بدقة. تستخدم هذه المقدمة رقمين؛ وتعلّم دروس ماجور الموجودة روابط إضافية.",
        "تعلّم أولًا بضعة روابط ثابتة بين الأرقام والأصوات.",
        "اقرأ الأصوات حسب ترتيب الأرقام.",
        "أضف أصوات العلّة لتكوين كلمة تشير إلى شيء محسوس.",
        "تحقّق من وجود أصوات ساكنة إضافية قد ترمز إلى أرقام زائدة.",
        "استرجع الكلمة من الصورة وفكّ أصواتها للعودة إلى العدد.",
        "1 → t/d; 2 → n. 12 → tonne (طن من الرمل) → t + n.",
        "صوت العلّة لا يُحسب هنا. في الاتجاه العكسي يعطي t الرقم 1 ويعطي n الرقم 2، فنستعيد 12. المهم هو الأصوات، وليس الحروف المكتوبة فقط.",
        "tonne: ما العدد الذي تمثّله هذه الكلمة؟ اشرح كيف تستعيده من الصوتين الساكنين.",
        "تدرّب على روابط ثابتة إضافية في دروس ماجور الموجودة قبل العمل على أعداد أطول. تحقّق من أن كل صورة تعيد العدد المقصود بدقة."
      ],
      "zh": [
        "把数字变成图像",
        "Major 编码系统把辅音与数字对应起来。用这些辅音组成词，再形成能反向还原出数字的图像。",
        "先学会固定对应关系。不能可靠还原的图像无助于准确记住数字。本入门练习使用两个数字；已有的 Major 课程会介绍更多对应关系。",
        "先学会几个固定的数字与辅音对应关系。",
        "按数字顺序读取音素。",
        "加上元音形成一个具体的词。",
        "检查这个词中是否包含额外的辅音音素，这些音素可能对应额外的数字。",
        "从图像中提取这个词，并将其中的音素解码回数字。",
        "1 → t/d; 2 → n. 12 → tonne (一吨沙子) → t + n.",
        "这里元音不计。在反向过程中，t对应1，n对应2，从而恢复出12。音素的模式比单纯的文字更重要。",
        "tonne: 这个词代表哪个数字？请说明怎样通过两个辅音还原数字。",
        "在处理更长的数字之前，先在已有的 Major 课程中练习更多固定对应关系。确认每幅图像都能准确还原成原定的数字。"
      ],
      "ja": [
        "数字をイメージに変える",
        "Major法は子音の音を数字に対応させる方法です。その音で単語を作り、元の数字に戻せるイメージを思い浮かべます。",
        "先に対応関係を覚えましょう。確実に数字に戻せないイメージは、正確な数字の記憶に役立ちません。ここでは2桁を扱います。既存のMajor法のレッスンでは、さらに多くの対応を学べます。",
        "まず数字と子音の決まった対応をいくつか覚えましょう。",
        "数字の順に音を読む。",
        "母音を加えて、具体的な物を表す単語を作りましょう。",
        "余計な数字を表す子音が単語に含まれていないか、確認しましょう。",
        "イメージから単語を思い出して、その音を数字に戻す。",
        "1 → t/d; 2 → n. 12 → tonne (1トンの砂) → t + n.",
        "ここでは母音は数えません。逆にたどるとtは1、nは2なので、12に戻ります。文字だけでなく、子音の並びが重要です。",
        "tonne: この単語はどの数字を表しますか。2つの子音から数字に戻す手順を説明しましょう。",
        "長い数字を扱う前に、既存のMajor法のレッスンで他の固定した対応も練習しましょう。作ったイメージから、意図した数字を正確に取り出せるか確認します。"
      ]
    },
    "recallBoundary": 80.01600833333333,
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "interleaved-practice",
    "coach": "rafael",
    "language": "fr",
    "mime": "video/mp4",
    "presentation": "illustrated",
    "src": "/course-media/video/atta-interleaved-practice-fr-visual-8153ae5b2f24.mp4",
    "bytes": 1429455,
    "sha256": "8153ae5b2f24ae8597fe46161f63f63c6c3fa8110326c57b97e7883b16df333e",
    "duration": 95.92,
    "cues": [
      {
        "start": 0.0,
        "end": 3.48
      },
      {
        "start": 3.48,
        "end": 12.76
      },
      {
        "start": 12.76,
        "end": 24.4
      },
      {
        "start": 24.4,
        "end": 27.52
      },
      {
        "start": 27.52,
        "end": 30.8
      },
      {
        "start": 30.8,
        "end": 35.4
      },
      {
        "start": 35.4,
        "end": 41.16
      },
      {
        "start": 41.16,
        "end": 44.96
      },
      {
        "start": 44.96,
        "end": 63.12
      },
      {
        "start": 63.12,
        "end": 77.16
      },
      {
        "start": 77.16,
        "end": 90.04
      },
      {
        "start": 90.04,
        "end": 95.92
      }
    ],
    "captions": {
      "de": [
        "Passende Vorgehensweisen unterscheiden",
        "Beim gezielten Mischen wechselst du zwischen ähnlichen Aufgabentypen und entscheidest selbst, welches Vorgehen passt. So übst du auch die Auswahl einer Methode.",
        "Lerne neue Vorgehensweisen zuerst an klaren Beispielen. Wahlloses Themenwechseln oder Multitasking ist nicht dasselbe. Ob das Mischen hilft, hängt auch vom Material und deinem Vorwissen ab.",
        "Verstehe die einzelnen Vorgehensweisen zunächst getrennt.",
        "Mische anschließend wenige verwandte Aufgabentypen.",
        "Bestimme vor dem Rechnen oder Antworten, welcher Typ vorliegt und warum.",
        "Löse die Aufgabe und prüfe Auswahl und Ergebnis getrennt.",
        "Arbeite Fehler gezielt nach und kehre danach zur gemischten Übung zurück.",
        "Rechteck: Fläche = Länge × Breite. Dreieck: Fläche = Grundseite × zugehörige Höhe ÷ 2. Beispiel: Ein Rechteck mit 4 cm Länge und 3 cm Breite hat 12 cm². Ein Dreieck mit 4 cm Grundseite und 3 cm zugehöriger Höhe hat 6 cm².",
        "Gleiche Zahlen verlangen nicht automatisch dieselbe Rechnung. Die Figur entscheidet: Beim Dreieck gehört der Faktor ein Halb dazu. In gemischten Aufgaben muss die Aufgabenart erkannt werden, bevor die Regel angewandt wird.",
        "Aufgabe A: Dreieck mit Grundseite 6 cm und zugehöriger Höhe 4 cm. Aufgabe B: Rechteck mit Länge 6 cm und Breite 4 cm. Nenne jeweils die passende Regel und die Fläche.",
        "Wähle zwei oder drei bereits eingeführte, verwandte Aufgabentypen aus deinem Lernstoff. Mische sie und begründe vor jeder Lösung deine Auswahl des Vorgehens."
      ],
      "en": [
        "Choose between related approaches",
        "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
        "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
        "Understand each approach separately first.",
        "Then mix a few related task types.",
        "Before answering, identify the type and explain your choice.",
        "Solve the task and check your choice and result separately.",
        "Work on errors specifically, then return to mixed practice.",
        "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
        "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
        "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
        "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one."
      ],
      "fr": [
        "Choisir entre des démarches proches",
        "Mélange des types d’exercices proches et choisis toi-même la démarche adaptée. Tu travailles ainsi le choix de la méthode autant que son application.",
        "Apprends d’abord chaque démarche avec des exemples clairs. Changer de sujet au hasard ou faire plusieurs choses à la fois est différent. L’intérêt du mélange dépend du contenu et de tes connaissances antérieures.",
        "Comprends d’abord chaque démarche séparément.",
        "Mélange ensuite quelques types d’exercices proches.",
        "Avant de répondre, identifie le type et explique ton choix.",
        "Fais le calcul. Vérifie ensuite deux choses séparément : ton choix de méthode et ton résultat.",
        "Retravaille les erreurs, puis reviens aux exercices mélangés.",
        "Pour un rectangle, multiplie la longueur par la largeur. Un rectangle de quatre centimètres sur trois centimètres a donc une aire de douze centimètres carrés. Pour un triangle, multiplie la base par la hauteur correspondante. Divise ensuite ce résultat par deux. Avec une base de quatre centimètres et une hauteur de trois centimètres, le calcul donne six centimètres carrés.",
        "Des nombres identiques ne donnent pas forcément le même calcul. La figure détermine la règle. Pour le triangle, il faut diviser le produit par deux. Dans un mélange d’exercices, commence par identifier le type de figure avant d’appliquer la règle.",
        "Exercice A. Un triangle de base six centimètres et de hauteur correspondante quatre centimètres. Exercice B. Un rectangle de longueur six centimètres et de largeur quatre centimètres. Donne la règle et l’aire de chaque figure.",
        "Choisis deux ou trois types d’exercices proches que tu connais déjà. Mélange-les et justifie ta démarche avant chaque résolution."
      ],
      "es": [
        "Elige entre métodos relacionados",
        "Mezcle tipos relacionados de tareas y elija usted mismo el enfoque adecuado. Esto practica la selección de un método así como su aplicación.",
        "Aprenda nuevos enfoques a través de ejemplos claros. Cambiar de tema de forma aleatoria o multitarea es diferente. Los beneficios dependen del material y de su conocimiento previo.",
        "Entienda cada enfoque por separado primero.",
        "Luego combine un par de tipos de tareas relacionados.",
        "Antes de responder, identifique el tipo y explique su elección.",
        "Resuelva la tarea y verifique por separado su elección y resultado.",
        "Trabaje específicamente en los errores, luego regrese a la práctica mezclada.",
        "Rectángulo: área = longitud × anchura. Triángulo: área = base × altura correspondiente ÷ 2. Un rectángulo de 4 cm por 3 cm tiene un área de 12 cm². Un triángulo de base 4 cm y altura correspondiente 3 cm tiene un área de 6 cm².",
        "Los mismos números no implican el mismo cálculo. La figura determina la regla: en el triángulo hay que dividir entre dos. Al mezclar tareas, debes reconocer el tipo antes de aplicar la regla.",
        "Tarea A: un triángulo con base de 6 cm y altura correspondiente de 4 cm. Tarea B: un rectángulo de 6 cm de longitud y 4 cm de anchura. Proporcione la regla y el área para cada una.",
        "Elige dos o tres tipos de tareas relacionadas que ya hayas estudiado. Mézclalas y explica qué método corresponde antes de resolver cada una."
      ],
      "it": [
        "Scegli tra approcci correlati",
        "Alterna tipi di esercizio correlati e scegli il metodo adatto. In questo modo ti eserciti sia a scegliere un metodo sia ad applicarlo.",
        "Apprendi prima i nuovi approcci attraverso esempi chiari. Cambiare argomento in modo casuale o multitasking è diverso. I benefici dipendono dal materiale e dalle tue conoscenze precedenti.",
        "Capisci ogni approccio separatamente prima.",
        "Poi mescola alcuni tipi di compito correlati.",
        "Prima di rispondere, identifica il tipo e spiega il tuo ragionamento.",
        "Risolvi l’esercizio e controlla separatamente la scelta del metodo e il risultato.",
        "Lavora specificamente sugli errori, poi ritorna alla pratica mista.",
        "Rettangolo: area = lunghezza × larghezza. Triangolo: area = base × altezza corrispondente ÷ 2. Un rettangolo di 4 cm di lunghezza e 3 cm di larghezza ha un'area di 12 cm². Un triangolo con base 4 cm e altezza corrispondente 3 cm ha un'area di 6 cm².",
        "Gli stessi numeri non richiedono sempre lo stesso calcolo. La figura determina la regola: per il triangolo bisogna dividere per due. Gli esercizi misti richiedono di riconoscere il tipo prima di applicare una regola.",
        "Compito A: un triangolo con base 6 cm e altezza corrispondente 4 cm. Compito B: un rettangolo di 6 cm di lunghezza e 4 cm di larghezza. Fornisci la regola e l'area per ciascuno.",
        "Scegli due o tre tipi di compito correlati che hai già studiato. Mescolali e spiega quale approccio si adatta prima di risolvere ciascuno."
      ],
      "pt": [
        "Escolha entre abordagens relacionadas",
        "Misture tipos relacionados de tarefas e escolha o método apropriado sozinho. Isso pratica a seleção de um método e sua aplicação.",
        "Aprenda primeiramente as novas abordagens por meio de exemplos claros. Alterar de tópico aleatoriamente ou multitarefas é diferente. Os benefícios dependem do conteúdo e do seu conhecimento prévio.",
        "Entenda cada abordagem separadamente primeiro.",
        "Em seguida, misture alguns tipos de tarefa relacionados.",
        "Antes de responder, identifique o tipo e explique sua escolha.",
        "Resolva a tarefa e verifique separadamente sua escolha e resultado.",
        "Trabalhe especificamente com erros, depois retorne à prática mista.",
        "Retângulo: área = comprimento × largura. Triângulo: área = base × altura correspondente ÷ 2. Um retângulo de 4 cm de comprimento e 3 cm de largura tem área de 12 cm². Um triângulo com base de 4 cm e altura correspondente de 3 cm tem área de 6 cm².",
        "Números iguais não implicam cálculos idênticos. A forma determina a regra: o triângulo exige o fator um meio. Tarefas mistas exigem reconhecer o tipo antes de aplicar a regra.",
        "Tarefa A: um triângulo com base de 6 cm e altura correspondente de 4 cm. Tarefa B: um retângulo de 6 cm de comprimento e 4 cm de largura. Forneça a regra e a área para cada uma.",
        "Escolha dois ou três tipos de tarefa relacionados que já estudou. Misture-os e explique qual método é adequado antes de resolver cada tarefa."
      ],
      "nl": [
        "Kies tussen gerelateerde aanpakken",
        "Combineer gerelateerde soorten opgaven en kies zelf de juiste aanpak. Dit oefent het kiezen van een methode en het toepassen ervan.",
        "Leer nieuwe aanpakken eerst met duidelijke voorbeelden. Willekeurig van onderwerp wisselen of multitasken is iets anders. Het voordeel hangt af van de leerstof en je voorkennis.",
        "Begrijp eerst elke aanpak afzonderlijk.",
        "Meng daarna enkele verwante soorten opgaven.",
        "Voor het antwoorden bepaal je eerst het type en leg je keuze uit.",
        "Los de opgave op en controleer je keuze en resultaat apart.",
        "Werk gericht aan fouten en ga daarna terug naar gemengde oefening.",
        "Rechthoek: oppervlakte = lengte × breedte. Driehoek: oppervlakte = basis × overeenkomende hoogte ÷ 2. Een rechthoek van 4 cm lengte en 3 cm breedte heeft een oppervlakte van 12 cm². Een driehoek met basis 4 cm en overeenkomende hoogte  3 cm heeft een oppervlakte van 6 cm².",
        "Dezelfde getallen vragen niet altijd om dezelfde berekening. De vorm bepaalt de regel: bij een driehoek deel je door twee. Bij gemengde opgaven moet je het type herkennen voordat je de regel toepast.",
        "Opgave A: een driehoek met basis 6 cm en overeenkomende hoogte 4 cm. Opgave B: een rechthoek van 6 cm lengte en 4 cm breedte. Geef de regel en oppervlakte voor elk.",
        "Kies twee of drie gerelateerde opgaventypen die je al hebt bestudeerd. Combineer ze en leg uit welke aanpak past voordat je elke opgave oplost."
      ],
      "tr": [
        "İlgili yöntemler arasında seçim yap",
        "Birbiriyle ilişkili soru türlerini karıştır ve uygun yöntemi kendin seç. Böylece hem yöntem seçmeyi hem de uygulamayı çalışırsın.",
        "Yeni yöntemleri önce açık örneklerle öğren. Rastgele konu değiştirmek veya aynı anda birden çok iş yapmak farklıdır. Yararı, çalışma malzemesine ve önceki bilgine bağlıdır.",
        "Önce her yöntemi ayrı ayrı anla.",
        "Sonra birbiriyle ilişkili birkaç soru türünü karıştır.",
        "Cevaplamadan önce soru türünü belirle ve seçimini açıkla.",
        "Soruyu çöz; yöntem seçimini ve sonucu ayrı ayrı kontrol et.",
        "Hatalar üzerinde özellikle çalış, sonra karışık alıştırmalara dön.",
        "Dikdörtgen: alan = uzunluk × genişlik. Üçgen: alan = taban × karşılık gelen yükseklik ÷ 2. 4 cm uzunluğunda ve 3 cm genişliğinde bir dikdörtgenin alanı 12 cm²’dir. 4 cm tabanlı ve karşılık gelen yüksekliği 3 cm olan bir üçgenin alanı 6 cm²’dir.",
        "Aynı sayılar aynı hesabı gerektirmez. Kuralı şekil belirler: üçgende ikiye bölmek gerekir. Karışık sorularda kuralı uygulamadan önce soru türünü tanımak gerekir.",
        "Görev A: 6 cm tabanlı ve karşılık gelen yüksekliği 4 cm olan bir üçgen. Görev B: 6 cm uzunluğunda ve 4 cm genişliğinde bir dikdörtgen. Her ikisinde kural ve alanları verin.",
        "Daha önce öğrendiğin iki veya üç ilişkili soru türünü seç. Bunları karıştır ve her birini çözmeden önce hangi yöntemin uygun olduğunu açıkla."
      ],
      "ar": [
        "اختر بين طرق مترابطة",
        "امزج أنواعًا مترابطة من المسائل واختر بنفسك الطريقة المناسبة. بذلك تتدرّب على اختيار الطريقة وعلى تطبيقها.",
        "تعلّم الطرق الجديدة أولًا من أمثلة واضحة. التنقل العشوائي بين المواضيع أو أداء مهام متعددة في الوقت نفسه أمر مختلف. تعتمد الفائدة على المادة ومعرفتك السابقة.",
        "افهم كل طريقة على حدة أولًا.",
        "ثم امزج بضعة أنواع مترابطة من المسائل.",
        "قبل الإجابة، حدّد نوع المسألة واشرح اختيارك.",
        "حل المسألة وتحقّق من اختيار الطريقة ومن النتيجة كلٍّ على حدة.",
        "عالج الأخطاء تحديدًا ثم عد إلى التدريب المختلط.",
        "المستطيل: المساحة = الطول × العرض. المثلث: المساحة = القاعدة × الارتفاع المقابل ÷ 2. مستطيل طوله 4 سم وعرضه 3 سم مساحته 12 سم². مثلث قاعدته 4 سم وارتفاعه المقابل 3 سم مساحته 6 سم².",
        "تساوي الأعداد لا يعني استخدام الحساب نفسه. الشكل يحدّد القاعدة: المثلث يحتاج إلى القسمة على اثنين. في المسائل المختلطة يجب تمييز النوع قبل تطبيق القاعدة.",
        "المسألة أ: مثلث قاعدته 6 سم وارتفاعه المقابل 4 سم. المسألة ب: مستطيل طوله 6 سم وعرضه 4 سم. اذكر القاعدة والمساحة لكل منهما.",
        "اختر نوعين أو ثلاثة من المسائل المترابطة التي درستها. امزجها واشرح الطريقة المناسبة قبل حل كل مسألة."
      ],
      "zh": [
        "在相关方法之间进行选择",
        "混合练习几种相关的任务，并自行选择合适的方法。这样既练习选择方法，也练习应用方法。",
        "先通过清晰的例子学会每种新方法。随机切换主题或同时处理多个任务是另一回事。效果取决于学习内容和你已有的知识。",
        "先分别理解每种方法。",
        "然后混合几种相关类型的任务。",
        "在作答前，先确定任务类型并解释你的选择依据。",
        "完成任务并分别检查你的选择和结果是否正确。",
        "专门针对错误进行练习，然后再回到混合练习。",
        "矩形：面积 = 长 × 宽。三角形：面积 = 底 × 对应高 ÷ 2。一个长4厘米、宽3厘米的矩形面积为12平方厘米。一个底为4厘米、对应高为3厘米的三角形面积为6平方厘米。",
        "相同的数字并不意味着相同的计算过程。形状决定了规则：三角形需要乘以二分之一的因子。混合任务要求在应用规则前先识别出任务类型。",
        "任务A：一个底为6厘米、对应高为4厘米的三角形。任务B：一个长6厘米、宽4厘米的矩形。给出每种任务的规则和面积。",
        "选择你已经学习过的两种或三种相关任务类型，混合它们，并在求解前说明哪种方法更合适。"
      ],
      "ja": [
        "関連する方法を選び分ける",
        "関連するタスクの種類を混ぜて、自分自身で適切なアプローチを選択します。これにより、方法の選択およびその適用が練習されます。",
        "まず、明確な例を通じて新しいアプローチを学びます。トピックをランダムに切り替えたり、マルチタスクを実施するのは異なります。メリットは、素材や既存の知識に依存します。",
        "まず、それぞれのアプローチを個別に理解します。",
        "その後、関連するタスクのいくつかを混ぜます。",
        "答えを出す前に、タスクの種類を特定し、その選択理由を説明します。",
        "タスクを解き、その後、選択と結果を別々に確認します。",
        "誤りを特に取り上げて練習し、その後に混ぜた練習に戻ります。",
        "長方形：面積 = 長さ × 幅。三角形：面積 = 底辺 × 対応する高さ ÷ 2。長さ4cm、幅3cmの長方形は面積12cm²です。底辺4cm、対応する高さ3cmの三角形は面積6cm²です。",
        "数値が同じでも、計算方法が同じとは限りません。図形によって使う公式が決まり、三角形では2で割ります。問題を混ぜると、公式を使う前に問題の種類を見分ける必要があります。",
        "タスクA：底辺6cm、対応する高さ4cmの三角形。タスクB：長さ6cm、幅4cmの長方形。それぞれのルールと面積を示してください。",
        "すでに学んだ2つまたは3つの関連タスクタイプを選び、混ぜて、どのアプローチが適しているかを説明した上で、それぞれを解きます。"
      ]
    },
    "recallBoundary": 89.07804374999999,
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      }
    ]
  },
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "de",
    "mime": "video/mp4",
    "presentation": "illustrated",
    "src": "/course-media/video/atta-story-de-visual-04f09d8aa552.mp4",
    "bytes": 1641297,
    "sha256": "04f09d8aa5520824119183482aa7aa45c42739494cf1f28b261e8afaa7544a3e",
    "duration": 102.6,
    "cues": [
      {
        "start": 0.0,
        "end": 2.6
      },
      {
        "start": 2.6,
        "end": 5.44
      },
      {
        "start": 5.44,
        "end": 8.64
      },
      {
        "start": 8.64,
        "end": 16.6
      },
      {
        "start": 16.6,
        "end": 24.8
      },
      {
        "start": 24.8,
        "end": 28.16
      },
      {
        "start": 28.16,
        "end": 34.96
      },
      {
        "start": 34.96,
        "end": 39.96
      },
      {
        "start": 39.96,
        "end": 45.04
      },
      {
        "start": 45.04,
        "end": 50.76
      },
      {
        "start": 50.76,
        "end": 56.32
      },
      {
        "start": 56.32,
        "end": 62.52
      },
      {
        "start": 62.52,
        "end": 65.96
      },
      {
        "start": 65.96,
        "end": 70.88
      },
      {
        "start": 70.88,
        "end": 73.0
      },
      {
        "start": 73.0,
        "end": 77.64
      },
      {
        "start": 77.64,
        "end": 80.64
      },
      {
        "start": 80.64,
        "end": 84.28
      },
      {
        "start": 84.28,
        "end": 90.96
      },
      {
        "start": 90.96,
        "end": 97.4
      },
      {
        "start": 97.4,
        "end": 102.6
      }
    ],
    "captions": {
      "es": [
        "Bienvenido a ANITEW.",
        "Soy un entrenador de aprendizaje generado por IA.",
        "Hoy conocerás el método de las historias.",
        "Es una técnica de memoria: conectas distintas informaciones en una sola historia.",
        "Puede ayudarte a recordar un orden, como una lista de compras o las ideas de una presentación.",
        "No sustituye la comprensión del contenido.",
        "Primero conocerás el principio, verás un ejemplo y después lo probarás.",
        "Tu objetivo es recordar tres palabras en el orden correcto.",
        "Nuestro ejemplo: llave, limón, bicicleta.",
        "Imagina primero una llave gigante que exprime un limón.",
        "El zumo salpica una bicicleta y hace girar sus ruedas.",
        "Una acción conecta la primera palabra con la segunda y otra conecta la segunda con la tercera.",
        "La historia inusual es solo una ayuda para la memoria.",
        "Lo importante es imaginar claramente las acciones.",
        "Ahora desaparecerán las imágenes.",
        "Haz una pausa y recuerda las tres palabras en orden.",
        "Cuando estés listo, muestra la respuesta.",
        "Eran: llave, limón, bicicleta.",
        "Si falta una palabra, repasa su conexión y vuelve a intentarlo.",
        "Para terminar, inventa una historia con otras tres palabras y recuérdalas sin mirar.",
        "También puedes leer todo el curso y hacer los ejercicios a tu ritmo."
      ],
      "it": [
        "Benvenuto su ANITEW.",
        "Sono un tutor creato con l'intelligenza artificiale.",
        "Oggi scoprirai il metodo delle storie.",
        "È una tecnica di memoria: colleghi informazioni diverse in un'unica storia.",
        "Può aiutarti a ricordare una sequenza, come una lista della spesa o i punti di un discorso.",
        "Non sostituisce la comprensione del contenuto.",
        "Prima scoprirai il principio, vedrai un esempio e poi proverai il metodo.",
        "Il tuo obiettivo è ricordare tre parole nell'ordine giusto.",
        "Il nostro esempio: chiave, limone, bicicletta.",
        "Immagina una chiave gigante che spreme un limone.",
        "Il succo schizza su una bicicletta e ne fa girare le ruote.",
        "Un'azione collega la prima parola alla seconda e un'altra collega la seconda alla terza.",
        "La storia insolita è soltanto un aiuto per la memoria.",
        "Conta immaginare chiaramente le azioni.",
        "Ora le immagini scompariranno.",
        "Fai una pausa e ricorda le tre parole nell'ordine giusto.",
        "Quando sei pronto, mostra la risposta.",
        "Erano: chiave, limone, bicicletta.",
        "Se manca una parola, rivedi il collegamento e riprova.",
        "Infine, inventa una storia con altre tre parole e ricordale senza guardare.",
        "Puoi anche leggere tutto il corso e fare gli esercizi al tuo ritmo."
      ],
      "pt": [
        "Bem-vindo ao ANITEW.",
        "Sou um orientador de aprendizagem gerado por IA.",
        "Hoje vamos conhecer o método das histórias.",
        "É uma técnica de memorização: ligas informações separadas numa única história.",
        "Pode ajudar a recordar uma sequência, como uma lista de compras ou os pontos de uma apresentação.",
        "Não substitui a compreensão do conteúdo.",
        "Primeiro conhecerás o princípio, verás um exemplo e depois experimentarás o método.",
        "O objetivo é recordar três palavras na ordem certa.",
        "O nosso exemplo: chave, limão, bicicleta.",
        "Imagina uma chave gigante a espremer um limão.",
        "O sumo salpica uma bicicleta e faz girar as rodas.",
        "Uma ação liga a primeira palavra à segunda e outra liga a segunda à terceira.",
        "A história invulgar é apenas uma ajuda para a memória.",
        "O importante é imaginar claramente as ações.",
        "Agora as imagens vão desaparecer.",
        "Faz uma pausa e recorda as três palavras pela ordem certa.",
        "Quando estiveres pronto, mostra a resposta.",
        "Eram: chave, limão, bicicleta.",
        "Se faltar uma palavra, revê a ligação e tenta novamente.",
        "Por fim, inventa uma história com outras três palavras e recorda-as sem olhar.",
        "Também podes ler o curso inteiro e fazer os exercícios ao teu ritmo."
      ],
      "nl": [
        "Welkom bij ANITEW.",
        "Ik ben een door AI gemaakte leercoach.",
        "Vandaag ontdek je de verhalenmethode.",
        "Dit is een geheugentechniek: je verbindt losse informatie in één verhaal.",
        "Dat kan helpen om een volgorde te onthouden, zoals een boodschappenlijst of de hoofdpunten van een presentatie.",
        "Het vervangt niet het begrijpen van de inhoud.",
        "Eerst leer je het principe, dan zie je een voorbeeld en probeer je het zelf.",
        "Je doel is drie woorden in de juiste volgorde te herinneren.",
        "Ons voorbeeld: sleutel, citroen, fiets.",
        "Stel je eerst een enorme sleutel voor die een citroen uitperst.",
        "Het sap spat op een fiets en laat de wielen draaien.",
        "Eén handeling verbindt het eerste woord met het tweede; een andere het tweede met het derde.",
        "Het ongewone verhaal is alleen een geheugensteuntje.",
        "Het gaat erom dat je de handelingen zelf duidelijk voor je ziet.",
        "Nu verdwijnen de beelden.",
        "Pauzeer en noem de drie woorden in de juiste volgorde.",
        "Toon het antwoord zodra je klaar bent.",
        "Het waren: sleutel, citroen, fiets.",
        "Mis je een woord, bekijk dan de verbinding opnieuw en probeer het nog eens.",
        "Bedenk tot slot een verhaal met drie andere woorden en herinner ze zonder te kijken.",
        "Je kunt ook de hele cursus lezen en alle oefeningen in je eigen tempo doen."
      ],
      "tr": [
        "ANITEW'e hoş geldin.",
        "Ben yapay zekâyla oluşturulmuş bir öğrenme koçuyum.",
        "Bugün hikâye yöntemini öğreneceksin.",
        "Bu bir hafıza tekniğidir: ayrı bilgileri tek bir hikâyede birleştirirsin.",
        "Alışveriş listesi veya sunum başlıkları gibi bir sırayı hatırlamana yardımcı olabilir.",
        "İçeriği anlamanın yerini tutmaz.",
        "Önce yöntemi öğrenecek, bir örnek görecek, ardından kendin deneyeceksin.",
        "Hedefin üç kelimeyi doğru sırayla hatırlamak.",
        "Örneğimiz: anahtar, limon, bisiklet.",
        "Önce dev bir anahtarın bir limonu sıktığını hayal et.",
        "Limon suyu bir bisiklete sıçrar ve tekerleklerini döndürür.",
        "Bir hareket ilk kelimeyi ikinciye, başka bir hareket ikinciyi üçüncüye bağlar.",
        "Bu alışılmadık hikâye yalnızca bir hatırlama aracıdır.",
        "Önemli olan hareketleri zihninde açıkça canlandırmandır.",
        "Şimdi resimler kaybolacak.",
        "Duraklat ve üç kelimeyi doğru sırayla söyle.",
        "Hazır olduğunda yanıtı göster.",
        "Kelimeler: anahtar, limon, bisiklet.",
        "Bir kelime eksikse ilgili bağlantıya yeniden bak ve tekrar dene.",
        "Son olarak başka üç kelimeyle bir hikâye kur ve bakmadan hatırla.",
        "Kursun tamamını okuyabilir ve alıştırmaları kendi hızında yapabilirsin."
      ],
      "ar": [
        "مرحبًا بك في ANITEW.",
        "أنا مدرب تعلّم مولّد بالذكاء الاصطناعي.",
        "سنتعرّف اليوم على طريقة القصص.",
        "هي تقنية للتذكّر تربط معلومات منفصلة في قصة واحدة.",
        "قد تساعدك على تذكّر ترتيب الأشياء، مثل قائمة مشتريات أو النقاط الأساسية لعرض تقديمي.",
        "لكنها لا تغني عن فهم المحتوى.",
        "ستتعرّف أولًا على الفكرة، ثم تشاهد مثالًا وتجرّب الطريقة بنفسك.",
        "هدفك تذكّر ثلاث كلمات بالترتيب الصحيح.",
        "مثالنا هو: مفتاح، ليمونة، دراجة.",
        "تخيّل أولًا مفتاحًا ضخمًا يعصر ليمونة.",
        "يتناثر عصير الليمون على دراجة فيجعل عجلاتها تدور.",
        "يربط فعلٌ الكلمة الأولى بالثانية، وفعلٌ آخر يربط الثانية بالثالثة.",
        "القصة غير المعتادة مجرد وسيلة مساعدة للتذكّر.",
        "المهم أن تتخيّل الأفعال بوضوح بنفسك.",
        "ستختفي الصور الآن.",
        "توقّف مؤقتًا واذكر الكلمات الثلاث بالترتيب الصحيح.",
        "عندما تكون مستعدًا، أظهر الإجابة.",
        "الكلمات هي: مفتاح، ليمونة، دراجة.",
        "إذا نسيت كلمة، راجع الرابط المتعلق بها ثم حاول مجددًا.",
        "أخيرًا، ابتكر قصة بثلاث كلمات أخرى وتذكّرها دون النظر.",
        "يمكنك أيضًا قراءة الدرس كاملًا وأداء التمارين بالسرعة المناسبة لك."
      ],
      "zh": [
        "欢迎来到 ANITEW。",
        "我是一位由人工智能生成的学习教练。",
        "今天我们来了解故事记忆法。",
        "这是一种记忆技巧：把零散的信息串成一个故事。",
        "它可以帮助你记住顺序，例如购物清单或演讲要点。",
        "但它不能代替对内容的理解。",
        "你将先了解原理，再看一个例子，然后亲自尝试。",
        "你的目标是按正确顺序回忆三个词。",
        "我们的例子是：钥匙、柠檬、自行车。",
        "先想象一把巨大的钥匙挤压一个柠檬。",
        "柠檬汁溅到自行车上，让车轮转动起来。",
        "一个动作连接第一个词和第二个词，另一个动作连接第二个词和第三个词。",
        "这个不寻常的故事只是辅助记忆的工具。",
        "关键是自己清晰地想象这些动作。",
        "现在图片将会消失。",
        "请暂停，按正确顺序说出这三个词。",
        "准备好后再显示答案。",
        "它们是：钥匙、柠檬、自行车。",
        "如果忘了一个词，就再看一遍对应的联系，然后重试。",
        "最后，用另外三个词编一个故事，再不看提示回忆这些词。",
        "你也可以阅读整个课程，按自己的节奏完成所有练习。"
      ],
      "ja": [
        "ANITEWへようこそ。",
        "私はAIで生成された学習コーチです。",
        "今日は物語を使った記憶法を学びます。",
        "これは、別々の情報を一つの物語につなげる記憶の技法です。",
        "買い物リストや発表の要点など、順序を覚えるのに役立つことがあります。",
        "ただし、内容を理解する代わりにはなりません。",
        "まず考え方を知り、例を見てから、自分で試してみましょう。",
        "目標は三つの言葉を正しい順序で思い出すことです。",
        "例は、鍵、レモン、自転車です。",
        "まず、巨大な鍵がレモンを搾るところを想像してください。",
        "レモンの汁が自転車にかかり、車輪を回します。",
        "一つの動作が一番目と二番目の言葉をつなぎ、別の動作が二番目と三番目をつなぎます。",
        "この変わった物語は、記憶を助けるためのものです。",
        "大切なのは、動作を自分ではっきりと想像することです。",
        "これから画像が消えます。",
        "一時停止して、三つの言葉を正しい順序で思い出してください。",
        "準備ができたら答えを表示しましょう。",
        "答えは、鍵、レモン、自転車です。",
        "忘れた言葉があれば、そのつながりをもう一度見て、再び試してください。",
        "最後に、別の三つの言葉で物語を作り、見ずに思い出してください。",
        "コース全体を文章で読み、自分のペースで練習することもできます。"
      ],
      "de": [
        "Willkommen bei ANITEW.",
        "Ich bin ein KI-generierter Lerncoach.",
        "Heute geht es um die Geschichten-Methode.",
        "Die Geschichten-Methode ist eine Merktechnik: Du verknüpfst einzelne Informationen zu einer zusammenhängenden Geschichte.",
        "Sie kann dir helfen, eine Reihenfolge zu behalten, etwa bei einer Einkaufsliste oder den Stichpunkten eines Vortrags.",
        "Sie ersetzt nicht das Verstehen des Inhalts.",
        "In diesem Kurs lernst du zuerst das Prinzip, siehst ein Beispiel und probierst die Methode anschließend selbst aus.",
        "Dein Ziel: drei Begriffe in der richtigen Reihenfolge erinnern.",
        "Unser Beispiel ist: Schlüssel, Zitrone, Fahrrad.",
        "Zuerst stellst du dir vor, wie ein riesiger Schlüssel eine Zitrone aufdrückt.",
        "Der Zitronensaft spritzt auf ein Fahrrad und setzt seine Räder in Bewegung.",
        "So verbindet eine Handlung den ersten Begriff mit dem zweiten, und eine weitere den zweiten mit dem dritten.",
        "Die ungewöhnliche Geschichte ist nur eine Merkhilfe.",
        "Entscheidend ist, dass du dir die Handlung selbst deutlich vorstellst.",
        "Jetzt verschwinden die Bilder.",
        "Pausiere hier und nenne die drei Begriffe in der richtigen Reihenfolge.",
        "Wenn du bereit bist, blende die Lösung ein.",
        "Es waren: Schlüssel, Zitrone, Fahrrad.",
        "Fehlt dir ein Begriff, schau dir die passende Verbindung noch einmal an und versuche es erneut.",
        "Zum Schluss: Erfinde eine eigene Geschichte mit drei anderen Begriffen und rufe sie ohne Vorlage ab.",
        "Du kannst den gesamten Kurs auch lesen und alle Übungen in deinem eigenen Tempo machen."
      ],
      "en": [
        "Welcome to ANITEW.",
        "I am an AI-generated learning coach.",
        "Today we will explore the story method.",
        "The story method is a memory technique: you connect separate pieces of information in a single story.",
        "It can help you remember a sequence, such as a shopping list or the main points of a talk.",
        "It does not replace understanding the material.",
        "In this course, you will first learn the idea, see an example, and then try the method yourself.",
        "Your goal is to recall three words in the correct order.",
        "Our example is: key, lemon, bicycle.",
        "First, imagine a giant key squeezing a lemon.",
        "The lemon juice splashes onto a bicycle and makes its wheels turn.",
        "One action connects the first word to the second, and another connects the second to the third.",
        "The unusual story is simply a memory aid.",
        "What matters is imagining the actions clearly for yourself.",
        "Now the pictures will disappear.",
        "Pause here and name the three words in the correct order.",
        "When you are ready, reveal the answer.",
        "The words were: key, lemon, bicycle.",
        "If you missed a word, look at its connection again and have another try.",
        "Finally, make up your own story with three different words and recall them without looking.",
        "You can also read the entire course and do every exercise at your own pace."
      ],
      "fr": [
        "Bienvenue sur ANITEW.",
        "Je suis un coach pédagogique créé par intelligence artificielle.",
        "Aujourd'hui, nous allons découvrir la méthode des histoires.",
        "La méthode des histoires est une technique de mémorisation : elle relie plusieurs informations dans une même histoire.",
        "Elle peut aider à retenir un ordre, par exemple une liste de courses ou les points principaux d'un exposé.",
        "Elle ne remplace pas la compréhension du contenu.",
        "Dans ce cours, tu découvriras le principe, tu verras un exemple, puis tu essaieras la méthode toi-même.",
        "Ton objectif : retrouver trois mots dans le bon ordre.",
        "Voici notre exemple : clé, citron, vélo.",
        "Imagine d'abord une clé géante qui presse un citron.",
        "Le jus de citron éclabousse un vélo et fait tourner ses roues.",
        "Une action relie le premier mot au deuxième, puis une autre relie le deuxième au troisième.",
        "Cette histoire inhabituelle sert simplement d'aide-mémoire.",
        "L'essentiel est de te représenter clairement les actions.",
        "Les images vont maintenant disparaître.",
        "Fais une pause et retrouve les trois mots dans le bon ordre.",
        "Quand tu es prêt, affiche la réponse.",
        "Les mots étaient : clé, citron, vélo.",
        "Si tu as oublié un mot, revois le lien correspondant et essaie à nouveau.",
        "Pour terminer, invente une histoire avec trois autres mots, puis retrouve-les sans regarder.",
        "Tu peux aussi lire tout le cours et faire chaque exercice à ton rythme."
      ]
    },
    "recallBoundary": 77.64,
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW AI coach portrait and logo animation",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW assets"
      }
    ]
  },
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "fr",
    "mime": "video/mp4",
    "presentation": "illustrated",
    "src": "/course-media/video/atta-story-fr-visual-017409c07a09.mp4",
    "bytes": 1310725,
    "sha256": "017409c07a09a69f0143e67ee95cbd420075684e07077a2093b3f41cb67fd3c0",
    "duration": 83.88,
    "cues": [
      {
        "start": 0.0,
        "end": 2.32
      },
      {
        "start": 2.32,
        "end": 6.04
      },
      {
        "start": 6.04,
        "end": 10.16
      },
      {
        "start": 10.16,
        "end": 17.48
      },
      {
        "start": 17.48,
        "end": 24.16
      },
      {
        "start": 24.16,
        "end": 27.48
      },
      {
        "start": 27.48,
        "end": 32.44
      },
      {
        "start": 32.44,
        "end": 36.64
      },
      {
        "start": 36.64,
        "end": 40.96
      },
      {
        "start": 40.96,
        "end": 44.72
      },
      {
        "start": 44.72,
        "end": 48.88
      },
      {
        "start": 48.88,
        "end": 53.4
      },
      {
        "start": 53.4,
        "end": 56.24
      },
      {
        "start": 56.24,
        "end": 59.96
      },
      {
        "start": 59.96,
        "end": 61.8
      },
      {
        "start": 61.8,
        "end": 64.48
      },
      {
        "start": 64.48,
        "end": 67.84
      },
      {
        "start": 67.84,
        "end": 71.08
      },
      {
        "start": 71.08,
        "end": 75.92
      },
      {
        "start": 75.92,
        "end": 80.6
      },
      {
        "start": 80.6,
        "end": 83.88
      }
    ],
    "captions": {
      "es": [
        "Bienvenido a ANITEW.",
        "Soy un entrenador de aprendizaje generado por IA.",
        "Hoy conocerás el método de las historias.",
        "Es una técnica de memoria: conectas distintas informaciones en una sola historia.",
        "Puede ayudarte a recordar un orden, como una lista de compras o las ideas de una presentación.",
        "No sustituye la comprensión del contenido.",
        "Primero conocerás el principio, verás un ejemplo y después lo probarás.",
        "Tu objetivo es recordar tres palabras en el orden correcto.",
        "Nuestro ejemplo: llave, limón, bicicleta.",
        "Imagina primero una llave gigante que exprime un limón.",
        "El zumo salpica una bicicleta y hace girar sus ruedas.",
        "Una acción conecta la primera palabra con la segunda y otra conecta la segunda con la tercera.",
        "La historia inusual es solo una ayuda para la memoria.",
        "Lo importante es imaginar claramente las acciones.",
        "Ahora desaparecerán las imágenes.",
        "Haz una pausa y recuerda las tres palabras en orden.",
        "Cuando estés listo, muestra la respuesta.",
        "Eran: llave, limón, bicicleta.",
        "Si falta una palabra, repasa su conexión y vuelve a intentarlo.",
        "Para terminar, inventa una historia con otras tres palabras y recuérdalas sin mirar.",
        "También puedes leer todo el curso y hacer los ejercicios a tu ritmo."
      ],
      "it": [
        "Benvenuto su ANITEW.",
        "Sono un tutor creato con l'intelligenza artificiale.",
        "Oggi scoprirai il metodo delle storie.",
        "È una tecnica di memoria: colleghi informazioni diverse in un'unica storia.",
        "Può aiutarti a ricordare una sequenza, come una lista della spesa o i punti di un discorso.",
        "Non sostituisce la comprensione del contenuto.",
        "Prima scoprirai il principio, vedrai un esempio e poi proverai il metodo.",
        "Il tuo obiettivo è ricordare tre parole nell'ordine giusto.",
        "Il nostro esempio: chiave, limone, bicicletta.",
        "Immagina una chiave gigante che spreme un limone.",
        "Il succo schizza su una bicicletta e ne fa girare le ruote.",
        "Un'azione collega la prima parola alla seconda e un'altra collega la seconda alla terza.",
        "La storia insolita è soltanto un aiuto per la memoria.",
        "Conta immaginare chiaramente le azioni.",
        "Ora le immagini scompariranno.",
        "Fai una pausa e ricorda le tre parole nell'ordine giusto.",
        "Quando sei pronto, mostra la risposta.",
        "Erano: chiave, limone, bicicletta.",
        "Se manca una parola, rivedi il collegamento e riprova.",
        "Infine, inventa una storia con altre tre parole e ricordale senza guardare.",
        "Puoi anche leggere tutto il corso e fare gli esercizi al tuo ritmo."
      ],
      "pt": [
        "Bem-vindo ao ANITEW.",
        "Sou um orientador de aprendizagem gerado por IA.",
        "Hoje vamos conhecer o método das histórias.",
        "É uma técnica de memorização: ligas informações separadas numa única história.",
        "Pode ajudar a recordar uma sequência, como uma lista de compras ou os pontos de uma apresentação.",
        "Não substitui a compreensão do conteúdo.",
        "Primeiro conhecerás o princípio, verás um exemplo e depois experimentarás o método.",
        "O objetivo é recordar três palavras na ordem certa.",
        "O nosso exemplo: chave, limão, bicicleta.",
        "Imagina uma chave gigante a espremer um limão.",
        "O sumo salpica uma bicicleta e faz girar as rodas.",
        "Uma ação liga a primeira palavra à segunda e outra liga a segunda à terceira.",
        "A história invulgar é apenas uma ajuda para a memória.",
        "O importante é imaginar claramente as ações.",
        "Agora as imagens vão desaparecer.",
        "Faz uma pausa e recorda as três palavras pela ordem certa.",
        "Quando estiveres pronto, mostra a resposta.",
        "Eram: chave, limão, bicicleta.",
        "Se faltar uma palavra, revê a ligação e tenta novamente.",
        "Por fim, inventa uma história com outras três palavras e recorda-as sem olhar.",
        "Também podes ler o curso inteiro e fazer os exercícios ao teu ritmo."
      ],
      "nl": [
        "Welkom bij ANITEW.",
        "Ik ben een door AI gemaakte leercoach.",
        "Vandaag ontdek je de verhalenmethode.",
        "Dit is een geheugentechniek: je verbindt losse informatie in één verhaal.",
        "Dat kan helpen om een volgorde te onthouden, zoals een boodschappenlijst of de hoofdpunten van een presentatie.",
        "Het vervangt niet het begrijpen van de inhoud.",
        "Eerst leer je het principe, dan zie je een voorbeeld en probeer je het zelf.",
        "Je doel is drie woorden in de juiste volgorde te herinneren.",
        "Ons voorbeeld: sleutel, citroen, fiets.",
        "Stel je eerst een enorme sleutel voor die een citroen uitperst.",
        "Het sap spat op een fiets en laat de wielen draaien.",
        "Eén handeling verbindt het eerste woord met het tweede; een andere het tweede met het derde.",
        "Het ongewone verhaal is alleen een geheugensteuntje.",
        "Het gaat erom dat je de handelingen zelf duidelijk voor je ziet.",
        "Nu verdwijnen de beelden.",
        "Pauzeer en noem de drie woorden in de juiste volgorde.",
        "Toon het antwoord zodra je klaar bent.",
        "Het waren: sleutel, citroen, fiets.",
        "Mis je een woord, bekijk dan de verbinding opnieuw en probeer het nog eens.",
        "Bedenk tot slot een verhaal met drie andere woorden en herinner ze zonder te kijken.",
        "Je kunt ook de hele cursus lezen en alle oefeningen in je eigen tempo doen."
      ],
      "tr": [
        "ANITEW'e hoş geldin.",
        "Ben yapay zekâyla oluşturulmuş bir öğrenme koçuyum.",
        "Bugün hikâye yöntemini öğreneceksin.",
        "Bu bir hafıza tekniğidir: ayrı bilgileri tek bir hikâyede birleştirirsin.",
        "Alışveriş listesi veya sunum başlıkları gibi bir sırayı hatırlamana yardımcı olabilir.",
        "İçeriği anlamanın yerini tutmaz.",
        "Önce yöntemi öğrenecek, bir örnek görecek, ardından kendin deneyeceksin.",
        "Hedefin üç kelimeyi doğru sırayla hatırlamak.",
        "Örneğimiz: anahtar, limon, bisiklet.",
        "Önce dev bir anahtarın bir limonu sıktığını hayal et.",
        "Limon suyu bir bisiklete sıçrar ve tekerleklerini döndürür.",
        "Bir hareket ilk kelimeyi ikinciye, başka bir hareket ikinciyi üçüncüye bağlar.",
        "Bu alışılmadık hikâye yalnızca bir hatırlama aracıdır.",
        "Önemli olan hareketleri zihninde açıkça canlandırmandır.",
        "Şimdi resimler kaybolacak.",
        "Duraklat ve üç kelimeyi doğru sırayla söyle.",
        "Hazır olduğunda yanıtı göster.",
        "Kelimeler: anahtar, limon, bisiklet.",
        "Bir kelime eksikse ilgili bağlantıya yeniden bak ve tekrar dene.",
        "Son olarak başka üç kelimeyle bir hikâye kur ve bakmadan hatırla.",
        "Kursun tamamını okuyabilir ve alıştırmaları kendi hızında yapabilirsin."
      ],
      "ar": [
        "مرحبًا بك في ANITEW.",
        "أنا مدرب تعلّم مولّد بالذكاء الاصطناعي.",
        "سنتعرّف اليوم على طريقة القصص.",
        "هي تقنية للتذكّر تربط معلومات منفصلة في قصة واحدة.",
        "قد تساعدك على تذكّر ترتيب الأشياء، مثل قائمة مشتريات أو النقاط الأساسية لعرض تقديمي.",
        "لكنها لا تغني عن فهم المحتوى.",
        "ستتعرّف أولًا على الفكرة، ثم تشاهد مثالًا وتجرّب الطريقة بنفسك.",
        "هدفك تذكّر ثلاث كلمات بالترتيب الصحيح.",
        "مثالنا هو: مفتاح، ليمونة، دراجة.",
        "تخيّل أولًا مفتاحًا ضخمًا يعصر ليمونة.",
        "يتناثر عصير الليمون على دراجة فيجعل عجلاتها تدور.",
        "يربط فعلٌ الكلمة الأولى بالثانية، وفعلٌ آخر يربط الثانية بالثالثة.",
        "القصة غير المعتادة مجرد وسيلة مساعدة للتذكّر.",
        "المهم أن تتخيّل الأفعال بوضوح بنفسك.",
        "ستختفي الصور الآن.",
        "توقّف مؤقتًا واذكر الكلمات الثلاث بالترتيب الصحيح.",
        "عندما تكون مستعدًا، أظهر الإجابة.",
        "الكلمات هي: مفتاح، ليمونة، دراجة.",
        "إذا نسيت كلمة، راجع الرابط المتعلق بها ثم حاول مجددًا.",
        "أخيرًا، ابتكر قصة بثلاث كلمات أخرى وتذكّرها دون النظر.",
        "يمكنك أيضًا قراءة الدرس كاملًا وأداء التمارين بالسرعة المناسبة لك."
      ],
      "zh": [
        "欢迎来到 ANITEW。",
        "我是一位由人工智能生成的学习教练。",
        "今天我们来了解故事记忆法。",
        "这是一种记忆技巧：把零散的信息串成一个故事。",
        "它可以帮助你记住顺序，例如购物清单或演讲要点。",
        "但它不能代替对内容的理解。",
        "你将先了解原理，再看一个例子，然后亲自尝试。",
        "你的目标是按正确顺序回忆三个词。",
        "我们的例子是：钥匙、柠檬、自行车。",
        "先想象一把巨大的钥匙挤压一个柠檬。",
        "柠檬汁溅到自行车上，让车轮转动起来。",
        "一个动作连接第一个词和第二个词，另一个动作连接第二个词和第三个词。",
        "这个不寻常的故事只是辅助记忆的工具。",
        "关键是自己清晰地想象这些动作。",
        "现在图片将会消失。",
        "请暂停，按正确顺序说出这三个词。",
        "准备好后再显示答案。",
        "它们是：钥匙、柠檬、自行车。",
        "如果忘了一个词，就再看一遍对应的联系，然后重试。",
        "最后，用另外三个词编一个故事，再不看提示回忆这些词。",
        "你也可以阅读整个课程，按自己的节奏完成所有练习。"
      ],
      "ja": [
        "ANITEWへようこそ。",
        "私はAIで生成された学習コーチです。",
        "今日は物語を使った記憶法を学びます。",
        "これは、別々の情報を一つの物語につなげる記憶の技法です。",
        "買い物リストや発表の要点など、順序を覚えるのに役立つことがあります。",
        "ただし、内容を理解する代わりにはなりません。",
        "まず考え方を知り、例を見てから、自分で試してみましょう。",
        "目標は三つの言葉を正しい順序で思い出すことです。",
        "例は、鍵、レモン、自転車です。",
        "まず、巨大な鍵がレモンを搾るところを想像してください。",
        "レモンの汁が自転車にかかり、車輪を回します。",
        "一つの動作が一番目と二番目の言葉をつなぎ、別の動作が二番目と三番目をつなぎます。",
        "この変わった物語は、記憶を助けるためのものです。",
        "大切なのは、動作を自分ではっきりと想像することです。",
        "これから画像が消えます。",
        "一時停止して、三つの言葉を正しい順序で思い出してください。",
        "準備ができたら答えを表示しましょう。",
        "答えは、鍵、レモン、自転車です。",
        "忘れた言葉があれば、そのつながりをもう一度見て、再び試してください。",
        "最後に、別の三つの言葉で物語を作り、見ずに思い出してください。",
        "コース全体を文章で読み、自分のペースで練習することもできます。"
      ],
      "de": [
        "Willkommen bei ANITEW.",
        "Ich bin ein KI-generierter Lerncoach.",
        "Heute geht es um die Geschichten-Methode.",
        "Die Geschichten-Methode ist eine Merktechnik: Du verknüpfst einzelne Informationen zu einer zusammenhängenden Geschichte.",
        "Sie kann dir helfen, eine Reihenfolge zu behalten, etwa bei einer Einkaufsliste oder den Stichpunkten eines Vortrags.",
        "Sie ersetzt nicht das Verstehen des Inhalts.",
        "In diesem Kurs lernst du zuerst das Prinzip, siehst ein Beispiel und probierst die Methode anschließend selbst aus.",
        "Dein Ziel: drei Begriffe in der richtigen Reihenfolge erinnern.",
        "Unser Beispiel ist: Schlüssel, Zitrone, Fahrrad.",
        "Zuerst stellst du dir vor, wie ein riesiger Schlüssel eine Zitrone aufdrückt.",
        "Der Zitronensaft spritzt auf ein Fahrrad und setzt seine Räder in Bewegung.",
        "So verbindet eine Handlung den ersten Begriff mit dem zweiten, und eine weitere den zweiten mit dem dritten.",
        "Die ungewöhnliche Geschichte ist nur eine Merkhilfe.",
        "Entscheidend ist, dass du dir die Handlung selbst deutlich vorstellst.",
        "Jetzt verschwinden die Bilder.",
        "Pausiere hier und nenne die drei Begriffe in der richtigen Reihenfolge.",
        "Wenn du bereit bist, blende die Lösung ein.",
        "Es waren: Schlüssel, Zitrone, Fahrrad.",
        "Fehlt dir ein Begriff, schau dir die passende Verbindung noch einmal an und versuche es erneut.",
        "Zum Schluss: Erfinde eine eigene Geschichte mit drei anderen Begriffen und rufe sie ohne Vorlage ab.",
        "Du kannst den gesamten Kurs auch lesen und alle Übungen in deinem eigenen Tempo machen."
      ],
      "en": [
        "Welcome to ANITEW.",
        "I am an AI-generated learning coach.",
        "Today we will explore the story method.",
        "The story method is a memory technique: you connect separate pieces of information in a single story.",
        "It can help you remember a sequence, such as a shopping list or the main points of a talk.",
        "It does not replace understanding the material.",
        "In this course, you will first learn the idea, see an example, and then try the method yourself.",
        "Your goal is to recall three words in the correct order.",
        "Our example is: key, lemon, bicycle.",
        "First, imagine a giant key squeezing a lemon.",
        "The lemon juice splashes onto a bicycle and makes its wheels turn.",
        "One action connects the first word to the second, and another connects the second to the third.",
        "The unusual story is simply a memory aid.",
        "What matters is imagining the actions clearly for yourself.",
        "Now the pictures will disappear.",
        "Pause here and name the three words in the correct order.",
        "When you are ready, reveal the answer.",
        "The words were: key, lemon, bicycle.",
        "If you missed a word, look at its connection again and have another try.",
        "Finally, make up your own story with three different words and recall them without looking.",
        "You can also read the entire course and do every exercise at your own pace."
      ],
      "fr": [
        "Bienvenue sur ANITEW.",
        "Je suis un coach pédagogique créé par intelligence artificielle.",
        "Aujourd'hui, nous allons découvrir la méthode des histoires.",
        "La méthode des histoires est une technique de mémorisation. Elle relie plusieurs informations dans une même histoire.",
        "Elle peut aider à retenir un ordre. Par exemple une liste de courses ou les points principaux d'un exposé.",
        "Elle ne remplace pas la compréhension du contenu.",
        "Dans ce cours, tu découvriras le principe, tu verras un exemple, puis tu essaieras la méthode toi-même.",
        "Ton objectif est de retrouver trois mots dans le bon ordre.",
        "Voici notre exemple. clé, citron, vélo.",
        "Imagine d'abord une clé géante qui presse un citron.",
        "Le jus de citron éclabousse un vélo et fait tourner ses roues.",
        "Une action relie le premier mot au deuxième, puis une autre relie le deuxième au troisième.",
        "Cette histoire inhabituelle sert simplement d'aide-mémoire.",
        "L'essentiel est de te représenter clairement les actions.",
        "Les images vont maintenant disparaître.",
        "Fais une pause et retrouve les trois mots dans le bon ordre.",
        "Quand tu es prêt, affiche la réponse.",
        "Les mots étaient : clé, citron, vélo.",
        "Si tu as oublié un mot, revois le lien correspondant et essaie à nouveau.",
        "Pour terminer, invente une histoire avec trois autres mots, puis retrouve-les sans regarder.",
        "Tu peux aussi lire tout le cours et faire chaque exercice à ton rythme."
      ]
    },
    "recallBoundary": 66.6,
    "credits": [
      {
        "name": "ANITEW original illustrations",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW graphics"
      },
      {
        "name": "Atta voice · Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW synthetic reference · Qwen VoiceDesign",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        "license": "Apache-2.0"
      },
      {
        "name": "ANITEW AI coach portrait and logo animation",
        "url": "https://github.com/Impekal/anitew",
        "license": "Original ANITEW assets"
      }
    ]
  }
]
export function courseVideo(course:CourseId,language:SpokenLanguage,coach:CoachId|null){
 return courseVideos.find(video=>video.course===course&&video.language===language&&(video.coach===coach||video.presentation==='illustrated'))
}
export const courseVideoCopy={
 de:{illustratedNote:'Mit Illustrationen und der Kursstimme. Du kannst jederzeit zum Lesekurs oder zur Tonspur wechseln.',failed:'Das Video ist gerade nicht abspielbar. Ton und Lesekurs bleiben verfügbar.',format:'Darstellung',audio:'Ton und Illustration',video:'Videokurs',note:'Mit deinem gewählten KI-Coach und Illustrationen. Du kannst jederzeit zum Lesekurs oder zur Tonspur wechseln.'},
 en:{illustratedNote:'Illustrations with the course narration. You can switch to reading or audio at any time.',failed:'The video is unavailable right now. Audio and reading remain available.',format:'Presentation',audio:'Audio and illustration',video:'Video course',note:'With your selected AI coach and illustrations. You can switch to reading or audio at any time.'},
 fr:{illustratedNote:'Des illustrations avec la voix du cours. Vous pouvez passer à la lecture ou à l’audio à tout moment.',failed:'La vidéo est indisponible. L’audio et le cours écrit restent accessibles.',format:'Présentation',audio:'Audio et illustration',video:'Cours vidéo',note:'Avec le coach IA choisi et des illustrations. Vous pouvez passer à la lecture ou à l’audio à tout moment.'},
}
