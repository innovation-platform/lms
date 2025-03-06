import React from "react";
import { Modal, Button } from "react-bootstrap";
 
const DocumentViewer = ({ document,filetype, show, onClose }) => {
  if (!document) return null; // Prevent errors if document is undefined
console.log(document,show,onClose)
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Document Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {filetype.startsWith("image/") ? (
          <img
            src={`data:${filetype};base64,${document}`}
            alt="Document Preview"
            className="img-fluid"
          />
        ) : (
          <p>Preview not available for this file type.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
 
export default DocumentViewer;
 