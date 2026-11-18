# Brüssel 1927 – Lernspiel zur Quantenmechanik

Browser-Lernspiel für den Physikunterricht. Bitte vor jeder Änderung diese Datei lesen. Das Spiel liegt als **eine einzige HTML-Datei** vor: `Solvay-1927-Lernspiel-2D.html` (ca. 1500 Zeilen, ca. 210 KB, reines HTML/CSS/JavaScript ohne Bibliotheken und ohne Internet).

## Auftraggeber und Einsatz

- Lehrkraft für Mathematik und Physik an einer beruflichen Schule in Baden-Württemberg (Christian-Schmidt-Schule, Technische Schule Neckarsulm).
- Zielgruppe: Technisches Gymnasium, Jahrgangsstufe 2, Physik. Einzelarbeit am Tablet oder Laptop, **nicht am Handy**.
- Einordnung: Bildungsplan BPE 11.2 (Quantenobjekte). Vorwissen: Photoeffekt, Doppelspalt mit Messdaten, Materiewellen (de Broglie). Neu erarbeitet wird u. a. die Unbestimmtheitsrelation. Auch EPR und Schrödingers Katze kommen als Vertiefung vor, obwohl sie nicht im Bildungsplan stehen.
- Die Lehrkraft lädt die Datei auf **Moodle** hoch. Die Schüler spielen im Unterricht oder zu Hause. Geplant war eine Doppelstunde, tatsächlich ist das Spiel länger geworden (nicht gemessen).
- Inhaltliche Grundlage: Ernst Peter Fischer, „Die Stunde der Physiker“ (kein Kapitel bevorzugt), dazu der Bildungsplan, dessen vier Folgerungen für das Weltbild (Nichtkausalität, Nichtdeterminiertheit, Nichtobjektivierbarkeit, Nichtlokalität) das Gerüst für Quiz und Zeitungsartikel bilden.

## Spielidee

Der Spieler ist Journalist einer Berliner Zeitung auf der 5. Solvay-Konferenz (Brüssel, Oktober 1927), drei Konferenztage. Auftrag der Redaktion: den Lesern erklären, was die neue Quantenmechanik ist und worüber die Physiker streiten.

Ablauf: Spiel (drei Tage, jeweils mit Aufträgen, Abendszene und selbst ausgefülltem Abendtelegramm) → Epilog (1928, 1930, 1935) → Redaktionsschluss (7 Schritte: 5 Quizschritte, eigener Laborbericht, Schlagzeile und Fazit) → fertiger Zeitungsartikel zum Drucken oder als PDF.

