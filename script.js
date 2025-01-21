const treeContainer = document.getElementById('tree-container');
const depthInput = document.getElementById('depth');
const drawButton = document.getElementById('draw-tree');

// Funktion zum Erstellen des Binärbaums
function createBinaryTree(levels) {
  treeContainer.innerHTML = ''; // Alten Baum löschen

  const treeWidth = treeContainer.offsetWidth || 800;
  const treeHeight = treeContainer.offsetHeight || 600;

  function createNode(level, index, x, y, parentX = null, parentY = null, label = '') {
    // Berechnung der Knotengröße basierend auf der Ebene
    const maxSize = 50; // Maximale Größe der Knoten
    const minSize = 5;  // Minimale Größe der Knoten
    const size = Math.max(maxSize - (level - 4) * (maxSize / levels), minSize);

    // Knoten erstellen
    const node = document.createElement('div');
    node.classList.add('node');
    node.style.left = `${x - size / 2}px`;
    node.style.top = `${y - size / 2}px`;
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;

    // Wenn die Größe zu klein ist, Knoten unsichtbar machen
    if (size <= minSize) {
      node.style.opacity = '0';
    }

    // Eingabefeld hinzufügen
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = level === levels ? '' : '...';
    input.style.fontSize = `${size / 3}px`;
    node.appendChild(input);
    treeContainer.appendChild(node);

    // Linie zum Elternknoten
    if (parentX !== null && parentY !== null) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.width = `${Math.sqrt((x - parentX) ** 2 + (y - parentY) ** 2)}px`;
      line.style.height = '2px';
      line.style.backgroundColor = '#000';
      line.style.transformOrigin = '0 0';
      line.style.transform = `rotate(${Math.atan2(y - parentY, x - parentX) * (180 / Math.PI)}deg)`;
      line.style.left = `${parentX}px`;
      line.style.top = `${parentY}px`;
      treeContainer.appendChild(line);

      // Beschriftung der Kante
      const edgeLabel = document.createElement('div');
      edgeLabel.classList.add('edge-label');
      edgeLabel.innerText = label;
      edgeLabel.style.left = `${(x + parentX) / 2}px`;
      edgeLabel.style.top = `${(y + parentY) / 2}px`;
      treeContainer.appendChild(edgeLabel);
    }

    // Abbruch bei der letzten Ebene
    if (level >= levels) return;

    // Positionen der Kinder berechnen
    const childY = y + 100; // Vertikaler Abstand
    const spacing = treeWidth / (2 ** (level + 1));

    const leftChildX = x - spacing;
    const rightChildX = x + spacing;

    // Rekursiv Kinderknoten erstellen
    createNode(level + 1, index * 2, leftChildX, childY, x, y, '0'); // Linkes Kind
    createNode(level + 1, index * 2 + 1, rightChildX, childY, x, y, '1'); // Rechtes Kind
  }

  // Wurzelknoten
  const rootX = treeWidth / 2;
  const rootY = 50;
  createNode(1, 1, rootX, rootY);
}

// Event-Listener für den Button
drawButton.addEventListener('click', () => {
  const levels = parseInt(depthInput.value, 10);
  if (levels >= 1 && levels <= 10) {
    createBinaryTree(levels);
  } else {
    alert('Bitte geben Sie eine Tiefe zwischen 1 und 10 ein.');
  }
});

// Standardbaum mit Tiefe 5 erstellen
createBinaryTree(4);
