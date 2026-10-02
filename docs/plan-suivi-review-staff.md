# Plan de suivi : retours de la review « Staff / Senior » du Storybook

Date : 2 octobre 2026 · branche : `feat/staff-review-followup` (depuis `origin/main` @ `f2a4d1b`)

Statut : implémenté dans l'arbre de travail, **non commité** — à valider sur le Storybook local (`npm run storybook`).

Ce document suit les chantiers ouverts après la review du Storybook publié. Chaque case cochée renvoie aux fichiers modifiés ; la colonne « Vérifié » indique la commande qui le prouve.

## Vue d'ensemble

| # | Chantier | État | Vérifié par |
| --- | --- | --- | --- |
| 1 | MCP Figma et Storybook configurés par défaut dans les applications | fait | `npm run devkit:test` (test « bootstrap configures the offline Plectrum MCP server… ») |
| 2 | Serveur MCP Plectrum hors ligne dans `pds-devkit` (option A) | fait | `npm run devkit:test` (`mcp-server.spec.mjs`, appel stdio de bout en bout) |
| 3 | Storybook MCP dans le Storybook de l'application (option C) | fait | `npm run devkit:test` |
| 4 | Mesure de l'usage de `/plectrum` (télémétrie locale + rapport d'adoption + éval de pertinence) | fait | `npm run devkit:test`, `npm run test:pipelines`, `npm run contracts:generate` |
| 5 | Tests d'interaction clavier des composants Plectrum interactifs | fait — 4 défauts corrigés | `npm run test-storybook:vitest`, `npm run contracts:check` |
| 6 | Réduction de la charge cognitive de la documentation | fait (sans tree test) | `npm run docs:check`, `npm run build-storybook` |
| — | Hors périmètre de cette branche | — | — |

## 1. MCP Figma et Storybook : pourquoi `null`, et ce qui change