Spielelemente:
- **2D-Welt von oben**, sechs Räume: Wandelgang, Konferenzsaal, Labor, Leopoldpark, Frühstückssaal, Salon. Laufen per Klick/Tippen oder Pfeiltasten. Start im Konferenzsaal bei Lorentz.
- **Elf Physiker** (Lorentz, Einstein, Bohr, Curie, Born, Heisenberg, Schrödinger, de Broglie, Pauli, Dirac, Ehrenfest) und fünf Nebenfiguren (Federle, Fotograf, Kellner, Hotelpage, Laborant). Figuren sind selbst gezeichnet (kein Foto, kein Bild aus dem Netz).
- **Feste Dialoge mit Verzweigungen**, keine KI. Antworten hängen vom Tag, von gesammelten Notizen und von bisherigen Gesprächen ab.
- **Notizen** (`NOTES`) sammeln und anderen Physikern **vorlegen** (`react`). So entstehen die Debatten. Etliche Schlüsselnotizen gibt es nur über das Vorlegen.
- **Aufträge** (`TASKS`) pro Tag, Pflichtnotizen und Botengänge. Tipps von Ehrenfest (`hintText`).
- **Lesbare Gegenstände** (`OBJT`), teils erst ab Tag 2 oder 3 (`if:` in `MAPS[..].objs`). Zettel (`k:'paper'`) haben Schatten und dunklen Rand; Varianten `v:'napkin'` (farbig, `c`) und `v:'stack'` (Blätterstapel), damit sie auf den weißen Tischtüchern im Frühstückssaal auffallen.
- **Mithören** (`EAVES`): Gespräche zweier Physiker, die man belauschen kann.
- **Abendszenen** (`EVE`) am Ende jedes Tages, danach das **Abendtelegramm** (`TELE`, `telegram`): vier Lücken zum Auswählen (gemischt, falsche Wahl wird erklärt) und ein eigener Satz. Die vervollständigten Sätze (`teleProse`) und die eigenen Sätze bilden den Kern des Artikels.
- **Mini-Experimente** im Labor (`exp1` Doppelspalt mit Wegmessung, `exp2` Einzelspalt mit Regler, `exp3` Elektronenbeugungsröhre mit Spannungsregler, Ringmessung und Vergleich mit λ = h/p, auch mit einzelnen Elektronen), jeweils mit Vorhersage-Tipp vorab. Dazu **Curies Zerfallsmodell** (`decayDemo`, Thema `c3` bei Curie). Physiker verweisen in ihren Antworten auf passende Experimente (`lab(note, vorher, nachher)`), Ehrenfests Tipp nennt offene Experimente.
- **Konkurrent Federle** verbreitet Falschmeldungen (`RUM`). Pauli („Gewissen der Physik“) lässt sie prüfen, der Spieler muss selbst den Fehler benennen. Drei Widerlegungen sind am Tag 3 Pflicht.
- **Gruppenfoto**: Wer drei „Aktionen“ erhalten hat (Fragen, Notizen vorlegen, mithören), erscheint auf dem Foto (`inPhoto`, `bump`). Das Bild steht über dem Artikel. Aufstellung in drei eng überlappenden Reihen wie 1927 (`PROWS`: hinten die Jüngeren, vorn Curie, Lorentz, Einstein; vordere Reihe größer), Namen als Bildunterschrift nach Reihen; Fehlende erscheinen als graue Silhouette.
- **Beziehungstafel** im Notizbuch (`REL`, `relHTML`), füllt sich mit den Entdeckungen.
- **Glossar** im Notizbuch, Reiter „Begriffe“ (`GLOSS`, `glossHTML`), mit Suchfeld.
- **Geräusche** (`Snd`) werden per Web Audio erzeugt, standardmäßig aus.
- **Eigene Spielfigur**: Name, Haarfarbe, Frisur, Mantel, Hut (`chooser`).
- **Spielstand** im `localStorage` unter `solvay1927v2`. Beim Neuladen fortsetzbar. Zusätzlich als Datei sicherbar (💾 in der Leiste, im Quiz und am Artikel; `saveFile`, Dateiname `Bruessel1927_<Name>_<Stand>.json`) und im Startbildschirm ladbar (`loadFile`). Bevor ein vorhandener Spielstand ersetzt wird (neues Spiel oder Datei laden), fragt `guardOverwrite` nach und bietet an, den alten als Datei zu sichern. `fixState` ergänzt ältere Spielstände um neue Felder; ein Quiz der alten Fassung beginnt neu.
- **Escape** schließt das jeweilige Fenster (Knopf `#cl`, `#bk` oder `.bye` im Fenster, sonst `[data-esc]`). Szenen und Telegramm lassen sich nicht wegdrücken.
- **Lehrkraft-Modus**: Name beginnt mit „Lehrkraft“ → Knopf 🎓 (`teacher`): zu jedem Tag/Halbtag springen (Pflichtaufträge und Telegramme der Vortage werden erledigt), Aufträge des Tages erledigen, alle Notizen, alle aufs Foto, Abend sofort, Raumwechsel, direkt zu Epilog, Quiz oder Beispielartikel, Übersicht „Wer ist wo?“. In Quiz und Telegramm setzt „🎓 Lösung einsetzen“ die richtigen Antworten ein.

