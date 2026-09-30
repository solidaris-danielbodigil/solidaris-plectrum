# Plan d’évolution Plectrum : autonomie des équipes, devkit et CI

Date : 29 septembre 2026 · mise en œuvre source : 30 septembre 2026

Statut : socle implémenté dans le dépôt ; publication et pilote iShare encore à réaliser.
Périmètre : gouvernance des contributions, outillage des applications, documentation Storybook, intégration aux CI Solidaris et migration.

> Les constats de la section 2 décrivent l’état observé avant les modifications. Les sections suivantes restent la cible d’ensemble ; le tableau ci-dessous distingue ce qui est codé de ce qui demande encore un accord ou une validation externe.

## État de mise en œuvre

| Lot | Réalisé dans le code source | Reste à confirmer ou livrer |
| --- | --- | --- |
| Autonomie locale | `plectrum scaffold --name` ne consulte plus Core ; style dans `06-components`, import ITCSS, story, spec, métadonnées et preuves ; l’approbation centrale reste contrôlée à la soumission. | Enregistrement réel de l’équipe et choix de revue design asynchrone pour iShare. |
| Installation | Socle `tools/consumers/starter`, manifeste avec dépendances et `postinstall`, `plectrum bootstrap` idempotent, contrôle sans écriture en CI. | Publier `pds-devkit` 0.4.0, créer et committer le lockfile depuis les versions publiées, tester un clone iShare avec accès privé. |
| Styles et assets | Huit couches locales vides, composition Sass partagée/locale, placement des nouveaux composants et polices Agenda distribuées par le devkit. | Vérifier visuellement la cascade et les polices dans l’application iShare réelle. |
| Storybook et tests | Storybook Angular local avec thème, docs, exemple, build statique ; Vitest navigateur pour unités et stories, assertions `play` et addon a11y. | Publier les packages, configurer une preview privée liée à la révision et enrichir les tests métier/a11y du pilote. |
| Règles et CI | `.ai` portable, adapters Cursor/Copilot, hook rapide, workflow GitHub Actions avec checks, build et tests ; documentation des garanties et limites. | Confirmer le fournisseur CI et les contrôles globaux Solidaris, les secrets, les jobs obligatoires et la protection des branches. |
| Support | Storybook « Build with Plectrum », contribution, overview, contrats et CI mis à jour ; copie révisée du PPT. | Présenter le parcours final aux équipes et intégrer les retours du pilote. |

La vérification locale empaquette les quatre packages et installe le socle dans un dépôt temporaire : `postinstall`, build Angular, compilation SCSS, scaffold, contrôles statiques, tests unitaires, build Storybook et tests de stories sont couverts. Une installation depuis le registre privé après publication reste une étape distincte.

## 1. Objectif et décisions de principe

Les équipes applicatives doivent pouvoir développer et livrer leurs écrans, composants et patterns locaux avec les mêmes exigences de qualité que Plectrum Core, sans attendre une décision de mutualisation.

Elles doivent recevoir les composants partagés **et l’outillage pour développer leurs propres composants** : structure ITCSS locale vide, SCSS préconfiguré, générateur, Storybook local prêt à lancer, contrôles des tokens et des contrats, configuration de tests, hook pré-commit et commandes de CI.

Parcours demandé pour un nouveau dépôt : à partir du socle applicatif Plectrum, **`npm install` installe les dépendances et génère les fichiers de structure et de configuration manquants**. L’équipe ne doit pas assembler elle-même Angular, PrimeNG, SCSS, Storybook, les tests et les contrôles.

Principes retenus pour construire la cible :

1. La réutilisation de PrimeNG et de Plectrum reste le premier réflexe.
2. Signaler un manque tôt ne signifie pas attendre une autorisation pour travailler localement.
3. L’équipe applicative possède et maintient sa réalisation locale, y compris ses tests et sa qualité UX.
4. La Core team décide de l’intégration dans le système partagé et de ses conditions de publication.
5. Les changements de tokens partagés et de langage visuel commun conservent une revue adaptée.
6. Une absence de réponse centrale ne vaut pas approbation, mais ne doit pas bloquer la livraison locale.
7. Les outils et règles communs sont distribués et versionnés dans les packages ; ils ne sont pas copiés manuellement depuis le monorepo.
8. Les CI Plectrum complètent les contrôles Solidaris et s’intègrent dans les pipelines des équipes.
9. Les mêmes exigences s’appliquent au travail produit par une personne ou un agent.
10. ITCSS est une convention commune appliquée dans les dépôts des équipes : structure générée, imports organisés et règles contrôlées.

## 2. Constats sur l’existant

### 2.1. Contribution et autonomie

- Le PPT, notamment les slides 13 et 14, présente une décision Core avant le développement d’un candidat.
- `tools/devkit/src/workflows.mjs` exige une proposition centrale `approved-candidate` avant `plectrum scaffold`.
- `tools/devkit/src/checks.mjs` vérifie également la copie de cette approbation pour chaque candidat local détecté.
- La soumission centrale relit la décision fusionnée ; une modification locale ne permet pas de s’auto-approuver.
- L’onboarding documenté demande aussi l’enregistrement préalable de l’équipe, de l’application et de son dépôt dans le registre central.

Conséquence : le parcours officiel de création d’un candidat dépend aujourd’hui de la disponibilité de Core. La promesse de ne pas créer de goulot d’étranglement n’est pas garantie par ce fonctionnement.

### 2.2. Devkit et tests

- `pds-devkit` distribue le CLI `plectrum`, le catalogue hors ligne, les tokens, les schémas, les contrats de processus et les instructions pour les agents.
- `plectrum init` génère la configuration applicative, les adaptations pour les éditeurs et un workflow GitHub Actions.
- Le scaffold applicatif génère un composant, une story, un style, des métadonnées, une copie de la proposition et une fiche de preuves. Il ne génère pas actuellement de fichier de test unitaire.
- Le devkit ne déclare actuellement aucune dépendance Storybook et `init` ne crée ni configuration `.storybook`, ni commandes de lancement/build Storybook. Générer un fichier `.stories.ts` ou configurer une URL MCP ne fournit pas un Storybook local opérationnel.
- `plectrum check --profile ci` vérifie la compatibilité, les fichiers gérés, l’usage des tokens et les candidats. Il ne compile pas l’application et n’exécute ni ses tests unitaires, ni ses stories, ni ses tests d’accessibilité.
- La présence d’une story et d’une fiche de preuves complétée ne démontre pas l’exécution de ces tests.
- `npm run pds:component`, les scripts centraux `tokens:*`, les tests Storybook et le hook pré-commit du dépôt Plectrum ne constituent pas actuellement une chaîne portable installée dans les applications.

### 2.3. Documentation CI

