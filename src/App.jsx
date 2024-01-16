/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { throttle } from 'lodash'; // Ensure lodash is installed
import map from "./assets/image.png"
const App = () => {
  const canvasSize = 54; // in centimeters
  const boxSize = 0.1; // in centimeters
  const numBoxes = Math.floor(canvasSize / boxSize);

  // Using a Set to track selected cells for more efficient updates
  const [selectedCells, setSelectedCells] = useState(new Set());
  // Additional state to track cells that are highlighted during dragging
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const startCellIndexRef = useRef(null);
  const endCellIndexRef = useRef(null);

  // useMemo to avoid recalculating grid cells unless numBoxes changes
  const gridCells = useMemo(() => Array.from({ length: numBoxes * numBoxes }), [numBoxes]);

  const toggleCellSelection = useCallback(() => {
    setSelectedCells((prevSelectedCells) => {
      const newSelection = new Set(prevSelectedCells);
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
            newSelection.add(cellIndex); // Select if not already selected
          }
        }
      }

      return newSelection;
    });
    // After selection, clear the highlighted cells
    setHighlightedCells(new Set());
  }, [numBoxes]);

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

  return (

    <div style={{ position: 'relative' }}>
      <img
        src={map} // Replace with the path to your image
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.8 // Set the desired opacity for the image
        }}
      />
      <div
        className="grid"
        style={gridStyle}
        onMouseUp={handleMouseUp}
      >
        {gridCells.map((_, index) => (
          <div
            key={index}
            className={`box ${selectedCells.has(index) ? 'selected' : ''} ${highlightedCells.has(index) ? 'highlighted' : ''}`}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => throttledMouseEnter(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;