# LIS-Projekte

Hier pflegt die [Gruppe Offene Infrastruktur des hbz](https://www.hbz-nrw.de/produkte/linked-open-data) eine Liste von möglichen Projekten, die sich für ein Praxisprojekt oder eine Masterarbeit in einem Studium der Bibliotheks- und Informationswissenschaften oder vergleichbarer Studiengänge eignen (z.B. MALIS an der TH Köln oder Informationsverarbeitung an der Uni Köln).

## Erstellung eines Korpus für die Nordrhein-Westfälische Bibliographie (NWBib) zum Trainieren Machine-Learning-basierter Modelle

- Themengebiet: Machine Learning
- siehe auch https://github.com/hbz/nwbib/issues/560
- Schritte:
  1. Herunterladen sämtlicher NWBib-Daten über die lobid-API, siehe auch https://blog.lobid.org/2019/10/08/nwbib-at-cdv.html
  2. Erstellung eines [Short text document corpus (TSV file)](https://github.com/NatLibFi/Annif/wiki/Document-corpus-formats#short-text-document-corpus-tsv-file) auf Basis des NWBib-Gesamtabzugs
  3. Dokumentation des Prozesses
  4. Publikation der Korpus-Daten

Eine prototypische Umsetzung mit Python findet sich unter https://github.com/fsteeg/python-data-analysis/tree/master/annif

Optional können weitere Schritte folgen (siehe [Ticket](https://github.com/hbz/nwbib/issues/560))

## Erstellung einer offenen Klassifikation im Bereich Library and Information Science (LIS)

Für viele Aufgaben wie etwa den Austausch von Open Educational Resources (OER) im LIS-Bereich wäre eine gemeinsame Klassifikation von Inhalten in bibliotheks- und informationswissenschaftlichen Studiengängen sinnvoll. Die Klassifikation sollte unter einer offenen Lizenz maschinenlesbar als SKOS-Klassifikation veröffentlicht werden.

- Themengebiet: Bibliotheks- und Informationswissenschaft
- Mögliches Vorgehen:
  1. Evaluation bestehender Klassifikationen
  2. Analyse und Vergleich der Inhalte/Module von LIS-Studiengängen im deutschsprachigen und internationalen Raum
  3. Erarbeitung eines Entwurfs
  4. Publikation mit SkoHub Vocabs
