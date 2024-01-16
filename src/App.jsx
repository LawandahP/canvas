/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { throttle } from 'lodash'; // Ensure lodash is installed
import map from "./assets/image.png"
import { ModalComponent } from './Modal';

const App = () => {
  const canvasSize = 52; // in centimeters
  const boxSize = 0.4; // in centimeters
  const numBoxes = Math.floor(canvasSize / boxSize);

  const [currentColor, setCurrentColor] = useState('#FF0000'); // Default color red

  // Using a Set to track selected cells for more efficient updates
  const [selectedCells, setSelectedCells] = useState(new Map());
  // Additional state to track cells that are highlighted during dragging
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const startCellIndexRef = useRef(null);
  const endCellIndexRef = useRef(null);

  // Details inside modal
  const [showModal, setShowModal] = useState(false);
  const [standNumber, setStandNumber] = useState('');
  const [coordinates, setCoordinates] = useState({});

  // useMemo to avoid recalculating grid cells unless numBoxes changes
  const gridCells = useMemo(() => Array.from({ length: numBoxes * numBoxes }), [numBoxes]);


  // calculate the corners of the selected area
  const calculateCorners = (start, end) => {
    const startRow = Math.floor(start / numBoxes);
    const startCol = start % numBoxes;
    const endRow = Math.floor(end / numBoxes);
    const endCol = end % numBoxes;

    const topLeft = Math.min(startRow, endRow) * numBoxes + Math.min(startCol, endCol);
    const topRight = Math.min(startRow, endRow) * numBoxes + Math.max(startCol, endCol);
    const bottomLeft = Math.max(startRow, endRow) * numBoxes + Math.min(startCol, endCol);
    const bottomRight = Math.max(startRow, endRow) * numBoxes + Math.max(startCol, endCol);

    return { topLeft, topRight, bottomLeft, bottomRight };
  };

  const toggleCellSelection = useCallback(() => {
    setSelectedCells((prevSelectedCells) => {
      const newSelection = new Map(prevSelectedCells);
      const start = startCellIndexRef.current;
      const end = endCellIndexRef.current;

      const startRow = Math.floor(start / numBoxes);
      const startCol = start % numBoxes;
      const endRow = Math.floor(end / numBoxes);
      const endCol = end % numBoxes;

      for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
        for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
          const cellIndex = i * numBoxes + j;
          if (newSelection.has(cellIndex)) {
            newSelection.delete(cellIndex); // Unselect if already selected
          } else {
            newSelection.set(cellIndex, currentColor); // Select if not already selected
          }
        }
      }

      return newSelection;
    });

    // Calculate and log the corners of the selected area
    const corners = calculateCorners(startCellIndexRef.current, endCellIndexRef.current);
    console.log('Corners:', corners);
    console.log(highlightedCells)
    // After selection, clear the highlighted cells
    setHighlightedCells(new Set());

    // Update the state variables
    setStandNumber(''); // Reset the stand number
    setCoordinates(calculateCorners(startCellIndexRef.current, endCellIndexRef.current));

    // Open the modal after selection
    setShowModal(true);
  }, [numBoxes, currentColor]);

  const updateHighlightedCells = useCallback((cellIndex) => {
    const newHighlightedCells = new Set();
    const start = startCellIndexRef.current;
    const end = cellIndex;

    const startRow = Math.floor(start / numBoxes);
    const startCol = start % numBoxes;
    const endRow = Math.floor(end / numBoxes);
    const endCol = end % numBoxes;

    for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
      for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
        newHighlightedCells.add(i * numBoxes + j);
      }
    }

    setHighlightedCells(newHighlightedCells);
  }, [numBoxes]);

  const handleMouseDown = useCallback((cellIndex) => {
    setIsDragging(true);
    startCellIndexRef.current = cellIndex;
    // Highlight the initial cell on mouse down
    setHighlightedCells(new Set([cellIndex]));
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    toggleCellSelection();
    // Clear highlighted cells on mouse up
    setHighlightedCells(new Set());
  }, [toggleCellSelection]);

  // Throttle the mouse enter event to improve performance
  const throttledMouseEnter = useCallback(throttle((cellIndex) => {
    if (isDragging) {
      endCellIndexRef.current = cellIndex;
      updateHighlightedCells(cellIndex);
    }
  }, 10), [isDragging, updateHighlightedCells]);

  const gridStyle = useMemo(() => ({
    position: 'relative',
    gridTemplateColumns: `repeat(${numBoxes}, ${boxSize}cm)`,
    gridTemplateRows: `repeat(${numBoxes}, ${boxSize}cm)`,
  }), [numBoxes, boxSize]);

  const canvasStyle = useMemo(() => ({
    position: 'relative',
    width: `${canvasSize}cm`, // Set the width of the canvas
    height: `${canvasSize}cm`, // Set the height of the canvas
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }), [canvasSize]);

  const imageStyle = {
    position: 'absolute',
    maxWidth: '100%',
    maxHeight: '100%',
    border: "1px solid #000000",
    opacity: 0.8 // Set the desired opacity for the image
  };

  const scaleFactor = (canvasSize / 520) * (boxSize / 1);

  // Calculate the actual coordinates based on the given coordinates and the scale factor
  const topLeft = { x: 10 * scaleFactor, y: 510 * scaleFactor };
  const topRight = { x: 510 * scaleFactor, y: 510 * scaleFactor };
  const bottomLeft = { x: 10 * scaleFactor, y: 10 * scaleFactor };
  const bottomRight = { x: 510 * scaleFactor, y: 10 * scaleFactor };

  // // Calculate the width and height of the div based on the coordinates
  const divWidth = Math.abs(topRight.x - topLeft.x);
  const divHeight = Math.abs(bottomLeft.y - topLeft.y);

  // // Calculate the position of the div based on the coordinates
  // const divPosition = { left: topLeft.x, top: topLeft.y };
  const canvasCenter = { x: canvasSize / 2, y: canvasSize / 2 };

  // Adjust the position of the div to center it in the canvas
  const divPosition = { 
    left: canvasCenter.x - divWidth / 2, 
    top: canvasCenter.y - divHeight / 2 
  };

  return (

    <>
      <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 10, zIndex: 10,
          position: 'fixed',
        }}>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
        />

        <button
          onClick={() => setSelectedCells(new Map())} // Clears all selections// Adjust the position as needed
        >
          Clear All Selections
        </button>
      </div>
      
    
      <div style={canvasStyle}>
        {/* Color picker to select the color */}
        <div style={{ 
            position: 'absolute', 
            left: `${divPosition.left}cm`, 
            top: `${divPosition.top}cm`, 
            width: `${divWidth}cm`, 
            height: `${divHeight}cm`,
            zIndex: -1 // To place it beneath the grid
          }}>
          <img
            src={map}
            alt="Background"
            style={imageStyle}
          />
        </div>
        <div
          className="grid"
          style={gridStyle}
          onMouseUp={handleMouseUp}
        >
          {gridCells.map((_, index) => {
            const isSelected = selectedCells.has(index);
            const cellColor = isSelected ? selectedCells.get(index) : '';
            return (
              <div
                key={index}
                className={`box ${isSelected ? 'selected' : ''} ${highlightedCells.has(index) ? 'highlighted' : ''}`}
                style={{ backgroundColor: cellColor }} // Apply the background color
                onMouseDown={() => handleMouseDown(index)}
                onMouseEnter={() => throttledMouseEnter(index)}
              />
            );
          })}
        </div>
      </div>
      <ModalComponent 
        showModal={showModal} 
        handleClose={() => setShowModal(false)} 
        standNumber={standNumber} 
        setStandNumber={setStandNumber} 
        coordinates={coordinates} 
      />
    </>
  );
};

export default App;

