import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useElectrodeState } from './hooks/useElectrodeState';
import ElectrodeManager from './components/ElectrodeManager';
import LoadingSpinner from './components/LoadingSpinner';

function Programmer({ patient }) {
  // const navigate = useNavigate();
  const type = 'leaddbs';
  const mode = 'standalone';
  const timeline = 'optimizer';
  // Use custom hooks for state management
  const {
    patientStates,
    patients,
    selectedPatient,
    totalS,
    isLoading,
    currentPatientState,
    setSelectedPatient,
    updatePatientState,
    navigateToPatient,
    updateElectrodeSelection,
  } = useElectrodeState(patient, timeline, type, mode);


  // Handle back navigation
  // const handleBack = () => {
  //   navigate(-1);
  // };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!patient) {
    return (
      <div className="error-container">
        <h3>No patient data available</h3>
        {/* <button onClick={handleBack}>Go Back</button> */}
      </div>
    );
  }

  return (
    <div className="programmer-container">
      {/* Patient Name Header */}
      {patient?.id && (
        <div className="patient-header">
          <h2>Patient: {patient.id}</h2>
        </div>
      )}

      {/* Main Electrode Management */}
      <div className="electrode-management">
        {patients.length > 0 && (
          <ElectrodeManager
            // Patient selection
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            navigateToPatient={navigateToPatient}
            
            // Current state
            currentState={currentPatientState}
            updatePatientState={updatePatientState}
            updateElectrodeSelection={updateElectrodeSelection}
            
            // Configuration
            type={type}
            mode={mode}
            patient={patient}
            timeline={timeline}
            
            // Export functionality
            patientStates={patientStates}
            totalS={totalS}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="navigation-controls">
        {mode !== 'stimulate' && (
          <button
            className="back-button"
            // onClick={handleBack}
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
          </button>
        )}
        
        {type === 'leadgroup' && (
          <button
            className="export-button"
            style={{
              width: '200px',
              marginLeft: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              backgroundColor: 'green',
              color: 'white',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Save and Close
          </button>
        )}
      </div>
    </div>
  );
}

export default Programmer;