interface ProcessHandler {
  /**
   * Prepare the process by validating, detecting features and more.
   */
  prepare: () => Promise<void>

  /**
   * Bundle the actual code into the liferay loader
   */
  bundle: () => Promise<void>
}

export default ProcessHandler
