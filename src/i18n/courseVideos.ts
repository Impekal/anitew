import type { Language } from '../core/index.ts'
import type { CourseId } from '../core/courses/progress.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import type { SpokenLanguage } from '../core/courses/media.ts'
import type { DownloadAsset } from '../app/courseDownloads.ts'
/** Verified attribution for this video's actual production pipeline. */
export interface CourseVideoCredit { name:string; url:string; license:string }
export interface CourseVideo extends DownloadAsset {
 course:CourseId; coach:CoachId; language:SpokenLanguage; mime:'video/mp4'
 /** Illustrated videos share the approved French voice across coach choices. */
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
  }
]
export function courseVideo(course:CourseId,language:SpokenLanguage,coach:CoachId|null){
 return courseVideos.find(video=>video.course===course&&video.language===language&&(video.coach===coach||video.presentation==='illustrated'))
}
export const courseVideoCopy={
 de:{illustratedNote:'Mit Illustrationen und der freigegebenen Kursstimme. Du kannst jederzeit zum Lesekurs oder zur Tonspur wechseln.',failed:'Das Video ist gerade nicht abspielbar. Ton und Lesekurs bleiben verfügbar.',format:'Darstellung',audio:'Ton und Illustration',video:'Videokurs',note:'Mit deinem gewählten KI-Coach und Illustrationen. Du kannst jederzeit zum Lesekurs oder zur Tonspur wechseln.'},
 en:{illustratedNote:'Illustrations with the approved course narration. You can switch to reading or audio at any time.',failed:'The video is unavailable right now. Audio and reading remain available.',format:'Presentation',audio:'Audio and illustration',video:'Video course',note:'With your selected AI coach and illustrations. You can switch to reading or audio at any time.'},
 fr:{illustratedNote:'Des illustrations avec la voix du cours validée. Vous pouvez passer à la lecture ou à l’audio à tout moment.',failed:'La vidéo est indisponible. L’audio et le cours écrit restent accessibles.',format:'Présentation',audio:'Audio et illustration',video:'Cours vidéo',note:'Avec le coach IA choisi et des illustrations. Vous pouvez passer à la lecture ou à l’audio à tout moment.'},
}