- Storybook expose déjà les jobs et commandes de `.github/workflows/ci.yml` via une table générée.
- Il manque une explication orientée utilisateur : garantie obtenue, périmètre inspecté, déclencheur, erreur typique, correction et limites.
- Certains contrôles sont conditionnels ou non bloquants : Chromatic est activé par configuration ; la validation des références du preset est actuellement consultative dans la CI centrale.
- La configuration réelle des CI globales Solidaris n’a pas été fournie. Leur alignement avec Plectrum reste à établir.

## 3. Gouvernance cible et responsabilités

### 3.1. Décisions selon le périmètre

| Situation | Équipe applicative | Core team | Design |
| --- | --- | --- | --- |
| Composition d’un écran avec l’existant | Conçoit, développe, teste et livre | Support en cas de difficulté | Revue selon les pratiques de l’application |
| Composant ou pattern local | Décide de sa création et en assume la maintenance | Peut donner un retour asynchrone | Sollicité selon la nouveauté et le risque UX |
| Proposition de mutualisation | Décrit le besoin, fournit une preview et les preuves | Évalue la réutilisabilité, les doublons et la priorité | Évalue les nouvelles décisions de design |
| Intégration dans les packages partagés | Contribue à l’implémentation et aux cas d’usage | Approuve l’API, l’intégration et la maintenance partagée | Valide la représentation et les règles de design concernées |
| Modification de tokens partagés | Propose le besoin et ses exemples | Vérifie l’impact technique | Valide la décision visuelle et le retour Figma |
| Adoption d’une version publiée | Planifie, teste et livre la migration | Fournit la documentation de migration | Intervient si le comportement ou le rendu change |

### 3.2. Séparer propriété, qualité et mutualisation

Éviter qu’un unique statut « candidate » serve à la fois à exprimer la qualité locale et l’approbation centrale.

Le modèle cible doit représenter séparément :

- **La propriété** : équipe responsable et dépôt d’origine.
- **La distribution** : locale ou publiée dans un package partagé.
- **La qualité** : résultats des contrôles et des tests pour une révision donnée.
- **La mutualisation** : non demandée, proposée, en revue, acceptée pour intégration, maintenue locale ou retirée.
- **La publication** : version réellement disponible après intégration et release.

Les noms et schémas définitifs seront fixés dans le lot consacré aux contrats. Cette liste exprime les concepts, pas de nouvelles valeurs déjà acceptées par les schémas actuels.

Conséquences attendues :

- Une proposition en attente ou maintenue locale ne fait pas échouer la CI applicative pour ce seul motif.
- Un composant local peut rester local durablement.
- Une acceptation pour intégration n’équivaut pas à une publication consommable.
- Un composant publié est adopté via sa version de package, avec une migration explicite.
- Les contrôles de qualité continuent à bloquer lorsqu’un défaut relevant de l’application est détecté.

### 3.3. Communication avec Core et les designers

Mettre en place une fiche asynchrone courte : besoin utilisateur, solutions existantes examinées, propriétaire, preview, états concernés, questions à trancher et échéance applicative.

Organiser le fonctionnement avec :

- un point d’entrée commun et un responsable de triage avec suppléance ;
- une cadence de revue annoncée et un délai de première réponse convenu selon la capacité réelle ;
- une distinction entre retour d’orientation rapide et travail d’intégration planifié ;
- une trace écrite des décisions pour éviter de dépendre d’une réunion ou d’une personne ;
- une file visible des propositions, sans promesse implicite de prise en charge immédiate.

Aucun délai chiffré n’est imposé par ce plan. Il doit être convenu avec Core et les designers. En cas d’absence de réponse, l’équipe poursuit localement sous sa responsabilité ; elle ne publie pas la solution comme approuvée par Core.

### 3.4. Encadrer le risque de reprise

L’autonomie accepte qu’une généralisation future nécessite des changements. Pour en limiter le coût :

- documenter tôt l’API, les états et les hypothèses métier ;
- conserver une implémentation locale isolée, sans modifier les packages installés ;
- rechercher les solutions existantes et les propositions visibles avant de créer ;
- utiliser les tokens et conventions partagés ;
- annoncer les divergences connues et les arbitrages provisoires ;
- définir ensemble la cible et le calendrier de migration lorsqu’une version partagée est disponible.

L’équipe maintient sa version locale jusqu’à sa migration. Core prend en charge la version partagée selon une responsabilité explicitement convenue. Le refus de mutualiser ne signifie pas, à lui seul, que la réalisation locale doit être supprimée.

## 4. Devkit cible : contenu et architecture

### 4.1. Répartition des packages

Conserver les rôles des trois packages runtime :

- `pds-ui` : composants Angular partagés ;
- `pds-plectrum` : intégration du thème et presets ;
- `pds-styles` : styles, conventions CSS et tokens distribués.

Faire de `pds-devkit` une dépendance de développement contenant le CLI, les règles, les validateurs portables, les générateurs et les configurations réutilisables. Les moteurs de tests nécessaires seront déclarés comme dépendances ou peer dependencies documentées, avec une matrice de compatibilité.

Commencer par ce package existant. Ne créer un package séparé de configuration de tests que si les contraintes de dépendances ou de versionnement le justifient.

### 4.2. Une logique commune, des adaptations par contexte

Extraire les règles réutilisables des chemins et hypothèses du dépôt central. Elles doivent fonctionner sur une racine de projet et des chemins configurés.

- Le moteur commun valide les tokens, métadonnées, API et conventions applicables.
- L’adaptation applicative travaille dans le dépôt de l’équipe, sans dépendance à un checkout Plectrum.
- L’adaptation Core conserve les contrôles du catalogue partagé, des exports, des sources de tokens, de Figma et de la publication.
- Les mêmes règles communes doivent donner les mêmes diagnostics sur des exemples équivalents.
- Les opérations locales doivent fonctionner sans accès au dépôt central ; soumission et publication restent des opérations distinctes nécessitant une connexion.

Les applications possèdent leurs composants, stories et tests. Le devkit possède les règles et configurations communes importées par ces projets. Les fichiers générés ne doivent pas contenir une copie complète des validateurs.

### 4.3. Installation et mise à jour

**Exigence confirmée : `npm install` doit installer tout le nécessaire au développement et générer la structure initiale.** Le parcours standard ne doit pas demander ensuite une succession de commandes pour brancher les styles, créer les couches ITCSS ou configurer Storybook.

#### Nouveau dépôt : un socle minimal, puis une installation

Un dossier entièrement vide ne contient pas de manifeste permettant à npm de connaître les packages à installer. Fournir un socle applicatif Plectrum, obtenu par un template de dépôt ou un générateur de création. Le mode de distribution du socle reste à choisir ; le résultat attendu est identique.

Ce socle doit contenir au minimum :

- un `package.json` qui déclare les dépendances runtime et de développement nécessaires, les scripts applicatifs et l’appel d’initialisation après installation ;
- un lockfile compatible lorsque le socle est distribué comme template ;
- les informations permettant de reconnaître la racine applicative et les conventions choisies ;
- une configuration de registre sans secret et les instructions d’accès initial aux packages privés.

