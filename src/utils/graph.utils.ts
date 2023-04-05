export type Graph = {
  [key: string]: string[];
};

export const shortestChainLength = (
  graph: Graph,
  start: string,
  end: string
): number => {
  if (!graph[start]) throw new Error("Id not found on first parameter");
  if (!graph[end]) throw new Error("Id not found on second parameter");

  if (start === end) return 0;

  const visited = new Set<string>();
  const queue: [string, number][] = [[start, 0]];

  while (queue.length > 0) {
    const [current, length] = queue.shift() ?? ["", 0];

    if (current === end) {
      return length;
    }

    visited.add(current);

    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        queue.push([neighbor, length + 1]);
      }
    }
  }

  return -1; // No chain exists
};
