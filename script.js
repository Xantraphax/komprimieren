document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const filePath = getUrlParameter('path');
	
	// Referenzen zu den Containern
	const controlsContainer = document.getElementById('controls');
	const treeContainer = document.getElementById('tree-container');

	// Buttons und Input erstellen
	let depthInput, drawButton, cleanButton, prefixTestButton, loadTreeButton;

	if (urlParams.has('depthInput')) {
		depthInput = document.createElement('input');
		depthInput.type = 'number';
		depthInput.id = 'depth';
		depthInput.min = '1';
		depthInput.max = '10';
		depthInput.value = '4';

    const depthLabel = document.createElement('label');
		depthLabel.setAttribute('for', 'depth');
		depthLabel.textContent = 'Baumtiefe:';
		controlsContainer.appendChild(depthLabel);
		controlsContainer.appendChild(depthInput);
	}

	if (urlParams.has('drawTreeButton')) {
		drawButton = document.createElement('button');
		drawButton.id = 'draw-tree';
		drawButton.textContent = 'Baum zeichnen';
		controlsContainer.appendChild(drawButton);
	}

	if (urlParams.has('cleanTreeButton')) {
		cleanButton = document.createElement('button');
		cleanButton.id = 'clean-tree';
		cleanButton.textContent = 'Leere Knoten entfernen';
		controlsContainer.appendChild(cleanButton);
	}

	if (urlParams.has('prefixTestButton')) {
		prefixTestButton = document.createElement('button');
		prefixTestButton.id = 'prefixTestButton';
		prefixTestButton.textContent = 'Präfix Test';
		controlsContainer.appendChild(prefixTestButton);
	}

	if (urlParams.has('loadButton')) {
		loadTreeButton = document.createElement('button');
		loadTreeButton.id = 'load-button';
		loadTreeButton.textContent = 'Baum laden';
		controlsContainer.appendChild(loadTreeButton);
	}
	
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
			input.dataset.key = nodeKey; // Sicherstellen, dass das Attribut vorhanden ist
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

	function createBinaryTreeFromJSON(jsonData) {
		treeContainer.innerHTML = ''; // Alten Baum löschen

		const treeWidth = treeContainer.offsetWidth || 800;

		function createNode(level, index, x, y, parentX = null, parentY = null, label = '') {
			const size = 50 - (level - 4) * 5;

			const nodeKey = `${level}-${index}`;
			if (!(nodeKey in jsonData)) {
				return; // Überspringen, wenn der Knoten nicht in den JSON-Daten definiert ist
			}

			const node = document.createElement('div');
			node.classList.add('node');
			node.dataset.key = nodeKey;
			node.style.left = `${x - size / 2}px`;
			node.style.top = `${y - size / 2}px`;
			node.style.width = `${size}px`;
			node.style.height = `${size}px`;

			const input = document.createElement('input');
			input.type = 'text';
			input.value = jsonData[nodeKey] || '';
			input.dataset.key = nodeKey;

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
				const startIndex = Math.pow(2, level - 1);
				const startIndexParent = Math.pow(2, level - 2);
				const relativeIndex = index - startIndex;
				const parentIndex = Math.floor(relativeIndex / 2) + startIndexParent;
				const parentKey = `${level - 1}-${parentIndex}`;
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
		createBinaryTree.levelData = nodeData;
	}
	
	//Aufruf und Funktion des Präfixbuttons
	if (prefixTestButton){
		document.getElementById("prefixTestButton").addEventListener("click", () => {
			// Zuerst leere Knoten entfernen
			cleanEmptyNodes();

			// Finde alle Knoten mit Eingaben
			const nodeInputs = document.querySelectorAll(".node input");
			nodeInputs.forEach((input) => {
				const key = input.dataset.key;
				if (!key){
					console.warn("Warnung!");
					return; // Überspringen, falls kein key vorhanden
				}

				const value = input.value.trim();

				// Wenn der Knoten Eingaben hat und kein Blatt ist
				if (value) {
				  const [level, index] = key.split('-').map(Number);

				  // Prüfe, ob der Knoten ein Blatt ist
				  const leftChildKey = `${level + 1}-${index * 2}`;
				  const rightChildKey = `${level + 1}-${index * 2 + 1}`;
				  const hasLeftChild = document.querySelector(`.node[data-key="${leftChildKey}"]`);
				  const hasRightChild = document.querySelector(`.node[data-key="${rightChildKey}"]`);

				  if (hasLeftChild || hasRightChild) {
					// Kein Blatt: Knoten rot einfärben
					input.parentElement.style.backgroundColor = "red";
					}
				}
				else{
					input.parentElement.style.backgroundColor = "#005eff";
				}
			});
		});
	}

	// Laden der JSON-Datei und Erstellen des Baums basierend auf den Daten
	async function loadTreeFromFile(filePath) {
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}
			const jsonData = await response.json();

			// Zeichne den Baum basierend auf den JSON-Daten
			createBinaryTreeFromJSON(jsonData);
		} 
		catch (error) {
			console.error('Fehler beim Laden der Baumdatei:', error);
		}
	}

	// Event-Listener für den "Load Tree"-Button
	if (loadTreeButton){
		loadTreeButton.addEventListener('click', () => {
			const filePath = prompt('Bitte geben Sie den Pfad zur JSON-Datei ein (z. B. ./tree.json):');
			if (filePath) {
				loadTreeFromFile(filePath);
			}
		});
	}


	// Event-Listener für den Button
	if (drawButton){
		drawButton.addEventListener('click', () => {
			const levels = parseInt(depthInput.value, 10);
			if (levels >= 1 && levels <= 10) {
				const currentData = createBinaryTree.levelData || {};
				createBinaryTree.levelData = createBinaryTree(levels, currentData);
			} 
			else {
				alert('Bitte geben Sie eine Tiefe zwischen 1 und 10 ein.');
			}
		});
	}
	
	// Event-Listener für den Button
	if (cleanButton){
		cleanButton.addEventListener('click', cleanEmptyNodes);
	}

	// Funktion, um URL-Parameter auszulesen
	function getUrlParameter(name) {
		const params = new URLSearchParams(window.location.search);
		return params.get(name);
	}

	//Es wird ein vorefertigter Baum geladen oder ein Standarbaum erstellt
	if (filePath) {
		// Wenn 'path' vorhanden ist, lade die JSON-Datei
		loadTreeFromFile(filePath).catch((error) => {
			console.error('Fehler beim Laden der Baumdatei:', error);
			alert('Baum konnte nicht geladen werden. Standardbaum wird erstellt.');
			createBinaryTree.levelData = createBinaryTree(4); // Standardbaum als Fallback
		});
	} 
	else {
	// Wenn kein 'path' vorhanden ist, Standardbaum erstellen
	createBinaryTree.levelData = createBinaryTree(4);
	}
});
