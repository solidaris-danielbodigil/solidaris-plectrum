# Cohérence de la documentation Plectrum

Revue du 29 septembre 2026, après le refinement iShare. Référence : comportement du checkout courant, manifests, CLI devkit, générateurs, configuration Storybook et workflows du dépôt. Cette revue ne constitue pas une publication des packages ou de la documentation.

## Corrections effectuées

| Sujet | Documentation alignée | Résultat |
| --- | --- | --- |
| Parcours développeur | Overview, Build with Plectrum, README | Stepper conservé ; prérequis, installation, initialisation, styles, tests et validation distingués. |
| Packages et versions | Releases, README des packages, guide mainteneur | Noms `pds-*`, accès privé et différence entre version source et version publiée explicites. |
| Devkit | Build with Plectrum, AI strategy, README devkit | Liste des fichiers générés et des outils à configurer séparément ; pas de promesse de bootstrap complet. |
| SCSS et ITCSS | CSS architecture, CSS-first surface, README styles, Contribute | Structure locale attendue, styles en `06-components`, imports et ordre de cascade ; génération automatique identifiée comme travail prévu. Exemple de padding dans un composant retiré au profit des classes de layout. |
| Storybook et tests | Writing stories, Token contracts, AI strategy, Maintainer workflow | Distinction entre contrôles statiques du toolkit, tests CSSOM centraux, unitaires, interactions et accessibilité ; MCP local Vitest correctement décrit. |
| CI et hooks | Maintainer workflow, Build with Plectrum, README devkit | Rôle des sept jobs centraux, limites, équivalents applicatifs et caractère conditionnel de Chromatic ; hook central distinct du setup applicatif. Soumission d'adoption conditionnée à son activation. |
| Agents et `.ai/` | Overview, AI strategy, README devkit | Rôles applicatifs et adaptateurs distincts des agents Core ; références centrales embarquées sans copie intégrale du dossier `.ai/`. |
| Autonomie et contribution | Contribute, Design with Plectrum, Process and contracts, component-promotion | Approbation encore requise par le scaffolder actuel ; autonomie locale et mutualisation séparées dans la cible, sans les présenter comme déjà livrées. |
| Maintenance | README racine, handoff mainteneur | Arborescence, applications, démarrage, noms de packages et commandes de contrôle actualisés ; preuves historiques de release conservées comme telles. |

## Vérification

- Compilation statique complète de Storybook réussie.
- Compilation MDX des 69 pages du catalogue réussie.
- 252 références littérales de routes Storybook contrôlées contre l'index construit : aucune route absente.
- 46 ancres de liens interpages contrôlées contre les titres des sources MDX : aucune absente.
- Les 20 routes du catalogue distribué résolvent les bonnes pages construites (`contracts:docs-check`).
- Contrôles SSOT, release, process, synchronisation des instructions d'installation et génération des contrats réussis.
- Overview vérifié dans le navigateur, onglet Developers : cinq étapes synthétiques, liens vers le parcours détaillé et stepper vertical.

Les contrôles de routes couvrent les références littérales présentes dans les MDX et stories ; ils ne valident pas les permissions des services externes. Les tests d'interaction de tous les composants n'ont pas été réexécutés pour ces changements documentaires.

## Points qui restent à réaliser ou à confirmer

1. **Implémentation du starter et autonomie locale** : suivre le [plan détaillé](plan-autonomie-equipes-devkit-ci.md). La documentation décrit la cible mais ne remplace pas sa livraison.
2. **Correspondance avec la CI globale Solidaris** : à valider avec ses propriétaires, en associant exigence, commande, déclencheur, caractère bloquant, rapport et responsable. Les workflows de ce dépôt ne suffisent pas à prouver cette conformité.
3. **Onboarding réel iShare** : démontrer depuis son propre dépôt l'installation privée, le build, le Storybook local, les tests, les hooks et la CI ; un smoke test du monorepo ne remplace pas cette preuve.
4. **Publication** : ces modifications concernent le checkout local. Les releases immuables et les pages déjà déployées restent celles de leur publication.
