Führe den vollständigen PR-Workflow für den aktuellen Branch aus:

## 1. Testing aktuell?

```bash
git fetch origin testing
git log HEAD..origin/testing --oneline
```

Falls `origin/testing` Commits enthält, die dieser Branch nicht hat: Rebase auf `origin/testing` anbieten und auf Antwort warten bevor du fortfährst.

## 2. PR erstellen

- Basis **immer** `testing`, niemals `main`
- Titel: Conventional Commit Format (`feat`/`fix`/`chore`/`docs` + kurzer Scope)
- Body: Was ändert sich + Checkliste der wichtigsten Punkte

## 3. PR überwachen

`subscribe_pr_activity` aufrufen, dann jeden eingehenden Event behandeln:

- **CI schlägt fehl** → Fehler analysieren, fixen, pushen, weiterwarten
- **Copilot-Review** → alle Suggestions lesen:
  - Kleine, eindeutige Verbesserungen: umsetzen und pushen
  - Größere Umbauten oder Unklarheiten: beim User nachfragen bevor du handelst
- **Alle Checks grün + kein offener Review** → Merge durchführen

## 4. Memory aktualisieren

Nach erfolgreichem Merge `.claude/memory.md` aktualisieren:
- Neue oder verschobene Dateipfade
- Geänderte Abhängigkeiten
- Neue Architekturentscheidungen
- Versionsstempel aktualisieren

---

**Unveränderliche Regeln:**
- PR-Ziel ist immer `testing`
- Niemals nach `main` mergen
- Nicht mergen bei rotem CI
- Keine großen Refactorings ohne Rückfrage
