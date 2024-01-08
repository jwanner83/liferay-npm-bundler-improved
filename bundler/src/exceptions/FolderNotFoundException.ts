export default class FolderNotFoundException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FolderNotFoundException'
  }
}