**Constat.** `plectrum init` écrivait `mcp: { primeNg: 'https://primeng.org/mcp', figma: null, storybook: null }`. C'était volontaire (plan d'autonomie §8) : ne pas supposer qu'une URL donne les autorisations nécessaires, et aucun serveur Storybook MCP n'existait côté application (le Storybook du starter n'avait pas `@storybook/addon-mcp`, et GitHub Pages ne peut pas servir un endpoint MCP).

**Décision.**

- **Figma** : le serveur distant officiel `https://mcp.figma.com/mcp` s'authentifie par OAuth dans l'éditeur. La configuration ne contient donc aucun secret ; l'accès dépend du siège Figma de chaque personne. Il devient la valeur par défaut. Alternative locale documentée : serveur de l'application Figma desktop `http://127.0.0.1:3845/mcp`.
- **Storybook** : `http://localhost:6006/mcp`, servi par le Storybook **de l'application** (`npm run pds:storybook`) une fois `@storybook/addon-mcp` ajouté (chantier 3). Il expose les composants locaux de l'équipe, pas le catalogue Core.
- **Plectrum** : nouveau serveur stdio hors ligne (chantier 2), toujours configuré, car il ne dépend ni du réseau ni d'un compte.
- Les configurations existantes gardent leurs `null` (fichier possédé par l'équipe) ; `plectrum doctor` indique les valeurs recommandées.

- [x] `tools/devkit/src/managed.mjs` : valeurs par défaut de `init`, serveurs stdio acceptés.
- [x] `plectrum doctor` : conseil pour les valeurs `null`.
- [x] Tests `managed`/`bootstrap`.

## 2. Serveur MCP Plectrum hors ligne (option A)

`npx --no-install plectrum mcp` : serveur MCP stdio (JSON-RPC 2.0, sans dépendance ajoutée) qui lit les données **installées avec la version du toolkit** : `catalogue.json`, `tokens.json`, `process.json`, `local-components.json`.

Outils exposés :

| Outil | Rôle |
| --- | --- |
| `search_components` | Recherche par besoin (« side panel with member details ») dans les cas d'usage, mots-clés `aiHints`, descriptions ; inclut les composants locaux des autres équipes. |
| `get_component` | Contrat complet d'un composant : usage, anti-patterns, accessibilité, exemples, lien de doc de la version installée. |
| `find_token` | Recherche de tokens `--pds-*` par nom ou rôle. |
| `check_tokens` | Lance le contrôle de tokens du projet. |
| `get_process` | Commandes et étapes du process pour une question donnée. |

- [x] `tools/devkit/src/mcp-server.mjs` + tests.
- [x] Commande `consumerMcp` dans `.ai/contracts/process.json` (le CLI refuse une commande non annoncée).
- [x] Entrée `plectrum` dans `.cursor/mcp.json` et `.vscode/mcp.json`.
- [x] Rôles et baseline : l'agent interroge le MCP Plectrum avant de proposer un composant.

## 3. Storybook MCP dans l'application (option C)

- [x] `@storybook/addon-mcp` dans `tools/consumers/starter/package.json`.
- [x] Addon ajouté au `.storybook/main.ts` généré par `bootstrap` (fichiers existants : conseil de fusion, pas d'écriture).
- [x] Fonctionnalité `componentsManifest` activée dans le `main.ts` généré.

## 4. Mesurer l'usage de `/plectrum`

Trois niveaux : **usage** (l'agent est-il utilisé ?), **effet** (change-t-il quelque chose ?), **qualité** (répond-il juste ?).

Contraintes : aucun contenu de prompt ni de code, uniquement des compteurs ; fichier local ignoré par git ; envoi agrégé par le canal existant (rapport d'adoption, PR revue) ; désactivable (`telemetry.enabled: false`).

- [x] **Usage** : chaque appel d'outil MCP Plectrum et chaque commande CLI ajoutent un événement à `.plectrum/telemetry.jsonl` (`{ at, source, name, componentId?, outcome }`).
- [x] **Effet** : trailer de commit `Plectrum-Agent: reuse=<id>,… | scaffold=<slug> | advice` demandé à l'agent ; `adoption-report` compte les trailers de l'historique.
- [x] Bloc optionnel `agent` dans le rapport d'adoption (schéma zod + JSON schema générés, compatible avec les rapports existants).
- [x] Agrégation Core (`tools/adoption`) et affichage dans Storybook.
- [x] **Qualité** : jeu de requêtes de référence (`tools/devkit/evals/search.json`) joué contre `search_components` en CI (`devkit:test`), taux de réussite affiché.
- [x] Documentation : page « Use the Plectrum agent », section « What is measured ».

KPIs visés : apps où l'agent est actif ; consultations du catalogue par semaine ; réutilisations conseillées puis importées ; composants locaux créés ; doublons repérés par Core après coup (faux négatifs de l'agent) ; taux de réussite de l'éval.

## 5. Tests clavier

**PrimeNG fournit-il déjà l'accessibilité clavier ?** Oui, pour **ses propres composants** : chaque composant PrimeNG documente et implémente son modèle clavier WAI-ARIA (Accordion, Select, AutoComplete, Dialog, Drawer, Menu, Tree, SelectButton…). Plectrum ne réécrit pas ces comportements ; ils ne sont pas re-testés ici.

Ce que PrimeNG ne couvre pas, et qui est donc testé :

| Composant | Pourquoi PrimeNG ne suffit pas | Ce qui est testé |
| --- | --- | --- |
| Copyable Text | Bouton et retour d'état Plectrum | Tab atteint le bouton, Enter copie, état annoncé |
| Input Clear | Bouton Plectrum dans un champ | Hors tabulation si vide, Enter efface, focus rendu au champ |
| Nav Shell | Navigation Plectrum | Liens atteignables au Tab, révélation `:focus-within`, `aria-current` |
| Sub Nav Shell | Composition Plectrum autour d'Accordion | Recherche et liens atteignables, ordre logique |
| Top Nav | Composition Plectrum | Actions atteignables, nom accessible des boutons icônes |
| List | Actions et popover Plectrum | Actions de ligne au clavier, Échap ferme le popover, focus rendu |
| Profile Card | Actions Plectrum | Actions atteignables, nom accessible |
| Profile Drawer | Composition Plectrum autour de Drawer | Focus dans le panneau, Échap ferme |
| Plectrum Avatar | Rendu Plectrum | Non focusable quand décoratif |
| Delay Prediction Card, Transactions CICS Modal (iSHARE) | Compositions | Bouton d'action, dialogue : focus et Échap |

Composants non interactifs (Detail List, Empty State, Icon, Skeleton Slot, Toolbar, Form Field) : pas de story clavier ; Form Field garde son test d'association label / `aria-describedby`.

- [x] **A** : helpers clavier dans `libs/ui/src/storybook/story-tests.ts`.
- [x] **B** : story `Keyboard` (tag `keyboard`) par composant du tableau.
- [x] **C** : `contracts:check` échoue si un composant marqué interactif n'a pas de story `keyboard`.

## 6. Charge cognitive de la documentation

Le tree test est hors périmètre (pas de temps disponible) ; les changements suivent des règles vérifiables.

- [x] Navigation par public : *Start here* (parcours), *Guides* (tâches), *Governance*, *Maintainers* (en fin de barre latérale). Les identifiants de pages existants sont conservés : aucun lien publié ne casse.
- [x] Page *AI strategy* scindée : « Use the Plectrum agent » (applications, une page courte) et « How agents work » (Core, contrats et référence).
- [x] Encadré « En bref » (pour qui, ce qu'il faut retenir) en tête des pages longues.
- [x] Page *Glossary* et liens depuis les termes techniques.
- [x] Processus : une seule page canonique (*Process and contracts*) ; *Contribute* résume et renvoie.
- [x] Page « For reviewers and leads » : résumé d'un écran (quoi, pourquoi, état réel, limites, liens).

## Hors périmètre de cette branche (backlog)

- Cible WCAG 2.2 AA (`wcag22aa` dans axe, vérification des cibles 24×24 px, focus non masqué).
- Page « Decisions » exposant `.ai/decisions/` ; preuve d'adoption par une application externe enregistrée.
- Régression visuelle active (Chromatic dépend de `vars.CHROMATIC_ENABLED`).

## Résultats et écarts

**MCP (1–3).** `plectrum mcp` est un serveur stdio écrit sans dépendance (JSON-RPC 2.0, protocoles 2024-11-05 → 2025-06-18). L'éditeur le lance avec `node …/pds-devkit/bin/plectrum.mjs mcp --root ${workspaceFolder}` (pas de `npx`, qui pose problème sous Windows). `plectrum init` écrit désormais Figma (`https://mcp.figma.com/mcp`) et Storybook (`http://localhost:6006/mcp`) ; `doctor --live` signale un 401 Figma comme « connectez-vous depuis l'éditeur ». Changeset : `pds-devkit` minor, process 1.6.0.

**Mesure (4).**
- Télémétrie : `.plectrum/telemetry/events.jsonl` avec son propre `.gitignore`. Le nom d'outil et l'ID de composant sont validés par motif ; aucun texte libre ne peut y entrer (testé avec une requête contenant un nom et un numéro).
- Rapport d'adoption : bloc `agent` optionnel (fenêtre de 30 jours, trailers `Plectrum-Agent:` lus dans `git log`). Agrégé par Core dans `adoption-data.generated.ts` et affiché sur « Use the Plectrum agent ».
- Éval : 17 requêtes de référence, **16/17**. Gate **sur régression uniquement**, dans la CI du repo Plectrum : une requête qui passait et ne passe plus fait échouer la PR. `knownMisses` liste les échecs connus (aujourd'hui la composition Drawer + Detail List, laissée visible et non sur-ajustée). Une régression assumée s'ajoute à `knownMisses` dans la même PR ; une amélioration n'échoue jamais. La CI des applications ne lance jamais ce test, et l'usage de l'agent ne bloque rien. Le rapport est régénéré par `contracts:generate` (contrôle de dérive en CI).

**Clavier (5).** Réponse à la question : PrimeNG fournit le clavier de *ses* composants ; il n'est pas re-testé. Les 10 stories `keyboard` couvrent ce que Plectrum possède. Quatre défauts réels trouvés et corrigés :

| Composant | Défaut | Correction |
| --- | --- | --- |
| Input Clear | Après « Entrée », le focus restait sur le bouton devenu `aria-hidden` / `tabindex=-1` | Le focus revient au champ après un effacement clavier |
| Top Nav | Échap fermait la recherche et le focus tombait sur `body` ; le rendre au bouton l'aurait rouverte (`(focus)` ouvre) | Focus rendu au bouton sans réouverture |
| List | Sélecteur de cible ouvert au clavier : focus resté sur le tag, options ajoutées en fin de `body`, hors d'atteinte | Focus sur la 1re option, retour au tag à la fermeture |
| Transactions CICS Modal | Après Échap, focus perdu (PrimeNG Dialog ne le rend pas) | Focus rendu au déclencheur, comme Profile Drawer |

Le gate (`contracts:check`) lit l'interactivité dans le code (bouton, lien, `tabindex`, `keydown` dans le template ou l'hôte), pas dans une déclaration : il sélectionne exactement les 10 composants. Profile Card (dépréciée) est exclue. Le helper `pressEscape` existe parce que PrimeNG lit `event.which`, que `user-event` ne renseigne pas.

**Docs (6).** Barre latérale : *Start here* (+ « Use the Plectrum agent », « At a glance »), *Reference*, *Maintainers* ; le groupe *Docs* disparaît. Tous les identifiants de pages existants sont conservés (`id` explicite) : aucun lien publié ne casse. *AI strategy* devient *How agents work* (cœur Core), la partie application part dans la nouvelle page. Encadrés « In short » sur 10 pages, page *Glossary*, *Contribute* allégée (flux design → Core et clone du repo renvoyés vers *Process and contracts* / *Maintainer workflow*). Les titres des stories de figures cachées (`Docs/…/Figures`) ne changent pas.

**Vérifications (Windows, 2026-10-02).**
- Tests de stories : 495/495 ✅.
- Tests unitaires `ui` : 419/419 ✅.
- `docs:check`, `contracts:check`, `devkit:check`, build Storybook ✅.
- `devkit:test` 27/28 et `test:pipelines` 10/11 : les deux échecs sont préexistants et propres à Windows (`node_modules/.bin/sass` sans `.cmd`, `tar` et les chemins `C:`). Le test bootstrap a été validé avec Sass lancé via Node.

## Journal

- 2026-10-02 : branche créée, plan rédigé.
- 2026-10-02 : chantiers 1 à 6 implémentés et vérifiés localement ; rien n'est commité.
- 2026-10-02 : deck `docs/Storybook for application teams.pptx` mis à jour (17 diapos) : nouvelle diapo 10 « We measure the agent. It never blocks your build. », plectrum MCP et Storybook MCP de l'app (diapos 7, 9), stories clavier (8, 11, 12), sections Storybook renommées (4, 12). `docs/onboarding/…onboarding updated.pptx` (ancienne copie) non modifiée.
- 2026-10-02 : seuil de 90 % remplacé par un gate sur régression (`knownMisses`) ; page « Use the Plectrum agent » reformulée pour préciser que rien ne bloque le build des applications.
- 2026-10-02 : commandes et extraits des figures Angular (cartes de commandes, étapes du process, installation d'une release, patterns et exemples des pages composant) affichés en bloc de code avec bouton Copier (`pds-docs-code`). Story clavier Sub Nav Shell stabilisée (attente de l'ouverture du panneau avant Tab).
