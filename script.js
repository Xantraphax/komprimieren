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
		adjustTreeContainerHeight();
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
		adjustTreeContainerHeight();
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
		adjustTreeContainerHeight();
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
				adjustTreeContainerHeight();
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

// Funktion zum Überprüfen, auf welcher Ebene ein Buchstabe im Baum vorkommt
function searchTreeForLetters(letterCounts) {
  const nodes = document.querySelectorAll(".node");

  // Objekt für die Speicherung von Buchstabeninformationen (Häufigkeit und Ebenen)
  const letterInfo = {};

  // Durchlaufe alle Knoten im Baum und prüfe, ob der Buchstabe im Knotenwert vorhanden ist
  nodes.forEach(node => {
    const input = node.querySelector('input');
    const nodeValue = input.value.trim().toLowerCase();
    const level = node.dataset.key.split('-')[0]; // Die Ebene des Knotens extrahieren

    // Überprüfe, ob der Buchstabe im Knotenwert vorhanden ist
    for (const letter in letterCounts) {
      if (nodeValue.includes(letter)) {
        // Wenn der Buchstabe im Knoten vorkommt, füge die Ebene hinzu
        if (!letterInfo[letter]) {
          letterInfo[letter] = {
            frequency: letterCounts[letter],  // Die Häufigkeit des Buchstabens im Text
            levels: [],  // Liste der Ebenen, auf denen der Buchstabe im Baum vorkommt
            multipleOccurrences: false,  // Flag für mehrfaches Vorkommen
            isPrefix: false  // Flag, ob der Buchstabe auf dem Pfad zur Wurzel liegt
          };
        }

        // Füge die Ebene hinzu, wenn sie noch nicht existiert
        if (!letterInfo[letter].levels.includes(level)) {
          letterInfo[letter].levels.push(level-1);
        }

        // Überprüfe, ob der Buchstabe mehrfach im Baum vorkommt
        if (letterInfo[letter].levels.length > 1) {
          letterInfo[letter].multipleOccurrences = true;
        }

        // Überprüfen, ob der Buchstabe ein Präfix ist
        const parentKey = getParentKey(node.dataset.key);
        if (parentKey) {
          letterInfo[letter].isPrefix = true;
        }
      }
    }
  });

  // Wenn der Buchstabe nicht im Baum ist, setze die Ebenen auf "-"
  for (const letter in letterCounts) {
    if (!letterInfo[letter]) {
      letterInfo[letter] = {
        frequency: letterCounts[letter],  // Die Häufigkeit aus dem Text
        levels: ['-'],  // Setze "-" als Platzhalter für die Ebenen
        multipleOccurrences: false,  // Keine mehrfachen Vorkommen
        isPrefix: false  // Kein Präfix
      };
    }
  }

  // Tabelle mit den Informationen aktualisieren
  updateTable(letterInfo);
}

// Hilfsfunktion, um den Elterneintrag (Pfad zur Wurzel) zu bekommen
function getParentKey(key) {
  const [level, index] = key.split('-').map(Number);

  // Basisfall 1: Wurzel erreicht → Rekursion beenden
  if (level === 1) return null;

  // Berechne den Elternknoten
  const startIndex = Math.pow(2, level - 1);
const startIndexParent = Math.pow(2, level - 2);
const relativeIndex = index - startIndex;
const parentIndex = Math.floor(relativeIndex / 2) + startIndexParent;
const parentKey = `${level - 1}-${parentIndex}`;

  // Finde den Elternknoten im DOM
  const parentNode = document.querySelector(`[data-key="${parentKey}"]`);

  // Basisfall 2: Elternknoten existiert und hat einen Inputwert → Rekursion beenden
  if (parentNode) {
    const input = parentNode.querySelector('input');
    if (input && input.value.trim()) {
      console.log("Knoten");
	  return true; // Stoppt die Rekursion, weil ein Wert gefunden wurde 
    }
  }

  // Rekursiver Aufruf für den nächsten Elternknoten
  return getParentKey(parentKey);
}


