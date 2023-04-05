import { shortestChainLength, Graph } from "../utils/graph.utils";

describe("Graph Utils", () => {
  const users: Graph = {
    "1": ["2", "3"],
    "2": ["1", "3"],
    "3": ["1", "2", "6"],
    "5": [],
    "6": ["3"],
  };
  it("should return a path between two nodes", () => {
    const path = shortestChainLength(users, "1", "6");
    expect(path).toEqual(2);
  });
  it("should return undefined if no path is found", () => {
    const path = shortestChainLength(users, "2", "5");
    expect(path).toEqual(-1);
  });
  it("should throw an error if the first id is not found", () => {
    expect(() => shortestChainLength(users, "4", "1")).toThrowError(
      "Id not found on first parameter"
    );
  });
  it("should throw an error if the second id is not found", () => {
    expect(() => shortestChainLength(users, "1", "4")).toThrowError(
      "Id not found on second parameter"
    );
  });
});
