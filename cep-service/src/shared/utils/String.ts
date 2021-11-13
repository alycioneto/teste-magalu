class StringUtil {
  public static replaceAt(string: string, index: number): string {
    return string.substring(0, index) + "0" + string.substring(index + 1);
  }
}

export { StringUtil }
