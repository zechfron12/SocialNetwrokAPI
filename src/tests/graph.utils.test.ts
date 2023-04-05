import User from "../cotrollers/Users/user.interace";
import { Graph } from "../utils/graph.utils";

describe("Graph Utils", () => {
  const users: User[] = [
    {
      id: "1",
      name: "John",
      friends: ["2", "3"],
    },
    {
      id: "2",
      name: "Mary",
      friends: ["1", "3"],
    },
    {
      id: "3",
      name: "Peter",
      friends: ["1", "2", "6"],
    },
    {
      id: "5",
      name: "Peter",
      friends: [],
    },
    {
      id: "6",
      name: "Eve",
      friends: ["3"],
    },
  ];
  const graph = new Graph(users);
  it("should return a path between two nodes", () => {
    const path = graph.findPath("1", "6");
    expect(path).toEqual([
      { id: "1", name: "John" },
      { id: "2", name: "Mary" },
      { id: "3", name: "Peter" },
      { id: "6", name: "Eve" },
    ]);
  });
  it("should return undefined if no path is found", () => {
    const path = graph.findPath("2", "5");
    expect(path).toBeUndefined();
  });
  it("should throw an error if the first id is not found", () => {
    expect(() => graph.findPath("4", "1")).toThrowError(
      "Id not found on first parameter"
    );
  });
  it("should throw an error if the second id is not found", () => {
    expect(() => graph.findPath("1", "4")).toThrowError(
      "Id not found on second parameter"
    );
  });
});
