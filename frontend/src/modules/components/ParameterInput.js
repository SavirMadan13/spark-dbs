import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../styling/ParameterInput.css';

function ParameterInput({ onFilePathsChange }) {
  
  const [electrodeDataPath, setElectrodeDataPath] = useState('');
  const [niftiPath, setNiftiPath] = useState('');
  const [outputPath, setOutputPath] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilePathsChange({
      electrodeDataPath,
      niftiPath,
      outputPath,
    });
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <h2>Enter File Paths</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFilePath1" style={{ marginBottom: '1rem' }}>
          <Form.Label>Electrode Data Path</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter electrode data file path"
            value={electrodeDataPath}
            onChange={(e) => setElectrodeDataPath(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formFilePath2" style={{ marginBottom: '1rem' }}>
          <Form.Label>NIfTI Path</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter NIfTI file path"
            value={niftiPath}
            onChange={(e) => setNiftiPath(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formFilePath3" style={{ marginBottom: '1rem' }}>
          <Form.Label>Output Path</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter output file path"
            value={outputPath}
            onChange={(e) => setOutputPath(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default ParameterInput;