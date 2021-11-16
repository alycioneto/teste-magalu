class CepError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "CepError";
  }
}

export { CepError };
