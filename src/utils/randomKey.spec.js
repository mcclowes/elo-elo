import randomKey from "./randomKey";

describe("randomKey", () => {
  const originalRandom = Math.random;

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("returns a key using the provided random function", () => {
    Math.random = jest.fn(() => 0.49);
    const result = randomKey({ alpha: 1, beta: 2 });

    expect(result).toBe("alpha");
  });

  it("reuses cached keys for repeated calls", () => {
    Math.random = jest.fn(() => 0.9);
    const keysSpy = jest.spyOn(Object, "keys");

    const target = { first: true, second: true };

    const initialCalls = keysSpy.mock.calls.length;

    try {
      randomKey(target);
      randomKey(target);

      const newCalls = keysSpy.mock.calls.length - initialCalls;

      expect(newCalls).toBe(1);
    } finally {
      keysSpy.mockRestore();
    }
  });

  it("throws when the object has no keys", () => {
    expect(() => randomKey({})).toThrow(
      "Cannot select a random key from an empty object",
    );
  });
});
