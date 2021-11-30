interface ExceptionHandler {
  /**
   * Validate the required fields of the package.json
   */
  getExceptionMessage: (exception: Error, stacktrace?: boolean) => string
}

export default ExceptionHandler
