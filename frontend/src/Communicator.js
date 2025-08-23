import React, { useEffect, useState } from 'react';
import ParameterInput from './modules/components/ParameterInput';
import Programmer from './modules/Programmer';
import { Routes, Route } from 'react-router-dom';

function Communicator() {
  const [msg, setMsg] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [reconstructionFile, setReconstructionFile] = useState(null);
  const [filePaths, setFilePaths] = useState({
    electrodeDataPath: '',
    niftiPath: '',
    outputPath: '',
  });
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchWithRetry = async () => {
      for (let i = 0; i < 10; i++) {
        try {
          const res = await fetch('http://localhost:8000/api/hello');
          if (!res.ok) throw new Error(`Response not OK: ${res.status} ${res.statusText}`);
          const data = await res.json();
          setMsg(data.message);
          return;
        } catch (err) {
          console.warn(`Attempt ${i + 1} failed. Retrying in 1s...`);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      setMsg('Backend unavailable');
    };

    fetchWithRetry();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const updateMessage = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/update-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!res.ok) throw new Error('Failed to update message');

      const data = await res.json();
      setMsg(data.message);
    } catch (err) {
      console.error('Error updating message:', err);
      setMsg('Error updating message');
    }
  };

  const runStimpyper = async () => {
    const res = await fetch('http://localhost:8000/api/run-stimpyper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ electrode_data_path: '/Users/savirmadan/Documents/Localizations/BrighamReprogramming/derivatives/leaddbs/sub-CbctDbs0157/reconstruction/sub-CbctDbs0157_desc-reconstruction.mat', nifti_path: '/Users/savirmadan/Documents/OptimizerAnalysis/targets/final/multimodal_tremormap_BIDMC_gait_agreement_map.nii', output_path: '/Users/savirmadan/Downloads/stimpyper_testing' }),
    });

    if (!res.ok) throw new Error('Failed to run StimPyPer');
  };

  const retrieveElectrodeData = async (electrode_data_path) => {
    try {
      const res = await fetch('http://localhost:8000/api/retrieve-electrode-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: electrode_data_path }),
      });

      if (!res.ok) throw new Error('Failed to update message');

      const data = await res.json();
      console.log(data);
      setPatient({elmodel: data.elmodels[0], id: data.patient_id})
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  // const handleInitializeElectrodeData = (electrode_data_path) => {
  //   console.log(electrode_data_path);
  //   retrieveElectrodeData(electrode_data_path);
  //   setReconstructionFile(electrode_data_path);
  // }

  const handleInitializeElectrodeData = (data) => {

    console.log(data);
  }

  const handleFilePathsChange = (newFilePaths) => {
    setFilePaths(newFilePaths);
    console.log(newFilePaths);
    retrieveElectrodeData(newFilePaths.electrodeDataPath);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{msg || 'Loading...'}</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a message"
        style={{ marginRight: '10px', padding: '0.5rem' }}
      />
      <button onClick={updateMessage} style={{ padding: '0.5rem' }}>
        Update Message
      </button>
      <button onClick={runStimpyper} style={{ padding: '0.5rem' }}>
        Run StimPyPer
      </button>
      <ParameterInput onFilePathsChange={handleFilePathsChange} />
      {/* <Routes>
        <Route path="/programmer" element={<Programmer patient={patient} />} />
      </Routes> */}
      <Programmer patient={patient} />
    </div>
  );
}

export default Communicator;