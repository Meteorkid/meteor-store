// @ts-nocheck
/* eslint-disable */
export interface Locale {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
}

export interface Translation {
  [key: string]: string | Translation
}

export interface I18nConfig {
  defaultLocale: string
  supportedLocales: string[]
  fallbackLocale: string
  loadPath: string
  debug: boolean
}

export interface LocalizedText {
  [locale: string]: string
}

export interface PluralRule {
  one: string
  other: string
  zero?: string
  few?: string
  many?: string
}

export interface DateFormat {
  short: string
  medium: string
  long: string
  full: string
}

export interface NumberFormat {
  decimal: string
  thousands: string
  precision: number
  currency: string
}

export interface LocaleData {
  locale: string
  translations: Translation
  dateFormats: DateFormat
  numberFormats: NumberFormat
  pluralRules: Record<string, PluralRule>
}
