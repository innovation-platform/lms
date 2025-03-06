import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DocumentViewer from '../components/Banker/ViewDocument';

describe('DocumentViewer', () => {
  it('does not render anything if document is not passed', () => {
    render(<DocumentViewer document={null} filetype="image/jpeg" show={true} onClose={vi.fn()} />);
    expect(screen.queryByText('Document Preview')).toBeNull();
  });

  it('renders a modal with image preview when a valid image is passed', () => {
    const document = 'base64string';
    const filetype = 'image/jpeg';
    const onClose = vi.fn();
    
    render(<DocumentViewer document={document} filetype={filetype} show={true} onClose={onClose} />);
    
    // Check if the modal title exists
    expect(screen.getByText('Document Preview')).toBeInTheDocument();
    
    // Check if the image element exists
    const imgElement = screen.getByRole('img'); // Query by role instead of tag name
    expect(imgElement).toHaveAttribute('src', `data:${filetype};base64,${document}`);
  });

  it('renders a placeholder message for non-image file types', () => {
    const document = 'base64string';
    const filetype = 'application/pdf';
    
    render(<DocumentViewer document={document} filetype={filetype} show={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('Preview not available for this file type.')).toBeInTheDocument();
  });

  it('calls onClose function when close button is clicked', () => {
    const document = 'base64string';
    const filetype = 'image/jpeg';
    const onClose = vi.fn();

    render(<DocumentViewer document={document} filetype={filetype} show={true} onClose={onClose} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render modal when show is false', () => {
    const document = 'base64string';
    const filetype = 'image/jpeg';
    const onClose = vi.fn();

    render(<DocumentViewer document={document} filetype={filetype} show={false} onClose={onClose} />);
    
    expect(screen.queryByText('Document Preview')).toBeNull();
  });

  it('renders modal when show is true', () => {
    const document = 'base64string';
    const filetype = 'image/jpeg';
    const onClose = vi.fn();

    render(<DocumentViewer document={document} filetype={filetype} show={true} onClose={onClose} />);
    
    expect(screen.getByText('Document Preview')).toBeInTheDocument();
  });
});