Le bootstrap doit appeler le CLI installé du devkit depuis un script de cycle de vie du **projet applicatif**, par exemple son `postinstall`. Il ne doit pas dépendre d’un script exécuté dans le répertoire `node_modules` du package pour deviner et modifier le dépôt parent.

Le déroulement cible de `npm install` est :

1. Installer les versions compatibles déclarées dans le manifeste : Angular, PrimeNG, thème, packages Plectrum, outils SCSS, Storybook, tests et lint.
2. Exécuter l’initialiseur local du devkit dans la racine déclarée du projet.
3. Créer les fichiers applicatifs Angular manquants et brancher les providers nécessaires, dont `providePlectrum()`.
4. Générer les couches ITCSS locales vides et leur composition avec `pds-styles`.
5. Configurer les chemins SCSS et les assets pour l’application et Storybook.
6. Créer les configurations et exemples de Storybook/tests prévus, sans ajouter de styles métier dans les couches ITCSS.
7. Installer les contrôles et hooks et générer la configuration CI correspondant au profil Solidaris choisi.
8. Afficher les commandes de lancement et le résultat du diagnostic final.

Toutes les dépendances nécessaires doivent être connues avant l’installation. L’initialiseur ne doit pas lancer un second `npm install` depuis `postinstall`, ni ajouter tardivement des dépendances qui exigeraient une deuxième installation. Tester également les prérequis système et navigateurs nécessaires aux tests : leur préparation doit être intégrée au parcours local ou au job CI approprié, et tout prérequis restant doit être annoncé clairement.

Le parcours suppose les accès au registre privé disponibles. Installer des packages ne peut pas créer les droits, identifiants, secrets CI ou protections de branches Solidaris : les distinguer des fichiers et dépendances effectivement préparés par le devkit.

#### Installations suivantes et CI

L’initialiseur est rejouable : une deuxième installation préserve les fichiers et contenus existants. Les sources générées sont committées après la première initialisation ; une installation en CI valide le socle et ne migre pas silencieusement le code applicatif. Les hooks Git ne sont installés que dans les environnements locaux appropriés.

Une mise à jour de dépendance ne doit pas écraser un fichier d’équipe. Les évolutions de configuration nécessitant une migration sont proposées et appliquées par un parcours de mise à jour explicite. Si les scripts npm sont désactivés par l’environnement, fournir une commande documentée permettant de rejouer exactement l’étape d’initialisation et signaler que celle-ci n’a pas eu lieu.

#### Application existante

Prévoir un rattachement initial au socle Plectrum qui détecte Angular, les runners, les scripts, styles et hooks déjà présents. Il prépare le manifeste et le script d’initialisation, et présente les conflits avant les modifications incompatibles. Une fois cette intégration établie, `npm install` termine les ajouts manquants selon le même parcours que pour un nouveau dépôt.

Ne pas imposer à une application existante la création d’un second projet Angular ou d’un second Storybook. Préserver ses extensions et fournir des instructions ciblées lorsque son architecture nécessite une adaptation.

Le registre central doit devenir un prérequis à la participation centrale, plutôt qu’un verrou sur toute création locale : prévoir une identité locale explicite, puis son rapprochement avec l’identité enregistrée avant soumission. Les collisions et changements d’identifiant doivent être traités par la migration.

### 4.4. Storybook local fourni par le parcours devkit

Chaque équipe doit disposer de son propre Storybook pour développer, documenter, tester et présenter ses composants et patterns. Le Storybook central reste la référence du système partagé ; les stories locales appartiennent au dépôt applicatif.

Le devkit doit fournir ou initialiser :

- les dépendances Storybook et son intégration Angular dans des versions compatibles ;
- une configuration réutilisable et de petits fichiers `.storybook/main.*` et `preview.*` adaptés au projet ;
- la découverte des stories locales et la prise en charge de leur documentation ;
- le thème Plectrum, les styles, icônes, polices et providers nécessaires au rendu, avec des chemins d’assets explicites ;
- les contrôles de propriétés, la documentation et l’accessibilité, ainsi que les raccordements aux tests d’interaction ;
- les commandes de serveur local, build statique et tests ;
- un exemple immédiatement visible après initialisation ;
- la possibilité d’ajouter des decorators, mocks et providers applicatifs sans modifier les fichiers internes du devkit.

Storybook peut être installé comme dépendance de développement du projet, avec une configuration commune exportée par le devkit. « Fournir Storybook » signifie livrer un parcours opérationnel ; cela n’impose pas d’embarquer tout son moteur dans l’archive du devkit.

Si l’application possède déjà un Storybook, intégrer Plectrum à sa configuration et préserver ses stories et addons. Vérifier particulièrement la compatibilité entre les imports générés, le renderer Angular et le builder retenu : le scaffold actuel utilise `@storybook/angular`, tandis que le générateur central utilise `@storybook/angular-vite`.

Prévoir un build statique déployable dans l’hébergement approuvé par Solidaris, avec une preview liée à une révision pour les revues Core/design. Le devkit fournit la configuration et les commandes ; la publication doit respecter les accès et les pipelines de l’équipe. Ne pas imposer une preview publique.

Un lien vers le Storybook central versionné, ou une composition de catalogues si elle est compatible avec l’hébergement, peut faciliter la réutilisation. Cette connexion reste facultative pour lancer le catalogue local. Une URL Storybook MCP destinée aux agents ne remplace ni le serveur Storybook local ni son runner de tests.

**Critère d’acceptation** : dans un dépôt applicatif neuf, l’initialisation puis le lancement affichent le composant d’exemple avec le thème Plectrum ; le build statique et les tests réussissent sans checkout central. Dans un dépôt déjà équipé, les stories existantes restent fonctionnelles.

### 4.5. Structure ITCSS locale vide et SCSS préconfiguré

Générer une structure ITCSS dans le dépôt de chaque équipe. Les couches locales ne contiennent initialement aucune règle visuelle métier, aucun token partagé recopié et aucun exemple de style imposé. Elles contiennent uniquement les points d’entrée nécessaires, accompagnés de commentaires expliquant leur rôle ; ces fichiers permettent aussi de conserver les dossiers dans Git.

Structure cible :

```text
src/
├── styles.scss
└── styles/
    ├── 01-settings/_index.scss
    ├── 02-tools/_index.scss
    ├── 03-generic/_index.scss
    ├── 04-elements/_index.scss
    ├── 05-objects/_index.scss
    ├── 06-components/_index.scss
    ├── 07-utilities/_index.scss
    ├── 08-trumps/_index.scss
    └── main.scss
```

Les chemins peuvent s’adapter à un workspace existant, mais les couches, leur responsabilité et leur ordre doivent rester explicites. Les styles partagés demeurent dans `pds-styles` ; les fichiers ci-dessus accueillent seulement les extensions applicatives.

Responsabilités du devkit :

