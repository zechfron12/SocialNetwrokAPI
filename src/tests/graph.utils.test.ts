import { shortestChainLength, Graph } from "../utils/graph.utils";

describe("Graph Utils", () => {
  const users: Graph = {
    "1": ["2", "3"],
    "2": ["1", "3"],
    "3": ["1", "2", "6"],
    "5": [],
    "6": ["3", "7"],
    "7": ["6"],
  };
  it("A and B are the same user should return 0", () => {
    const step = shortestChainLength(users, "1", "1");
    expect(step).toEqual(0);
  });

  it("There is a path between A and B", () => {
    const step = shortestChainLength(users, "1", "7");
    expect(step).toEqual(3);
  });
  it("A and B are direct friends should return 1", () => {
    const step = shortestChainLength(users, "1", "2");
    expect(step).toEqual(1);
  });
  it("should return -1 if no path is found", () => {
    const step = shortestChainLength(users, "2", "5");
    expect(step).toEqual(-1);
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
