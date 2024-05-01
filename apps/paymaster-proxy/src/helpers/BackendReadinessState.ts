export class BackendReadinessState {
  private isReady = false

  getIsReady() {
    return this.isReady
  }

  setIsReady() {
    this.isReady = true
  }
}
