# Brüssel 1927 – Lernspiel zur Quantenmechanik

Browser-Lernspiel für den Physikunterricht. Bitte vor jeder Änderung diese Datei lesen. Das Spiel liegt als **eine einzige HTML-Datei** vor: `Solvay-1927-Lernspiel-2D.html` (ca. 1200 Zeilen, ca. 160 KB, reines HTML/CSS/JavaScript ohne Bibliotheken und ohne Internet).

## Auftraggeber und Einsatz

- Lehrkraft für Mathematik und Physik an einer beruflichen Schule in Baden-Württemberg (Christian-Schmidt-Schule, Technische Schule Neckarsulm).
- Zielgruppe: Technisches Gymnasium, Jahrgangsstufe 2, Physik. Einzelarbeit am Tablet oder Laptop, **nicht am Handy**.
- Einordnung: Bildungsplan BPE 11.2 (Quantenobjekte). Vorwissen: Photoeffekt, Doppelspalt mit Messdaten, Materiewellen (de Broglie). Neu erarbeitet wird u. a. die Unbestimmtheitsrelation. Auch EPR und Schrödingers Katze kommen als Vertiefung vor, obwohl sie nicht im Bildungsplan stehen.
- Die Lehrkraft lädt die Datei auf **Moodle** hoch. Die Schüler spielen im Unterricht oder zu Hause. Geplant war eine Doppelstunde, tatsächlich ist das Spiel länger geworden (nicht gemessen).
- Inhaltliche Grundlage: Ernst Peter Fischer, „Die Stunde der Physiker“ (kein Kapitel bevorzugt), dazu der Bildungsplan, dessen vier Folgerungen für das Weltbild (Nichtkausalität, Nichtdeterminiertheit, Nichtobjektivierbarkeit, Nichtlokalität) das Gerüst für Quiz und Zeitungsartikel bilden.

## Spielidee

Der Spieler ist Journalist einer Berliner Zeitung auf der 5. Solvay-Konferenz (Brüssel, Oktober 1927), drei Konferenztage. Auftrag der Redaktion: den Lesern erklären, was die neue Quantenmechanik ist und worüber die Physiker streiten.

Ablauf: Spiel (drei Tage, jeweils mit Aufträgen und Abendszene) → Epilog (1930, 1935, 1928) → Redaktionsschluss (Quiz in 6 Schritten) → fertiger Zeitungsartikel zum Drucken oder als PDF.

Spielelemente:
- **2D-Welt von oben**, sechs Räume: Wandelgang, Konferenzsaal, Labor, Leopoldpark, Frühstückssaal, Salon. Laufen per Klick/Tippen oder Pfeiltasten. Start im Konferenzsaal bei Lorentz.
- **Elf Physiker** (Lorentz, Einstein, Bohr, Curie, Born, Heisenberg, Schrödinger, de Broglie, Pauli, Dirac, Ehrenfest) und fünf Nebenfiguren (Federle, Fotograf, Kellner, Hotelpage, Laborant). Figuren sind selbst gezeichnet (kein Foto, kein Bild aus dem Netz).
- **Feste Dialoge mit Verzweigungen**, keine KI. Antworten hängen vom Tag, von gesammelten Notizen und von bisherigen Gesprächen ab.
- **Notizen** (`NOTES`) sammeln und anderen Physikern **vorlegen** (`react`). So entstehen die Debatten. Etliche Schlüsselnotizen gibt es nur über das Vorlegen.
- **Aufträge** (`TASKS`) pro Tag, Pflichtnotizen und Botengänge. Tipps von Ehrenfest (`hintText`).
- **Lesbare Gegenstände** (`OBJT`), teils erst ab Tag 2 oder 3 (`if:` in `MAPS[..].objs`).
- **Mithören** (`EAVES`): Gespräche zweier Physiker, die man belauschen kann.
- **Abendszenen** (`EVE`) am Ende jedes Tages.
- **Mini-Experimente** im Labor (`exp1` Doppelspalt mit Wegmessung, `exp2` Einzelspalt mit Regler), jeweils mit Vorhersage-Tipp vorab.
- **Konkurrent Federle** verbreitet Falschmeldungen (`RUM`). Pauli („Gewissen der Physik“) lässt sie prüfen, der Spieler muss selbst den Fehler benennen. Drei Widerlegungen sind am Tag 3 Pflicht.
- **Gruppenfoto**: Wer drei „Aktionen“ erhalten hat (Fragen, Notizen vorlegen, mithören), erscheint auf dem Foto (`inPhoto`, `bump`). Das Bild steht über dem Artikel.
- **Beziehungstafel** im Notizbuch (`REL`, `relHTML`), füllt sich mit den Entdeckungen.
- **Geräusche** (`Snd`) werden per Web Audio erzeugt, standardmäßig aus.
- **Eigene Spielfigur**: Name, Haarfarbe, Frisur, Mantel, Hut (`chooser`).
- **Spielstand** im `localStorage` unter `solvay1927v2`. Beim Neuladen fortsetzbar.

## Vorgaben der Lehrkraft (bitte beibehalten)

