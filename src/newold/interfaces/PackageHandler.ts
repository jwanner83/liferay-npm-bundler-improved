import Pack from '../types/Pack'

interface PackageHandler {
  /**
   * The external package.json file
   */
  pack: Pack

  /**
   * Resolve the external package.json file
   */
  resolve: () => Promise<void>

  /**
   * Validate the required fields of the package.json
   */
  validate: () => void
}

export default PackageHandler