- brancher `src/styles.scss` sur le point d’entrée local et configurer le build Angular ;
- garantir un compilateur Sass compatible via le builder ou une dépendance dédiée si nécessaire ; aucun package nommé `scss` n’est à demander aux équipes ;
- configurer la résolution des imports du package de styles ;
- fournir exactement la même composition des styles à l’application et à Storybook ;
- générer les styles de nouveaux composants dans `06-components`, enregistrer leur import et adapter les chemins de métadonnées et de contrôles ;
- appliquer les conventions ITCSS/BEMIT et la politique de tokens via les contrôles distribués ;
- préserver les fichiers locaux et leurs imports lors des installations suivantes.

Faire évoluer `pds-styles` pour exposer des points d’entrée de couches documentés et supportés. La composition doit charger les couches communes et leurs extensions locales dans l’ordre convenu, par exemple settings partagés/locaux, tools partagés/locaux, puis les couches produisant du CSS jusqu’aux trumps. Vérifier le graphe réel des imports Sass pour que les dépendances internes ne chargent pas prématurément une couche ultérieure.

Ne pas cumuler l’import global de tout `pds-styles` et les imports de ses couches. Ne pas placer systématiquement tous les styles applicatifs après les utilities/trumps partagés. La configuration initiale doit éviter les doublons de CSS et conserver l’ordre de priorité attendu.

Le terme « structure vide » concerne les règles locales : le raccordement aux styles communs est opérationnel dès l’installation. L’application et Storybook affichent donc le thème Plectrum sans que les équipes aient à remplir les huit couches.

**Critères d’acceptation** : après `npm install`, les huit couches existent sans styles métier, SCSS compile dans Angular et Storybook, les styles Plectrum sont chargés une seule fois et un composant local généré reçoit bien ses styles. Un cas de cascade représentatif prouve qu’un utilitaire conserve la priorité prévue. Une seconde installation conserve les ajouts de l’équipe.

## 5. Génération de composants et interface de commandes

### Prérequis transversal : règles, skills, protocoles et agents applicatifs

Le socle généré doit aussi fournir un environnement d’assistance cohérent avec les outils réellement installés. Dans les sources actuelles du devkit, les règles applicatives sont distribuées dans `rules/consumer.md`, les rôles dans `roles.json`, et les copies des règles, skills et protocoles centraux dans `rules/central/`. `plectrum init` génère des instructions et agents Cursor/VS Code ; il ne reconstitue pas tout le dossier `.ai/` dans l’application.

Les fichiers centraux sont actuellement des références : leurs chemins de monorepo et procédures de publication ne sont pas des instructions applicatives directement utilisables. Les agents applicatifs distribués sont des rôles dédiés et plus courts, pas une copie intégrale des agents Core.

La cible doit inclure :

- des règles applicatives complètes sur ITCSS, SCSS, BEMIT, tokens, PrimeNG, Angular, Storybook, tests et contributions locales ;
- des skills et protocoles adaptés aux commandes et chemins applicatifs, notamment la génération de styles dans `06-components` ;
- les rôles de coordination, développement, UX, tests, audit de tokens et architecture adaptés à l’autonomie locale ;
- un point d’entrée `.ai/README.md` et une organisation locale documentée permettant de retrouver règles, skills, protocoles et agents ;
- les adaptations nécessaires aux éditeurs pris en charge pour que ces instructions soient découvertes et que les skills soient utilisables dans le format attendu ; la simple présence de Markdown dans `.ai/` ou `node_modules` ne garantit pas leur activation ;
- un emplacement distinct pour les instructions et décisions propres à l’équipe.

Conserver une seule source versionnée dans le devkit pour les instructions partagées. Les entrées locales peuvent être des références ou des vues générées selon les contraintes de l’éditeur ; toute copie nécessaire doit être identifiée comme générée et synchronisée. Les personnalisations d’équipe restent séparées et sont préservées à la mise à jour.

Ne pas recopier l’historique interne de Core : recherches, décisions propres au monorepo, propositions d’autres applications et configurations contenant des informations d’accès. Configurer les connexions MCP pertinentes sans inclure de secrets ni supposer qu’une URL donne les autorisations nécessaires.

Intégrer ce travail aux lots 1, 2 et 6 : mettre à jour les règles à la source, préparer leur distribution avec le bootstrap, puis expliquer leur utilisation et leur mise à jour. L’initialisation doit aussi retirer de ses vues générées l’ancienne instruction exigeant une approbation Core avant toute création locale.

**Acceptation** : dans une application installée depuis le socle, les points d’entrée d’instructions sont présents et résolvent les fichiers de la version installée ; les agents générés utilisent des commandes disponibles et les chemins ITCSS locaux ; aucun chemin Core n’est présenté comme local ; une mise à jour synchronise les instructions communes sans supprimer les notes de l’équipe. La disponibilité effective des agents et skills est vérifiée dans chaque éditeur annoncé comme pris en charge.

### 5.1. Générateur applicatif

Faire évoluer `plectrum scaffold` pour créer un composant ou pattern local sans décision Core préalable.

Le résultat attendu comprend :

- composant Angular et template ;
- styles créés dans la couche ITCSS locale `06-components`, automatiquement importés et utilisant les tokens publiés ;
- métadonnées adaptées à une propriété locale ;
- story par défaut avec une assertion d’interaction ou de rendu utile ;
- fichier de tests unitaires exécutable ;
- documentation du besoin, des états attendus et des limites ;
- fiche de revue manuelle pour les points non couverts automatiquement.

Le générateur vérifie les conflits de noms et signale les solutions existantes pertinentes. Il n’exige pas une décision centrale pour créer les fichiers locaux. Un exemple généré ne constitue pas une preuve suffisante du comportement métier : les assertions doivent être complétées par l’équipe.

#### Placement obligatoire des styles générés

La génération doit appliquer l’architecture ITCSS sans déplacement manuel par l’équipe. Pour un composant `claim-summary`, le résultat cible est :

```text
src/
├── app/components/claim-summary/
│   ├── claim-summary.component.ts
│   ├── claim-summary.component.html
│   ├── claim-summary.component.spec.ts
│   ├── claim-summary.stories.ts
│   └── claim-summary.metadata.json
└── styles/06-components/
    ├── _index.scss
    └── _components.claim-summary.scss
```

Le chemin du code Angular est configurable. Le fichier SCSS est toujours placé dans la couche `06-components` du répertoire ITCSS configuré, y compris pour un composant proposé à Core. Le statut de mutualisation ne crée pas une seconde architecture de styles.

À chaque génération, le devkit doit :