## Vorgaben der Lehrkraft (bitte beibehalten)

- Eine einzelne HTML-Datei, die offline läuft (für Moodle). Ausnahme nur, wenn die Lehrkraft es ausdrücklich erlaubt.
- Keine Punktzahl auf dem Ausdruck. Auf dem Artikel steht der Schülername als Autor. Die Bewertung (Punkte, „Titelseite“ bis „Lokalteil“) erscheint nur am Bildschirm.
- Dialoge historisch fundiert. Bekannte Aussprüche dürfen **eng an den überlieferten Formulierungen** bleiben (z. B. „Quantenspringerei“, „Genie und Wahnsinn“, „Dirac ist sein Prophet“), sind aber keine wörtlichen Zitate; Ort und Zeitpunkt sind teils frei gewählt (z. B. Einsteins Mond-Satz). So steht es im Hinweis auf dem Startbildschirm und unter dem Artikel. Federle und seine Zeitung sind erfunden.
- Keine Fotos oder fremden Bilder. Figuren selbst gezeichnet.
- Keine begrenzte Spielzeit, keine Sammelziele im Sinne von Erfolgsabzeichen (bewusst weggelassen). Das Gruppenfoto ist die einzige Fortschrittsanzeige außer Aufträgen.
- Paulis Neutrino-Hypothese kommt **nicht** vor. Beiträge von Pauli und Dirac müssen immer an andere Teilnehmer oder an Erkenntnisse der Konferenz geknüpft sein.
- Roter Faden: Tag 1 Wellen (de Broglie, Schrödinger, Born), Tag 2 Atom ohne Bahnen und Zufall (Heisenberg, Pauli, Dirac, Einstein), Tag 3 Einstein gegen Bohr. Paulis Ausschließungsprinzip (`P1`) gibt es deshalb erst, wenn Heisenbergs „Keine Bahnen“ (`N6`) notiert ist: Zustände mit Quantenzahlen statt Bahnen. An Tag 1 verweist Pauli auf Heisenberg (Thema `p2a`).
- Auf Handys muss das Spiel nicht laufen. Tablets und Laptops sind das Ziel.

## Aufbau der Datei

Ein `<script>`-Block, grob in dieser Reihenfolge (Zeilen ungefähr):
- `Figuren` (ab ca. 204): `LOOK` (Aussehen jeder Figur), `portrait(id)` zeichnet das große SVG-Porträt für Dialoge, Foto und Titelseite.
- `Daten` (ab ca. 268): `C` (Namen/Rollen), `NOTES`, `MAPS` (Räume, Türen, Möbel, Gegenstände, Standplätze), `PLACE` (wer ist wann wo: Tag × Vor-/Nachmittag), `TASKS`, `HOW`, `RUM`, `EAVES`, `EVE`, `REL`.
- `Dialoge` (ab ca. 427): `T[figur]` mit `greet`, `topics`, `react` (Reaktion auf vorgelegte Notizen) und `def`. Ergänzungen zu Pauli, Dirac und den Nebenfiguren stehen später im Block `Dialog-Ergänzungen`.
- Epilog `EPI`, Abendtelegramme `TELE`/`telegram`, Quiz `QA/QB/QC/QD/QE` (Auswahlantworten als `{t, ok}` bzw. `{t, w}` mit Erklärung `w`, gemischt über `mcHTML`/`mcCheck`), Laborbericht-Hilfe `LABX`, `quiz`/`qstep` (`NSTEP` = 7), Zeitungsartikel `article`. Auch die Gerüchte (`RUM`) haben Antworten der Form `{t, ok}`/`{t, w}`; Pauli erklärt falsche Wahl.
- Glossar `GLOSS`, Lehrkraft-Modus (`teacher`, `teachDay`, `teachTele`), Spielstand-Datei (`saveFile`, `loadFile`, `guardOverwrite`, `fixState`).
- Spiellogik: Zustand `S`, Raster und Wegsuche (`buildGrid`, `findPath`), Zeichnen (`draw*`), Bewegung (`update`, `clickAt`), Fenster (`talk`, `pick`, `notebook`, `tasks`, `photo`), Experimente, Tagesablauf (`endDay`).

