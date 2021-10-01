import ExceptionHandler from '../interfaces/ExceptionHandler'

export default class ExceptionHandlerImplementation implements ExceptionHandler {
  getExceptionMessage(exception: Error, stacktrace: boolean = false): string {
    if (stacktrace) {
      return exception.stack
    } else {
      return `${exception.name}: ${exception.message}`
    }
  }
}
