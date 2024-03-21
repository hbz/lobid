---
slug: "/usage-policy"
title: "Richtlinien einer rücksichtsvollen lobid-Nutzung"
---

## Herzlich willkommen liebe:r lobid-Nutzer:in!

Schön, dass du dich für lobid interessierst. Wir bemühen uns, die Verwendung von lobid möglichst einfach zu gestalten und verschiedenste Nutzungskontexte zu unterstützen. Neben der Bereitstellung offener und freier Daten haben wir versucht, diese nutzer:innenorientiert zu modellieren und strukturieren. Offene, intuitive Schnittstellen und die Unterstützung der standardisierten [Reconciliation API](https://reconciliation-api.github.io/specs/latest/) sowie eine gute Dokumentation zielen ebenfalls auf eine leichte Nutzung ab.

Damit wir diesen Dienst auch weiterhin so zuverlässig, aktuell und in hoher Qualität anbieten können, bitten wir um einen rücksichts- und respektvollen Umgang mit Daten und Schnittstellen. Im Folgenden formulieren wir einige Leitlinien, an denen sich Nutzer:innen der lobid-API orientieren können. Es handelt sich nicht um verbindliche Vorschriften, sondern vielmehr um Anregungen, die ein faires Miteinander garantieren sollen.

## lobid als Datenquelle nennen

Die lobid-Daten sind CC0-lizenziert, d. h. die Verwendung der Daten ist an keinerlei Auflagen oder Bedingungen geknüpft. Urheber:innen, die ihre geschützten Inhalte unter [CC0](https://creativecommons.org/publicdomain/zero/1.0/) veröffentlichen, signalisieren damit den Nachnutzenden, dass mit der Verwendung der Inhalte keine urheberrechtlichen Konsequenzen verbunden sind bzw. die Verwertungs- und Schutzrechte der Urheber:innen nicht wahrgenommen werden. Es besteht insbesondere keine Verpflichtung, die Urheberschaft der Daten zu kennzeichnen. Dennoch begrüßen wir es, wenn lobid als Datenquelle genannt wird. Das ermöglicht eine größere Sichtbarkeit der lobid-Dienste und erleichtert im Gegenzug die Aufrechterhaltung des Angebots, weil es die Relevanz offener Daten und offen zugänglicher Schnittstellen gegenüber Geldgeber:innen und Entscheider:innen verdeutlicht.

Je nach Art der Nutzung existieren unterschiedliche Möglichkeiten der Quellenangabe. Wir empfehlen einen knappen Hinweis in der Art "powered by lobid data", "verwendet lobid-Daten" o. ä. in Verbindung mit einer Verlinkung zu [lobid.org](https://lobid.org/). Wir freuen uns auch über die Nutzung des lobid-Logos für die Quellenangabe.

> Text-Beispiel
>
> ```html
> <a href="https://lobid.org/" title="verwendet lobid-Daten">
>   verwendet lobid-Daten
> </a>
> ```

> Logo-Beispiel
>
> ```html
> <a href="https://lobid.org/" title="powered by lobid data">
>    powered by <img src="https://lobid.org/images/lobid.png"
>    alt="lobid-Logo" width="110" height="32"/></a>
> ```

## Feedback geben

Uns interessieren der Umfang und die Anwendungskontexte, in denen unsere Schnittstellen und Daten Verwendung finden. Deshalb freuen wir uns über jede Mitteilung zur Nutzung der lobid-Dienste, gerne auch mit Verweis auf die Publikationen oder Angebote, in die die Daten eingeflossen sind. Das erleichtert uns nicht nur wiederum die Begründung der Relevanz freier Daten und offener Schnittstellen, sondern ermöglicht auch eine vorausschauende Entwicklungsplanung der lobid-Dienste mit Blick auf besonders häufig nachgefragte Nutzungskontexte oder Datensichten. Feedback kann am besten per E-Mail an [lobid-admin@hbz-nrw.de](mailto:lobid-admin@hbz-nrw.de) oder per [GitHub issue](https://github.com/hbz/lobid/issues/new) gegeben werden.

Wir freuen uns auch über Feedback, sollten bei den angebotenen Daten oder Schnittstellen Probleme auftreten. Sollte zum Beispiel die Performanz unserer Server nicht ausreichend sein, so freuen wir uns über eine Mitteilung (möglichst mit genauer Datumsangabe der Abfragen), um ein günstigeres Zeitfenster verabreden und unseren Servern ggf. weitere Ressourcen zur Verfügung stellen zu können.

## Technische Hinweise zur lobid-Nutzung

Damit wir die lobid APIs allen Interessierten zuverlässig und performant bereitstellen können, bitten wir darum, die Belastung unserer Infrastruktur auf das notwendige Maß zu beschränken. Insbesondere empfehlen wir folgende Maßnahmen, die gleichzeitig zur Performancesteigerung lokaler Anwendungen beitragen.

### Mit der Dokumentation vertraut machen

lobid bietet eine Vielzahl von APIs zu den drei Datensammlungen an. Wir empfehlen, vor der Implementierung einer Anwendung, die lobid-Schnittstellen verwendet, die relevante Dokumentation ([lobid-resources](https://lobid.org/resources/api), [lobid-organisatons](https://lobid.org/organisations/api), [lobid-gnd](https://lobid.org/gnd/api)) zu konsultieren. Diese enthalten auch Anwendungsbeispiele und erläuternde Hinweise zur möglichst effizienten Nutzung der Schnittstellen. In einigen Anwendungsfällen existieren bereits weiterführende Funktionen oder Schnittstellen (beispielsweise die [Reconciliation-API für lobid-gnd](https://lobid.org/gnd/reconcile)), die den clientseitigen Implementierungsaufwand verringern können.

### Rate Limiting & Vermeiden von Hochlastphasen

Um allen Anwendenden der lobid-Schnittstellen einen gleichermaßen performanten und stabilen Dienst anbieten zu können, bitten wir generell um die Limitierung der Schnittstellenanfragen auf maximal 6000 Abrufe pro Minute für einfache Lookups und bis zu 30 pro Minute für komplexere Suchanfragen (z.B. Wildcard-Suchen). Hochfrequente Abfragen (z. B. Harvesting) und Datenabzüge (Bulk Downloads) sollten in nutzungsschwachen Zeiten erfolgen, etwa nachts oder an Wochenenden und Feiertagen.

### User Agent setzen

Wir bitten darum, bei der Nutzung von lobid eine aussagekräftige, wiederkehrende Zeichenkette als User Agent mitzusenden, damit wir bei der statistischen Auswertung unserer Infrastruktur Nutzungsweisen der API erkennen und unsere Dienstleistungen aus den gewonnenen Erkenntnissen verbessern können. Die statistische Erfassung der Nutzung dient außerdem der Begründung der Relevanz unserer Daten und Dienste gegenüber Geldgeber:innen und Entscheider:innen. In der Zeichenkette des User Agent kann sich die zugreifende Person, Institution oder ein Projekt zu erkennen geben, gegebenenfalls auch eine Kontaktmöglichkeit (E-Mail-Adresse) hinzufügen, eine anonyme beziehungsweise pseudonyme Kennung ist jedoch ebenso möglich. Eine solche Agent-Kennung sollte über die Dauer eines Projektes möglichst unverändert bleiben.

> Abfrage eines GND-Datensatzes mittels cURL
>
> ```bash
> curl -A "Mein Projekt; mailto:meinprojekt@example.org" https://lobid.org/gnd/4074335-4.json
> ```

> Abfrage eines GND-Datensatzes in Javascript/Node.js
>
> ```javascript
> const axios = require('axios');
> const result = async () => {
>   res = await axios.get('http://lobid.org/gnd/4074335-4.json', {
>     headers: { 'User-Agent': 'Mein Projekt; mailto:meinprojekt@example.org' }
>   });
>   console.log(res.data);
> }
> result();
> ```

### Datenabzüge statt API-Anfragen

In manchen Anwendungsfällen kann die Nutzung von Datenabzügen anstelle von API-Abfragen vorteilhaft sein. Wenn beispielsweise regelmäßig größere Datenmengen abgefragt werden oder wiederholt eine größere Anzahl von Einzelabfragen erfolgt, bietet sich die Verwendung lokal vorgehaltener Datenabzüge an. Dies entlastet unsere Infrastruktur und beschleunigt lokale Anwendungen.

Solche Datenabzüge können als sogenannte Bulk Downloads ebenfalls über die APIs bezogen werden. Für die Datenquellen lobid-gnd und lobid-resources erfolgt dies über den Parameter `format=jsonl`, bei lobid-organisations auch über den Parameter `format=bulk`. Werden größere Datenmengen abgefragt, empfiehlt es sich, das Ergebnis komprimiert herunterzuladen. Dafür muss der HTTP-Anfrage der entsprechende Accept-Header mitgegeben werden.

> Komprimierte Abfrage aller Sammlungen in der GND mittels cURL
>
> ```bash
> curl --header "Accept-Encoding: gzip" "http://lobid.org/gnd/search?filter=type:Collection&format=jsonl" > collections.gz
> ```

### Caching

Die Ergebnisse sich wiederholender, gleichartiger Anfragen sollten clientseitig in einem Zwischenspeicher abgelegt und anstelle erneuter Anfragen an die API nachgenutzt werden. Dies entlastet nicht nur unsere Infrastruktur, es führt in vielen Fällen auch zu einer Beschleunigung clientseitiger Anwendungen, die Daten aus einem Cache meist schneller beziehen können als wiederholt die Beantwortung von API-Anfragen abwarten zu müssen.

Da die Daten der lobid-Schnittstellen nur alle 24 Stunden aktualisiert werden, kann auch die Cache-Dauer entsprechend großzügig gewählt werden. Wir empfehlen eine Cache-Dauer von mindestens 12 Stunden.

#### Caching auf Anwendungsebene

Das Caching kann beispielsweise direkt innerhalb der Applikation erfolgen, in dem die Ergebnisse von API-Abfragen in Variablen oder temporären Speichern abgelegt werden. Vor erneuten API-Abfragen kann dann geprüft werden, ob für die spezifische Anfrage bereits ein Ergebnis im Cache vorliegt. Für fortgeschrittene Anwendungsfälle empfehlen sich Caching-Komponenten auf der Basis entsprechender Softwarelösungen wie Redis oder Memcached.

> Einfaches Caching in Python ohne Error-Handling und ohne Cache-Dauer
>
> ```python
> import requests
> cache={}
> def getCached(url):
>     if url in cache:
>         print("returning cached %s" % url)
>         return cache[url]
>     response = requests.get(url)
>     cache[url]=response.json()
>     print("returning fresh %s" % url)
>     return cache[url]
> getCached("https://lobid.org/gnd/4074335-4.json")
> getCached("https://lobid.org/gnd/4074335-4.json")
> getCached("https://lobid.org/gnd/4074335-4.json")
> ```

#### Caching mittels Proxyserver

Auch die Nutzung separater HTTP-Proxyserver, wie beispielsweise Squid, ist denkbar. Zu beachten ist hier jedoch, dass HTTPS-Verbindungen nicht ohne weiteres gecached werden können. Hierfür ist eine aufwändige Konfiguration des Proxyservers unter Auftrennung der SSL-Verbindungen im Proxy erforderlich. Die Ressourcen in lobid sind jedoch auch per HTTP ansprechbar.

> Squid-Konfiguration für ein Cache-Mindestdauer von 12 Stunden und einem Maximum von 24 Stunden
>
> ```
> cache_dir ufs /var/spool/squid/ 1024 16 256
> refresh_pattern -i lobid.org/.* 720 100% 1440
> cache_mem 512 MB
> minimum_object_size 0 bytes
> maximum_object_size 10 MB
> maximum_object_size_in_memory 512 KB
> ```
>
> Abruf eines GND-Datensatzes über Squid auf dessen Standard-Port
>
> ```bash
> curl -x localhost:3128 http://lobid.org/gnd/4074335-4.json
> ```

## Informationen zur Gewährleistung
Informationen zur Gewährleistung finden Sie [hier](http://lobid.org/warranty).