Das Spiel hat vier Bildschirme: Start, Spiel (Canvas), Epilog/Quiz, Artikel. Das Drucklayout steht im `@media print`-Block.

## Typische Änderungen

- **Neuen Dialog oder Thema**: In `T[figur].topics` einen Eintrag mit `id`, `q` (Frage), `a` (Funktion mit Antworttext), optional `if`, `give` (Notiz), `need` (frühester Tag) ergänzen. Neue Notizen in `NOTES` anlegen. Reaktionen auf vorgelegte Notizen unter `react`.
- **Neuer Auftrag**: in `TASKS` und `HOW` eintragen, `thow`/`hintText` prüfen.
- **Neuer Raum oder Möbel**: in `MAPS` (Canvas 960 × 560, Raster 20 px, Möbel ohne `nb:1` blockieren den Weg). Danach prüfen, dass alle Türen, Standplätze und Gegenstände erreichbar sind.
- **Neue Notiz** muss in Quiz, Beziehungstafel (`REL`) und Artikel berücksichtigt werden, wenn sie fachlich dort hingehört.

## Prüfen

Bei jeder Änderung alles einmal automatisch durchspielen. Die Testskripte liegen in `tests/` (Playwright mit Chromium, headless): `node tests/durchspielen.js` spielt alle drei Tage samt Telegrammen, Experimenten, Quiz, Artikel, PDF und Fortsetzen durch; `node tests/funktionen.js` prüft Escape, Spielstand-Datei, Überschreibschutz, alte Spielstände und den Lehrkraft-Modus. Geprüft wird:
- Syntaxfehler und Konsolenfehler.
- Alle Plätze von `PLACE` enthalten jede Figur genau einmal. Alle Türen haben Rückweg, alle Standplätze sind erreichbar (`findPath`).
- Alle Notizen sind erreichbar, an allen drei Tagen sind alle Aufträge erfüllbar (`missing()` leer).
- Abendtelegramme (Rückmeldung bei falscher Lücke, Speichern), Quiz komplett durchspielen, Artikel erzeugen, Druck als PDF (zuletzt zwei A4-Seiten, auch mit eigenen Texten).
- Spielstand-Fortsetzen nach Neuladen, Spielstand-Datei auf anderem Gerät laden, Rückfrage vor dem Überschreiben.

Nicht geprüft: echtes Tablet, Touch-Bedienung, Ton, Spieldauer mit echten Schülern, Herunterladen und Laden der Spielstand-Datei auf dem iPad (Safari, App „Dateien“) und aus Moodle heraus.

## Offene Punkte und Ideen

- Spieldauer mit einem Probelauf messen, ggf. Wege oder Textmenge anpassen. Durch Telegramme und Laborbericht ist das Spiel noch etwas länger geworden.
- Weitere Vorschläge aus der Durchsicht: Spielzeit mitzählen (nur am Bildschirm), Hinweis „Bitte quer halten“ im Hochformat, Vorlesefunktion.
- Raumgrößen: Figuren wurden vergrößert, die Räume sind unverändert. Auf Wunsch Räume enger zuschneiden.
- Fachliche Durchsicht der selbst formulierten Dialoge, Briefe und Anekdoten durch die Lehrkraft.
- Mehr Raumschmuck möglich (zuletzt viel ergänzt).
- Spielstand aus älteren Fassungen wird nicht übernommen.

## Arbeitsweise

- Sprache im Spiel und im Gespräch mit der Lehrkraft: Deutsch. Schüler siezen: im Spiel wird der Spieler gesiezt.
- Nach Änderungen die Datei neu liefern und kurz sagen, was sich geändert hat und was nicht geprüft wurde.
