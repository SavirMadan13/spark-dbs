import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import '../styling/ParameterInput.css';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import { windowUtils } from '../services/windowUtils';

function ParameterInput({ filePaths, onFilePathsChange }) {

  useEffect(() => {
    windowUtils.setZoomLevel(100); // This will zoom out to 70%
  }, []);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleBack = () => {
    navigate(-1);
  };
  
  const [electrodeDataPath, setElectrodeDataPath] = useState(filePaths.electrodeDataPath);
  const [niftiPath, setNiftiPath] = useState(filePaths.niftiPath);
  const [outputPath, setOutputPath] = useState(filePaths.outputPath);

  const runStimpyper = async () => {
    setIsLoading(true);
    const res = await fetch('http://localhost:8000/api/run-stimpyper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        electrode_data_path: electrodeDataPath,
        nifti_path: niftiPath,
        output_path: outputPath
      }),
    });
    setIsLoading(false);
    const data = await res.json(); // Parse the response as JSON
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onFilePathsChange({
      electrodeDataPath,
      niftiPath,
      outputPath,
    });
    const data = await runStimpyper();
    navigate('/programmer', { state: { v: data.v } });  
  };

  return (
    <Container style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Navbar text="Setup File Paths" color1="375D7A" />
      <Form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
          <Form.Group controlId="formFilePath1" style={{ flex: 1}}>
            <Form.Label>Reconstruction file</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter reconstruction.mat"
              value={electrodeDataPath}
              onChange={(e) => setElectrodeDataPath(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formFilePath2" style={{ flex: 1}}>
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
            onClick={handleSubmit}
            style={{ 
              width: '110px',
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
            // disabled={!(electrodeDataPath && niftiPath && outputPath)}
          >
            {/* → */}
            Optimize
          </Button>
          {isLoading && <LoadingSpinner />}
        </div>

      </Form>
    </Container>
  );
}

export default ParameterInput;