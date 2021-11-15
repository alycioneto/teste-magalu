class StringUtil {
  public static replaceAt(string: string, index: number, value: string): string {
    if(index >= string.length || index < 0) {
      throw new Error()
    }
    return string.substring(0, index) + value + string.substring(index + 1);
  }
}

export { StringUtil }
