import { useState, useMemo, useEffect } from 'react';
import map from "./assets/Updated_Venue_Map_Aligned_50_x_50_cm.svg"
import { ModalComponent } from './Modal'

const Canvas = () => {
  const canvasSize = 52; // in centimeters
  const boxSize = 0.1; // in centimeters
  const numBoxes = canvasSize / boxSize; // Number of boxes per side

  const [cellsSelected, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);

  const [selections, setSelections] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null)

  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [selectionColors, setSelectionColors] = useState([]);
  
  const getCellCoords = (index) => ({
    x: index % numBoxes,
    y: Math.floor(index / numBoxes) + 1,
  });

  const handleMouseDown = (cellIndex) => {
    setIsDragging(true);
    setStartCell(cellIndex);
    setEndCell(cellIndex);
    // Start a new selection
    console.log("endCell", endCell)
    setCurrentSelection(selections.length);
    setSelections(prevSelections => [...prevSelections, new Set([cellIndex])]);
  };
  

  const handleMouseEnter = (cellIndex) => {
    if (isDragging && currentSelection !== null) {
      setEndCell(cellIndex);
      setSelections(prevSelections => {
        const newSelections = [...prevSelections];
        const currentSel = newSelections[currentSelection];
        const startCoords = getCellCoords(startCell);
        const endCoords = getCellCoords(cellIndex);
        const minX = Math.min(startCoords.x, endCoords.x);
        const maxX = Math.max(startCoords.x, endCoords.x);
        const minY = Math.min(startCoords.y, endCoords.y);
        const maxY = Math.max(startCoords.y, endCoords.y);
        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            currentSel.add(y * numBoxes + x);
          }
        }
        newSelections[currentSelection] = currentSel;
        return newSelections;
      });
    }
  };
    
  const handleCellClick = (cellIndex) => {
    // Find the selection that contains the clicked cell
    const selectionIndex = selections.findIndex(selection => selection.has(cellIndex));
    if (selectionIndex !== -1) {
      // Set the current selection
      setCurrentSelection(selectionIndex);
      // Get the selected cells from the selection
      const selectedCells = Array.from(selections[selectionIndex]);
      console.log('Selected cells:', selectedCells);
      // Calculate and log the coordinates of the selection
      const coords = selectedCells.map(getCellCoords);
      const xCoords = coords.map(coord => coord.x);
      const yCoords = coords.map(coord => coord.y);
      const minX = Math.min(...xCoords);
      const maxX = Math.max(...xCoords);
      const minY = Math.min(...yCoords);
      const maxY = Math.max(...yCoords);
      const topLeftCoords = { x: minX, y: minY };
      const topRightCoords = { x: maxX, y: minY };
      const bottomLeftCoords = { x: minX, y: maxY };
      const bottomRightCoords = { x: maxX, y: maxY };
      const topLeft = [topLeftCoords.x, topLeftCoords.y]
      const topRight = [topRightCoords.x, topRightCoords.y]
      const bottomLeft = [bottomLeftCoords.x, bottomLeftCoords.y]
      const bottomRight = [bottomRightCoords.x, bottomRightCoords.y];

      console.log(`Selection coordinates: 
        topLeft: ${topLeft},
        topRight: ${topRight}
        bottomLeft: ${bottomLeft},
        bottomRight: ${bottomRight}`
      )
        setCoordinates([topLeft, topRight, bottomLeft, bottomRight])
        setSelectedCells(selectedCells)
        setShowModal(true)
    }
  }


  const handleMouseUp = () => {
    setIsDragging(false);
    // const selectedArray = Array.from(selections[currentSelection] || []).sort((a, b) => a - b);    console.log('Selected cells:', selectedArray);
    // // Log the coordinates of the selection
    // if (selectedArray.length > 0) {
    //   const topLeftCoords = getCellCoords(selectedArray[0]);
    //   const bottomRightCoords = getCellCoords(selectedArray[selectedArray.length - 1]);
    //   const topRightCoords = { x: bottomRightCoords.x, y: topLeftCoords.y };
    //   const bottomLeftCoords = { x: topLeftCoords.x, y: bottomRightCoords.y };
    //   console.log(` [[topLeft], [topRight], [bottomLeft], [bottomRight ] 
    // [[${topLeftCoords.x}, ${topLeftCoords.y}], [${topRightCoords.x}, ${topRightCoords.y}], [${bottomLeftCoords.x}, ${bottomLeftCoords.y}], [${bottomRightCoords.x}, ${bottomRightCoords.y}]]`);
    // }
  };

  const clearSelectionByCells = (selectedCellsToRemove) => {
    setSelections(prevSelections => {
      // Convert the array of cells to remove into a Set for efficient lookup
      const cellsToRemoveSet = new Set(selectedCellsToRemove);
  
      // Filter out the selection that matches the cells to remove
      const newSelections = prevSelections.filter(selection => {
        // Check if the selection has any of the cells to remove
        const hasCellToRemove = Array.from(selection).some(cell => cellsToRemoveSet.has(cell));
        return !hasCellToRemove;
      });
  
      return newSelections;
    });
  };

  const gridCells = Array.from({ length: numBoxes * numBoxes }, (_, index) => index + 1);

    const canvasStyle = useMemo(() => ({
    position: 'relative',
    width: `${canvasSize}cm`, // Set the width of the canvas
    height: `${canvasSize}cm`, // Set the height of the canvas
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }), [canvasSize]);