1. Créer le partial `_components.<nom>.scss` avec le bloc BEM du composant, utilisant les conventions de nommage applicatives pour éviter les collisions avec Core.
2. Ajouter une seule fois `@use 'components.<nom>';` dans le `_index.scss` de cette couche, en préservant les imports et commentaires existants.
3. Renseigner le chemin réel dans `component.scssPath`, ainsi que `itcssLayer: '06-components'` et le bloc BEM correspondant dans les métadonnées.
4. Charger ce style via le point d’entrée ITCSS commun à l’application et à Storybook. Ne pas générer de fichier `.component.scss` à côté du TypeScript, de styles inline, ni de `styleUrl`/`styleUrls` chargeant ce partial une deuxième fois.
5. Valider les destinations et conflits avant écriture pour éviter un composant partiellement généré.

Aligner les chemins de configuration et les validateurs existants, notamment `paths.candidateStyles`, sur cette convention. Prévoir la migration des anciens candidats dont les styles résident dans `src/styles/plectrum-candidates` : déplacer leurs partials, corriger les imports et métadonnées, puis vérifier leur rendu sans duplication CSS.

Les contrôles doivent détecter un style généré hors de la couche configurée, un import manquant ou dupliqué et des métadonnées pointant vers un ancien emplacement. Vérifier le résultat dans Angular et Storybook avec un composant témoin dont le rendu dépend effectivement de son partial ITCSS.

### 5.2. Commandes proposées

Conserver `plectrum` comme CLI commun et fournir des alias npm lisibles. La table suivante décrit une interface cible à valider ; elle ne constitue pas une liste de commandes déjà implémentées.

| Alias npm proposé dans une application | Fonction attendue |
| --- | --- |
| `pds:component` | Appeler le générateur portable de composant ou pattern local |
| `pds:tokens` | Contrôler l’usage des tokens dans les sources applicatives |
| `pds:contracts` | Valider métadonnées, API et documentation locale |
| `pds:styles` | Appliquer les règles de styles communes pertinentes |
| `pds:storybook` | Lancer le Storybook local de l’application |
| `pds:storybook:build` | Produire son build statique pour les previews et la CI |
| `pds:test:unit` | Exécuter les tests unitaires du périmètre configuré |
| `pds:test:stories` | Exécuter réellement les stories et leurs interactions |
| `pds:test:a11y` | Exécuter les contrôles automatiques d’accessibilité, éventuellement via le même runner de stories |
| `pds:check:commit` | Exécuter les contrôles rapides avant commit |
| `pds:check:ci` | Exécuter le profil de conformité Plectrum prévu pour la CI |
| `pds:doctor` | Vérifier versions, chemins, dépendances et intégration des outils |

Exemples d’usage cible après initialisation :

```sh
# Interface proposée ; à rendre disponible par le devkit.
npm run pds:component -- --name claim-summary
npm run pds:check:commit
npm run pds:check:ci
```

Les scripts centraux ne seront pas simplement copiés. Le même alias `pds:component` pourra utiliser une adaptation applicative ou centrale explicitement configurée. Le choix du contexte devra être visible et empêcher toute écriture dans le mauvais périmètre.

La commande existante `plectrum check --profile ci` doit conserver un comportement documenté pendant la transition. Toute extension de son périmètre devra être versionnée et accompagnée d’instructions de migration ; le terme « CI » ne doit plus laisser croire que les tests ont été exécutés lorsqu’ils ne l’ont pas été.

## 6. Contrôles à distribuer

### 6.1. Tokens et styles

Distribuer des contrôles pour : tokens inconnus, valeurs interdites codées en dur, redéclarations non autorisées, imports de helpers de thème interdits et conventions de styles applicables.

Améliorer le scan actuel pour documenter et tester les cas qu’il couvre réellement : CSS/SCSS, templates, styles inline Angular, alias et expressions. Les exclusions doivent être précises pour éviter qu’un commentaire ou un exemple ne soit pris pour du code exécutable.

Prévoir une politique d’extensions locales :

- privilégier les tokens partagés et les alias sémantiques ;
- ne pas autoriser une application à remplacer silencieusement un token partagé ;
- définir un espace de noms et une déclaration pour les exceptions locales nécessaires ;
- conserver un propriétaire, une justification et une éventuelle proposition de mutualisation ;
- rendre les exceptions visibles dans les rapports et réexaminables.

Le mécanisme actuel `localTokenFiles` doit être évalué et migré vers cette politique. Sa présence ne suffit pas à définir une gouvernance des extensions.

La synchronisation Figma, les comparaisons entre sources centrales et la génération des tokens publiés restent des opérations Core. Une application vérifie l’usage des tokens de sa version installée.

### 6.2. Contrats et documentation locale

Distribuer la validation de schéma, la cohérence des identifiants, propriétaires et chemins, la correspondance entre API Angular et métadonnées, ainsi que les exigences documentaires locales.

Prévoir des cas de validation pour les inputs requis, alias, signal inputs, modèles et outputs lorsque le contrat les couvre. Les limites d’analyse doivent être connues et testées ; un analyseur partiel ne doit pas être présenté comme une vérification exhaustive de l’API.

Séparer les erreurs de qualité locale des conditions d’admission centrale : une approbation de mutualisation manquante ne doit plus faire échouer les contrôles locaux.

### 6.3. Diagnostics et dérogations

Chaque règle doit exposer un identifiant stable, sa gravité, le fichier concerné, une explication et une correction suggérée. Prévoir une sortie lisible en terminal et une sortie JSON exploitable par les CI.

Les exceptions doivent être ciblées par règle et périmètre, justifiées, attribuées à un propriétaire et réexaminées selon une échéance convenue. Une exception ne doit pas masquer des erreurs nouvelles hors de son périmètre.

## 7. Tests réellement exécutables dans les applications

### 7.1. Couches à fournir

| Couche | Livré ou configuré par le devkit | Responsabilité de l’application |
| --- | --- | --- |
| Unitaire | Configuration Angular/runner compatible, helpers et exemples | Assertions sur états, transformations, événements et erreurs |
| Stories | Configuration réutilisable, découverte des stories, exécution headless | Histoires représentatives des états et interactions |
| Accessibilité automatique | Moteur, règles et intégration au runner | Couverture des états et correction des violations |
| Accessibilité manuelle | Checklist et format de preuve | Clavier, focus, lecteur d’écran et compréhension du parcours |
| Visuel | Point d’intégration et procédure de baseline | Choix du service approuvé, validation des changements de rendu |
| E2E applicatif | Exemples d’intégration si utiles | Parcours métier, données et services de l’application |

Éviter l’exécution redondante des mêmes stories si interactions et accessibilité peuvent partager un runner. Les tests visuels ne doivent pas imposer un service externe non retenu par Solidaris.

### 7.2. Critères de preuve

- Une story présente n’est pas une story exécutée.
- Un fichier de preuves rempli ne remplace pas un rapport de test.
- Une suite vide ou un runner absent ne doit pas produire un succès silencieux lorsque ce contrôle est requis.
- Un test d’exemple généré ne prouve pas la couverture des comportements métier.
- Un résultat d’accessibilité automatique ne vaut pas validation complète du parcours.
- Les rapports indiquent la version du devkit, le périmètre et la révision testée.

