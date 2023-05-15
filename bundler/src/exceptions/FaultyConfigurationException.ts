export default class FaultyConfigurationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FaultyConfigurationException'
  }
}
