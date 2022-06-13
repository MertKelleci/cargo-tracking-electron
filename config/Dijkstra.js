const { ipcRenderer } = require("electron");

function dijkstra() {
  const adjacencyList = new Map();

  function addNode(id) {
    adjacencyList.set(id, []);
  }

  function addEdge(originId, destinationId) {
    adjacencyList.get(originId).push(destinationId);
    adjacencyList.get(destinationId).push(originId);
  }
}