La couverture doit servir à identifier les comportements non exercés. Les seuils éventuels seront convenus avec Solidaris et distingués des exigences déjà présentes dans ses pipelines.

## 8. Hook pré-commit et profils de contrôle

### 8.1. Répartition cible

| Profil | Contenu | Moment |
| --- | --- | --- |
| Rapide | Tokens, contrats, styles et cohérence de configuration sur le périmètre pertinent | Avant commit et à la demande |
| CI Plectrum | Contrôles complets applicables au dépôt, tests Plectrum configurés et rapports | Pull request et branche d’intégration selon les règles de l’équipe |
| CI applicative | Build, tests métier, E2E et autres contrôles Solidaris | Pipeline de l’application |
| CI Core | Cohérence globale du système, packages, Figma et publication | Dépôt Plectrum |

Le hook doit donner un retour rapide sans exiger de réseau, de designer disponible ou d’accès au dépôt central. Les budgets de durée seront mesurés sur le pilote avant fixation d’une cible.

### 8.2. Intégration technique du hook

- Détecter les hooks existants, Husky ou un autre gestionnaire, ainsi que `core.hooksPath`.
- Ajouter l’appel Plectrum sans écraser les contrôles de l’équipe.
- Supporter les worktrees et les plateformes réellement utilisées, à confirmer avec Solidaris.
- Définir si le contrôle porte sur les fichiers indexés ou l’arbre de travail ; afficher ce périmètre et tester les commits partiels.
- Ne pas modifier, indexer ou committer automatiquement des fichiers pendant la validation.
- Fournir une commande de correction distincte lorsqu’une régénération est nécessaire.
- Réexécuter les contrôles requis en CI : le hook local peut être contourné et ne constitue pas l’unique garantie.

Les exigences de complétude doivent être liées au bon stade : autoriser les commits de travail documentés sans confondre un brouillon avec un composant prêt à livrer. La CI de livraison vérifie les obligations finales applicables.

## 9. Intégration aux CI globales Solidaris

### 9.1. Informations à recueillir

Obtenir auprès de l’équipe responsable :

- un pipeline applicatif représentatif et ses templates partagés ;
- les runners, versions Node, systèmes et gestionnaires de packages pris en charge ;
- les règles de build, lint, tests, couverture et accessibilité ;
- les contrôles de sécurité, dépendances, licences et autres exigences existantes ;
- les formats et durées de conservation des rapports ;
- les règles de protection des branches et de validation des changements ;
- les accès au registre privé, caches et contraintes réseau.

Ces éléments sont des points à vérifier, pas des contrôles dont la présence chez Solidaris est affirmée ici.

### 9.2. Matrice de correspondance

Construire une matrice avec les colonnes : exigence Solidaris, contrôle existant, contrôle Plectrum, recouvrement, décision d’intégration, caractère bloquant, propriétaire et preuve de validation.

Règles d’intégration :

- réutiliser les contrôles existants lorsqu’ils assurent déjà la garantie attendue ;
- ajouter les contrôles spécifiques aux tokens, contrats et composants Plectrum ;
- éviter deux configurations contradictoires pour le même runner ou la même couverture ;
- conserver des commandes CLI indépendantes du fournisseur de CI ;
- séparer les contrôles de qualité des opérations optionnelles de soumission/adoption ;
- configurer explicitement l’authentification au registre privé et les permissions nécessaires ;
- signaler un prérequis manquant sans afficher une validation trompeuse.

Le workflow GitHub Actions généré actuellement est un point de départ. Il ne prouve pas la compatibilité avec le pipeline Solidaris. Prévoir une initialisation qui puisse fournir les commandes sans imposer un nouveau workflow GitHub géré.

### 9.3. Validation attendue

L’intégration est validée sur un dépôt consommateur séparé : installation depuis le registre, exécution des commandes, production des rapports et échec observable sur un défaut volontaire. Un smoke test dans le monorepo reste utile mais ne remplace pas cette preuve.

## 10. Storybook et support de présentation

### 10.1. Documentation pour les équipes

Mettre à jour les pages existantes plutôt que créer une documentation parallèle :

- **Build with Plectrum** : contenu de chaque package, initialisation du kit, hooks, tests et connexion à la CI existante.
- **Contribute** : autonomie locale, proposition non bloquante, mutualisation et responsabilités.
- **Process and contracts** : commandes par dépôt, profils et transitions réellement supportées.
- **Maintainer workflow** : contrôles propres à Core, revue et publication.
- **Writing stories** et les pages de composants : tests attendus, états et exemples applicatifs portables.
- **AI strategy** : mêmes règles de qualité et même autonomie avec ou sans agent.

Ajouter une entrée clairement accessible pour les contrôles côté application. Ne pas obliger une équipe à déduire ses obligations d’une page de maintenance Core.

### 10.2. Fiche explicative de chaque contrôle

Documenter systématiquement :

1. L’objectif et le défaut détecté.
2. Le dépôt et les fichiers concernés.
3. La commande et les prérequis.
4. Le déclencheur et la gravité.
5. Un exemple valide et un exemple en échec.
6. Le diagnostic obtenu et sa correction.
7. Les rapports produits.
8. Les limites et contrôles complémentaires.
9. Le lien avec la CI Solidaris, une fois établi.

Conserver une source unique pour les identifiants de règles, commandes et profils. Les explications éditoriales doivent être reliées à ces identifiants et vérifiées pour éviter les contrôles documentés mais inexistants.

### 10.3. Corrections prévues dans le PPT

| Slides | Évolution à prévoir |
| --- | --- |
| 3 | Présenter le devkit comme kit de développement et de qualité complet, une fois livré |
| 7–9 | Distinguer génération applicative et centrale ; retirer l’idée d’une autorisation Core préalable à toute création locale |
| 10–11 | Séparer contrôles statiques, tests exécutés et preuves manuelles ; préciser les contrôles conditionnels |
| 12 | Distinguer revue locale par l’équipe et approbation du système partagé |
| 13–14 | Montrer le développement local autonome et la mutualisation asynchrone |
| 15 | Expliquer comment règles communes et autonomie réduisent l’attente et limitent les reprises |

Éviter toute promesse « aucun goulot d’étranglement » sans mécanisme concret. Tant qu’une fonctionnalité n’est pas publiée, la présenter comme cible plutôt que comme capacité disponible.

## 11. Lots de mise en œuvre

### Lot 0 — Cadrage avec iShare, Core, design et CI Solidaris

**Livrables** : matrice des responsabilités, inventaire CI, parcours pilote, politique de revue asynchrone et liste des environnements pris en charge.

**Travaux** : vérifier le fonctionnement réel des équipes, leurs hooks/tests existants, le mode d’accès aux packages et les décisions qui nécessitent réellement Core ou design.

