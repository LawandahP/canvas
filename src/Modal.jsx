/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';


export const ModalComponent = ({
   showModal, handleClose, coordinates, selectedCells,
   clearSelectionByCells, selectionColors,
  currentSelection, setSelectionColors }) => {

  const handleClearSelection = () => {
    clearSelectionByCells(selectedCells);
    handleClose(); // Close the modal after clearing the selection
  };

  const [ standNumber, setStandNumber ] = useState('')
  const [ boxId, setBoxId ] = useState('')

  const handleSubmit = async () => {
    const data = {
      color_code: selectionColors[currentSelection],
      colm_number: `c${coordinates[0][0]}`,
      row_number: `r${coordinates[0][1]}`,
      box_id: boxId,
      stand_number: standNumber
      // selectedCells,
      // coordinates,
    };

    console.log(data)

    const response = await fetch('https://100085.pythonanywhere.com/api/v1/bett_event/65a7c19dc5b56cc2cab6c986/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle error
      console.error('Failed to submit data', response);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Selection Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formStandNumber">
            <Form.Label>Box Id</Form.Label>
            <Form.Control 
              type="text" 
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStandNumber">
            <Form.Label>Stand Number</Form.Label>
            <Form.Control type="text" placeholder="Enter stand number" value={standNumber} onChange={(e) => setStandNumber(e.target.value)} />
          </Form.Group>

          <Form.Group  controlId="formStandNumber">
            <Form.Label>Row Number</Form.Label>
            <Form.Control 
              type="text" 
              readOnly
              value={coordinates[0] ? `r${coordinates[0][1]}` : ''} />
          </Form.Group>

          <Form.Group  className="mb-2" controlId="formStandNumber">
            <Form.Label>Column Number</Form.Label>
            <Form.Control 
              type="text" 
              value={coordinates[0] ? `c${coordinates[0][0]}` : ''}
              readOnly
            />
          </Form.Group>

          

          {/* <Form.Group controlId="formCoordinates">
            <Form.Label>Selection Coordinates</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(coordinates)} />
          </Form.Group>

          <Form.Group controlId="formCoordinates">
            <Form.Label>Selected Cells</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(selectedCells)} />
          </Form.Group> */}

          <div style={{display: 'flex', marginTop: "5px", gap: "10px", alignItems: 'center'}}>
            <Form.Label>Select Color</Form.Label>
              <input
                type="color"
                value={selectionColors[currentSelection] ? selectionColors[currentSelection] : "#0e1df6" }
                onChange={(e) => {
                  const newColors = [...selectionColors];
                  newColors[currentSelection] = e.target.value;
                  setSelectionColors(newColors);
                }}
              />
          </div>
        </Form>
          
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="danger" onClick={handleClearSelection}>
          Clear Selection
        </Button>
      </Modal.Footer>
    </Modal>
  );
};