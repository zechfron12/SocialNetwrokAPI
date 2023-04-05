import User from "../cotrollers/Users/user.interace";

export type Node = {
  id: string;
  name: string;
  neighbors: string[];
  visited: boolean;
};

export const userToNode = (user: User): Node => ({
  id: user.id,
  name: user.name,
  neighbors: user.friends,
  visited: false,
});

export class Graph {
  nodes: Node[] = [];
  constructor(private users: User[]) {
    for (const user of users) {
      this.addNode(user.id, user.name);
      for (const friend of user.friends) {
        this.addConnection(user.id, friend);
      }
    }
  }

  addNode(id: string, name: string) {
    const newNode: Node = { id, neighbors: [], name, visited: false };
    this.nodes.push(newNode);
    return newNode;
  }

  addConnection(node1: Node, node2: Node) {
    node1.neighbors.push(node2.id);
    node2.neighbors.push(node1);
  }

  findPath(
    startId: string,
    endId: string,
    path: string[] = []
  ): string[] | undefined {
    const startNode = this.nodes.find((node) => node.id === startId);
    if (!startNode) throw new Error("Node not found");
    else {
      startNode.visited = true;
      path.push(startId);
      if (startId === endId) return path;
      else {
        for (const neighbor of startNode.neighbors) {
          if (!this.nodes.find((node) => node.id === neighbor)?.visited) {
            const newPath = this.findPath(neighbor, endId, path);
            if (newPath) return newPath;
          }
        }
      }
    }
  }
}
