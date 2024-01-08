export default class DeploymentException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DeploymentException'
  }
}
