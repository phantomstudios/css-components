import useLibrary from "../src";
import { renderHook } from "@testing-library/react-hooks";

describe("performs requests", () => {
  it("should work with 1 argument", async () => {
    const { result } = renderHook(() => useLibrary({argument1:10}));
    expect(result.current.something).toEqual(10);
  });

  it("should work with 2 arguments", async () => {
    const { result } = renderHook(() => useLibrary({argument1:10, argument2: 6}));
    expect(result.current.something).toEqual(16);
  });
});
