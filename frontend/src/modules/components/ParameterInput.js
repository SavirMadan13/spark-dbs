import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import '../styling/ParameterInput.css';
import Navbar from './Navbar';

function ParameterInput({ onFilePathsChange }) {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  
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
    navigate('/programmer');
  };

  return (
    <Container style={{ marginTop: '2rem', marginLeft: '10rem', marginRight: '10rem' }}>
      <Navbar text="Setup File Paths" color1="375D7A" />
      <Form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
          <Form.Group controlId="formFilePath1" style={{ flex: 1, marginRight: '1rem' }}>
            <Form.Label>Reconstruction file</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter reconstruction.mat"
              value={electrodeDataPath}
              onChange={(e) => setElectrodeDataPath(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formFilePath2" style={{ flex: 1, marginRight: '1rem' }}>
            <Form.Label>Target NIfTI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter target.nii.gz"
              value={niftiPath}
              onChange={(e) => setNiftiPath(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formFilePath3" style={{ flex: 1 }}>
            <Form.Label>Output Path</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter output directory"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
            />
          </Form.Group>
        </div>


        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            className="back-button"
            onClick={handleBack}
            style={{
              width: '100px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ←
          </Button>
          <Button 
            className="back-button" 
            style={{ 
              width: '100px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }} 
            disabled={!(electrodeDataPath && niftiPath && outputPath)}
          >
            →
          </Button>
        </div>

      </Form>
    </Container>
  );
}

export default ParameterInput;