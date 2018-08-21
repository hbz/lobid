# Lobid – Dateninfrastruktur für Bibliotheken

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Lobid – Dateninfrastruktur für Bibliotheken](#lobid-dateninfrastruktur-für-bibliotheken)
- [Überblick](#überblick)
	- [lobid: Oberflächen und APIs](#lobid-oberflächen-und-apis)
	- [Warum APIs?](#warum-apis)
	- [Architektur: von horizontalen Schichten zu vertikalen Schnitten](#architektur-von-horizontalen-schichten-zu-vertikalen-schnitten)
	- [JSON-LD: eine RDF-Serialisierung oder JSON mit Kontext](#json-ld-eine-rdf-serialisierung-oder-json-mit-kontext)
		- [Generisches JSON-LD im lobid 1.x-System](#generisches-json-ld-im-lobid-1x-system)
		- [Maßgeschneidertes JSON-LD in den neuen Systemen](#mageschneidertes-json-ld-in-den-neuen-systemen)
			- [Erstellung von JSON-LD als JSON mit Kontext: lobid-organisations](#erstellung-von-json-ld-als-json-mit-kontext-lobid-organisations)
			- [Erstellung von JSON-LD als RDF-Serialisierung: lobid-resources](#erstellung-von-json-ld-als-rdf-serialisierung-lobid-resources)
		- [Vorteile des maßgeschneiderten JSON-LD](#vorteile-des-mageschneiderten-json-ld)
			- [Was man sieht, ist was abgefragt wird](#was-man-sieht-ist-was-abgefragt-wird)
			- [Semantisch strukturierte Daten](#semantisch-strukturierte-daten)
			- [Labels für IDs](#labels-für-ids)
			- [Zwischenfazit: JSON-LD ist nicht gleich JSON-LD](#zwischenfazit-json-ld-ist-nicht-gleich-json-ld)
	- [Benutzerschnittstellen](#benutzerschnittstellen)
	- [Vokabulare](#vokabulare)
- [Entwicklungsprozess](#entwicklungsprozess)
	- [Open Source](#open-source)
	- [Visualisierung](#visualisierung)
	- [Reviews](#reviews)
- [Dokumentation](#dokumentation)
	- [Dokumentation des Datensets](#dokumentation-des-datensets)
	- [Dokumentation der API](#dokumentation-der-api)
	- [Dokumentation mit Beispielen](#dokumentation-mit-beispielen)
		- [Web-Annotationen für API-Dokumentation](#web-annotationen-für-api-dokumentation)
		- [Vorteile](#vorteile)
	- [Fallstudie: lobid-gnd](#fallstudie-lobid-gnd)
	- [Die Benutzeroberfläche](#die-benutzeroberfläche)
	- [Suche und Navigation](#suche-und-navigation)
	- [Datengenerierung und Anreicherung](#datengenerierung-und-anreicherung)
		- [Der JSON-LD-Kontext](#der-json-ld-kontext)
	- [Framing](#framing)
		- [Homogenisierung von Typen und Label-Properties](#homogenisierung-von-typen-und-label-properties)
		- [Labels für verlinkte Ressourcen](#labels-für-verlinkte-ressourcen)
		- [Anreicherung mit Links und Bildern aus EntityFacts](#anreicherung-mit-links-und-bildern-aus-entityfacts)
	- [Web-API](#web-api)
	- [Formulierung komplexer Suchanfragen](#formulierung-komplexer-suchanfragen)
		- [Query-Grundlagen](#query-grundlagen)
			- [Eingabe](#eingabe)
			- [Default-Sucheinstellungen & boolesche Operatoren](#default-sucheinstellungen-boolesche-operatoren)
			- [Anzeige der JSON-Daten](#anzeige-der-json-daten)
			- [Feldsuchen](#feldsuchen)
		- [Beispiele](#beispiele)
			- [`_exists_`-Abfragen](#exists-abfragen)
			- [Einträge mit Angabe eines Architekten](#einträge-mit-angabe-eines-architekten)
			- [Gleichzeitige Suche in Ansetzungs- und Verweisungsformen](#gleichzeitige-suche-in-ansetzungs-und-verweisungsformen)
			- [Suche nach Einträgen mit Wikidata-Link aber ohne Bild](#suche-nach-einträgen-mit-wikidata-link-aber-ohne-bild)
			- [Personen, die während der NS-Zeit in Köln geboren wurden](#personen-die-während-der-ns-zeit-in-köln-geboren-wurden)
			- [Vollständige Query-Syntax](#vollständige-query-syntax)
	- [Bulk Downloads, OpenRefine-API und mehr](#bulk-downloads-openrefine-api-und-mehr)
		- [Zufälliges Bild auf der Startseite](#zufälliges-bild-auf-der-startseite)
		- [Bulk Downloads](#bulk-downloads)
		- [OpenRefine Reconciliation API](#openrefine-reconciliation-api)
- [Referenzen](#referenzen)

<!-- /TOC -->

# Überblick

## lobid: Oberflächen und APIs

[lobid](http://lobid.org) stellt Rechercheoberflächen und offene Programmierschnittstellen (APIs) zur Verfügung, die auf Linked Open Data (LOD) basieren. lobid wird vom Hochschulbibliothekszentrum des Landes NRW betrieben. Derzeit umfasst lobid drei Dienste: [lobid-resources](http://lobid.org/resources) bietet Zugriff auf den hbz-Verbundkatalog, [lobid-organisations](http://lobid.org/organisations) bietet Informationen zu Gedächtnisinstitutionen im deutschsprachigen Raum, [lobid-gnd](http://lobid.org/gnd) bietet Zugriff auf die Gemeinsame Normdatei (GND).

## Warum APIs?

Die lobid-API bietet einheitlichen Zugriff auf bibliothekarische Daten über eine Web-basierte Programmierschnittstelle (application programming interface, API). Sie liefert JSON für Linked Data (JSON-LD):

![Daten](images/data.png "Daten")

Die Grundidee ist dabei eine Entkopplung von Anwendungen, die diese Daten verwenden, von spezifischen Datenquellen, Formaten und Systemen. So können sich diese Formate und Systeme ändern, ohne dass Änderungen in den Anwendungen nötig werden, die auf die Daten über die API zugreifen. Dies ermöglicht die Entwicklung von herstellerunabhängigen, nachhaltigen Anwendungen auf Basis bibliothekarischer Daten, siehe auch Steeg (2015a).

## Architektur: von horizontalen Schichten zu vertikalen Schnitten

Die hier beschriebenen lobid-Dienste bilden die zweite Version der im Jahr 2013 veröffentlichten lobid-APIs, die wir auf Basis der Erfahrungen mit der ersten Version entwickelt haben. Details und Motivation für diese Entwicklung haben wir [auf GitHub dokumentiert](https://github.com/hbz/lobid/issues/1).

Das lobid 1.x-System basierte auf einer klassischen monolithischen Schichtenarchitektur: Wir hatten ein Git-Repository, das die Implementierung für das Backend enthielt, mit der Logik aller Datentransformationen und der Indexschicht für alle Daten. Ein weiteres Git-Repository implementierte die APIs und ein gemeinsames Frontend für alle Datensets, die so alle innerhalb eines Prozesses ausgeliefert wurden.

Dies führte insgesamt zu einer Verquickung der verschiedenen Datensets: um etwa auf eine neuere Version unserer Suchmaschine (Elasticsearch) umzustellen, die Features bereistellt, die wir für eines der Datensets brauchten, mussten alle Datensets umgestellt werden, da die Applikation, die ja in einem einzigen Prozess lief, nicht von verschiedenen Elasticsearch-Versionen abhängen kann. Ebenso kam es zu inhaltlich eigentlich unnötigen Anhängigkeitskonflikten zwischen Software-Bibliotheken, die jeweils nur von den APIs unterschiedlicher Datensets benötigt wurden.

Daher haben wir lobid für die 2.0-Version in vertikale, in sich abgeschlossene Systeme für jedes Datenset (resources, organisations, gnd) aufgespalten (Steeg 2015b):

![Architektur](images/scs.png "Architektur")

Durch die Kombination dieser Module in der Horizontalen haben wir nach wie vor eine gemeinsame API und eine gemeinsame Oberfläche für alle Dienste, doch Teile dieser API und Oberfläche sind in Module gekapselt, die je ein Datenset behandeln. Diese Module enthalt den für das jeweilige Datenset spezifischen Code und die spezifischen Abhängigkeiten und können unabhängig analysiert, verändert und installiert werden.

## JSON-LD: eine RDF-Serialisierung oder JSON mit Kontext

JSON-LD ist eine W3C-Empfehlung für eine JSON-basierte Linked-Data-Serialisierung. Man kann JSON-LD aus zwei Perspektiven betrachten: einerseits als RDF-Serialisierung (wie N-Triples, Turtle oder RDF/XML), andererseits als eine Möglichkeit, JSON zum Verlinken von Daten zu verwenden. Diese doppelte Perspektive spiegelt sich auch in der JSON-LD-Spezifikation wider, die beschreibt dass JSON-LD "als RDF verwendet werden kann", und dass es "direkt als JSON verwendet werden kann, ohne Kenntnis von RDF" (Sporny (2014), Übersetzung von uns). Reguläres JSON wird durch das [Beifügen eines JSON-LD-Kontexts](https://www.w3.org/TR/json-ld/#the-context) zu JSON-LD und damit als RDF serialisierbar.

### Generisches JSON-LD im lobid 1.x-System

In der ersten Version der lobid-APIs haben wir im Zuge unserer Datentransformation N-Triples erzeugt und diese automatisch mit einem JSON-LD-Prozessor konvertiert. Hier haben wir JSON-LD vollständig als RDF-Serialisierung betrachtet:

![Lobid 1](images/lobid-1.png "Lobid 1")

Im resultierenden JSON-LD hatten wir so die URIs aus den Triples als JSON-Schlüsselwörter. Diese Daten haben wir als [expandiertes JSON-LD](https://www.w3.org/TR/json-ld/#expanded-document-form) in Elasticsearch indexiert. Elasticsearch erfordert konsistente Daten für ein gegebenes Feld, z.B. muss etwa der Wert von `alternateName` immer ein String sein, oder immer ein Array. Wenn die Werte mal ein String, mal ein Array sind, führ dies bei der Indexierung in Elasticsearch zu einem Fehler. In der kompakten JSON-LD Serialisierung werden einzelne Werte jedoch direkt serialisiert (z.B. als String), wenn jedoch in einem anderen Dokumente für das gleiche Feld mehrere Werte angegeben sind, wird ein Array verwendet. Expandiertes JSON-LD verwendet hingegen immer Arrays. Eine JSON-LD-Form, bei der kompakte Keys (Schlüsselwörter) mit expandierten Werten kombiniert sind gibt es in der Form nicht (siehe [https://github.com/json-ld/json-ld.org/issues/338](https://github.com/json-ld/json-ld.org/issues/338)).

Beim Ausliefern der Daten über die API haben wir die Daten dann in [kompaktes JSON-LD](https://www.w3.org/TR/json-ld/#compacted-document-form) konvertiert, um anstelle der URIs kurze, benutzerfreundliche JSON-Keys zu bekommen, das heißt wir haben im Grunde zwei verschiedene Formate erzeugt und verwendet: das interne Indexformat und das extern sichtbare API-Format.

### Maßgeschneidertes JSON-LD in den neuen Systemen

#### Erstellung von JSON-LD als JSON mit Kontext: lobid-organisations

Bei lobid-organisations, dem ersten Datenset, das wir auf den neuen Ansatz umgezogen haben, haben wir das Vorgehen umgedreht – statt manuell N-Triples anzufertigen, und diese automatisch in JSON-LD zu konvertieren, erzeugen wir das JSON mit genau der Struktur, die wir brauchen. Auf dieser Grundlage generieren wir dann RDF-Serialisierungen wie N-Triples:

![Lobid 2](images/lobid-2.png "Lobid 2")

Der zentrale Vorteil dieses Ansatzes ist, dass wir unseren konkreten Anwendungsfall nach vorne stellen: Wir bauen explizit unsere API, so wie sie für unsere Anwendungen Sinn macht, anstatt zuerst eine Abstraktion zu erzeugen, aus der wir dann konkrete Darstellungen generieren, die von unseren Anwendungen verwendet werden.

Im Vergleich zum Ansatz im ersten lobid-System befinden wir uns hier am anderen Ende des Spektrums der Perspektiven auf JSON-LD, die wir oben beschrieben haben: Wir behandeln hier JSON-LD als JSON, ohne bei der Produktion der Daten, oder bei ihrer Verwendung, Kenntisse von RDF zu erfordern.

#### Erstellung von JSON-LD als RDF-Serialisierung: lobid-resources

In der neuen Version von lobid-resources haben wir einen Mittelweg genommen. Wir haben uns entschlossen, auf die bestehende Transformation der Katalogdaten in N-Triples aufzubauen. Wir verwenden dann Code, der von Jan Schnasse im [Etikett-Projekt](https://github.com/hbz/etikett) entwickelt wurde, um maßgeschneidertes JSON-LD aus den N-Triples zu erzeugen. Wie in lobid-organisations (und im Gegensatz zur ersten Version von lobid-resources), ist das maßgeschneiderte JSON-LD zugleich das Index- wie auch das von der API gelieferte Format.

### Vorteile des maßgeschneiderten JSON-LD

Beide Ansätze erzeugen also maßgeschneidertes JSON-LD, sei es auf spezifische Weise aus N-Triples generiert, oder manuell erzeugtes JSON. Dieses maßgeschneiderte JSON-LD hat mehrere Vorteile.

#### Was man sieht, ist was abgefragt wird

Ein zentraler Aspekt der neuen Systeme ist, dass wir nun das gleiche Format liefern, das auch im Index gespeichert ist. Dies ermöglicht beliebige Abfragen der Daten über generische Mechanismen, ohne dass wir spezifische Anfragen implementieren müssen. Betrachten wir etwa einen bestimmten Datensatz, z.B. [http://lobid.org/organisations/DE-605?format=json](http://lobid.org/organisations/DE-605?format=json), so sehen wir folgendes:

	"classification" : {
	  "id" : "http://purl.org/lobid/libtype#n96",
	  "type" : "Concept",
	  "label" : {
	    "de" : "Verbundsystem/ -kataloge",
	    "en" : "Union Catalogue"
	  }
	}

Auf Basis der Daten, die wir hier sehen, können wir ein beliebiges Feld nehmen, z.B. `classification.label.en` (die Punkte bilden die Schachtelung der Felder ab) und eine Abfrage wie [http://lobid.org/organisations/search?q=classification.label.en:Union](http://lobid.org/organisations/search?q=classification.label.en:Union) formulieren. Im alten System, bei dem im Index expandiertes JSON-LD gespeichert war, die API aber kompaktes JSON-LD lieferte, brauchten wir spezifische Query-Parameter um Feldsuchen in praxistauglicher Art (ohne URIs als Feldnamen) umzusetzen, etwa für Titel, Autoren oder Schlagwörter, z.B.:

`http://lobid.org/resource?name=Ehrenfeld`

Diese können nun stattdessen über einen generischen `q`-Parameter und die tatsächlichen Feldnamen aus den Daten formuliert werden:

`http://lobid.org/resources/search?q=title:Ehrenfeld`

So vermeiden wir eine Beschränkung auf die von uns antizipierten Arten von Abfragen, und öffnen stattdessen den API-Zugriff auf die kompletten Daten.

#### Semantisch strukturierte Daten

Das generierte JSON-LD des alten Systems war eine flache Struktur mit JSON-Objekten in einem Array unter dem `@graph`-Schlüsselwort, z.B. in `http://lobid.org/organisation?id=DE-605&format=full`:

	"@graph": [
	    {
	        "@id": "http://purl.org/lobid/fundertype#n02",
	        "prefLabel": [{
	                "@language": "de",
	                "@value": "Land"
	            },{
	                "@language": "en",
	                "@value": "Federal State"
	        }]
	    },{
	        "@id": "http://purl.org/lobid/stocksize#n11",
	        "prefLabel": [{
	                "@language": "en",
	                "@value": "Institution without a collection"
	            },{
	                "@language": "de",
	                "@value": "Einrichtung ohne Bestand"
	        }]
	    }
	]

Diese Struktur war nicht sehr praktisch und entsprach nicht dem [pragmatischen Geist von JSON-LD](http://fsteeg.com/notes/one-issue-with-json-ld-that-seems-not-so-pragmatic). Wenn man etwa die englische Bezeichnung des Unterhaltsträgers einer Einrichtung verwenden will, muss man hier über alle `@graph`-Objekte iterieren und jeweils prüfen, ob die `@id` die Unterhaltsträger-ID ist, dann über alle `prefLabel`-Objekte iterieren und jenes mit dem passenden `@language`-Feld suchen, das dann als `@value` den gesuchten Wert enthält.

In den neuen Systemen bieten wir die Daten in einem strukturierteren, JSON-typischem Format an:

	"fundertype": {
	    "id": "http://purl.org/lobid/fundertype#n02",
	    "type": "Concept",
	    "label": {
	        "de": "Land",
	        "en": "Federal State"
	    }
	},
	"collects": {
	    "type": "Collection",
	    "extent": {
	        "id": "http://purl.org/lobid/stocksize#n11",
	        "type": "Concept",
	        "label": {
	            "de": "Einrichtung ohne Bestand",
	            "en": "Institution without holdings"
	        }
	    }
	}

Dies ermöglicht Entwicklern und Entwicklerinnen, die mit JSON vertraut sind, einen einfachen Zugriff auf die Daten. Das gesuchte Datum aus dem obigen Beispiel etwa ist per Direktzugriff auf das geschachtelte Feld `fundertype.label.en` verfügbar.

Ein weiteres Beispiel für die semantische Anreicherung der JSON-Daten durch eine angepasste Struktur und die sich daraus ergebenden Auswirkungen auf die API-Nutzung sind [Mitwirkende und ihre Rollen in lobid-resources](http://blog.lobid.org/2016/12/13/data-modeling-client-effects.html).

#### Labels für IDs

Ein typisches Nutzungsszenario bei der Verwendung der Lobid-APIs ist die Anzeige von Labels für die URIs, die zur Identifikation von Ressourcen, Autoren, Schlagwörtern etc. verwendet werden. Für Anwendungen, die auf dem alten System basierten haben wir das Nachschlagen dieser Labels in unterschiedlichen Formen implementiert. Um diesen Anwendungsfall zu vereinfachen, liefern die neuen APIs die Labels mit den IDs zusammen aus, soweit dies möglich und sinnvoll ist. In den alten Daten hatten wir etwa zu Identifikation des Mediums einer Publikation nur eine URI:

	"medium" : "http://rdvocab.info/termList/RDAproductionMethod/1010"

Um nun ein Label für eine solche URI anzuzeigen, mussten wir in den Client-Anwendungen, die die Lobid-APIs nutzten, Zuordnungen etwa in Form von Mapping-Tabellen verwalten. In den neuen APIs liefern wir die Labels mit den IDs zusammen aus (aus Konsistenzgründen wird auch hier ein einzelner Wert als Array geliefert, s.o.):

	"medium": [{
	  "id": "http://rdaregistry.info/termList/RDAproductionMethod/1010",
	  "label": "Print"
	}]

Wie die Erstellung des JSON-LD allgemein, unterscheidet sich auch die Implementierung dieser Labels zwischen der oben beschriebenen *JSON-first* und der *Triples-first* Umsetzung. In lobid-organisations ist die Ergänzung der Labels (wie alle Aspekte der JSON-Erzeugung) Teil der Datentransformation. In lobid-resources wird eine `labels.json` Datei während der Konvertierung von N-Triples in JSON-LD verwendet. lobid-gnd schließlich verwendet ein Bootstrapping-Ansatz, bei dem die vorige Version des Dienstes als Quelle für die Labels verwendet wird. Details zur Datentrasformation in lobid-gnd finden sich weiter unten.

#### Zwischenfazit: JSON-LD ist nicht gleich JSON-LD

Eine zentrale Schlussfolgerung unserer Erfahrung mit JSON-LD ist, dass JSON-LD sehr unterschiedlich erzeugt und verwendet werden kann. Wie es erzeugt wird hat dabei große Auswirkungen darauf, wie es verarbeitet werden kann und wie nützlich es Entwickler*innen mit unterschiedlichem fachlichen Hintergrund erscheint. Eine reine RDF-Serialisierung wie in unserem alten System kann etwa perfekt passen, wenn sowieso mit einem RDF-Modell gearbeitet wird, während sie Web-Entwicklern und Entwicklerinnen, die mit JSON vertraut sind, als absurd und schwer verwendbar erscheinen wird. Diese Unterschiede in dem, wie JSON-LD tatsächlich aussieht, können eine Herausforderung für die Kommunikation über die Nützlichkeit von JSON-LD sein. Zugleich ist dies aber auch eine Stärke von JSON-LD, das mit seiner Doppelnatur – als RDF-Serialisierung und als einfacher Weg, JSON-Daten zu vernetzen – unterschiedliche Nutzungsszenarien abdecken kann.

## Benutzerschnittstellen

Über die hier skizzierten APIs und Datenstrukturen hinaus bietet [Lobid](http://lobid.org) in der neuen Version (im Gegensatz zur rudimentären Darstellung der alten Dienste) Suchoberflächen für Endnutzer*innen mit erweiterten Funktionen wie facettierter Suche und Kartenvisualisierungen. Eine ausführliche Darstellung der Funktionalitäten am Beispiel von lobid-gnd findet sich weiter unten.

## Vokabulare

Ein zentraler Aspekt jeder Linked-Data-Anwendung sind die genutzten RDF-Vokabulare und Ontologien. In [lobid-organisations](http://lobid.org/organisations) verwenden wir schema.org als Basisvokabular. lobid-resources basiert auf DC Terms, Bibframe, der Bibliographic Ontology (Bibo) und anderen, siehe  Ewertowski/Pohl (2017). http://blog.lobid.org/2017/04/19/vocabulary-choices.html), wobei wir auch hier für die Modellierung der Publikationsdaten schema.org einsetzen, z.B. [hier](http://lobid.org/resources/HT002213253.json). Grundlage der Daten in lobid-gnd ist die [GND-Ontologie](http://d-nb.info/standards/elementset/gnd).

# Entwicklungsprozess

## Open Source

Wir entwickeln die lobid-Dienste als Open Source Software auf GitHub. Wir veröffentlichen nicht nur Ergebnisse auf GitHub, sondern der gesamte Prozess findet dort statt, d.h. Planung, Issue Tracking, Diskussion, Implementierung sowie Testen der Software. GitHub hat einen integrierten Issue Tracker, dessen primäres Organisationsmittel beliebige Labels mit Farben sind. Diese lassen sich vielseitig anwenden (s.u.). Dieser Issue Tracker ermöglicht es auf einfache und funktionale Weise, andere Prozesse in GitHub zu referenzieren, so lassen sich etwa auf einfache Weise Links zu Code, Commits und Benutzern erstellen.

## Visualisierung

GitHub Issues sind immer mit einem GitHub Code Repository assoziiert. Für einen einheitlichen Blick auf alle vom Team bearbeiteten Issues in allen Repositories verwenden wir zur Visualisierung des Workflows [Waffle](http://waffle.io), ein Kanban Board mit GitHub-Integration, bei dem jedes GitHub Issue einer Karte entspricht, und die Spalten des Boards Labels der GitHub-Issues entsprechen.

![Waffle](images/waffle.png "Waffle")

In unserem Prozess durchläuft eine Karte das Board von links nach rechts. Priorisierte Karten schieben wir nach oben in der Spalte, Karten, die Fehler (Bugs) beschreiben, werden generell priorisiert.

| Backlog | Ready | Working | Review | Deploy | Done |
|---------|-------|---------|--------|--------|------|
| Neue Issues ohne Label | Bereit, d.h. Anforderungen und Abhängigkeiten sind klar | In Bearbeitung | In Überprüfung | Bereit für Produktion | In Produktion |

## Reviews

Ein Kernelement unseres Entwicklungsprozesses, durch das bibliothekarische Anforderungen und Entwicklung miteinander verzahnt werden, sind die Begutachtungen bzw. Reviews. Hier unterscheiden wir zwischen funktionalem Review und Code Review.

Zur Einleitung des funktionalen Reviews stellt einer unserer Entwickler neue oder reparierte Funktionalität auf dem Staging-System bereit, beschreibt im korrespondierenden Issue, wie getestet werden kann (z.B. durch Angabe von Links auf die betreffenden Seiten im Staging-System) und weist das Issue einem Team-Mitglied zur Begutachtung zu. Dieses testet, gibt Feedback (bei Bedarf aktualisiert der Entwickler den Code und die Version auf Staging mehrfach), und schließt die Begutachtung mit einem "+1" Kommentar ab.

Nach Abschluss des Functional Reviews weist der Begutachter den zum Issue gehörigen Pull Request einem anderen Entwickler zur Begutachtung zu (Code Review). Dieser inspiziert je nach Fall nur den Diff im Pull Request oder testet den Branch lokal. Die Ausführung des Builds und der Tests erfolgt automatisch im Pull Request durch Travis CI, ein in GitHub integrierter Continuous-Integration-Dienst. Auch hier wird die Begutachtung mit einem "+1" Kommentar abgeschlossen, der Begutachter weist das Issue wieder dem Entwickler zu, und verschiebt es in 'Deploy'.

Nach Abschluss beider Begutachtungsschritte wird die neue bzw. reparierte Funktionalität auf dem Produktivsystem installiert. Details zu unserem Entwicklungsprozess finden sich in unserer [Dokumentation](https://hbz.github.io/#dev-process) und in dieser [Präsentation](http://hbz.github.io/slides/lobid-entwicklungsprozess).

# Dokumentation

Bei der Dokumentation einer API gibt es unterschiedliche Aspekte: das Datenset als Ganzes, die Struktur von API-Anfragen und -Antworten, die verwendeten RDF-Properties und -Klassen, Provenienzinformationen. Im Folgenden beschreiben wir unsere Herangehensweise an die Dokumentation von [lobid-resources](https://lobid.org/resources/) und [lobid-organisations](https://lobid.org/organisations/), mit dem Schwerpunkt auf letzterem Dienst.

## Dokumentation des Datensets

Um für die menschliche und maschinelle Nutzung der Daten einen Überblick zu geben, folgen wir im Wesentlichen der W3C-Empfehlung für Daten im Web (Lóscio 2017). Das Ergebnis ist [eine JSON-LD-Datei](http://lobid.org/organisations/dataset.jsonld) und eine daraus generierte [HTML-Version](http://lobid.org/organisations/dataset). Im Gegensatz zu den Beispielen der W3C-Empfehlung verwenden wir insofern es möglich ist Vokabular von schema.org anstatt DC Terms und des DCAT-Vokabulars.

![Beschreibung des lobid-organisations Datensets](images/lobid-organisations-description.png)

HTML-Version des lobid-organisations Datensets

## Dokumentation der API

Die API-Dokumentation ([lobid-organisations](http://lobid.org/organisations/api), [lobid-resources](http://lobid.org/organisations/api), [lobid-gnd](http://lobid.org/gnd/api)) führt zunächste grundlegende Konzepte der API anhand von Beispielen ein und zeigt darauf aufbauend komplexere Anfragen und spezielle Fälle wie die Suche nach URLs (in denen bestimmt Zeichen maskiert werden müssen). Für eine vollständige Referenz zur den Suchmöglichkeiten verweisen wir auf die Lucene- bzw. Elasticsearch-Dokumentation.

Im weiteren Verlauf beschreibt die Dokumentation die unterstützten Inhaltstypen mit Beispielanfragen. Wir beschreiben den Einsatz der API zur Umsetzung einer Autosuggest-Funktionalität mit einem in die Dokumentationseite eingebetteten, funktionstüchtigen Beispiel. Schließlich beschreiben wir spezifische Funktionen der einzelnen Dienste wie ortsbezogene Abfragen, CSV-Export, und die Integration der APIs in OpenRefine (siehe dazu auch unten).

## Dokumentation mit Beispielen

Um einen leichten Zugang zu einem Schema und seiner Verwendung zu bekommen, wird häufig nach Beispielen gesucht. Leider sind Beispiele aber oft nur zweitrangige Elemente einer Dokumentation, wenn überhaupt welche gegeben werden. Sehr verbreitet ist ein beschreibender Ansatz zur Dokumentation von Vokabularen oder Applikationsprofilen, bei dem Elemente in einer Tabelle (häufig in einem PDF) aufgelistet werden, mit Beschreibungen verschiedener Aspekte in mehreren Spalten.

Eine Ausnahme bildet hier schema.org, das viele Beispiele bietet. Aber selbst hier sind die Beispiele ein Anhängsel der Beschreibung und manchmal fehlen sie (z.B. ist es schwierig zu erfahren, wie die Property [publication](http://schema.org/publication) oder die Klasse [PublicationEvent](http://schema.org/PublicationEvent) verwendet werden). Wir sind der Ansicht, dass [Beispiele Kernelemente der Dokumentation](https://twitter.com/acka47/status/791271448245637120) sein sollten und halten seitenlange Tabellen, die Elemente eines Metadatenschemas auflisten, nicht für sehr hilfreich und praktisch. Daher haben wir uns Gedanken gemacht und damit experimentiert, wie Beispiele ins Zentrum der Dokumentation gerückt werden können.

### Web-Annotationen für API-Dokumentation

Beispiele alleine sind nicht hinreichend (Gruenbaum 2009), aber brauchen wir wirklich eine Tabelle, in der jedes Element unserer Daten beschrieben wird? Wenn wir das Beispiel in den Mittelpunkt stellen, können wir die strukturierten beschreibenden Daten (Name, Beschreibung, etc.) direkt dem Beispiel beifügen?

Hier kommen Werkzeuge zur Web-Annotation zur Anwendung, indem Beispiele unserer JSON-LD Daten aus dem Produktivsystem mit [hypothes.is](https://hypothes.is/) annotiert werden. Unser erster Ansatz war, direkt die JSON-Darstellungen zu annotieren (z.B. [http://lobid.org/organisations/DE-38M.json](http://lobid.org/organisations/DE-38M.json)), doch hier würden die Annotationen nur bei Verwendung des [hypothes.is Chrome-Plugins](https://chrome.google.com/webstore/detail/hypothesis-web-pdf-annota/bjfhmglciegochdpefhhlphglcehbmek) sichtbar. Eine weitere Option wäre die Verwendung des hypothes.is [via service](https://via.hypothes.is/), doch dieser [unterstützt keine Annotation von Textdateien](https://github.com/hypothesis/via/issues/79). Daher haben wir uns entschlossen, die JSON-Beispiele in die HTML-Dokumentationsseite einzubetten, und hypothes.is über JavaScript einzubinden.

In lobid-organisations reicht die Annotation eines einzigen Beispiels. Um die wesentlichen Felder in den lobid-resources-Daten abzudecken, mussten wir je ein Beispiel verschiedener Ressourcentypen (Buch, Periodikum, Artikel, Serienband) annotieren. Für lobid-gnd haben wir den Annotationsansatz noch nicht umgesetzt.

Jedes JSON-Schlüsselwort wird mit den folgenden Informationen annotiert:

- Name: eine menschenlesbare Bezeichnung für das Feld
- Beschreibung: eine kurze Beschreibung der Information in diesem Feld
- Abdeckung: die Anzahl der Ressourcen im Dataset mit Informationen in diesem Feld. Hier ergänzen wir häufig URLs mit `_exists_`-Abfragen (siehe unten) dieses Feldes.
- Anwendungsfälle: Beispiele zur Verwendung der Information in diesem Feld, häufig mit Beispielanfragen
- URI: die RDF-Property, die diesem Feld entspricht (d.h. die auf den JSON-Key im JSON-LD-Kontext gemappte URI)
- Provenienz: Informationen über die Felder in den Quelldaten, aus denen die Information in diesem Feld erzeugt wurde

Die ersten beiden Punkte (Name und Beschreibung) sowie die URI werden bei allen Annotationen angegeben, die anderen Werte sind (noch) nicht vollständig angegeben. Wir versuchen durch Beispielanfragen in den Annotationen ein Gefühl für Möglichkeiten zur Nutzung der API zu vermitteln, insbesondere in den Abschnitten 'Abdeckung' und 'Anwendungsfälle'.

Unter [http://lobid.org/organisations/api]([http://lobid.org/organisations/api/de]) kann man die annotationbasierte Dokumentation in Aktion sehen (für lobid-resources siehe [http://lobid.org/resources/api](http://lobid.org/resources/api)). Im [Abschnitt zu JSON-LD](http://lobid.org/organisations/api#jsonld) öffnet sich durch einen Klick auf die hervorgehobenen JSON-Keys die hypothes.is-Seitenleiste mit Informationen über das entsprechende Element.

![Beispielannotation](images/annotation-example.png)

Beispielannotation für das "type" Feld

### Vorteile

Die Beispiele, die zur Dokumentation annotiert werden, sollten im besten Fall Live-Daten aus dem Produktivsystem sein. So ist gewährleistet, dass bei Änderungen in den Daten das Beispiel, und damit die Dokumentation, automatisch aktuell bleibt. Dies verhindert manuellen Synchronisationsaufwand zwischen Daten und Dokumentation.

Wir hoffen und glauben, dass dieser Ansatz zur Dokumentation nützlicher und angenehmer ist als der traditionelle beschreibende Ansatz. Er bietet Nutzenden eine intuitive und interaktive Schnittstelle um die Daten der lobid-APIs zu erkunden und zu verstehen. Bei Fragen oder Unklarheiten kann innerhalb der hypothes.is-Seitenleiste auf die Annotationen geantwortet werden. So können spezifische Teile der Dokumentation im direkten Kontext derselben diskutiert werden.

## Fallstudie: lobid-gnd

Mit lobid-gnd bietet das hbz eine Schnittstelle zur GND für Mensch und Maschine an. Über [https://lobid.org/gnd](https://lobid.org/gnd) gibt es Zugriff auf alle GND-Entitäten. Da es sich bei lobid-gnd zum einen um den Dienst handelt, der am meisten Menschen interessieren dürfte und zum anden um den letzten lobid-Dienst, der in Version 2 gelauncht wurde, nutzen wir es als Beispiel für eine detaillierte Betrachtung der Möglichkeiten von lobid.

## Die Benutzeroberfläche

## Suche und Navigation

Die Startseite von lobid-gnd führt auf die einfache Suchoberfläche, die unter anderem Boolesche Operatoren, Phrasensuche und Trunkierung unterstützt:

![http://lobid.org/gnd](images/lobid-gnd-suche/1-1-suchen.png)

Nach der Eingabe im Suchfeld kann einer der Vorschläge direkt ausgewählt werden, um zur Detailansicht zu gelangen:

![http://lobid.org/gnd](images/lobid-gnd-suche/1-2-vorschlag-auswahl.png)

Alternativ kann eine Suche über die Enter-Taste oder das Lupen-Icon ausgeführt werden:

![http://lobid.org/gnd](images/lobid-gnd-suche/1-3-vorschlag-suche.png)

Als alternativer Einstieg kann die gesamte GND erkundet werden:

![http://lobid.org/gnd/search](images/lobid-gnd-suche/2-erkunden.png)

Über beide Wege kommt man zur Trefferliste. Über den Treffern auf der linken Seite kann die Anzahl der Treffer pro Seite gewählt werden, darunter kann zwischen den Seiten gewechselt werden:

![http://lobid.org/gnd/search](images/lobid-gnd-suche/3-1-liste-paginierung.png)

Auf der rechten Seite ermöglicht eine facettierte Suche nach Entitätstyp, GND-Sachgruppe, Ländercode und Beruf oder Beschäftigung eine Eingrenzung der Ergebnisse:

![http://lobid.org/gnd/search](images/lobid-gnd-suche/3-2-liste-facetten.png)

Als Standard werden in jeder Facette die fünf häufigsten Einträge angezeigt, weitere Einträge lassen sich ein- und ausblenden:

![http://lobid.org/gnd/search](images/lobid-gnd-suche/4-facetten-einblenden.png)

Entitätstypen sind in Untertypen differenziert:

![http://lobid.org/gnd/search](images/lobid-gnd-suche/5-facetten-untertypen.png)

Über die Auswahl unterschiedlicher Facetten lässt sich die Treffermenge präzise eingrenzen, z.B. zur Anzeige [aller hydrologischen Geografika in Nordrhein-Westfalen](http://lobid.org/gnd/search?filter=%2B(type%3ANaturalGeographicUnit)+%2B(gndSubjectCategory.id%3A%22http%3A%2F%2Fd-nb.info%2Fstandards%2Fvocab%2Fgnd%2Fgnd-sc%2319.3%22)+%2B(geographicAreaCode.id%3A%22http%3A%2F%2Fd-nb.info%2Fstandards%2Fvocab%2Fgnd%2Fgeographic-area-code%23XA-DE-NW%22)):

![http://lobid.org/gnd/search](images/lobid-gnd-suche/6-1-facetten-filter.png)

Erweiterte Suchmöglichkeiten ergeben sich aus einer Kombination von Sucheinstieg über das Suchfeld und facettierter Suche sowie über Mehrfachauswahl innerhalb einer Facette:

![http://lobid.org/gnd/search](images/lobid-gnd-suche/6-2-facetten-filter.png)

Der Klick auf einen Suchtreffer führt zu einer Detailansicht. Die Detailseiten enthalten Links zu verknüpften GND-Einträgen. Über die Lupen-Icons kann eine Suche nach Einträgen mit der gleichen Beziehung angestoßen werden, z.B. [alle Teile der Nordsee](https://lobid.org/gnd/search?q=broaderTermPartitive.id%3A%22http%3A%2F%2Fd-nb.info%2Fgnd%2F4042579-4%22&size=50&format=html):

![http://lobid.org/gnd/4393546-1](images/lobid-gnd-suche/7-1-details-lupe.png)

Die visuelle Darstellung im Tab "Beziehungen" erlaubt ebenso eine Navigation zu den verknüpften Entitäten per Klick auf einen Knoten des Graphs und eine Suche nach weiteren Einträgen mit der gleichen Beziehung per Klick auf eine Kante:

![http://lobid.org/gnd/4393546-1](images/lobid-gnd-suche/7-2-details-kante.png)

Das Piktogramm <img src="http://lobid.org/gnd/assets/images/json-ld.png" alt="JSON-LD-Piktogramm" style="width:16px !important;height:16px !important;"> verweist auf die dem Eintrag zugrundeliegenden strukturierten Daten im Format JSON-LD. Im folgenden wird die Herkunft, Aktualität und Struktur dieser Daten erläutert, um daran anschließend vorzustellen, wie komplexere Suchanfragen formuliert werden können.

## Datengenerierung und Anreicherung

lobid-gnd ist – neben seiner Funktion als Endnutzerschnittstelle – auch eine Maschinenschnittstelle zur GND. Die Endnutzerschnittstelle basiert auf HTML für die Ansicht im Browser, aber ebenso liefern alle HTTP-GET-Anfragen auf Wunsch JSON(-LD) für die maschinelle Verarbeitung etwa durch Anwendungsentwickler. Bevor wir aber näher auf die Web-API (_Application Programming Interface_, deutsch: Anwendungsschnittstelle) eingehen, möchten wir zunächst beschreiben, wie und in welcher Form die GND-Daten indexiert werden.

Die Datenquelle sind die RDF-Daten der GND, die von der Deutschen Nationalbliothek (DNB) [bereitgestellt](http://www.dnb.de/DE/Service/DigitaleDienste/LinkedData/linkeddata_node.html) werden. Das hbz hat Zugriff auf eine OAI-PMH-Schnittstelle der DNB, über die täglich Updates der Daten geholt werden. Diese Daten werden dann für lobid-gnd mit einigen Anpassungen nach JSON-LD konvertiert. Zum Teil waren die Anpassungen durch Inkonsistenzen in den Ausgangsdaten bedingt, was wir zum Anlass genommen haben, Verbesserungen vorzuschlagen.

### Der JSON-LD-Kontext

Die meiste Arbeit zur Optimierung der Datenstruktur übernimmt der JSON-LD-Kontext unter [https://lobid.org/gnd/context.jsonld](https://lobid.org/gnd/context.jsonld). Er bewirkt unter anderem folgende Dinge:

- Der Kontext bestimmt, welche JSON-Keys auf welche RDF-Properties gemappt werden, so dass im JSON nicht lange URIs als Keys angezeigt werden.
- Mit Einträgen wie `"AuthorityResource": "http://d-nb.info/standards/elementset/gnd#AuthorityResource"` werden Typen (`type`) im JSON nicht als umständliche URI, sondern als einfacher String angezeigt, so dass die Daten auch leicht verständlich sind für Entwickler, die bisher nicht viel mit Linked Data gearbeitet haben.
- Mittels `"@container": "@set"` wird festgelegt, dass bis auf wenige Ausnahmen alle Properties ein Array als Wert haben, auch wenn es in einem Eintrag nur ein Element als Wert gibt. Dadurch ist die Datenstruktur homogener und vorhersagbarer. Dies spielt etwa für die Indexierung in Elasticsearch eine Rolle, da hier ein bestimmtes Feld immer den gleichen Datentypen (z.B. Array) haben muss. Auch bei der Nutzung der API erleichtert dies die Verarbeitung, da für ein bestimmtes Feld immer von einem identischen Typ ausgegangen werden kann. Im Zusammenspiel mit der Option [compactArrays](https://json-ld.org/spec/latest/json-ld-api/#dom-jsonldoptions-compactarrays) in JSON-LD ermöglicht dies eine gezielte Konfiguration einzelner Felder.

## Framing

Außerdem nutzen wir einen einfachen JSON-LD Frame (Longley et al. 2018), um das JSON in eine hierarchische JSON-Struktur mit einem Wurzelelement zu bringen. Dieser Frame ist denkbar einfach:

```
{
  "@context": "http://lobid.org/gnd/context.jsonld",
  "@type": "AuthorityResource",
  "@embed": "@always"
}
```

### Homogenisierung von Typen und Label-Properties

Damit das Framing bei jeder GND-Entität funktioniert, muss allen Entitäten der Typ `AuthorityResource` zugewiesen sein. Hier kommen wir zum Punkt, wo wir die Daten der DNB ergänzen, um bestimmte Funktionalitäten zu ermöglichen. Das von der DNB gelieferte [RDF zum Eintrag von Hannah Arendt](https://d-nb.info/gnd/11850391X/about/lds) enthält zum Beispiel folgende Informationen (in Turtle-Notation):

```
@prefix gndo: <http://d-nb.info/standards/elementset/gnd#> .

<http://d-nb.info/gnd/11850391X> a gndo:DifferentiatedPerson ;
  gndo:preferredNameForThePerson "Arendt, Hannah" ;
  gndo:variantNameForThePerson "Blücher, Johanna" .
```

Wie man sieht, wird hier nur die spezifische Klasse (`gndo:DifferentiatedPerson`) angegeben und typspezifische Properties (`gndo:preferredNameForThePerson`, `gndo:variantNameForThePerson`) zur Angabe der Ansetzungs- und Verweisungsformen verwendet. Dies mag für eine Abfrage der Daten über einen SPARQL-Endpoint ausreichend sein, weil die GND-Ontologie (Haffner 2012ff) Informationen zu  Überklassen und -Properties enthält und somit mit Unterstützung von Reasoning auch entsprechende Abfragen funktionieren.

Für eine einheitliche Abfrage der Ansetzungsformen aller GND-Entitäten in einem Suchmaschinenindex bzw. über eine Web-API und die Bereitstellung von Filtermöglichkeiten nach Oberklassen (Person, Schlagwort, Körperschaft, Geografikum etc.) reicht das aber nicht aus. Deshalb verzichten wir zum einen auf die Nutzung der spezifischen Namen-Properties und ergänzen zum anderen  die Überklassen im JSON-LD. So sehen etwa entsprechenden Teile im JSON-LD zu Hannah Arendt in lobid-gnd so aus:

```json
{
  "@context": "http://lobid.org/gnd/context.jsonld",
  "id":"http://d-nb.info/gnd/11850391X",
  "type":[
    "DifferentiatedPerson",
    "AuthorityResource",
    "Person"
  ],
  "preferredName":"Arendt, Hannah",
  "variantName":[
    "Blücher, Johanna"
  ]
}
```

### Labels für verlinkte Ressourcen

Im JSON-LD wird zu jeder in Beziehung gesetzten GND-Ressource sowie zu den GND-Sachgruppen und Ländercodes die entsprechende Ansetzungsform wie in den anderen lobid-Diensten als `label` mitgeliefert. Beim Eintrag zu Hannah Arendt gibt es unter anderen einen Link auf den Sterbeort, auf verschiedene Berufe/Beschäftigungen, auf drei GND-Sachgruppen und auf verwandte Personen. Wo im RDF der GND nur URIs zu finden sind, sieht es in lobid-gnd wie folgt aus:

```json
{
  "@context": "http://lobid.org/gnd/context.jsonld",
  "id":"http://d-nb.info/gnd/11850391X",
  "placeOfDeath":[
    {
      "id":"http://d-nb.info/gnd/4042011-5",
      "label":"New York, NY"
    }
  ],
  "familialRelationship":[
    {
      "id":"http://d-nb.info/gnd/119378418",
      "label":"Blücher, Heinrich"
    },
    {
      "id":"http://d-nb.info/gnd/118502751",
      "label":"Anders, Günther"
    }
  ],
  "gndSubjectCategory":[
    {
      "id":"http://d-nb.info/standards/vocab/gnd/gnd-sc#4.7p",
      "label":"Personen zu Philosophie"
    }
  ],
  "geographicAreaCode":[
    {
      "id":"http://d-nb.info/standards/vocab/gnd/geographic-area-code#XA-DE",
      "label":"Deutschland"
    }
  ]
}
```

Dies ermöglicht es API-Nutzer/innen auf einfache Weise, menschenlesbare Labels anstatt bloße URIs in Anwendungsoberflächen anzuzeigen. Es macht zudem die Suche nach Einträgen mit diesen Labels (z.B. _Schriftsteller_) überhaupt erst möglich wie auch Performance-kritische Anwendungsfälle, bei denen zusätzliche Lookups zu Ermittlung der Labels nicht praktikabel wären. So verwendet etwa die oben beschriebene Vorschlagsfunktion die Labels zum schnellen Auffinden des gesuchten Eintrags.

### Anreicherung mit Links und Bildern aus EntityFacts

Neben dem GND-RDF stellt die DNB mit [EntityFacts](http://www.dnb.de/DE/Service/DigitaleDienste/EntityFacts/entityfacts_node.html) einen Dienst bereit, der einfaches JSON-LD zu Personen, Körperschaften und Geographika aus der GND anbietet, angereichert um Links zu anderen Datenanbietern (Wikidata, ORCID, BnF etc.) sowie zu Abbildungen einer GND-Entität auf Wikimedia Commons. Die Bereitstellung eines Dumps der EntityFacts-Daten seitens der DNB hat uns dazu ermutigt, diese zusätzlichen Informationen in lobid-gnd zu ergänzen. Im Beispiel Hannah Arendt sind dies unter anderem folgende Informationen:

```json
{
  "id":"http://d-nb.info/gnd/11850391X",
  "depiction":[
    {
      "id":"https://commons.wikimedia.org/wiki/Special:FilePath/Hannah_arendt-150x150.jpg",
      "url":"https://commons.wikimedia.org/wiki/File:Hannah_arendt-150x150.jpg?uselang=de",
      "thumbnail":"https://commons.wikimedia.org/wiki/Special:FilePath/Hannah_arendt-150x150.jpg?width=270"
    }
  ],
  "sameAs":[
    {
      "collection":{
        "abbr":"BNF",
        "name":"Bibliothèque nationale de France",
        "publisher":"Bibliothèque nationale de France",
        "icon":"http://www.bnf.fr/bnf_dev/icono/favicon.ico",
        "id":"http://www.wikidata.org/entity/Q19938912"
      },
      "id":"http://catalogue.bnf.fr/ark:/12148/cb118890622"
    },
    {
      "collection":{
        "abbr":"WIKIDATA",
        "name":"Wikidata",
        "publisher":"Wikimedia Foundation Inc.",
        "icon":"https://www.wikidata.org/static/favicon/wikidata.ico",
        "id":"http://www.wikidata.org/entity/Q2013"
      },
      "id":"http://www.wikidata.org/entity/Q60025"
    }
  ]
}
```

Mit diesen Anreicherungen kann auf der Basis von Identifikatoren Dritter in lobid-gnd gesucht werden, etwa anhand einer [ORCID](http://lobid.org/gnd/search?q=%220000-0002-7613-4123%22) oder eines [ISNI](http://lobid.org/gnd/search?q=%220000000114476112%22). Mit den Bildern können Einträge wie z.B. Autorenseiten illustriert werden. Wobei zu beachten ist, dass die Attributions- und Lizenzinformationen zu den Bildern nicht mitgeliefert werden, sondern von der Wikimedia Commons API geladen werden müssen. (Zur Umsetzung siehe z.B. [diesen Kommentar](https://github.com/hbz/lobid-organisations/issues/321#issuecomment-285366696) und unsere [aktuelle Implementierung](https://github.com/hbz/lobid-gnd/blob/580365da19ae5b3264376289480d836adc8894c4/app/controllers/HomeController.java#L355).)

## Web-API

Das im vorherigen Abschnitt beschriebene JSON-LD indexieren wir in einen [Elasticsearch](https://www.elastic.co/de/products/elasticsearch)-Suchmaschinenindex und bieten die Elasticsearch-Abfragesprache für Suchanfragen und zum Filtern an. Somit sind nützliche Elasticsearch-Funktionen für interessierte Nutzer verfügbar wie z.B. Unterstützung der [Lucene Query Language](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html) und `_exists_`-Abfragen. Eine Dokumentation der Elasticsearch `query_string` DSL findet sich [hier](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html). Darauf aufsetzend bieten wir auch einen [Parameter für Auto-Suggest](http://lobid.org/gnd/api#auto-complete), dessen Rückgabefelder bei Bedarf angepasst werden können.

Für eine detaillierte API-Beschreibung verweisen wir auf die Dokumentation unter [https://lobid.org/gnd/api](https://lobid.org/gnd/api).

## Formulierung komplexer Suchanfragen

Oben haben wir bereits die Oberfläche von lobid-gnd und ihre Funktionen wie z.B. einfache Suchen beschrieben. Die API ermöglicht aber auch komplexere Abfragen, für die ein wenig Vertrautheit mit den zugrundeliegenden Datenstrukturen nötig ist. Dies soll nun an einigen Beispielen ausgeführt werden.

### Query-Grundlagen

Bevor wir die Suchmöglichkeiten an einigen Beispielen illustrieren, werden zunächst einige generelle Informationen zur Suche geliefert.

#### Eingabe

Alle Abfragen können wie oben beschrieben über das Suchfeld auf der lobid-gnd-Seite eingegeben werden:

![Screenshot](images/2018-07-06-lobid-gnd-queries/enter-complex-query.png "Query in Eingabefenster")

Die Queries können auch direkt als Teil der URL angegeben und im Browser geöffnet werden:

[http://lobid.org/gnd/search?q=Dom+Köln](http://lobid.org/gnd/search?q=Dom+K%C3%B6ln)

Oder auf der Kommandozeile via curl:

<small>`$ curl "http://lobid.org/gnd/search?q=Dom+K%C3%B6ln"`</small>

#### Default-Sucheinstellungen & boolesche Operatoren

Standardmäßig geht eine im Suchfenster angestoßene Suche über alle Felder. Mehrere Suchterme werden dabei per Default mit einem booleschen `AND` verknüpft. Boolesche Operatoren lassen sich aber auch passgenau für den jeweiligen Zweck angeben. Beispiele:

- <a href="http://lobid.org/gnd/search?q=Dom+AND+(Aachen OR Köln)">Dom UND (Aachen ODER Köln)</a>
- [Geographika in (Äthiopien ODER Eritrea)](http://lobid.org/gnd/search?q=type%3APlaceOrGeographicName+AND+geographicAreaCode.id%3A%28%22http%3A%2F%2Fd-nb.info%2Fstandards%2Fvocab%2Fgnd%2Fgeographic-area-code%23XC-ET%22+OR+%22http%3A%2F%2Fd-nb.info%2Fstandards%2Fvocab%2Fgnd%2Fgeographic-area-code%23XC-ER%22%29)

#### Anzeige der JSON-Daten

In den folgenden Beispielen wird immer wieder auf die strukturierten Daten im Format JSON-LD Bezug genommen, die es für jeden Eintrag in lobid-gnd gibt. Anzeigen lassen sich diese wie folgt:

1. Mit Klick auf das JSON-LD-Zeichen in einer Detailansicht:
[![Screenshot](images/2018-07-06-lobid-gnd-queries/focus-json-ld.png "Hinweis auf Link zum JSON-LD")](http://lobid.org/gnd/11850391X)
2. Durch Anhängen von `.json` an die URL eines Einzeltreffers, z.B. [http://lobid.org/gnd/11850391X.json](http://lobid.org/gnd/11850391X)
3. Der Vollständigkeit halber: **Bei Suchanfragen** muss der Parameter `format=json` angehängt werden, um die gesamte Ergebnisliste als JSON-LD anzuzeigen, z.B. [http://lobid.org/gnd/search?q=hannah+arendt&format=json](http://lobid.org/gnd/search?q=hannah+arendt&format=json). (Alternativ können auch mit dem Parameter `format=jsonl` JSON Lines ausgegeben werden, d.h. pro Zeile ein Eintrag als JSON, z.B. [http://lobid.org/gnd/search?q=hannah+arendt&format=jsonl](http://lobid.org/gnd/search?q=hannah+arendt&format=jsonl)).

Die Bedeutung eines Feldes lässt sich im [JSON-LD-Kontext](https://json-ld.org/spec/latest/json-ld/#the-context) unter [http://lobid.org/gnd/context.jsonld](http://lobid.org/gnd/context.jsonld) nachschlagen. Will ich beispielsweise wissen, wie das Feld `broaderTermPartitive` verwendet wird, dann suche ich im JSON-LD-Kontext nach diesem Feld und folge dem angegebenen Link zur Beschreibung der zugrundeliegenden RDF-Property, hier ist dies die Beschreibung von ["Oberbegriff partitiv"](http://d-nb.info/standards/elementset/gnd#broaderTermPartitive) in der GND-Ontologie.

#### Feldsuchen

Über die `<Feld>:<Suchbegriff>`-Syntax kann in spezifischen Feldern gesucht werden, z.B. nach einer bestimmten Ansetzungsform:

![Screenshot](images/2018-07-06-lobid-gnd-queries/field-search.png "Feldsuche in Eingabefenster")

[http://lobid.org/gnd/search?q=preferredName:"Dom+Köln"](http://lobid.org/gnd/search?q=preferredName:"Dom+K%C3%B6ln")

Will ich ein Feld abfragen, das sich nicht auf der obersten Ebene der geschachtelten JSON-Daten befindet, muss ich es über den Pfad identifizieren, das heißt ich gebe die Felder an, in denen das Feld eingebettet ist. Beispielsweise `professionOrOccupation.label` in folgenden Daten:

```json
{
  "professionOrOccupation": [
    {
      "id": "http://d-nb.info/gnd/4124099-6",
      "label": "Sänger"
    }
  ]
}
```

So kann ich etwa nach [`professionOrOccupation.label:Sänger*`](http://lobid.org/gnd/search?q=professionOrOccupation.label:Sänger*) suchen, wenn ich sowohl männliche wie auch weibliche Vokalist*innen finden möchte.

### Beispiele

#### `_exists_`-Abfragen

Häufig ist es hilfreich herauszufinden, wie viele und welche Einträge überhaupt eine bestimmte Information beinhalten bzw. in wie vielen Einträgen ein bestimmtes Feld fehlt. Dafür kann eine Anfrage in der Form `_exists_:<Feldname>` verwendet werden, optional mit dem booleschen `NOT`, um alle Einträge zu bekommen, die das jeweilige *nicht* haben, z.B. geschlechtslose Geister:

[`http://lobid.org/gnd/search?q=type:Spirits+AND+NOT+_exists_:gender`](http://lobid.org/gnd/search?q=type%3ASpirits+AND+NOT+_exists_%3Agender)

#### Einträge mit Angabe eines Architekten

Beim Betrachten etwa des Eintrags zum [Friedenspark Köln](http://lobid.org/gnd/1065252633) fällt auf, dass ein Architekt angegeben ist. Bei Interesse daran, welche Einträge noch Architekt*innen angeben, lässt sich das wie folgt herausfinden.

Ich schaue zunächst im JSON nach, wie das entsprechende Feld heißt:

```json
{
  "id":"http://d-nb.info/gnd/1065252633",
  "architect":[
    {
      "id":"http://d-nb.info/gnd/118530232",
      "label":"Encke, Fritz"
    }
  ]
}
```

Dann schreibe ich die entsprechende `_exists`-[Anfrage](http://lobid.org/gnd/search?q=_exists_:architect):
![Screenshot](images/2018-07-06-lobid-gnd-queries/architect-query.png "architect-Sucheingabe")

Unterfelder werden wie beschrieben über eine Punkt-Notation angegeben, z.B. Architekten mit dem label "Fritz":
[`architect.label:Fritz`](http://lobid.org/gnd/search?q=architect.label:Fritz)

#### Gleichzeitige Suche in Ansetzungs- und Verweisungsformen

Aus einer E-Mail-Anfrage an das lobid-Team:

> Noch eine Frage habe ich zur API. Kann ich die Suche nach Namen so einschränken, dass ich nach exakten Matches in den `variantName` oder `preferredName` suchen kann?

Das geht über eine Kombination von booleschem OR und Phrasensuche mit `"<Phrase>"` in den entsprechenden Feldern:

[`preferredName:"Muka, Arnošt" OR variantName:"Muka, Arnošt"`](http://lobid.org/gnd/search?q=preferredName%3A%22Muka%2C+Arno%C5%A1t%22+OR+variantName%3A%22Muka%2C+Arno%C5%A1t%22)


#### Suche nach Einträgen mit Wikidata-Link aber ohne Bild

Im Kontext der Anzeige eines zufälligen Bildes auf der [lobid-gnd-Startseite](https://lobid.org/gnd) kam die Frage auf, wie viele und welche Einträge einen Wikidata-Link aber kein Bild haben. Dafür schaue ich mir zunächst am besten die Daten eines Eintrags an der beides hat, z.B. [Hannah Arendt](http://lobid.org/gnd/11850391X.json). Hier die für uns wichtigen Ausschnitte:

```json
{
  "id":"http://d-nb.info/gnd/11850391X",
  "depiction":[
    {
      "id":"https://commons.wikimedia.org/wiki/Special:FilePath/Hannah_arendt-150x150.jpg",
      "url":"https://commons.wikimedia.org/wiki/File:Hannah_arendt-150x150.jpg?uselang=de",
      "thumbnail":"https://commons.wikimedia.org/wiki/Special:FilePath/Hannah_arendt-150x150.jpg?width=270"
    }
  ],
  "sameAs":[
    {
      "collection":{
        "abbr":"WIKIDATA",
        "name":"Wikidata",
        "publisher":"Wikimedia Foundation Inc.",
        "icon":"https://www.wikidata.org/static/favicon/wikidata.ico",
        "id":"http://www.wikidata.org/entity/Q2013"
      },
      "id":"http://www.wikidata.org/entity/Q60025"
    }
  ]
}
```

Die Verlinkung zu Wikidata findet sich innerhalb eines Objekts im `sameAs`-Array. Gekennzeichnet als Wikidata-Verlinkung ist sie durch die angegebene Sammlung (`collection`). Will ich also meine Suche auf Einträge einschränken, die einen Link zu Wikidata haben muss ich nach Einträgen mit der ID `http://www.wikidata.org/entity/Q2013` im Feld `sameAs.collection.id` suchen:

[`sameAs.collection.id:"http://www.wikidata.org/entity/Q2013"`](http://lobid.org/gnd/search?q=sameAs.collection.id:%22http://www.wikidata.org/entity/Q2013%22)

**Hinweis**: Damit die Suche funktioniert muss die Wikidata-URI (`http://www.wikidata.org/entity/Q2013`) in Anführungszeichen gesetzt werden (exakte Phrasensuche).

Wir wollen aber nicht alle Einträge mit Wikidata-Link, sondern nur jene *ohne Bild*. Das heißt wir müssen die Bedingung ergänzen, dass das Feld `depiction` nicht vorhanden ist. Hier kommt uns die oben eingeführte `_exist_`-Anfrage zur Hilfe. Konkret müssen wir zur Suchanfrage `AND NOT _exists_:depiction` ergänzen, so dass am Ende dabei rauskommt:

[`sameAs.collection.id:"http://www.wikidata.org/entity/Q2013" AND NOT _exists_:depiction`](http://lobid.org/gnd/search?q=sameAs.collection.id:"http://www.wikidata.org/entity/Q2013"+AND+NOT+_exists_:depiction)

#### Personen, die während der NS-Zeit in Köln geboren wurden

Wenn ich eine Frage beantworten möchte wie "Welche Personen in der GND wurden in der NS-Zeit in Köln geboren?", dann ist es sinnvoll, sich einen Eintrag zu suchen, der die nötigen Informationen zur Beantwortung einer solchen Frage besitzt. Hier z.B. die strukturierten Daten zum Eintrag von [Konrad Adenauer](http://lobid.org/gnd/11850066X.json), der folgende Informationen zu Geburtsort und -datum enthält:

```json
{
  "id":"http://d-nb.info/gnd/11850066X",
  "placeOfBirth":[
    {
      "id":"http://d-nb.info/gnd/4031483-2",
      "label":"Köln"
    }
  ],
  "dateOfBirth":[
    "1876-01-05"
  ]
}
```

Den ersten Schritt – die Eingrenzung auf in Köln geborene Personen – können wir auf einfache Weise über die Benutzeroberfläche für den Eintrag von [Konrad Adenauer](http://lobid.org/gnd/11850066X) vollziehen: Mit einem Klick auf die Lupe neben "Geburtsort Köln" wird eine Abfrage nach allen in Köln geborenen Menschen in der GND gestartet.

![Screenshot](images/2018-07-06-lobid-gnd-queries/lupe-klick.png "Suche per Lupe")

Jetzt müssen wir die vorhandene Abfrage ([`placeOfBirth.id:"http://d-nb.info/gnd/4031483-2"`](http://lobid.org/gnd/search?q=placeOfBirth.id%3A%22http%3A%2F%2Fd-nb.info%2Fgnd%2F4031483-2%22&format=html)) noch um eine Einschränkung des Geburtsdatums ergänzen. Hier können wir eine [range query](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-query-string-query.html#_ranges) verwenden, die Zeitrahmen mit verschiedenen Detailgraden (Jahr, Monat, Tag etc.) ermöglicht. Für unseren Fall probieren wir zunächst die tagesgenaue Eingrenzung mit `dateOfBirth:[1933-01-30 TO 1945-05-08]`:

[`placeOfBirth.id:"http://d-nb.info/gnd/4031483-2" AND dateOfBirth:[1933-01-30 TO 1945-05-08]`](http://lobid.org/gnd/search?q=placeOfBirth.id%3A%22http%3A%2F%2Fd-nb.info%2Fgnd%2F4031483-2%22+AND+dateOfBirth%3A%5B1933-01-30+TO+1945-05-08%5D)

Ebenfalls möglich ist eine jahresgenaue Abfrage (enthält hier auch Geburtsdaten im Jahr 1933 vor dem 30.1. und im Jahr 1945 nach dem 8.5.):

[`placeOfBirth.id:"http://d-nb.info/gnd/4031483-2" AND dateOfBirth:[1933 TO 1945]`](http://lobid.org/gnd/search?q=placeOfBirth.id%3A%22http%3A%2F%2Fd-nb.info%2Fgnd%2F4031483-2%22+AND+dateOfBirth%3A%5B1933+TO+1945%5D)

Je nach Zweck kann die eine oder andere Abfrage sinnvoller sein.

#### Vollständige Query-Syntax

lobid-gnd ist auf Basis von [Elasticsearch](https://de.wikipedia.org/wiki/Elasticsearch) umgesetzt. Wir verweisen hier auf die vollständige Dokumentation der [Elasticsearch Query String Syntax](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-query-string-query.html#query-string-syntax) sowie der [Apache Lucene Query Syntax](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html). (Elasticsearch basiert auf [Apache Lucene](https://de.wikipedia.org/wiki/Apache_Lucene).)

## Bulk Downloads, OpenRefine-API und mehr

Letzte Woche haben wir einige Funktionen zu lobid-gnd ergänzt, hier ein Überblick.

### Zufälliges Bild auf der Startseite

Wie auch in [lobid-organisations](https://lobid.org/organisations) wird nun auf der [lobid-gnd-Startseite](https://lobid.org/gnd) mit jedem Laden ein zufälliges Bild zu einer GND-Ressource angezeigt. Momentan gibt es [knapp 200.000 Einträge mit Bild](http://lobid.org/gnd/search?q=_exists_%3Adepiction), davon sind die meisten Personen. Wer also Lust hat, die GND ein wenig näher kennenzulernen, kann ja mal die Startseite ein paar Mal neu laden.

[![Screenshot](images/sendler.png "lobid-gnd homepage")](https://lobid.org/gnd)
 <small>Screenshot der lobid-gnd-Startseite mit dem Bild von [Irena Sendler](http://lobid.org/gnd/129335290)</small>

### Bulk Downloads

Für jede lobid-gnd-Abfrage kann jetzt – wie auch in lobid-resources – die gesamte Ergebnismenge als JSON Lines heruntergeladen werden, indem einach der Parameter `format=jsonl` ergänzt wird. Im Antwortformat wird dann pro Zeile ein GND-Eintrag zurückgeliefert, zum Beispiel alle GND-Entitäten vom Typ "Sammlung" (Unterklasse von "Werk"):

[http://lobid.org/gnd/search?filter=type:Collection&format=jsonl](http://lobid.org/gnd/search?filter=type:Collection&format=jsonl)

Bei solchen kleineren Ergebnismengen reicht der JSON-Lines-Download aus, werden größere Untermengen der GND abgefragt, empfiehlt es sich, das Ergebnis komprimiert als gzip herunterzuladen. Dafür muss der HTTP-Anfrage nur der entsprechende Accept-Header mitgegeben werden, z.B. mit curl:

`$ curl --header "Accept-Encoding: gzip" 'http://lobid.org/gnd/search?filter=type:Collection&format=jsonl'`

### OpenRefine Reconciliation API

Seit Ende letzter Woche ist die OpenRefine Reconciliation API für lobid-gnd produktiv. Damit ist es auf einfache Weise möglich, mit dem für Datenaufbereitung und -anreicherung beliebten Werkzeug [OpenRefine](http://openrefine.org/) eine Liste von Ansetzungsformen mit der GND abzugleichen, um die Textstrings auf GND-IDs zu matchen. Dafür müssen lediglich die abzugleichenden Daten in OpenRefine geladen werden, die entsprechende Spalte ausgewählt und der Reconciliation-Prozess z.B. wie folgt durchgeführt werden.

1.Start des Reconciliation-Prozesses für eine Spalte in OpenRefine
![Screenshot](images/start-reconciling.png "start reconciling")
2. Ergänzen des lobid-gnd Reconciliation Endpoints (`https://lobid.org/gnd/reconcile`) in OpenRefine
![Screenshot](images/add-lobid-gnd-to-openrefine.png "ergänze lobid-gnd reconciliation API")
3. (Optionale) Auswahl einer GND-Untermenge (hier "Person") für Reconciliation
![Screenshot](images/choose-type-for-reconciliation.png "Typ-Auswahl")
4. Start der API-Abfrage mit Klick auf "Start Reconciling"

# Referenzen

Ewertowski, Christoph / Pohl, Adrian (2017): Which vocabularies to use for bibliographic descriptions? Blogpost verfügbar unter [http://blog.lobid.org/2017/04/19/vocabulary-choices.html](http://blog.lobid.org/2017/04/19/vocabulary-choices.html)

Gruenbaum, Peter (2010): Web API Documentation Best Practices. Blogpost verfügbar unter [https://www.programmableweb.com/news/web-api-documentation-best-practices/2010/08/12](https://www.programmableweb.com/news/web-api-documentation-best-practices/2010/08/12)

Haffner, Alexander (2012ff): GND Ontology. URL: [http://d-nb.info/standards/elementset/gnd](http://d-nb.info/standards/elementset/gnd)

Longley, Dave et al. (2018): JSON-LD 1.1 Framing – An Application Programming Interface for the JSON-LD Syntax. URL: [https://json-ld.org/spec/latest/json-ld-framing/](https://json-ld.org/spec/latest/json-ld-framing/)

Lóscio, Bernadette Farias et al. (2017): Data on the Web Best Practices. W3C Recommendation verfügbar unter https://www.w3.org/TR/dwbp/. Hier insbesondere Abschnitt "8.2 Metadata": [https://www.w3.org/TR/dwbp/#metadata](https://www.w3.org/TR/dwbp/#metadata)

Sporny, Manu et al. (2014): JSON-LD 1.0. A JSON-based Serialization for Linked Data. W3C Recommendation verfügbar unter [https://www.w3.org/TR/2014/REC-json-ld-20140116/](https://www.w3.org/TR/2014/REC-json-ld-20140116/)

Steeg, Fabian (2015a): Why LOD needs applications, and libraries need APIs. Blogpost verfügbar unter [http://fsteeg.com/notes/why-lod-needs-applications-and-libraries-need-apis](http://fsteeg.com/notes/why-lod-needs-applications-and-libraries-need-apis)

Steeg, Fabian (2015b): More self-containedness, less code sharing. Blogpost verfügbar unter [http://fsteeg.com/notes/more-self-containedness-less-code-sharing](http://fsteeg.com/notes/more-self-containedness-less-code-sharing).