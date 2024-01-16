/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';


export const ModalComponent = ({ showModal, handleClose, standNumber, setStandNumber, coordinates }) => {
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
            <Form.Label>Coordinates</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(coordinates)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};