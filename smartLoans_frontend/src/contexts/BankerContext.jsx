import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
 
export const BankerContext = createContext();
 
export const BankerProvider = ({ children, token, user }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true);
  const [DocumentSelected, SetDocumentSelected] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
 
  useEffect(() => {
    if (selectedLoan) {
      setDocumentsVerified(selectedLoan.documentVerification);
      setRemarks(selectedLoan.remarks);
    }
  }, [selectedLoan]);
 
  useEffect(() => {
    setIsButtonsDisabled(!(documentsVerified && remarks?.trim() !== ""));
  }, [documentsVerified, remarks]);
 
  useEffect(() => {
    fetchLoans();
  }, []);
 
  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:2000/api/banker/loans", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };
 
  const handleViewDetails = async (loan, loanIndex) => {
    try {
      const response = await axios.patch(`http://localhost:2000/api/banker/scores`, {
        loanId: loan.loanId,
        panNumber: loan.panNumber,token
      },{
        headers:{
          Authorization:`BEARER ${token}`
        }
      });
      const updatedLoan = response.data;
      console.log("Updated Loan Data:", updatedLoan); // Log the updated loan data
      SetDocumentSelected(true);
      setSelectedLoan(updatedLoan);
      setRemarks(updatedLoan.remarks || "");
      setShowModal(true); // Ensure modal is shown
    } catch (error) {
      console.error("Error updating loan scores:", error.response ? error.response.data : error.message);
    }
  };
 
  const handleStatusChange = async (loanId, status, remarks) => {
    try {
      await axios.patch(`http://localhost:2000/api/banker/${status}`, { loanId, remarks });
      fetchLoans(); // Refresh loan list
      setShowModal(false);
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };
 
  const handleViewDocument = (base64Data, filename) => {
    try {
      setSelectedDocument(base64Data);
      setSelectedDocType(filename);
      setShowViewer(true);
    } catch (error) {
      console.error("Error viewing document:", error);
    }
  };
 
  const handleDocumentVerification = () => {
    setDocumentsVerified(!documentsVerified);
  };
 
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };
 
  const handleDownload = (base64Data, filename) => {
    try {
      const base64WithoutPrefix = base64Data.split(",")[1] || base64Data;
      const byteCharacters = atob(base64WithoutPrefix);
      const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);
 
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
 
  return (
    <BankerContext.Provider
      value={{
        loans,
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
        setSelectedDocument,
        setSelectedDocType,
        handleViewDetails,
        handleStatusChange,
        handleViewDocument,
        handleDocumentVerification,
        handleRemarksChange,
        handleDownload,
        fetchLoans
      }}
    >
      {children}
    </BankerContext.Provider>
  );
};