- Eine einzelne HTML-Datei, die offline läuft (für Moodle). Ausnahme nur, wenn die Lehrkraft es ausdrücklich erlaubt.
- Keine Punktzahl auf dem Ausdruck. Auf dem Artikel steht der Schülername als Autor. Die Bewertung (Punkte, „Titelseite“ bis „Lokalteil“) erscheint nur am Bildschirm.
- Dialoge historisch fundiert, aber **keine Originalzitate**. Das wird im Spiel gekennzeichnet. Federle und seine Zeitung sind erfunden.
- Keine Fotos oder fremden Bilder. Figuren selbst gezeichnet.
- Keine begrenzte Spielzeit, keine Sammelziele im Sinne von Erfolgsabzeichen (bewusst weggelassen). Das Gruppenfoto ist die einzige Fortschrittsanzeige außer Aufträgen.
- Paulis Neutrino-Hypothese kommt **nicht** vor. Beiträge von Pauli und Dirac müssen immer an andere Teilnehmer oder an Erkenntnisse der Konferenz geknüpft sein.
- Auf Handys muss das Spiel nicht laufen. Tablets und Laptops sind das Ziel.

## Aufbau der Datei

Ein `<script>`-Block, grob in dieser Reihenfolge (Zeilen ungefähr):
- `Figuren` (ab ca. 204): `LOOK` (Aussehen jeder Figur), `portrait(id)` zeichnet das große SVG-Porträt für Dialoge, Foto und Titelseite.
- `Daten` (ab ca. 268): `C` (Namen/Rollen), `NOTES`, `MAPS` (Räume, Türen, Möbel, Gegenstände, Standplätze), `PLACE` (wer ist wann wo: Tag × Vor-/Nachmittag), `TASKS`, `HOW`, `RUM`, `EAVES`, `EVE`, `REL`.
- `Dialoge` (ab ca. 427): `T[figur]` mit `greet`, `topics`, `react` (Reaktion auf vorgelegte Notizen) und `def`. Ergänzungen zu Pauli, Dirac und den Nebenfiguren stehen später im Block `Dialog-Ergänzungen`.
- Epilog `EPI`, Quiz `QA/QB/QC/QE`, `quiz`/`qstep`, Zeitungsartikel `article`.
- Spiellogik: Zustand `S`, Raster und Wegsuche (`buildGrid`, `findPath`), Zeichnen (`draw*`), Bewegung (`update`, `clickAt`), Fenster (`talk`, `pick`, `notebook`, `tasks`, `photo`), Experimente, Tagesablauf (`endDay`).

Das Spiel hat vier Bildschirme: Start, Spiel (Canvas), Epilog/Quiz, Artikel. Das Drucklayout steht im `@media print`-Block.

## Typische Änderungen

- **Neuen Dialog oder Thema**: In `T[figur].topics` einen Eintrag mit `id`, `q` (Frage), `a` (Funktion mit Antworttext), optional `if`, `give` (Notiz), `need` (frühester Tag) ergänzen. Neue Notizen in `NOTES` anlegen. Reaktionen auf vorgelegte Notizen unter `react`.
- **Neuer Auftrag**: in `TASKS` und `HOW` eintragen, `thow`/`hintText` prüfen.
- **Neuer Raum oder Möbel**: in `MAPS` (Canvas 960 × 560, Raster 20 px, Möbel ohne `nb:1` blockieren den Weg). Danach prüfen, dass alle Türen, Standplätze und Gegenstände erreichbar sind.
- **Neue Notiz** muss in Quiz, Beziehungstafel (`REL`) und Artikel berücksichtigt werden, wenn sie fachlich dort hingehört.

## Prüfen

Bei jeder Änderung alles einmal automatisch durchspielen. Zuletzt wurde das mit Playwright und einem installierten Google Chrome (headless) gemacht:
- Syntaxfehler und Konsolenfehler.
- Alle Plätze von `PLACE` enthalten jede Figur genau einmal. Alle Türen haben Rückweg, alle Standplätze sind erreichbar (`findPath`).
- Alle Notizen sind erreichbar, an allen drei Tagen sind alle Aufträge erfüllbar (`missing()` leer).
- Quiz komplett durchspielen, Artikel erzeugen, Druck als PDF (zuletzt zwei A4-Seiten).
- Spielstand-Fortsetzen nach Neuladen.

Nicht geprüft: echtes Tablet, Touch-Bedienung, Ton, Spieldauer mit echten Schülern.

## Offene Punkte und Ideen

- Spieldauer mit einem Probelauf messen, ggf. Wege oder Textmenge anpassen.
- Raumgrößen: Figuren wurden vergrößert, die Räume sind unverändert. Auf Wunsch Räume enger zuschneiden.
- Fachliche Durchsicht der selbst formulierten Dialoge, Briefe und Anekdoten durch die Lehrkraft.
- Mehr Raumschmuck möglich (zuletzt viel ergänzt).
- Spielstand aus älteren Fassungen wird nicht übernommen.

## Arbeitsweise

- Sprache im Spiel und im Gespräch mit der Lehrkraft: Deutsch. Schüler siezen: im Spiel wird der Spieler gesiezt.
- Nach Änderungen die Datei neu liefern und kurz sagen, was sich geändert hat und was nicht geprüft wurde.
