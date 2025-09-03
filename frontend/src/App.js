import React, { useState } from 'react';
import ParameterInput from './modules/components/ParameterInput';
import Programmer from './modules/Programmer';
import LandingPage from './modules/components/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  // const [electrodeDataPath, setElectrodeDataPath] = useState('');
  // const [niftiPath, setNiftiPath] = useState('');
  // const [outputPath, setOutputPath] = useState('');

  const [filePaths, setFilePaths] = useState({
    electrodeDataPath: '',
    niftiPath: '',
    outputPath: '',
  });

  const [patient, setPatient] = useState(null);

  const retrieveElectrodeData = async (electrode_data_path) => {
    try {
      const res = await fetch('http://localhost:8000/api/retrieve-electrode-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: electrode_data_path }),
      });

      if (!res.ok) throw new Error('Failed to retrieve electrode data');

      const data = await res.json();
      console.log(data);
      setPatient({ elmodel: data.elmodels[0], id: data.patient_id });
    } catch (err) {
      console.error('Error retrieving electrode data:', err);
    }
  };

  const handleFilePathsChange = (newFilePaths) => {
    setFilePaths(newFilePaths);
    console.log(newFilePaths);
    retrieveElectrodeData(newFilePaths.electrodeDataPath);
  };

  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/parameter-input" element={<ParameterInput filePaths={filePaths} onFilePathsChange={handleFilePathsChange} />} />
          <Route path="/programmer" element={<Programmer patient={patient} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;