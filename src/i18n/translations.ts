export type Language = 'de' | 'en'

const translations = {
  de: {
    // Navigation
    nav_home: 'Meine Pflanzen',
    nav_admin: 'Admin',
    nav_settings: 'Einstellungen',

    // Home Screen
    home_title: 'Meine Pflanzen',
    home_empty: 'Noch keine Pflanzen vorhanden.\nFüge deine erste Pflanze im Admin-Bereich hinzu.',
    home_care_ok: 'Alles gut',
    home_care_soon: 'Bald fällig',
    home_care_overdue: 'Überfällig',
    home_watering: 'Gießen',
    home_fertilizing: 'Düngen',

    // Detail Screen
    detail_care_info: 'Pflegehinweise',
    detail_watering: 'Gießen',
    detail_fertilizing: 'Düngen',
    detail_location: 'Standort',
    detail_temperature: 'Temperatur',
    detail_humidity: 'Luftfeuchtigkeit',
    detail_diseases: 'Krankheiten & Schädlinge',
    detail_photos: 'Fotos',
    detail_quick_actions: 'Schnellaktionen',
    detail_last_watered: 'Zuletzt gegossen',
    detail_last_fertilized: 'Zuletzt gedüngt',
    detail_mark_watered: 'Jetzt gegossen',
    detail_mark_fertilized: 'Jetzt gedüngt',
    detail_never: 'Noch nie',
    detail_symptoms: 'Symptome',
    detail_treatment: 'Behandlung',

    // Admin Screen
    admin_title: 'Admin',
    admin_pin_title: 'Admin-PIN',
    admin_pin_prompt: 'PIN eingeben',
    admin_pin_wrong: 'Falsche PIN',
    admin_pin_set: 'PIN festlegen',
    admin_pin_confirm: 'PIN bestätigen',
    admin_pin_mismatch: 'PINs stimmen nicht überein',
    admin_add_plant: 'Pflanze hinzufügen',
    admin_edit_plant: 'Pflanze bearbeiten',
    admin_delete_plant: 'Pflanze löschen',
    admin_delete_confirm: 'Pflanze wirklich löschen?',
    admin_name: 'Name',
    admin_scientific_name: 'Wissenschaftlicher Name (optional)',
    admin_description: 'Beschreibung',
    admin_location: 'Standort',
    admin_watering_freq: 'Gießintervall (Tage)',
    admin_watering_tips: 'Gießtipps',
    admin_fertilizing_freq: 'Düngintervall (Tage)',
    admin_fertilizing_tips: 'Düngetipps',
    admin_location_tips: 'Standorttipps',
    admin_temp_min: 'Temperatur min (°C)',
    admin_temp_max: 'Temperatur max (°C)',
    admin_humidity: 'Luftfeuchtigkeit',
    admin_add_disease: 'Krankheit hinzufügen',
    admin_disease_name: 'Krankheitsname',
    admin_disease_symptoms: 'Symptome',
    admin_disease_treatment: 'Behandlung',
    admin_save: 'Speichern',
    admin_cancel: 'Abbrechen',
    admin_add_photo: 'Foto hinzufügen',
    admin_plant_list: 'Pflanzenliste',

    // Location
    location_sun: 'Sonne',
    location_partial_shade: 'Halbschatten',
    location_shade: 'Schatten',
    location_indoor: 'Innenraum',

    // Humidity
    humidity_low: 'Niedrig',
    humidity_medium: 'Mittel',
    humidity_high: 'Hoch',

    // Settings
    settings_title: 'Einstellungen',
    settings_theme: 'Erscheinungsbild',
    settings_theme_light: 'Hell',
    settings_theme_dark: 'Dunkel',
    settings_theme_system: 'System',
    settings_language: 'Sprache',
    settings_language_de: 'Deutsch',
    settings_language_en: 'English',
    settings_admin: 'Admin-Bereich',
    settings_admin_change_pin: 'PIN ändern',
    settings_about: 'Über die App',
    settings_version: 'Version',

    // Dashboard
    dashboard_due_today: 'Überfällig',
    dashboard_this_week: 'Bald fällig',
    dashboard_all_good: 'Alles ok',

    // Hero Card
    hero_featured: 'Braucht Aufmerksamkeit',
    hero_water: 'Gegossen',
    hero_fertilize: 'Gedüngt',

    // CareAction Types
    care_action_water: 'Gegossen',
    care_action_fertilize: 'Gedüngt',
    care_action_repot: 'Umgetopft',
    care_action_prune: 'Geschnitten',
    care_action_note: 'Notiz',

    // Search & Filter
    search_placeholder: 'Pflanze suchen …',
    filter_all: 'Alle',
    sort_name: 'Name A–Z',
    sort_next_care: 'Nächste Pflege',
    sort_recent: 'Zuletzt hinzugefügt',
    filter_no_results: 'Keine Pflanzen für diese Filter.',

    // Reminder Banner
    reminder_singular: '1 Pflanze braucht Pflege',
    reminder_plural: '{{n}} Pflanzen brauchen Pflege',
    reminder_tap: 'Tippen zum Anzeigen',

    // Notifications
    settings_notifications: 'Erinnerungen',
    settings_notifications_enable: 'Tägliche Erinnerung',
    settings_notifications_time: 'Uhrzeit',
    settings_notifications_permission_denied: 'Berechtigung verweigert. Bitte in den Systemeinstellungen aktivieren.',
    settings_notifications_saved: 'Erinnerung gespeichert',
    notification_channel_name: 'Pflege-Erinnerungen',
    notification_body: 'Schau nach deinen Pflanzen – vielleicht braucht eine heute Pflege!',

    // Data / Export-Import
    settings_data: 'Daten',
    settings_export: 'Daten exportieren',
    settings_import: 'Daten importieren',
    settings_export_success: 'Backup gespeichert',
    settings_import_success: '{{n}} Pflanze(n) importiert',
    settings_import_skipped: '{{n}} bereits vorhanden (übersprungen)',
    settings_import_confirm: 'Bestehende Daten werden ergänzt, nicht ersetzt.',
    settings_import_error: 'Ungültige Backup-Datei.',

    // Stats Screen
    stats_title: 'Statistiken',
    stats_streak_current: 'Tage in Folge',
    stats_streak_longest: 'Rekord',
    stats_streak_days: 'Tage',
    stats_this_month: 'Dieser Monat',
    stats_actions_water: 'Gegossen',
    stats_actions_fertilize: 'Gedüngt',
    stats_actions_other: 'Sonstiges',
    stats_highlights: 'Highlights',
    stats_thirstiest: 'Durstigste Pflanze',
    stats_most_active: 'Fleißigste Pflanze',

    // Quick Actions
    action_water: 'Gießen',
    action_fertilize: 'Düngen',
    action_repot: 'Umtopfen',
    action_prune: 'Schneiden',
    action_note: 'Notiz',

    // Note Modal
    note_modal_title: 'Notiz hinzufügen',
    note_modal_placeholder: 'Was hast du beobachtet?',

    // History
    history_title: 'Pflegehistorie',
    history_empty: 'Noch keine Pflegeeinträge für diese Pflanze.',

    // Empty States
    empty_plants_title: 'Keine Pflanzen',
    empty_plants_body: 'Füge deine erste Pflanze im Admin-Bereich hinzu.',
    empty_plants_cta: 'Zum Admin-Bereich',
    empty_history_title: 'Noch keine Einträge',
    empty_diseases_title: 'Keine Krankheiten bekannt',

    // Onboarding
    onboarding_skip: 'Überspringen',
    onboarding_next: 'Weiter',
    onboarding_finish: 'Fertig',
    onboarding_slide1_title: 'Willkommen bei Safe My Plants',
    onboarding_slide1_body: 'Alle deine Pflanzen im Blick – smarte Pflegeerinnerung.',
    onboarding_slide2_title: 'Das Ampel-System',
    onboarding_slide2_body: 'Grün: alles gut. Gelb: bald fällig. Rot: jetzt handeln!',
    onboarding_slide3_title: 'Schnell pflegen',
    onboarding_slide3_body: 'Tippe auf eine Pflanze und protokolliere Gießen, Düngen und mehr.',

    // Notes
    notes_title: 'Notizen',
    notes_add: 'Notiz hinzufügen',
    notes_placeholder: 'Was hast du beobachtet?',
    notes_empty: 'Noch keine Notizen zu dieser Pflanze.',
    notes_save: 'Speichern',
    notes_show_more: 'Mehr anzeigen',
    notes_show_less: 'Weniger anzeigen',

    // Add Plant Screen
    add_plant_title: 'Pflanze hinzufügen',
    add_plant_search_placeholder: 'Name oder wissenschaftlicher Name …',
    add_plant_custom_label: 'Eigene Pflanze:',
    add_plant_custom_sub: 'Ohne Vorlage hinzufügen',
    add_plant_aka: 'auch:',
    add_plant_template_badge: 'Vorlage:',
    add_plant_field_name: 'Name *',
    add_plant_field_name_placeholder: 'Pflanzenname',
    add_plant_field_room: 'Raum / Aufstellort',
    add_plant_field_room_placeholder: 'z.B. Wohnzimmer',
    add_plant_care_preview_title: 'Pflegeinfo',
    add_plant_water_every: 'Gießen alle',
    add_plant_fertilize_every: 'Düngen alle',
    add_plant_hint: 'Weitere Details (Fotos, Krankheiten, …) kannst du später über "Pflanzen verwalten" ergänzen.',
    add_plant_save: 'Pflanze hinzufügen',
    add_plant_empty_hint: 'Tippe einen Pflanzennamen ein, um loszulegen.',

    // Manage Plants Screen
    manage_plants_title: 'Pflanzen verwalten',
    manage_plants_empty: 'Noch keine Pflanzen vorhanden.',
    manage_plants_back: 'Zurück',
    manage_plants_edit_title: 'Pflanze bearbeiten',
    manage_plants_delete_title: 'Löschen?',
    manage_plants_delete_body: '"{{name}}" wirklich löschen?',

    // Plant Form
    form_section_plant_info: 'Pflanzendaten',
    form_field_scientific: 'Wissenschaftlicher Name',
    form_field_description: 'Beschreibung',
    form_description_placeholder: 'Kurze Beschreibung...',
    form_section_sun: 'Standort',
    form_section_care: 'Pflege',
    form_watering_interval: 'Gießintervall (Tage)',
    form_watering_tips: 'Gießtipps',
    form_fertilizing_interval: 'Düngintervall (Tage)',
    form_fertilizing_tips: 'Düngetipps',
    form_temp_min: 'Temperatur min (°C)',
    form_temp_max: 'Temperatur max (°C)',
    form_humidity: 'Luftfeuchtigkeit',
    form_section_photos: 'Fotos',
    form_section_diseases: 'Krankheiten & Schädlinge',
    form_disease_name: 'Krankheitsname',
    form_disease_symptoms: 'Symptome',
    form_disease_treatment: 'Behandlung',
    form_disease_add: 'Krankheit hinzufügen',
    form_name_required: 'Name ist erforderlich.',
    form_plant_name_placeholder: 'z.B. Monstera',
    form_room_placeholder: 'z.B. Wohnzimmer',
    form_add: 'Hinzufügen',

    // Home Screen
    home_plant_singular: 'Pflanze',
    home_plant_plural: 'Pflanzen',
    home_no_room: 'Ohne Raum',
    home_empty_tap: 'Noch keine Pflanzen.\nTippe auf ⋮ → Pflanze hinzufügen.',

    // PlantCard
    card_watered: '💧 Gegossen',
    card_fertilized: '🌿 Gedüngt',

    // Common
    ok: 'OK',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    save: 'Speichern',
    back: 'Zurück',
    days: 'Tage',
    day: 'Tag',
    today: 'Heute',
    yesterday: 'Gestern',
    days_ago: 'vor {{n}} Tagen',
    in_days: 'in {{n}} Tagen',
    tomorrow: 'Morgen',
  },
  en: {
    // Navigation
    nav_home: 'My Plants',
    nav_admin: 'Admin',
    nav_settings: 'Settings',

    // Home Screen
    home_title: 'My Plants',
    home_empty: 'No plants yet.\nAdd your first plant in the Admin area.',
    home_care_ok: 'All good',
    home_care_soon: 'Due soon',
    home_care_overdue: 'Overdue',
    home_watering: 'Watering',
    home_fertilizing: 'Fertilizing',

    // Detail Screen
    detail_care_info: 'Care Instructions',
    detail_watering: 'Watering',
    detail_fertilizing: 'Fertilizing',
    detail_location: 'Location',
    detail_temperature: 'Temperature',
    detail_humidity: 'Humidity',
    detail_diseases: 'Diseases & Pests',
    detail_photos: 'Photos',
    detail_quick_actions: 'Quick actions',
    detail_last_watered: 'Last watered',
    detail_last_fertilized: 'Last fertilized',
    detail_mark_watered: 'Watered now',
    detail_mark_fertilized: 'Fertilized now',
    detail_never: 'Never',
    detail_symptoms: 'Symptoms',
    detail_treatment: 'Treatment',

    // Admin Screen
    admin_title: 'Admin',
    admin_pin_title: 'Admin PIN',
    admin_pin_prompt: 'Enter PIN',
    admin_pin_wrong: 'Wrong PIN',
    admin_pin_set: 'Set PIN',
    admin_pin_confirm: 'Confirm PIN',
    admin_pin_mismatch: 'PINs do not match',
    admin_add_plant: 'Add Plant',
    admin_edit_plant: 'Edit Plant',
    admin_delete_plant: 'Delete Plant',
    admin_delete_confirm: 'Really delete this plant?',
    admin_name: 'Name',
    admin_scientific_name: 'Scientific Name (optional)',
    admin_description: 'Description',
    admin_location: 'Location',
    admin_watering_freq: 'Watering interval (days)',
    admin_watering_tips: 'Watering tips',
    admin_fertilizing_freq: 'Fertilizing interval (days)',
    admin_fertilizing_tips: 'Fertilizing tips',
    admin_location_tips: 'Location tips',
    admin_temp_min: 'Temperature min (°C)',
    admin_temp_max: 'Temperature max (°C)',
    admin_humidity: 'Humidity',
    admin_add_disease: 'Add Disease',
    admin_disease_name: 'Disease name',
    admin_disease_symptoms: 'Symptoms',
    admin_disease_treatment: 'Treatment',
    admin_save: 'Save',
    admin_cancel: 'Cancel',
    admin_add_photo: 'Add Photo',
    admin_plant_list: 'Plant List',

    // Location
    location_sun: 'Full sun',
    location_partial_shade: 'Partial shade',
    location_shade: 'Shade',
    location_indoor: 'Indoor',

    // Humidity
    humidity_low: 'Low',
    humidity_medium: 'Medium',
    humidity_high: 'High',

    // Settings
    settings_title: 'Settings',
    settings_theme: 'Appearance',
    settings_theme_light: 'Light',
    settings_theme_dark: 'Dark',
    settings_theme_system: 'System',
    settings_language: 'Language',
    settings_language_de: 'Deutsch',
    settings_language_en: 'English',
    settings_admin: 'Admin Area',
    settings_admin_change_pin: 'Change PIN',
    settings_about: 'About',
    settings_version: 'Version',

    // Dashboard
    dashboard_due_today: 'Overdue',
    dashboard_this_week: 'Due soon',
    dashboard_all_good: 'All good',

    // Hero Card
    hero_featured: 'Needs attention',
    hero_water: 'Watered',
    hero_fertilize: 'Fertilized',

    // CareAction Types
    care_action_water: 'Watered',
    care_action_fertilize: 'Fertilized',
    care_action_repot: 'Repotted',
    care_action_prune: 'Pruned',
    care_action_note: 'Note',

    // Search & Filter
    search_placeholder: 'Search plants …',
    filter_all: 'All',
    sort_name: 'Name A–Z',
    sort_next_care: 'Next care',
    sort_recent: 'Recently added',
    filter_no_results: 'No plants match these filters.',

    // Reminder Banner
    reminder_singular: '1 plant needs care',
    reminder_plural: '{{n}} plants need care',
    reminder_tap: 'Tap to view',

    // Notifications
    settings_notifications: 'Reminders',
    settings_notifications_enable: 'Daily reminder',
    settings_notifications_time: 'Time',
    settings_notifications_permission_denied: 'Permission denied. Please enable in system settings.',
    settings_notifications_saved: 'Reminder saved',
    notification_channel_name: 'Care Reminders',
    notification_body: 'Check on your plants – one might need care today!',

    // Data / Export-Import
    settings_data: 'Data',
    settings_export: 'Export data',
    settings_import: 'Import data',
    settings_export_success: 'Backup saved',
    settings_import_success: '{{n}} plant(s) imported',
    settings_import_skipped: '{{n}} already present (skipped)',
    settings_import_confirm: 'Existing data will be supplemented, not replaced.',
    settings_import_error: 'Invalid backup file.',

    // Stats Screen
    stats_title: 'Statistics',
    stats_streak_current: 'days in a row',
    stats_streak_longest: 'Record',
    stats_streak_days: 'days',
    stats_this_month: 'This month',
    stats_actions_water: 'Watered',
    stats_actions_fertilize: 'Fertilized',
    stats_actions_other: 'Other',
    stats_highlights: 'Highlights',
    stats_thirstiest: 'Thirstiest plant',
    stats_most_active: 'Most active plant',

    // Quick Actions
    action_water: 'Water',
    action_fertilize: 'Fertilize',
    action_repot: 'Repot',
    action_prune: 'Prune',
    action_note: 'Note',

    // Note Modal
    note_modal_title: 'Add note',
    note_modal_placeholder: 'What did you observe?',

    // History
    history_title: 'Care history',
    history_empty: 'No care entries for this plant yet.',

    // Empty States
    empty_plants_title: 'No Plants',
    empty_plants_body: 'Add your first plant in the Admin area.',
    empty_plants_cta: 'Go to Admin',
    empty_history_title: 'No entries yet',
    empty_diseases_title: 'No diseases known',

    // Onboarding
    onboarding_skip: 'Skip',
    onboarding_next: 'Next',
    onboarding_finish: 'Get started',
    onboarding_slide1_title: 'Welcome to Safe My Plants',
    onboarding_slide1_body: 'All your plants at a glance – smart care reminders.',
    onboarding_slide2_title: 'The Traffic Light System',
    onboarding_slide2_body: 'Green: all good. Yellow: due soon. Red: act now!',
    onboarding_slide3_title: 'Quick care',
    onboarding_slide3_body: 'Tap a plant and log watering, fertilizing and more.',

    // Notes
    notes_title: 'Notes',
    notes_add: 'Add note',
    notes_placeholder: 'What did you observe?',
    notes_empty: 'No notes for this plant yet.',
    notes_save: 'Save',
    notes_show_more: 'Show more',
    notes_show_less: 'Show less',

    // Add Plant Screen
    add_plant_title: 'Add Plant',
    add_plant_search_placeholder: 'Name or scientific name …',
    add_plant_custom_label: 'Custom plant:',
    add_plant_custom_sub: 'Add without template',
    add_plant_aka: 'aka:',
    add_plant_template_badge: 'Template:',
    add_plant_field_name: 'Name *',
    add_plant_field_name_placeholder: 'Plant name',
    add_plant_field_room: 'Room / Location',
    add_plant_field_room_placeholder: 'e.g. Living room',
    add_plant_care_preview_title: 'Care info',
    add_plant_water_every: 'Water every',
    add_plant_fertilize_every: 'Fertilize every',
    add_plant_hint: 'Additional details (photos, diseases, …) can be added later via "Manage plants".',
    add_plant_save: 'Add plant',
    add_plant_empty_hint: 'Type a plant name to get started.',

    // Manage Plants Screen
    manage_plants_title: 'Manage Plants',
    manage_plants_empty: 'No plants yet.',
    manage_plants_back: 'Back',
    manage_plants_edit_title: 'Edit Plant',
    manage_plants_delete_title: 'Delete?',
    manage_plants_delete_body: 'Really delete "{{name}}"?',

    // Plant Form
    form_section_plant_info: 'Plant Info',
    form_field_scientific: 'Scientific Name',
    form_field_description: 'Description',
    form_description_placeholder: 'Short description...',
    form_section_sun: 'Sun exposure',
    form_section_care: 'Care',
    form_watering_interval: 'Watering interval (days)',
    form_watering_tips: 'Watering tips',
    form_fertilizing_interval: 'Fertilizing interval (days)',
    form_fertilizing_tips: 'Fertilizing tips',
    form_temp_min: 'Temperature min (°C)',
    form_temp_max: 'Temperature max (°C)',
    form_humidity: 'Humidity',
    form_section_photos: 'Photos',
    form_section_diseases: 'Diseases & Pests',
    form_disease_name: 'Disease name',
    form_disease_symptoms: 'Symptoms',
    form_disease_treatment: 'Treatment',
    form_disease_add: 'Add disease',
    form_name_required: 'Name is required.',
    form_plant_name_placeholder: 'e.g. Monstera',
    form_room_placeholder: 'e.g. Living room',
    form_add: 'Add',

    // Home Screen
    home_plant_singular: 'plant',
    home_plant_plural: 'plants',
    home_no_room: 'No room',
    home_empty_tap: 'No plants yet.\nTap ⋮ → Add plant.',

    // PlantCard
    card_watered: '💧 Watered',
    card_fertilized: '🌿 Fertilized',

    // Common
    ok: 'OK',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    back: 'Back',
    days: 'days',
    day: 'day',
    today: 'Today',
    yesterday: 'Yesterday',
    days_ago: '{{n}} days ago',
    in_days: 'in {{n}} days',
    tomorrow: 'Tomorrow',
  },
} as const

export type TranslationKey = keyof typeof translations.de

export function t(lang: Language, key: TranslationKey, vars?: Record<string, string | number>): string {
  const str = translations[lang][key] as string
  if (!vars) return str
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{{${k}}}`, String(v)), str)
}

export default translations
