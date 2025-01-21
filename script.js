const treeContainer = document.getElementById('tree-container');

function createBinaryTree(levels) {
  const nodeWidth = 50;
  const nodeHeight = 50;

  // Total width of the tree container
  const treeWidth = treeContainer.offsetWidth;

  // Recursively create tree nodes and edges
  function createNode(level, index, x, y, parentX = null, parentY = null, label = '') {
    // Create node element
    const node = document.createElement('div');
    node.classList.add('node');
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '...';
   
