# Politique de confidentialité

**Version du : 2026-08-29**

<!-- verbindlich: de -->
> **La version allemande fait foi.** Cette traduction est fournie à titre de commodité. En cas de divergence, le texte allemand sur [/datenschutz.html](/datenschutz.html) prévaut.

> D'abord l'essentiel : **ANITEW reste local-first.** Il n'y a **aucun compte
> ANITEW**, aucune publicité, aucun service d'analyse externe et aucun traceur.
> L'entraînement, les souvenirs, les mesures et le profil restent sur ton
> appareil. Seules les fonctions que tu actives ou déclenches expressément —
> synchronisation Google Drive, fonctions d'IA, analyse de photo et
> notifications système — utilisent les services réseau nécessaires.

Ce document décrit ce que fait réellement la version actuelle d'ANITEW.

---

## 1. Responsable du traitement

Responsable au sens du règlement général sur la protection des données (RGPD) :

**ANITEW by Impekal**  
Propriétaire : **Dr. Mèhèza Kalibani**  
Holstenwall 24  
20335 Hambourg  
Allemagne

Courriel : impekaltech+anitew@gmail.com  
Téléphone : +49 151 12784951

D'autres informations sur le fournisseur figurent dans les [mentions légales](/impressum.fr.html).

## 2. Ce qui est enregistré sur ton appareil

