import { StringUtil } from "./String";

describe('Tests for "StringUtil" class', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Tests for the "replaceAt" method', () => {
    it("Should return 90220010 when called with 90220012 on cep 7 on index and 0 on value", async () => {
      const response = StringUtil.replaceAt("90220012", 7, "0");

      expect(response).toBe("90220010");
    });

    it("Should return TESTE when called with TOSTE on cep 7 on index and E on value", async () => {
      const response = StringUtil.replaceAt("TOSTE", 1, "E");

      expect(response).toBe("TESTE");
    });

    it("Should throw an error when index grather or equal than string length", async () => {
      expect(() => {
        StringUtil.replaceAt("90220012", 8, "0");
      }).toThrow();
    });

    it("Should throw an error when index lesss than ZERO", async () => {
      expect(() => {
        StringUtil.replaceAt("90220012", -1, "0");
      }).toThrow();
    });
  });
});
