# Google Play Store – Listing-Vorlage

> Arbeitsvorlage für den Play-Console-Eintrag von **Safe My Plants**.
> Felder mit `TODO` vor dem Upload ausfüllen. Marketing-Texte bewusst offline-/datenschutz-lastig,
> weil das ein zentrales Alleinstellungsmerkmal ist.

## 1. App-Details

| Feld | Wert |
|------|------|
| App-Name (max. 30 Zeichen) | `Safe My Plants` |
| Package-Name | `io.github.s540d.safemyplants` |
| Standardsprache | Deutsch (Deutschland) |
| Weitere Sprachen | Englisch (USA) |
| Kategorie | Lifestyle _(Alternative: Tools / Bildung)_ |
| Tags | Pflanzenpflege, Zimmerpflanzen, Gießerinnerung, Offline |
| Kontakt-E-Mail | `DevSven@posteo.de` |
| Website | `https://s540d.github.io/safe-my-plants` |
| Datenschutzerklärung (URL) | TODO: gehostete URL der `PRIVACY_POLICY.md` (z. B. GitHub Pages) |

## 2. Kurzbeschreibung (max. 80 Zeichen)

- **DE:** `Deine Zimmerpflanzen im Blick: Gieß- & Dünge-Ampel, Fotos, komplett offline.`
- **EN:** `Keep your houseplants healthy: watering & feeding traffic-light, fully offline.`

## 3. Vollständige Beschreibung (max. 4000 Zeichen)

### DE

```
Safe My Plants ist dein persönlicher Begleiter für gesunde Zimmerpflanzen –
komplett offline, ohne Konto und ohne Werbung.

🚦 AMPEL-SYSTEM
Auf einen Blick sehen, welche Pflanze Wasser oder Dünger braucht.
Grün = alles gut, Gelb = bald fällig, Rot = überfällig.

🪴 DEINE PFLANZEN, DEINE DATEN
Lege Pflanzen mit Fotos, Standort, Klima-Anforderungen und Pflegehinweisen an.
Alles bleibt lokal auf deinem Gerät.

📊 PFLEGE-VERLAUF & STATISTIK
Jede Gieß- und Dünge-Aktion wird protokolliert. Behalte deine Serie („Streak")
im Blick und sieh, wie zuverlässig du deine Pflanzen versorgst.

🔔 ERINNERUNGEN
Optionale, lokale Benachrichtigungen, wenn eine Pflanze dran ist.

🦠 KRANKHEITEN ERKENNEN
Symptome und Behandlungshinweise pro Pflanze hinterlegen.

✨ WEITERE FEATURES
• Foto-Galerie pro Pflanze
• Notizen
• Suche, Filter & Sortierung
• Vorlagen für häufige Zimmerpflanzen
• Export & Import deiner Daten (JSON)
• Deutsch & Englisch
• Heller & dunkler Modus

🔒 DATENSCHUTZ ZUERST
Keine Accounts. Keine Cloud. Keine Werbung. Kein Tracking.
Die App funktioniert vollständig ohne Internetverbindung.
```

### EN

```
TODO: Übersetzung analog zur DE-Fassung.
```

## 4. Grafische Assets (Anforderungen)

| Asset | Format / Größe | Status |
|-------|----------------|--------|
| App-Icon | 512 × 512 px, 32-bit PNG | ⚠️ aus `assets/icon.png` ableiten |
| Feature-Grafik | 1024 × 500 px | TODO |
| Smartphone-Screenshots | 2–8 Stück, min. 1080 px Kante | TODO |
| 7"-Tablet-Screenshots (optional) | min. 1080 px | TODO |
| 10"-Tablet-Screenshots (optional) | min. 1080 px | TODO |
| Werbevideo (optional, YouTube-Link) | – | – |

**Screenshot-Set (Vorschlag):** Hauptübersicht mit Ampel · Pflanzendetail · Pflege-Verlauf/Statistik ·
Erinnerungen · Dark Mode · Krankheitsansicht.

## 5. Data Safety / Datensicherheit (Play-Formular)

| Frage | Antwort |
|-------|---------|
| Werden Nutzerdaten erhoben oder geteilt? | **Nein** |
| Werden Daten verschlüsselt übertragen? | Entfällt (keine Übertragung) |
| Können Nutzer Löschung anfordern? | Alle Daten lokal, jederzeit in der App löschbar |
| Kamera-Zugriff | Nur lokal, für Pflanzenfotos – keine Übertragung |

## 6. Inhaltseinstufung (Content Rating / IARC)

- Fragebogen ausfüllen → erwartete Einstufung: **USK 0 / PEGI 3 / Everyone**.
- Keine Gewalt, keine Käufe, keine Nutzergenerierten Online-Inhalte, keine Werbung.

## 7. Zielgruppe & Inhalte

- Zielaltersgruppe: **allgemein / ab 13** (keine speziell an Kinder gerichtete App).
- Keine In-App-Käufe, keine Werbung.

## 8. Release-Checkliste (Kurz)

- [ ] Signierte **AAB** mit `./gradlew bundleRelease` erzeugt (Play App Signing)
- [ ] `versionCode` erhöht, `version` (Name) gesetzt
- [ ] Datenschutz-URL erreichbar
- [ ] Data-Safety-Formular ausgefüllt
- [ ] Content-Rating-Fragebogen abgeschlossen
- [ ] Screenshots + Feature-Grafik hochgeladen
- [ ] Interner Test-Track vor Produktion