La mémoire du navigateur (surtout IndexedDB ; à côté, localStorage/sessionStorage pour les préférences de l'appareil comme le thème, les marqueurs de premier démarrage et les avis passagers) contient entre autres :

| Quoi | Pour quoi |
|---|---|
| Séances d'entraînement et réponses | Plan de répétition et évaluations |
| Dates de répétition | Retrouvailles dues |
| Mesures | Comparaison au sein de ta propre série de mesures |
| Tes propres souvenirs, cartes et palais de mémoire | Entraînement personnel |
| Réglages comme la langue, le son et l'heure de rappel | Prochain démarrage |

Ces contenus ne sont **pas** copiés vers un serveur ANITEW pour le Web Push.

ANITEW peut en outre calculer sur l'appareil des informations de diagnostic
purement techniques et des mesures bêta agrégées. Elles ne contiennent aucun
texte de souvenir, aucun contenu de réponse, aucune clé d'API ni jeton OAuth et
ne sont **pas transmises automatiquement**. Il faut qu'une personne exporte
expressément un tel rapport avant de pouvoir le transmettre volontairement.

## 3. Ce qu'ANITEW ne fait pas

- Aucune publicité, aucun identifiant publicitaire, aucun profilage publicitaire.
- Aucun service d'analyse externe, aucune statistique d'usage automatique, aucun traceur.
- Aucun envoi de tes contenus d'entraînement ou de mémoire pour le push.
- Aucun accès aux contacts ni à la localisation.
- Aucun enregistrement permanent du micro ou de la caméra en arrière-plan.
- Aucun classement public ni profil social.

## 4. Micro, dictée et photos

### Dictée

Si tu démarres expressément la dictée, ANITEW peut utiliser le micro pour **une
courte dictée**. La reconnaissance vocale n'est lancée que si le navigateur
confirme une reconnaissance locale et prend en charge `processLocally`. ANITEW
ne se rabat délibérément **pas** sur un service vocal distant du navigateur. Si
le traitement local n'est pas disponible, la dictée reste coupée. Le texte
reconnu est traité comme un texte saisi par toi.

### Choix de photo et caméra

« Choisir une photo » ouvre le sélecteur d'images/caméra fourni par l'appareil.
La photo originale choisie reste d'abord une copie de travail locale et passagère
dans la mémoire du navigateur ; elle n'est pas enregistrée automatiquement dans
IndexedDB, la sauvegarde ou Google Drive.

Ce n'est que si tu touches en plus **« Analyser la photo »** qu'ANITEW crée dans
le navigateur une copie JPEG réduite sans métadonnées de fichier/EXIF et l'envoie
directement au fournisseur d'IA que tu as choisi et configuré avec ta propre clé
d'API. La photo originale n'est pas envoyée au fournisseur. La réponse de l'IA
n'est qu'une proposition ; rien n'est enregistré avant ta confirmation expresse.

## 5. Ce qui se passe techniquement au chargement

L'application est distribuée via Cloudflare Workers/Static Assets. Comme avec
tout serveur web, des données de connexion techniques telles que l'adresse IP,
l'horodatage, le navigateur et la requête de fichier apparaissent chez le
fournisseur d'infrastructure. ANITEW n'en tire aucun profil d'usage.

**En clair :** une fois chargé, **l'entraînement lui-même fonctionne hors
ligne**. L'accès réseau n'est requis que pour les fonctions en ligne
expressément choisies. La synchronisation Drive, les fonctions d'IA et les
notifications système sont coupées tant que tu n'y touches pas. Seule une
activation ou une action expresse démarre le chemin en ligne correspondant.

## 6. Sauvegarde et restauration

« Enregistrer la sauvegarde » crée un fichier JSON contenant ton état ANITEW.
Tu décides où il se trouve. Quiconque possède ce fichier peut en lire le contenu.

**Ne figurent pas dans la sauvegarde** les valeurs liées à l'appareil : clés
d'API d'IA enregistrées, affichage du compte Google de l'appareil et état
technique de la synchronisation Drive. Elles ne quittent l'appareil ni dans le
fichier ni lors de la synchronisation Drive ; même à la lecture d'un fichier
ancien qui contiendrait encore de telles valeurs, elles sont écartées.

Lors de la synchronisation Google Drive facultative, ANITEW dépose le même
fichier de sauvegarde dans un dossier `Anitew` propre de ton Google Drive.
ANITEW ne touche pas aux autres fichiers.

## 7. Notifications système / Web Push

Si tu touches expressément « Autoriser les notifications » et que ton appareil
prend en charge le Web Push, le navigateur crée une **adresse push technique**
pour cet appareil. Pour la distribution, ANITEW n'enregistre côté serveur que :

- cette adresse push technique,
- l'identifiant du rappel (`daily` ou `benchmark`),
- l'échéance,
- pour le rappel quotidien, l'heure et le fuseau horaire IANA,
- le texte générique de notification — également sous forme d'une courte note de
  distribution qui attend chez le serveur après le déclenchement jusqu'à ce que
  ton appareil la récupère, mais au maximum 24 heures **à compter de
  l'échéance** (60 minutes pour le rappel de mesure) ; ensuite elle est
  supprimée au lieu d'être distribuée en retard. Le délai court à partir de
  l'échéance et ne repart pas avec une nouvelle tentative de distribution. Ce
  délai s'applique que d'autres rappels soient encore prévus ou non, et que le
  service push soit joignable ou non. S'il ne reste ni échéance ni note,
  l'entrée côté serveur est entièrement supprimée.

**Ne sont pas enregistrés à cette fin :** réponses d'entraînement, contenus de
mémoire, profil, nom, adresse électronique, mesures ou fichiers de sauvegarde.

L'enregistrement a lieu dans un Durable Object Cloudflare dérivé uniquement de
l'adresse push. Il n'existe pour cela aucun compte utilisateur ANITEW ni
identifiant utilisateur multiplateforme. Le chemin de distribution proprement dit
passe par le service push déterminé par le navigateur/système d'exploitation
(sur les appareils Apple, l'infrastructure Apple correspondante).

« Aucun rappel » supprime le rappel quotidien. « Repartir de zéro » tente de
supprimer l'entrée push côté serveur et révoque en outre l'abonnement push
local ; l'adresse push précédente devient ainsi invalide, même si le serveur
n'est pas joignable à ce moment-là. L'autorisation de notification peut en outre
être retirée à tout moment dans les réglages du système ou du navigateur.

Sur iPhone et iPad, le Web Push ne fonctionne que pour une application web
ajoutée à l'écran d'accueil, sur les versions d'iOS/iPadOS prises en charge. Là
où le Web Push n'est pas disponible sur un appareil, ANITEW ne promet aucune
notification système application fermée et se rabat sur la mention « seulement
tant que l'app est ouverte ».

## 8. Suppression et portabilité

- **Portabilité :** « Enregistrer la sauvegarde » exporte ton état local.
- **Redémarrage complet :** « Repartir de zéro » supprime les données ANITEW
  locales, coupe la synchronisation Google en local et révoque l'abonnement
  push. En option, le fichier de sauvegarde propre à ANITEW dans ton Google
  Drive peut être supprimé également. Si le worker OAuth n'est pas joignable au
  moment du redémarrage, la déconnexion technique du navigateur est rattrapée au
  prochain démarrage joignable ; entre-temps, aucune synchronisation Drive ne
  peut démarrer, car son interrupteur local est déjà supprimé.
- **Couper uniquement le rappel :** « Aucun rappel » met fin au rappel quotidien
  sans supprimer tes données d'entraînement.

## 9. Synchronisation Google Drive

Google Drive est coupé tant que tu ne l'actives pas toi-même. La connexion se
fait via Google OAuth. Outre l'accès à Drive, ANITEW demande l'information de
base Google (`openid email profile`) — uniquement pour que l'interface puisse
montrer sous quelle identité tu es connecté. Le worker Cloudflare échange le code
d'autorisation Google contre des jetons et conserve la session — y compris le
jeton de rafraîchissement Google — chiffrée dans un cookie `HttpOnly` de ton
navigateur. La durée est fixée à 180 jours au maximum à compter de la connexion ;
elle n'est **pas** prolongée par l'usage.

L'écran de consentement de Google présente l'accès à Drive dans une case
distincte, non cochée par défaut. Google indique au worker, dans sa réponse,
si tu l'as cochée ; le worker en retient **un oui ou un non** dans la même
session chiffrée et transmet ce oui/non à l'interface — jamais la liste
d'autorisations de Google elle-même. C'est ainsi seulement qu'ANITEW peut te
dire dès la connexion que la case est restée vide, au lieu de te le laisser
découvrir au premier enregistrement par un message d'erreur de Google. Sans
cette coche, tout reste sur ton appareil ; rien n'est perdu.

Lorsque tu touches « Déconnecter le compte Google », la synchronisation Drive
est coupée **immédiatement et durablement** sur l'appareil et l'identité de
compte affichée localement est retirée. Si le worker est joignable, il supprime
en même temps le cookie de session HttpOnly et tente de révoquer le jeton Google.
Si le worker est temporairement injoignable — par exemple parce que l'appareil
est hors ligne —, le navigateur ne peut pas techniquement supprimer lui-même le
cookie HttpOnly. ANITEW ne fait alors que noter localement cette déconnexion
technique en attente et la retente au prochain démarrage ou au retour en ligne.
La synchronisation Drive reste coupée entre-temps ; le cookie resté en place ne
l'active pas à lui seul. Indépendamment de cela, la session scellée prend fin au
plus tard à l'expiration de son délai fixe de 180 jours.

**Règle transitoire pour les connexions plus anciennes :** les sessions créées
avant l'introduction de ce délai fixe ne portent en elles aucun horodatage de
connexion ; il ne peut pas être déterminé après coup et n'est pas non plus
estimé. De telles sessions expirent donc au plus tard **30 jours** après la
première utilisation avec la nouvelle version — plus court que toute durée
restante qu'elles auraient eue auparavant. Une nouvelle connexion est ensuite
nécessaire ; pour elle s'applique alors le délai fixe de 180 jours à compter de
la connexion. Il n'existe aucune base de données utilisateurs ANITEW dans
laquelle des jetons seraient conservés. L'appareil utilise ensuite l'accès pour
le dossier ANITEW dans ton propre Drive. Le nom et l'adresse électronique
affichés dans l'interface pour le contrôle du compte sont conservés localement
dans la mémoire d'appareil d'ANITEW et retirés à la déconnexion.

Les conditions de confidentialité de Google s'appliquent en outre.

## 10. Fonctions d'IA avec ta propre clé d'API

Le coach et les propositions d'IA sont coupés tant que tu n'as pas enregistré ta
propre clé et déclenché expressément une fonction correspondante. Pour le coach
textuel, Gemini, Anthropic, OpenAI, Groq, OpenRouter ou Mistral sont pris en
charge selon ta sélection. La question et le contexte chiffré décrit pour elle
vont alors directement au fournisseur d'IA choisi. Tes propres textes de souvenir
ne sont transmis que lors d'une fonction de proposition d'IA que tu déclenches.

Pour l'analyse de photo, seuls Gemini, Anthropic ou OpenAI sont pris en charge.
Comme décrit à la section 4, une copie d'image préparée n'est transmise qu'après
« Analyser la photo ».

La clé d'API reste sur ton appareil. Pour le traitement chez le fournisseur
concerné s'applique en outre sa propre politique de confidentialité.

## 11. Bases juridiques et durées de conservation

Dans la mesure où ANITEW ne traite les données que sur ton appareil, c'est toi
qui décides de leur existence par l'usage, l'export et la suppression. Pour les
fonctions en ligne activées volontairement, le traitement sert à fournir la
fonction expressément choisie dans chaque cas. Délais concrets : le cookie de
session Google chiffré expire au plus tard 180 jours après la connexion et n'est
pas prolongé par l'usage. À la déconnexion, la synchronisation Drive locale prend
fin immédiatement ; le worker supprime le cookie lors d'une déconnexion
confirmée. S'il ne peut pas être joint à ce moment-là, c'est précisément cette
déconnexion technique qui est retentée au prochain démarrage en ligne. Les
sessions antérieures à la règle des 180 jours expirent, selon la règle
transitoire de la section 9, au plus tard 30 jours après la première utilisation
avec la nouvelle version. Les entrées push côté serveur existent jusqu'à ce que
l'échéance soit distribuée et récupérée, que tu mettes fin au rappel ou que
l'abonnement push prenne fin — les notes de distribution non récupérées au
maximum 24 heures (rappel de mesure : 60 minutes). Les journaux techniques
d'infrastructure et les données chez des fournisseurs externes relèvent en outre
de leurs règles de conservation légales et contractuelles.

## 12. Tes droits

Dans la mesure où des données à caractère personnel sont traitées par le
responsable, tu disposes, dans les limites prévues par la loi, notamment des
droits d'accès, de rectification, d'effacement, de limitation du traitement, de
portabilité et d'opposition. Il existe en outre le droit d'introduire une
réclamation auprès d'une autorité de contrôle compétente en matière de
protection des données. L'adresse électronique indiquée ci-dessus suffit pour
toute demande.

## 13. Enfants

ANITEW n'a pas de fonction de discussion entre utilisateurs, pas de classement
public et pas de publicité. Les fonctions en ligne facultatives décrites
ci-dessus suivent les mêmes règles techniques indépendamment de l'âge.

## 14. Modifications

Si le traitement change, la présente politique est adaptée avec une nouvelle
date. Une fonction qui transmet des données supplémentaires ne doit pas
apparaître en silence sous un ancien texte de confidentialité.
