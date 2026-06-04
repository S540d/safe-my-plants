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

    // Notes
    notes_title: 'Notizen',
    notes_add: 'Notiz hinzufügen',
    notes_placeholder: 'Was hast du beobachtet?',
    notes_empty: 'Noch keine Notizen zu dieser Pflanze.',
    notes_save: 'Speichern',

    // Common
    ok: 'OK',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    save: 'Speichern',
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

    // Notes
    notes_title: 'Notes',
    notes_add: 'Add note',
    notes_placeholder: 'What did you observe?',
    notes_empty: 'No notes for this plant yet.',
    notes_save: 'Save',

    // Common
    ok: 'OK',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
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
