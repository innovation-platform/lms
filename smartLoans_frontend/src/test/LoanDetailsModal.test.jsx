import { render, screen, fireEvent } from '@testing-library/react';
import { BankerContext } from '../contexts/BankerContext';
import LoanDetailsModal from '../components/Banker/LoanDetailsModal';
import { vi } from 'vitest';

const mockLoan = {
  loanId: 1,
  customerName: 'John Doe',
  email: 'johndoe@example.com',
  accountNumber: '1234567890',
  panNumber: 'ABCDE1234F',
  loanAmount: 50000,
  status: 'pending',
  cibilScore: 750,
  itrValue: 50000,
  documents: [
    { filename: 'Document1.pdf', data: 'fileData1', mimetype: 'application/pdf' },
    { filename: 'Document2.jpg', data: 'fileData2', mimetype: 'image/jpeg' }
  ],
  remarks: 'Pending verification'
};

const mockHandleViewDocument = vi.fn();
const mockHandleDownload = vi.fn();
const mockHandleStatusChange = vi.fn();
const mockHandleDocumentVerification = vi.fn();
const mockHandleRemarksChange = vi.fn();
const mockSetShowModal = vi.fn();
const mockSetShowViewer = vi.fn();

describe('LoanDetailsModal', () => {
  test('renders loan details when selectedLoan is provided', () => {
    render(
      <BankerContext.Provider
        value={{
          selectedLoan: mockLoan,
          showModal: true,
          documentsVerified: false,
          remarks: '',
          isButtonsDisabled: false,
          DocumentSelected: false,
          showViewer: false,
          selectedDocument: null,
          selectedDocType: null,
          setShowModal: mockSetShowModal,
          setDocumentsVerified: vi.fn(),
          setRemarks: vi.fn(),
          setShowViewer: mockSetShowViewer,
          handleStatusChange: mockHandleStatusChange,
          handleDocumentVerification: mockHandleDocumentVerification,
          handleRemarksChange: mockHandleRemarksChange,
          handleDownload: mockHandleDownload,
          handleViewDocument: mockHandleViewDocument,
        }}
      >
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    // Check if customer name is displayed
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/₹50000/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });

  // test('renders the "Verify Documents" checkbox and "Remarks" for pending loans', () => {
  //   render(
  //     <BankerContext.Provider
  //       value={{
  //         selectedLoan: mockLoan,
  //         showModal: true,
  //         documentsVerified: false,
  //         remarks: '',
  //         isButtonsDisabled: false,
  //         DocumentSelected: false,
  //         showViewer: false,
  //         selectedDocument: null,
  //         selectedDocType: null,
  //         setShowModal: mockSetShowModal,
  //         setDocumentsVerified: vi.fn(),
  //         setRemarks: vi.fn(),
  //         setShowViewer: mockSetShowViewer,
  //         handleStatusChange: mockHandleStatusChange,
  //         handleDocumentVerification: mockHandleDocumentVerification,
  //         handleRemarksChange: mockHandleRemarksChange,
  //         handleDownload: mockHandleDownload,
  //         handleViewDocument: mockHandleViewDocument,
  //       }}
  //     >
  //       <LoanDetailsModal />
  //     </BankerContext.Provider>
  //   );

  //   // Verify that the "I have verified all documents" checkbox is rendered
  //   expect(screen.getByLabelText(/I have verified all documents/i)).toBeInTheDocument();

  //   // Verify that the remarks textarea is rendered
  //   expect(screen.getByLabelText(/remarks/i)).toBeInTheDocument();
  // });

  test('calls handleViewDocument when "View" button is clicked', () => {
    render(
      <BankerContext.Provider
        value={{
          selectedLoan: mockLoan,
          showModal: true,
          documentsVerified: false,
          remarks: '',
          isButtonsDisabled: false,
          DocumentSelected: false,
          showViewer: false,
          selectedDocument: null,
          selectedDocType: null,
          setShowModal: mockSetShowModal,
          setDocumentsVerified: vi.fn(),
          setRemarks: vi.fn(),
          setShowViewer: mockSetShowViewer,
          handleStatusChange: mockHandleStatusChange,
          handleDocumentVerification: mockHandleDocumentVerification,
          handleRemarksChange: mockHandleRemarksChange,
          handleDownload: mockHandleDownload,
          handleViewDocument: mockHandleViewDocument,
        }}
      >
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    // Click on "View" for the first document
    const viewButton = screen.getAllByRole('button', { name: /view/i })[0];
    fireEvent.click(viewButton);

    // Check if handleViewDocument is called with the correct document data
    expect(mockHandleViewDocument).toHaveBeenCalledWith('fileData1', 'application/pdf');
  });

  test('calls handleStatusChange when "Approve" button is clicked', () => {
    render(
      <BankerContext.Provider
        value={{
          selectedLoan: mockLoan,
          showModal: true,
          documentsVerified: false,
          remarks: 'Approve the loan',
          isButtonsDisabled: false,
          DocumentSelected: false,
          showViewer: false,
          selectedDocument: null,
          selectedDocType: null,
          setShowModal: mockSetShowModal,
          setDocumentsVerified: vi.fn(),
          setRemarks: vi.fn(),
          setShowViewer: mockSetShowViewer,
          handleStatusChange: mockHandleStatusChange,
          handleDocumentVerification: mockHandleDocumentVerification,
          handleRemarksChange: mockHandleRemarksChange,
          handleDownload: mockHandleDownload,
          handleViewDocument: mockHandleViewDocument,
        }}
      >
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    // Click on "Approve"
    const approveButton = screen.getByRole('button', { name: /approve/i });
    fireEvent.click(approveButton);

    // Check if handleStatusChange is called with correct parameters
    expect(mockHandleStatusChange).toHaveBeenCalledWith(mockLoan.loanId, 'approve', 'Approve the loan');
  });
});
