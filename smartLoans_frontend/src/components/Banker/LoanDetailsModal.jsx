import React, { useContext } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { BankerContext } from "../../contexts/BankerContext";
import DocumentViewer from "./ViewDocument";
 
const LoanDetailsModal = () => {
  const {
    selectedLoan,
    showModal,
    documentsVerified,
    remarks,
    isButtonsDisabled,
    DocumentSelected,
    showViewer,
    selectedDocument,
    selectedDocType,
    setShowModal,
    setDocumentsVerified,
    setRemarks,
    setShowViewer,
    handleStatusChange,
    handleDocumentVerification,
    handleRemarksChange,
    handleDownload,
    handleViewDocument
  } = useContext(BankerContext);
 
  return (
    <>
      {selectedLoan && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton className="border-bottom">
            <Modal.Title>Loan Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="p-3">
              <div className="row mb-4">
                <div className="col-md-6">
                  <p><strong>Customer:</strong> {selectedLoan.customerName}</p>
                  <p><strong>Email:</strong> {selectedLoan.email}</p>
                  <p><strong>Account Number:</strong> {selectedLoan.accountNumber}</p>
                  <p><strong>PAN Number:</strong> {selectedLoan.panNumber}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Loan Amount:</strong> ₹{selectedLoan.loanAmount}</p>
                  <p><strong>Status:</strong> {selectedLoan.status}</p>
                  <p><strong>CIBIL Score:</strong> {selectedLoan.cibilScore}</p>
                  <p><strong>ITR Value:</strong> {selectedLoan.itrValue}</p>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="mb-3">Documents:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {selectedLoan.documents?.map((doc, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <span>{doc.filename}</span>
                      <Button variant="outline-primary" onClick={() => handleViewDocument(doc.data, doc.mimetype)}>
                        View
                      </Button>
                      <Button variant="outline-secondary" onClick={() => handleDownload(doc.data, doc.filename)}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {selectedLoan.status.toLowerCase() === "pending" ? (
                <>
                  <Form.Check
                    type="checkbox"
                    label="I have verified all documents"
                    checked={documentsVerified}
                    onChange={handleDocumentVerification}
                    className="mb-3"
                  />
                  <Form.Group className="mb-4">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={remarks}
                      onChange={handleRemarksChange}
                      placeholder="Enter remarks here"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="danger"
                      onClick={() => handleStatusChange(selectedLoan.loanId, "reject", remarks)}
                      disabled={isButtonsDisabled}
                      style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleStatusChange(selectedLoan.loanId, "approve", remarks)}
                      disabled={isButtonsDisabled}
                      style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }}
                    >
                      Approve
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <h4>Remarks</h4>
                  <p className="p-3 bg-light rounded">{selectedLoan.remarks}</p>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
      {DocumentSelected && (
        <DocumentViewer
          document={selectedDocument}
          filetype={selectedDocType}
          show={showViewer}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};
 
export default LoanDetailsModal;