// Funktion zum Aktualisieren der Tabelle mit den Buchstabeninformationen
function updateTable(letterInfo) {
  const tbody = document.querySelector("#result-table tbody");
  tbody.innerHTML = ""; // Tabelle leeren
  
  // Durchlaufen der Buchstabeninformationen
  for (const letter in letterInfo) {
    const data = letterInfo[letter];
    const row = document.createElement("tr");

    // Bestimme die Codelänge basierend auf den Flags
    let codelength = "-";
    if (data.multipleOccurrences) {
      codelength = "mehr.";
    } else if (data.isPrefix) {
      codelength = "präfix";
    } else if (data.levels.length > 0) {
      codelength = data.levels.join(", ");
    }

    // Füge die Zeile in die Tabelle ein
    row.innerHTML = `<td>${letter}</td><td>${data.frequency}</td><td>${codelength}</td>`;
    tbody.appendChild(row);
  }
  calculateWeightedSum(letterInfo);
}


document.getElementById("count-button").addEventListener("click", function() {
  const text = document.getElementById("input-text").value.toLowerCase();
  const letterCounts = {};

  // Zähle die Vorkommen der Buchstaben im Text
  for (const char of text) {
    if (char.match(/[a-zäöüß]/)) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
  }

  // Leere die Tabelle, bevor neue Daten eingefügt werden
  const tbody = document.querySelector("#result-table tbody");
  tbody.innerHTML = "";

  // Zeige die gezählten Buchstaben und deren Häufigkeit in der Tabelle an
  for (const [letter, count] of Object.entries(letterCounts).sort()) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${letter}</td><td>${count}</td><td></td>`;
    tbody.appendChild(row);
  }

  // Überprüfe, auf welchen Ebenen der Buchstabe im Baum vorkommt und aktualisiere die Tabelle
  searchTreeForLetters(letterCounts);
});

function adjustTreeContainerHeight() {
  const treeContainer = document.getElementById("tree-container");
  const nodes = document.querySelectorAll(".node");

  if (nodes.length === 0) {
    treeContainer.style.height = "100vh"; // Standardhöhe, wenn kein Baum existiert
    return;
  }

  let maxBottom = 0;

  nodes.forEach(node => {
    const nodeRect = node.getBoundingClientRect();
    const containerRect = treeContainer.getBoundingClientRect();
    const bottomPosition = nodeRect.bottom - containerRect.top; // Abstand zur Oberkante des Containers

    if (bottomPosition > maxBottom) {
      maxBottom = bottomPosition;
    }
  });

  // Puffer hinzufügen (z. B. 20px) für bessere Darstellung
  treeContainer.style.height = `${maxBottom + 20}px`;
}

// Rufe die Funktion nach jeder Baumänderung auf
window.addEventListener("resize", adjustTreeContainerHeight);
document.addEventListener("DOMContentLoaded", adjustTreeContainerHeight);

function calculateWeightedSum(letterInfo) {
  let allAssigned = true;
  let sum = 0;
  let calculationText = [];

  for (const letter in letterInfo) {
    const frequency = letterInfo[letter].frequency;
    const levels = letterInfo[letter].levels;

    // Falls ein Buchstabe eine "-" als Ebene hat, abbrechen
    if (levels.includes('-')) {
      allAssigned = false;
      break;
    }

    // Falls "mehr." oder "präfix" vorkommt, überspringen
    if (levels.includes("mehr.") || levels.includes("präfix")) continue;

    // Berechnung für jeden Buchstaben
    const level = parseInt(levels[0]); // Nehme die erste zugewiesene Ebene
    const product = frequency * level;
    sum += product;
    calculationText.push(`(${frequency} × ${level})`);
  }

  // Falls alle Buchstaben eine Ebene haben, Rechnung anzeigen
  const resultContainer = document.getElementById("calculation-result");
  if (allAssigned) {
    resultContainer.innerHTML = `<strong>Berechnung:</strong> ${calculationText.join(" + ")} = <strong>${sum} bit</strong>`;
    resultContainer.style.display = "block";
  } else {
    resultContainer.style.display = "none"; // Falls nicht alle Buchstaben eine Ebene haben, ausblenden
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const showCounter = urlParams.has("counter"); // ?counter in URL aktivieren

  const letterCounter = document.getElementById("letter-counter");

  if (!showCounter && letterCounter) {
    letterCounter.style.display = "none";
  }
});
