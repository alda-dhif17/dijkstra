import { readFileSync } from "fs";

/**
 * [********************************************]
 * [*****Berner**Donnelly**Imeri**Wilfinger*****]
 * [********************************************]
 */

class Mapping {
  previous: Node;
  cost: number = Number.MAX_VALUE;
}

/**
 * Klasse zum managen von den Knoten
 */
class Graph {
  nodes: Node[];

  constructor() {
    const nodeMap: { [key: string]: Node } = {};
    let edges: Edge[] = [];
    const nodes: Node[] = [];
    const input: string[] = readFileSync("input.txt", "utf8")
      .replace("\r", "")
      .split("\n")
      .slice(1);

    for (const line of input) {
      const split = line.split(";");
      let start = nodeMap[split[0]];
      if (!start) {
        start = new Node(split[0]);
        nodes.push(start);
      }
      // if (start.edges.length == 0) {
      start.edges.push(new Edge(start, start, 0));
      // }

      // check if the neighbor was already found somewhere else (already exists in the nodes)
      let neighbor = nodeMap[split[1]];
      if (!neighbor) {
        // if it does not exist, create it and add it to the nodes
        neighbor = new Node(split[1]);
        nodes.push(neighbor);
      }
      start.edges.push(new Edge(start, neighbor, parseInt(split[2], 10)));
      neighbor.edges.push(new Edge(neighbor, start, parseInt(split[2], 10)));
      nodeMap[split[1]] = neighbor;

      nodeMap[split[0]] = start;
      edges = [];
    }
    this.nodes = nodes;
  }

  /**
   * gibt alle knoten in string repräsentation zurück
   */
  getAlleKnoten() {
    let knoten = [];

    for (let n of this.nodes) {
      let str = `${n.name}: `;
      if (n.neighbors.length > 0) {
        for (let x of n.neighbors) {
          str += x.name + ", ";
        }
      } else {
        str += " ";
      }
      knoten.push(str.substr(0, str.length - 2));
    }

    return knoten;
  }

  getAlleNachbarn(knotenName: string) {
    let list = [];
    for (let n of this.nodes)
      if (n.name == knotenName) for (let x of n.neighbors) list.push(x.name);

    return list;
  }

  getNode(name: string) {
    for (let node of this.nodes) {
      if (node.name == name) {
        return node;
      }
    }
    return undefined;
  }
}

/**
 * Datenklasse für den Knoten
 */
class Node {
  edges: Edge[] = [];
  neighbors: Node[] = [];
  name: string;
  visited: boolean
  /**
   * Der Konstruktor für die Knoten Klasse
   * @param {string} name der Name vom Knoten
   */
  constructor(name) {
    this.name = name;
    this.visited = false;
  }
}

class Edge {
  from: Node;
  to: Node;
  cost: number;
  /**
   * @param {Node} from von wo es geht
   * @param {Node} to wohin es geht
   * @param {number} cost wie viel die Verbindung kostet
   */
  constructor(from, to, cost) {
    this.from = from;
    this.to = to;
    this.cost = cost;
  }
}

let visited: Node[] = [];
let unvisited: Node[] = [];
const graph = new Graph();

/*
    https://www.youtube.com/watch?v=pVfj6mxhdMw
    Vertex; Distance; Previous Vertex
*/
let mapping: { [key: string]: Mapping } = {};

function solve(startStr: string, endStr: string) {
  unvisited = [...graph.nodes];

  const start = graph.getNode(startStr);
  const end = graph.getNode(endStr);

  for (let k of unvisited) {
    mapping[k.name] = new Mapping();
  }

  mapping[start.name].cost = 0;

  visitSubNodes(start);

  console.log(getPath(start, end));

}

function getPath(start: Node, current: Node): string {
  if (current == start) {
    return current.name;
  }
  return getPath(start, mapping[current.name].previous) + "->" + current.name;
}

function visitSubNodes(node: Node) {
  setVisited(node);
  for (let edge of node.edges) {
    if (mapping[edge.to.name].cost > mapping[node.name].cost + edge.cost) {
      mapping[edge.to.name].cost = mapping[node.name].cost + edge.cost;
      mapping[edge.to.name].previous = node;
    }
  }

  if (unvisited.length == 0) {
    return;
  }

  let fav = null;
  for (let n of unvisited) {
    if (!mapping[n.name].cost)
      continue;
    if (!fav || mapping[fav.name].cost < mapping[n.name].cost) {
      fav = n;
    }
  }
  visitSubNodes(fav);
}

function setVisited(node: Node) {
  for (let i = 0; i < unvisited.length; i++) {
    if (unvisited[i] == node) unvisited.splice(i, 1);
  }
  visited.push(node);
}

let lol = new Graph();

solve("A", "E")
