import User from "../cotrollers/Users/user.interace";

export type Node = {
  id: string;
  name: string;
  neighbors: string[];
  visited: boolean;
};

export class Graph {
  nodes: Node[] = [];
  constructor(private users: User[]) {
    for (const user of users) {
      this.addNode(user.id, user.name);
    }

    for (const user of users) {
      for (const friend of user.friends) {
        this.addConnection(user.id, friend);
      }
    }
  }

  addNode(id: string, name: string) {
    const newNode: Node = { id, name, neighbors: [], visited: false };
    this.nodes.push(newNode);
    return newNode;
  }

  addConnection(id1: string, id2: string) {
    const node1 = this.nodes.find((node) => node.id === id1);
    const node2 = this.nodes.find((node) => node.id === id2);
    if (node1 && node2) {
      node1.neighbors.push(id2);
      node2.neighbors.push(id1);
    }
  }

  findPath(
    startId: string,
    endId: string,
    path: { id: string; name: string }[] = []
  ): { id: string; name: string }[] | undefined {
    const startNode = this.nodes.find((node) => node.id === startId);
    const endNode = this.nodes.find((node) => node.id === endId);
    if (!startNode) throw new Error("Id not found on first parameter");
    if (!endNode) throw new Error("Id not found on second parameter");
    else {
      startNode.visited = true;
      path.push({ id: startNode.id, name: startNode.name });
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