**Acceptation** : un exemple concret de composant local et un exemple de contribution partagée permettent d’identifier qui décide à chaque étape. Les exigences Solidaris inconnues restent explicitement marquées comme telles.

### Lot 1 — Contrats d’autonomie et compatibilité

**Dépendance** : lot 0 pour les décisions de gouvernance.

**Zones concernées** : `.ai/contracts/process.json`, schémas, registre, contrôles de candidats, catalogue, documentation des statuts et assets distribués.

**Travaux** : séparer qualité locale et mutualisation ; retirer l’approbation centrale des prérequis locaux ; définir l’identité locale ; conserver la validation centrale avant intégration ; prévoir la lecture et migration des anciens enregistrements.

**Acceptation** : une application non encore enregistrée peut travailler localement ; une proposition en attente n’entraîne pas d’échec local ; une application ne peut pas s’auto-déclarer publiée ou approuvée par Core.

### Lot 2 — Socle applicatif, installation complète et générateur portable

**Dépendance** : lot 1 pour les nouveaux contrats.

**Zones concernées** : `tools/devkit`, `tools/generators/sds-component`, `libs/styles` et ses points d’entrée publics, scripts et configuration d’initialisation, nouveau socle applicatif à distribuer.

**Travaux** : préparer le manifeste et le bootstrap du socle ; faire de `npm install` le parcours d’installation des dépendances et de génération initiale ; fournir ITCSS vide et SCSS préconfiguré selon la section 4.5 ; extraire les éléments communs du générateur, fournir le scaffold applicatif complet, ajouter les alias, gérer les chemins et collisions, préserver les fichiers existants. Les capacités Storybook/tests/CI sont raccordées à ce même parcours à mesure que les lots suivants sont livrés.

**Acceptation** : depuis le socle dans un dépôt indépendant, `npm install` installe les dépendances et génère la structure ITCSS vide, la configuration SCSS et les fichiers applicatifs ; aucun checkout Plectrum ni décision centrale n’est nécessaire. Un composant généré reçoit ses styles dans l’application et Storybook ; sa story et son test s’exécutent une fois le lot 4 intégré. Une deuxième installation ne détruit rien ; le parcours CI ne modifie pas les fichiers committés.

### Lot 3 — Contrôles portables des tokens, styles et contrats

**Dépendance** : lot 1 ; coordination avec le lot 2 sur les fichiers générés.

**Travaux** : partager les moteurs, améliorer les diagnostics, traiter les extensions locales et les limites d’analyse, fournir les sorties terminal/JSON.

**Acceptation** : les règles communes donnent des résultats cohérents dans Core et l’application ; des défauts de tokens et d’API volontaires échouent ; les cas légitimes et exceptions ciblées restent acceptés.

### Lot 4 — Storybook local et configurations de tests applicatifs

**Dépendance** : socle du lot 2 et environnements confirmés au lot 0.

**Travaux** : fournir le Storybook local décrit en section 4.4, ses commandes de lancement/build, le thème et les assets, les configurations de tests réutilisables, dépendances compatibles, helpers, exécution headless, rapports et exemples de tests métier à compléter. Préserver les configurations Storybook existantes et documenter la publication des previews.

**Acceptation** : une application neuve affiche son composant dans un Storybook local correctement thémé et produit un build statique ; une interaction cassée et une violation d’accessibilité détectable font réellement échouer le pipeline de test ; une configuration manquante ou une suite requise vide est signalée ; les stories et tests existants de l’application continuent de fonctionner.

### Lot 5 — Hook et intégration CI Solidaris

**Dépendance** : lots 0, 3 et 4.

**Travaux** : profils rapides/complets, composition avec les hooks existants, gestion des commits partiels, intégration à un pipeline Solidaris représentatif, accès au registre et rapports.

**Acceptation** : un hook existant est préservé ; un défaut est détecté avant commit puis en CI ; la CI reste protectrice après contournement du hook ; aucune décision de mutualisation en attente n’empêche l’exécution locale.

### Lot 6 — Documentation et mise à jour de la présentation

**Dépendance** : interfaces stabilisées des lots précédents. La rédaction préparatoire peut commencer plus tôt.

**Travaux** : pages Storybook, fiches de contrôles, tableau des packages, parcours avec/sans agent, commandes par contexte, slides concernées et notes de version.

**Acceptation** : une équipe peut identifier les commandes qu’elle reçoit, les tests réellement exécutés, les conditions de blocage et le moment où Core intervient. Aucun exemple ne dépend d’un chemin du monorepo absent du package.

### Lot 7 — Pilote iShare et publication

**Dépendance** : lots 1 à 6 suffisamment intégrés pour un parcours complet.

**Travaux** : tester le parcours complet `npm install` depuis le socle et le rattachement d’une application existante avec une version de devkit candidate ; utiliser des dépôts applicatifs représentatifs séparés ; mesurer les temps ; corriger les difficultés ; publier le socle et la version validée avec migration et Storybook correspondant.

**Acceptation** : installation depuis le registre privé, développement local autonome, CI Solidaris fonctionnelle, proposition asynchrone, intégration/release de démonstration et migration vers le package vérifiées avec des preuves traçables.

Ne pas annoncer le nouveau parcours comme disponible sur la seule base de tests locaux du dépôt Plectrum.

## 12. Migration et retour arrière

### 12.1. Préserver le travail existant

- Inventorier les versions de devkit utilisées, candidats, décisions et fichiers gérés.
- Conserver les identifiants et l’historique des propositions déjà approuvées.
- Ne pas retirer rétroactivement leurs preuves ou leur reconnaissance centrale.
- Prévoir une lecture compatible ou une migration explicite des anciens schémas.
- Adapter les instructions d’agents générées afin qu’elles ne réintroduisent pas l’ancien verrou.

### 12.2. Adoption progressive dans une application

1. Installer la nouvelle version dans une branche dédiée avec son lockfile.
2. Exécuter le diagnostic et prévisualiser les changements de configuration.
3. Résoudre les conflits de scripts, hooks et runners en conservant les besoins applicatifs.
4. Mesurer les violations existantes et décider du périmètre initial d’application.
5. Rendre les contrôles bloquants sur les nouveaux composants et changements convenus.
6. Planifier la correction du stock existant avec un inventaire explicite des exceptions.
7. Élargir la couverture après validation du pilote.

Une éventuelle baseline de dette doit être bornée et ne jamais masquer de nouvelles violations. Les dérogations ne deviennent pas des désactivations globales permanentes.

### 12.3. Versionnement et restauration

Le devkit continue de versionner séparément des packages runtime et déclare sa compatibilité avec eux, les schémas et les runners. Classer les changements de commandes, de contrats et de blocage selon leur impact réel ; ne pas imposer une rupture silencieuse dans une mise à jour corrective.

Conserver les changements d’onboarding dans une PR identifiable. Le retour arrière consiste à restaurer la version, le lockfile et la configuration correspondants. Les métadonnées migrées ne doivent pas être promises rétrocompatibles sans test : fournir une conversion inverse ou documenter la limite avant adoption.