//   useEffect(() => {
//     const savedSelections = localStorage.getItem('selections');
//     if (savedSelections) {
//       setSelections(JSON.parse(savedSelections).map(selection => new Set(selection)));
//     }
//   }, []);

    const dummySelections = [
        {
            selectedCells: [4073,4203,4333,4074,4204,4334,4075,4205,4335,4076,4206,4336,4077,4207,4337,4463,4593,4723,4464,4594,4724,4465,4595,4725,4466,4596,4726,4467,4597,4727,4078,4208,4338,4468,4598,4728,4079,4209,4339,4469,4599,4729,4080,4210,4340,4470,4600,4730,4081,4211,4341,4471,4601,4731],
            bgColor: "#8c2d2d",
            coordinates: [[38,12],[40,12],[38,15],[40,15]]
        },
    ];

    // This function plays an api
  const initializeSelectionsWithDummyData = () => {
    // Map the dummy data to selection sets
    const newSelections = dummySelections.map(sel => new Set(sel.selectedCells));
    const newSelectionColors = dummySelections.map(sel => sel.bgColor);
    setSelections(newSelections);
    setSelectionColors(newSelectionColors);

    // If you need to use the coordinates as well, you can set them here
    // For example, if you want to store the coordinates of the first selection:
    // setCoordinates(dummySelections[0].coordinates);
  };

  useEffect(() => {
    // Initialize selections when the component mounts
    initializeSelectionsWithDummyData();
  }, []); // Empty dependency array to run only once on mount


  return (

    <>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 10, zIndex: 10,
          position: 'fixed',
        }}>

        <button
          onClick={() => setSelections([])} // Clears all selections// Adjust the position as needed
        >
          Clear All Selections
        </button>
      </div>

        <div style={canvasStyle}>
            <div style={{ 
                position: 'absolute', 
                left: `${boxSize * 10}cm`, 
                top: `${boxSize * 10}cm`, 
                width: `${canvasSize - boxSize * 20}cm`, 
                height: `${canvasSize - boxSize * 20}cm`,
                zIndex: -1 // To place it beneath the grid
                }}>
                <img
                    src={map}
                    alt="Background"
                />
            </div>
    
            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${numBoxes}, ${boxSize}cm)`,
                    gridTemplateRows: `repeat(${numBoxes}, ${boxSize}cm)`,
                    width: `${canvasSize}cm`,
                    height: `${canvasSize}cm`,
                    border: '1px solid black',
                    userSelect: 'none' // Prevent text selection
                }}
                onMouseLeave={() => isDragging && setIsDragging(false)}
                >
                {gridCells.map((cellIndex) => {
                    const selectionIndex = selections.findIndex(selection => selection.has(cellIndex));
                    const isSelected = selectionIndex !== -1;
                    const color = isSelected ? selectionColors[selectionIndex] : 'transparent';
                    return (
                        <div
                        key={cellIndex}
                        className={`box ${isSelected ? 'selected' : ''}`}
                        style={{
                            border: '1px solid #ddd',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            backgroundColor: color
                        }}
                        onMouseDown={() => handleMouseDown(cellIndex)}
                        onMouseEnter={() => handleMouseEnter(cellIndex)}
                        onMouseUp={handleMouseUp}
                        onClick={() => handleCellClick(cellIndex)}
                        />
                    );
                })}
            </div>
        </div>

        <ModalComponent 
            showModal={showModal} 
            handleClose={() => setShowModal(false)} 
            coordinates={coordinates} 
            selectedCells={cellsSelected}
            clearSelectionByCells={clearSelectionByCells}
            selectionColors={selectionColors}
            setSelectionColors={setSelectionColors}
            currentSelection={currentSelection}
        />
    </>
  );
};

export default Canvas;