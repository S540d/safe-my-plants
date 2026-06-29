# Tagesabschluss: Aufräumen und Synchronisieren

Führe den täglichen Cleanup-Workflow durch:

## 0. Branch-Übersicht: testing vs. main (alle Repos)

Erstelle zu Beginn eine Tabelle aller Repositories mit dem Stand von `testing` gegenüber `main`:

```bash
for repo in Eisenhauer 1x1_Trainer DrawFromMemory EnergyPriceGermany Pflanzkalender safe_my_plants CD-to-Spotify-PWA project-templates; do
  dir="/Users/svenstrohkark/Documents/Programmierung/Projects/$repo"
  if [ -d "$dir/.git" ]; then
    cd "$dir"
    git fetch --all --prune -q 2>/dev/null
    ab=$(git rev-list --left-right --count origin/main...origin/testing 2>/dev/null)
    main_ahead=$(echo $ab | awk '{print $1}')
    test_ahead=$(echo $ab | awk '{print $2}')
    echo "$repo | testing +$test_ahead | main +$main_ahead"
  fi
done
```

Zeige das Ergebnis als Markdown-Tabelle:

| Projekt | testing ahead | main ahead | Status |
|---|---|---|---|
| ... | ... | ... | ✅ OK / ⚠️ Leicht divergiert / 🔴 main voraus |

**Statusregeln:**
- ✅ OK — main_ahead = 0 (testing enthält main vollständig)
- ⚠️ Leicht divergiert — main_ahead ≤ 3 und nur Auto-Commits (z.B. marketdata)
- 🔴 main voraus — main_ahead > 0 mit echten Commits → Sync-PR nötig


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
