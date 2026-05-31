# Tagesabschluss: Aufräumen und Synchronisieren

Führe den täglichen Cleanup-Workflow durch:

## 1. Repository Status prüfen

- Prüfe `git status` für uncommitted changes
- Liste alle lokalen Branches
- Prüfe ob `main` mit `origin/main` synchron ist

## 2. Branches aufräumen

- Liste alle merged Feature Branches (lokal und remote)
- Benennungsschema: `feature/<name>` oder `claude/<feature>-<hash>`
- Frage ob diese gelöscht werden sollen
- Lösche approved Branches

## 3. Branch-Sync prüfen

- Prüfe ob `testing` ≥ `main` (gleicher oder neuerer Commit)
- Falls testing hinter main: Weise darauf hin
- Zeige letzten Commit auf beiden Branches

## 4. GitHub Actions Status

- Liste letzte 5 Workflow Runs für `ci.yml`
- Zeige Failed Runs falls vorhanden

## 5. Open Pull Requests

- Liste alle offenen PRs
- Zeige Status (CI grün? Mergeable?)
- Weise auf alte PRs hin (>7 Tage)

## 6. Issues Management

- Liste offene Issues (nach Priorität)
- Zeige heute geschlossene Issues

## 7. Dependencies & Security

- Prüfe auf Security Vulnerabilities: `npm audit`
- Zeige outdated packages: `npm outdated`
- Weise auf kritische Updates hin

## 8. Sync & Push

- Hole neueste Änderungen von origin
- Zeige finale Status-Zusammenfassung

## 9. Zusammenfassung

Erstelle eine kurze Zusammenfassung:

- Anzahl gelöschter Branches
- Status der Branches (main / testing)
- Offene PRs und Issues
- Nächste TODOs für morgen
