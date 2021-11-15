class StringUtil {
  public static replaceAt(string: string, index: number, value: string): string {
    return string.substring(0, index) + value + string.substring(index + 1);
  }
}

export { StringUtil }
