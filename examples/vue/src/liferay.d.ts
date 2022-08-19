declare const Liferay: {
  Language: LiferayLanguage
}

interface LiferayLanguage {
  /**
   * Get language property value by a specified key and replace placeholders
   * with values
   *
   * @param key
   * @param params
   */
  get: (key: string, params?: Array<string> | string) => string
}
