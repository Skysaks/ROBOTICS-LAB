# Architecture

Robotics Lab est une application monopage en JavaScript, livrée en un seul fichier HTML (`dist/robotics-lab.html`, ≈ 830 Ko dont three.js). Ce document décrit la chaîne de build, la génération procédurale des modèles, l'atelier et sa vérification électrique.

## De `src/` à `dist/`

```
src/*.html ───────┐
src/styles/*.css  ├─ scripts/build.mjs ──► dist/robotics-lab.html
src/fonts/*.woff2 ┤     • <link rel="stylesheet"> → <style> (url() des polices → data:font/woff2)
src/js/*.js ──────┘     • <script src> d'un même data-bundle → un seul <script>
```

- Le gabarit référence les fichiers comme une page web classique ; les balises qui partagent un `data-bundle` sont concaténées dans l'ordre, sans séparateur. Le résultat est un script classique unique : les déclarations d'un module sont visibles de tous, comme dans un fichier d'un seul tenant.
- `npm run build -- --check` reconstruit en mémoire et compare octet par octet avec `dist/robotics-lab.html` ; la CI échoue au moindre écart.
- `scripts/lib.mjs` porte aussi les contrôles : ressources externes (balises `src`/`href`, `url()`, `@import`, `import()`) et données personnelles (adresses, jetons, liens privés, termes locaux d'un fichier `.prive-termes.txt` jamais publié).

## Modules

| Fichier | Rôle |
|---|---|
| `vendor/three.min.js` | three.js r160 (MIT), build UMD inchangé, exposé en `THREE` ; inséré dans son propre `<script>` |
| `01-donnees.js` | `BOARDS` (8 cartes : dimensions, tension, broches, composants), `MODS`/`MOD` (15 modules), prix indicatifs, couleurs de fils, `MISSIONS` (12), `LESSONS` (6), `QUIZ` (8) |
| `02-outils.js` | rendu, environnement et lumières, caméra orbitale tactile, textures canvas, sons Web Audio, stockage local |
| `03-modeles-3d.js` | construction procédurale des composants (résistances, condensateurs, connecteurs, puces), des cartes et des modules |
| `04-galerie-assemblage.js` | galerie : vues, brochage, éclaté, étiquettes, recherche de composant ; mode assemblage pas à pas |
| `05-atelier.js` | palette, placement, câblage aimanté, soudure, annuler / rétablir, graphe des connexions, vérification, missions, nomenclature, projets |
| `06-navigation-lecon-quiz.js` | navigation entre sections, leçon, quiz, comparateur, journal |
| `07-demarrage.js` | vignettes des pièces, initialisation des scènes, ancre de l'URL |

## Modèles procéduraux

Aucun fichier 3D : chaque carte est décrite par des données (taille du circuit, couleur du vernis, rangées de broches, composants placés) et `03-modeles-3d.js` en construit la géométrie. Les sérigraphies et le tapis antistatique sont dessinés sur des canvas utilisés comme textures. Les vignettes de la palette sont rendues une fois au démarrage, depuis les mêmes modèles.

## Atelier

```
pièces posées ─► fils (broche A ↔ broche B) ─► graphe des connexions (net) ─► tension de chaque réseau (volt)
                                                                         └─► règles : court-circuit, 5 V → 3,3 V, niveaux logiques
```

- Chaque broche porte un type (`p5`, `p3`, masse, signal…) ; `check(a, b)` refuse ou signale une connexion dangereuse au moment où elle est tirée.
- La vérification complète parcourt les réseaux électriques et rend des messages explicatifs, pas seulement un statut.
- Les missions déroulent des étapes (poser, câbler, vérifier, lancer) ; la progression et les projets libres sont enregistrés dans `localStorage` (clés préfixées `rl_`).
- Annuler / rétablir repose sur des instantanés de l'atelier (`commit`, `doUndo`, `doRedo`).

## Performance

La galerie et l'atelier ont chacun leur scène et leur moteur de rendu. Sur un GPU logiciel, comme en CI, l'ouverture prend plusieurs secondes : les tests de bout en bout ont un délai porté à 150 s (`build.config.json`).

## Tests

| Fichier | Vérifie |
|---|---|
| `tests/build.test.mjs` | `dist/` à jour, document complet (langue, encodage, viewport, titre, description), aucune ressource externe, aucun fichier orphelin dans `src/`, aucune donnée personnelle |
| `tests/e2e/app.spec.mjs` | ouverture hors ligne sans erreur ni requête, absence de débordement horizontal, parcours des six sections (cartes, atelier, leçon, quiz, comparateur, journal) ; en 1440 × 900 et en 390 × 844 tactile |

Les parcours sont décrits dans `build.config.json` (`e2e.flows`), ce qui garde le fichier de test générique.
