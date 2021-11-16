class ViaCepError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ViaCepError";
  }
}

export { ViaCepError };
