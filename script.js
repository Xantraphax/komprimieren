const treeContainer = document.getElementById('tree-container');

function createBinaryTree(levels) {
  const nodeWidth = 50;
  const nodeHeight = 50;

  // Total width and height of the tree container
  const treeWidth = treeContainer.offsetWidth || 800; // Fallback width
  const treeHeight = treeContainer.offsetHeight || 600; // Fallback height

  // Recursively create tree nodes and edges
  function createNode(level, index, x, y, parentX = null, parentY = null, label = '') {
    // Create node element
    const node = document.createElement('div');
    node.classList.add('node');
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    // Add input field to the node
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '...';
    input.style.width = '80%';
    input.style.border = 'none';
    input.style.textAlign = 'center';
    input.style.outline = 'none';
    node.appendChild(input);
    treeContainer.appendChild(node);

    // Draw line to parent node if exists
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

      // Add edge label (0 or 1)
      const edgeLabel = document.createElement('div');
      edgeLabel.classList.add('edge-label');
      edgeLabel.innerText = label;
      edgeLabel.style.left = `${(x + parentX) / 2}px`;
      edgeLabel.style.top = `${(y + parentY) / 2}px`;
      treeContainer.appendChild(edgeLabel);
    }

    // Stop recursion if the maximum level is reached
    if (level >= levels) {
      return;
    }

    // Calculate positions for child nodes
    const childY = y + 100; // Vertical distance between levels
    const spacing = treeWidth / (2 ** (level + 1)); // Horizontal spacing

    const leftChildX = x - spacing;
    const rightChildX = x + spacing;

    // Recursively create left and right child nodes
    createNode(level + 1, index * 2, leftChildX, childY, x, y, '0'); // Left child
    createNode(level + 1, index * 2 + 1, rightChildX, childY, x, y, '1'); // Right child
  }

  // Initialize tree with root node
  const rootX = treeWidth / 2;
  const rootY = 50; // Root node height
  createNode(1, 1, rootX, rootY);
}

// Create a binary tree with 5 levels
createBinaryTree(5);
