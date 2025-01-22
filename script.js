const treeContainer = document.getElementById('tree-container');
const depthInput = document.getElementById('depth');
const drawButton = document.getElementById('draw-tree');
const cleanButton = document.getElementById('clean-tree');

// Funktion zum Erstellen des Binärbaums
function createBinaryTree(levels, previousData = {}) {
  treeContainer.innerHTML = ''; // Alten Baum löschen

  const treeWidth = treeContainer.offsetWidth || 800;

  // Speichert den Inhalt der Knoten basierend auf der Position
  const newNodeData = {};

  function createNode(level, index, x, y, parentX = null, parentY = null, label = '') {
    const size = 50 - (level - 4) * 5;

    const nodeKey = `${level}-${index}`;
    const node = document.createElement('div');
    node.classList.add('node');
    node.dataset.key = nodeKey;
    node.style.left = `${x - size / 2}px`;
    node.style.top = `${y - size / 2}px`;
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = previousData[nodeKey] || '';
    newNodeData[nodeKey] = input.value;

    input.addEventListener('input', () => {
      newNodeData[nodeKey] = input.value;
    });

    node.appendChild(input);
    treeContainer.appendChild(node);

    if (parentX !== null && parentY !== null) {
      const line = document.createElement('div');
      line.classList.add('line');
      line.dataset.from = nodeKey;
      line.dataset.to = `${level - 1}-${Math.floor((index - 1) / 2)}`;
      line.style.width = `${Math.sqrt((x - parentX) ** 2 + (y - parentY) ** 2)}px`;
      line.style.height = '2px';
      line.style.transformOrigin = '0 0';
      line.style.transform = `rotate(${Math.atan2(y - parentY, x - parentX) * (180 / Math.PI)}deg)`;
      line.style.left = `${parentX}px`;
      line.style.top = `${parentY}px`;
      treeContainer.appendChild(line);

      const edgeLabel = document.createElement('div');
      edgeLabel.classList.add('edge-label');
      edgeLabel.dataset.from = nodeKey;
      edgeLabel.innerText = label;
      edgeLabel.style.left = `${(x + parentX) / 2}px`;
      edgeLabel.style.top = `${(y + parentY) / 2}px`;
      treeContainer.appendChild(edgeLabel);
    }

    if (level >= levels) return;

    const childY = y + 100;
    const spacing = treeWidth / (2 ** (level + 1));
    const leftChildX = x - spacing;
    const rightChildX = x + spacing;

    createNode(level + 1, index * 2, leftChildX, childY, x, y, '0');
    createNode(level + 1, index * 2 + 1, rightChildX, childY, x, y, '1');
  }

  const rootX = treeWidth / 2;
  const rootY = 50;
  createNode(1, 1, rootX, rootY);

  return newNodeData;
}

// Funktion zum Entfernen leerer Knoten und deren Linien
function cleanEmptyNodes() {
  const nodes = Array.from(document.querySelectorAll('.node'));
  const nodeData = createBinaryTree.levelData || {};

  // Set mit allen Knoten, die bestehen bleiben sollen
  const nodesToKeep = new Set();

  // Hilfsfunktion: Markiere Knoten und alle Eltern
function markNodeAndAncestors(key) {
    if (nodesToKeep.has(key)) return;

    nodesToKeep.add(key);

    const [level, index] = key.split('-').map(Number);

    if (level > 1) {
        // Startindex der aktuellen Ebene
        const startIndex = Math.pow(2, level - 1);
        // Startindex der Elternebene
        const startIndexParent = Math.pow(2, level - 2);

        // Relativer Index in der aktuellen Ebene
        const relativeIndex = index - startIndex;

        // Elternindex berechnen
        const parentIndex = Math.floor(relativeIndex / 2) + startIndexParent;

        // Schlüssel des Elternknotens
        const parentKey = `${level - 1}-${parentIndex}`;

        // Rekursiv den Elternknoten markieren
        markNodeAndAncestors(parentKey);
    }
}


  // Überprüfe alle Knoten auf Eingaben
  nodes.forEach(node => {
    const key = node.dataset.key;
    const inputValue = node.querySelector('input').value.trim();
    if (inputValue) {
      markNodeAndAncestors(key);
    }
  });

  // Entferne alle Knoten, Linien und Labels, die nicht im Set sind
  nodes.forEach(node => {
    const key = node.dataset.key;
    if (!nodesToKeep.has(key)) {
      const lines = document.querySelectorAll(`.line[data-from="${key}"]`);
      const labels = document.querySelectorAll(`.edge-label[data-from="${key}"]`);
      lines.forEach(line => line.remove());
      labels.forEach(label => label.remove());
      node.remove();
      delete nodeData[key];
    }
  });

  // Aktualisierte Knotendaten speichern
  createBinaryTree.levelData = nodeData;
}

// Event-Listener für den Button
drawButton.addEventListener('click', () => {
  const levels = parseInt(depthInput.value, 10);
  if (levels >= 1 && levels <= 10) {
    const currentData = createBinaryTree.levelData || {};
    createBinaryTree.levelData = createBinaryTree(levels, currentData);
  } else {
    alert('Bitte geben Sie eine Tiefe zwischen 1 und 10 ein.');
  }
});

cleanButton.addEventListener('click', cleanEmptyNodes);

// Standardbaum erstellen
createBinaryTree.levelData = createBinaryTree(4);
