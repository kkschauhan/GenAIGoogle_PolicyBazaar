import React, { useState } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import logo from './policybazaar_logo.png';


const ClaimForm = () => {
  const [show, setShow] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    policyNumber: '',
    claimAmount: '',
    claimDescription: '',
    dateOfIncident: '',
    document: null,
  });
  const [ocrData, setOcrData] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
    processDocument(e.target.files[0]);
  };

  const processDocument = (file) => {
    Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setOcrData(text);
        autofillForm(text);
      })
      .catch((error) => {
        console.error('Error processing document:', error);
      });
  };

  const extractDataFromText = (text) => {
    // Extract date of incident in format (dd/mm/yyyy or yyyy-mm-dd)
    const dateRegex = /(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/;
    const foundDate = text.match(dateRegex);
    if (foundDate) {
      setFormData({ ...formData, dateOfIncident: foundDate[0] });
    }
  };

  const autofillForm = (ocrText) => {
    const nameMatch = ocrText.match(/Name:\s*(.*)/);
    const policyMatch = ocrText.match(/Policy Number:\s*(.*)/);
    const dateMatch = ocrText.match(/Date of Incident:\s*(.*)/);

    setFormData({
      ...formData,
      name: nameMatch ? nameMatch[1].trim() : formData.name,
      policyNumber: policyMatch ? policyMatch[1].trim() : formData.policyNumber,
      dateOfIncident: dateMatch ? dateMatch[1].trim() : formData.dateOfIncident,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('policyNumber', formData.policyNumber);
    formPayload.append('claimAmount', formData.claimAmount);
    formPayload.append('document', formData.document);

    try {
      const response = await axios.post('http://localhost:3000/api/claims', formPayload);
      console.log('Claim submitted successfully:', response.data);
      alert('Claim submitted successfully!');
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Failed to submit claim.');
    }
  };

  return (
    <>
      {/* <Button
        style={{
          backgroundColor: '#007eff',
          border: 'none',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '5px',
          boxShadow: '0px 5px 15px rgba(0, 0, 255, 0.2)',
        }}
        onClick={handleShow}
      >
        File a Claim
      </Button> */}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#ffffff' }}>
          <Modal.Title style={{ color: '#007eff' }}>File your claim here</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f4f4f4' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label style={{ color: '#007eff' }}>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                style={{
                  border: '1px solid #007eff',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '15px',
                }}
              />
            </Form.Group>

            <Form.Group controlId="formPolicyNumber">
              <Form.Label style={{ color: '#007eff' }}>Policy Number</Form.Label>
              <Form.Control
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                placeholder="Enter your policy number"
                required
                style={{
                  border: '1px solid #007eff',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '15px',
                }}
              />
            </Form.Group>

            <Form.Group controlId="claimDescription">
              <Form.Label style={{ color: '#007eff' }}>Claim Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the claim"
                name="claimDescription"
                value={formData.claimDescription}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group controlId="dateOfIncident">
              <Form.Label style={{ color: '#007eff' }}>Date of Incident</Form.Label>
              <Form.Control
                type="text"
                placeholder="dd/mm/yyyy or yyyy-mm-dd"
                name="dateOfIncident"
                value={formData.dateOfIncident}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </Form.Group>


            <Form.Group controlId="formClaimAmount">
              <Form.Label style={{ color: '#007eff' }}>Claim Amount</Form.Label>
              <Form.Control
                type="number"
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleInputChange}
                placeholder="Enter the claim amount"
                required
                style={{
                  border: '1px solid #007eff',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '15px',
                }}
              />
            </Form.Group>

            <Form.Group controlId="formFileUpload">
              <Form.Label style={{ color: '#007eff' }}>Upload Document</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf, .jpeg, .png"
                onChange={handleFileChange}
                required
                style={{
                  border: '1px solid #007eff',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '15px',
                }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: '#007eff',
                border: 'none',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '5px',
                width: '100%',
              }}
            >
              Submit Claim
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#ffffff' }}>
          <p style={{ color: '#007eff', textAlign: 'center', width: '100%' }}>
            Powered by <img src={logo} alt="PolicyBazaar" height="20px" />
          </p>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const inputStyle = {
    borderRadius: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    fontFamily: 'Ubuntu, sans-serif',
    fontWeight: '500',
  };
  

export default ClaimForm;