## 13. Validation globale et indicateurs

### 13.1. Scénarios d’acceptation prioritaires

- [ ] Une équipe crée et teste un composant local sans décision Core préalable.
- [ ] Depuis le socle minimal, `npm install` installe les dépendances et génère les fichiers initiaux sans commande supplémentaire d’assemblage.
- [ ] Les huit couches ITCSS locales existent avec des points d’entrée vides de règles métier et sans copie des tokens communs.
- [ ] SCSS et la résolution des imports sont préconfigurés dans Angular et Storybook.
- [ ] Le générateur place les styles de chaque composant dans la couche ITCSS `06-components` et ajoute leur import exactement une fois.
- [ ] Aucun SCSS colocalisé ou inline n’est généré ; les métadonnées référencent le partial ITCSS réel.
- [ ] Le composant généré est correctement stylé dans Angular et Storybook sans déplacer ni importer manuellement son fichier SCSS.
- [ ] La composition des couches partagées/locales conserve la cascade attendue et ne duplique pas le CSS partagé.
- [ ] Une deuxième installation préserve les fichiers, styles et imports ajoutés par l’équipe.
- [ ] Le pipeline installe les dépendances sans réécrire les sources committées et signale une initialisation manquante.
- [ ] Le parcours avec scripts npm désactivés indique clairement comment exécuter l’étape d’initialisation manquante.
- [ ] Le devkit initialise un Storybook local lançable, correctement thémé et capable de produire un build statique.
- [ ] L’intégration dans un Storybook existant préserve ses stories, addons et adaptations applicatives.
- [ ] Une preview de Storybook liée à la révision revue peut être partagée avec les personnes autorisées.
- [ ] L’indisponibilité de Core ou du dépôt central n’empêche pas les contrôles locaux.
- [ ] Une proposition en attente ou maintenue locale ne bloque pas la livraison applicative pour ce seul motif.
- [ ] Un token invalide, un contrat incohérent et un style interdit produisent des diagnostics exploitables.
- [ ] Un test unitaire ou une interaction en échec bloque le contrôle concerné.
- [ ] Une violation d’accessibilité couverte par le moteur fait échouer le contrôle automatique.
- [ ] Une suite requise vide ne passe pas silencieusement.
- [ ] Les chemins configurés couvrent les sources réelles et un périmètre vide est signalé.
- [ ] Les hooks et tests déjà présents sont préservés.
- [ ] Les commits partiels, renommages et suppressions sont correctement pris en compte.
- [ ] La mise à jour du devkit est rejouable et les conflits sont compréhensibles.
- [ ] Les accès au registre privé fonctionnent depuis le pipeline de l’application.
- [ ] Core conserve le contrôle de l’intégration et de la publication partagées.
- [ ] La migration vers un composant publié retire la copie locale après validation du comportement.
- [ ] Storybook décrit la version installée et distingue capacité livrée et évolution prévue.

### 13.2. Mesures à recueillir pendant le pilote

Mesurer le temps jusqu’au premier composant testé, la durée du hook et de la CI, les faux positifs, les conflits d’initialisation, l’effort de mise à jour, le délai de retour Core/design et l’effort de migration locale vers Core.

Comparer ces observations au fonctionnement antérieur lorsqu’une référence existe. Fixer les objectifs après mesure et accord des équipes. La collecte doit rester explicite ; ce plan n’introduit pas de télémétrie automatique obligatoire.

## 14. Risques et arbitrages encore ouverts

| Risque ou décision | Traitement prévu |
| --- | --- |
| Multiplication de solutions locales similaires | Catalogue consultable, signalement précoce, triage visible et revue de mutualisation |
| Reprises après revue tardive | API locale documentée, composants isolés, retour d’orientation précoce et migration planifiée |
| Disponibilité limitée des designers | Revue asynchrone, priorisation des nouvelles décisions visuelles, suppléance explicite |
| Devkit trop lourd ou incompatible avec les tests existants | Configurations composables, dépendances explicites, matrice de compatibilité et pilote |
| Règles centrales inadaptées aux applications | Extraction des invariants communs et adaptations explicites par contexte |
| Hook trop lent ou destructif | Contrôles rapides, mesure, préservation des hooks et validation sans mutation |
| Faux sentiment de couverture | Distinguer présence de fichiers, exécution, couverture et revue manuelle |
| Divergence avec les CI Solidaris | Inventaire réel et matrice de correspondance avant généralisation |
| Statut de proposition confondu avec qualité ou disponibilité | Axes séparés dans les contrats et présentation explicite dans le catalogue |
| Modifications locales des fichiers gérés | Extensions prévues, détection de conflits et migration documentée |

Arbitrages à prendre pendant le cadrage : niveaux de revue design, délai de réponse soutenable, noms des nouveaux statuts, runners supportés, politique de tokens locaux, seuils éventuels de couverture, service de tests visuels et format de rapports CI.

## 15. Sources du dépôt à faire évoluer

| Source | Utilité pour le chantier |
| --- | --- |
| `docs/Storybook for application teams.pptx` | Support présenté à iShare ; formulations et parcours à corriger |
| `.ai/contracts/process.json` | Source des commandes, profils et étapes partagées |
| `.ai/contracts/schema/` | Contrats et schémas des composants et contributions |
| `.ai/contracts/registry.json` | Identités centrales et configuration opérationnelle |
| `tools/devkit/package.json` et `README.md` | Distribution, dépendances et contrat public du devkit |
| `tools/devkit/src/workflows.mjs` | Scaffold et parcours de soumission actuels |
| `tools/devkit/src/checks.mjs` | Compatibilité, tokens et validation des candidats |
| `tools/devkit/src/managed.mjs` | Initialisation, workflow et fichiers gérés |
| `tools/generators/sds-component/index.ts` | Générateur central à découpler des éléments communs |
| `tools/scripts/check-commit.mjs` et `install-git-hooks.mjs` | Contrôles et installation du hook central actuel |
| `.github/workflows/ci.yml` | CI centrale et conditions effectives des contrôles |
| `tools/contracts/ci-gates.ts` | Extraction de la CI pour Storybook |
| `libs/ui/src/docs/get-started-consume.mdx` | Parcours applicatif |
| `libs/ui/src/docs/get-started-contribute.mdx` | Parcours de contribution |
| `libs/ui/src/docs/pipeline-contracts.mdx` | Référence des processus |
| `libs/ui/src/docs/maintainer-workflow.mdx` | Référence des contrôles Core |
| `docs/component-promotion.md` | Intégration et promotion des composants |
| `tools/packaging/` | Installation et vérification des packages hors monorepo |

La réussite du chantier se vérifie sur un parcours complet : une équipe installe le kit, crée et livre une solution locale de qualité, propose sa mutualisation sans attendre, puis adopte une version partagée lorsque celle-ci est effectivement publiée.
