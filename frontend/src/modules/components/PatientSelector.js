import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';

function PatientSelector({
  patients,
  selectedPatient,
  setSelectedPatient,
  navigateToPatient,
  type,
}) {
  const handleSelect = (eventKey) => {
    setSelectedPatient(eventKey);
  };

  const handlePrevious = () => {
    navigateToPatient('previous');
  };

  const handleNext = () => {
    navigateToPatient('next');
  };

  return (
    <div className="patient-selector">
      {type === 'leadgroup' ? (
        // Lead group with navigation
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            style={{
              borderRadius: '20px',
              boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: 'white',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
            }}
            variant="secondary"
            onClick={handlePrevious}
          >
            ←
          </Button>

          <Dropdown onSelect={handleSelect}>
            <Dropdown.Toggle
              variant="secondary"
              style={{
                borderRadius: '20px',
                width: '150px',
                boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
                backgroundColor: 'white',
                color: 'black',
                fontWeight: 'bold',
                border: 'none',
              }}
            >
              {selectedPatient || 'Select Patient'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {patients.map((patient, index) => (
                <Dropdown.Item key={index} eventKey={patient}>
                  {patient}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button
            style={{
              borderRadius: '20px',
              boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: 'white',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
            }}
            variant="secondary"
            onClick={handleNext}
          >
            →
          </Button>
        </div>
      ) : (
        // Regular patient selection
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            variant="secondary"
            style={{
              borderRadius: '20px',
              width: '250px',
              boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: 'white',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
            }}
          >
            {selectedPatient || 'Select Patient'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {patients.map((patient, index) => (
              <Dropdown.Item key={index} eventKey={patient}>
                {patient}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export default PatientSelector;