/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';


export const ModalComponent = ({
   showModal, handleClose, standNumber,
  setStandNumber, coordinates, selectedCells,
   clearSelectionByCells, selectionColors,
  currentSelection, setSelectionColors }) => {

  const handleClearSelection = () => {
    clearSelectionByCells(selectedCells);
    handleClose(); // Close the modal after clearing the selection
  };

  const handleSubmit = async () => {
    const data = {
      color: selectionColors[currentSelection],
      selectedCells,
      coordinates,
    };

    console.log(data)

    // const response = await fetch('http://your-api-url', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   // Handle error
    //   console.error('Failed to submit data', response);
    // }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Selection Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStandNumber">
            <Form.Label>Stand Number</Form.Label>
            <Form.Control type="text" placeholder="Enter stand number" value={standNumber} onChange={(e) => setStandNumber(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formCoordinates">
            <Form.Label>Selection Coordinates</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(coordinates)} />
          </Form.Group>

          <Form.Group controlId="formCoordinates">
            <Form.Label>Selected Cells</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(selectedCells)} />
          </Form.Group>

          <input
            type="color"
            value={selectionColors[currentSelection]}
            onChange={(e) => {
              const newColors = [...selectionColors];
              newColors[currentSelection] = e.target.value;
              setSelectionColors(newColors);
            }}
          />
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