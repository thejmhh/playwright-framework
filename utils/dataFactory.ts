export class DataFactory {
  static generateUser() {
    const timestamp = Date.now()

    return {
      firstName: `Test${timestamp}`,
      lastName: `User${timestamp}`,
      postalCode: `${Math.floor(10000 + Math.random() * 90000)}`
    }
  }

  static generateInvalidUser() {
    return {
      firstName: '',
      lastName: '',
      postalCode: ''
    }
  }
}
