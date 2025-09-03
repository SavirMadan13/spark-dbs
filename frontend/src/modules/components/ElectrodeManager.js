import React, { useState, useEffect } from 'react';
import { Dropdown, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ELECTRODE_MODELS, IPG_OPTIONS, NAMING_CONVENTIONS } from '../constants/electrodeModelInterpreter';
import Electrode from './Electrode';
import Navbar from './Navbar';
import PatientSelector from './PatientSelector';
import '../styling/ElectrodeManager.css';
import '../styling/Sidebar.css';


function ElectrodeManager({
  // Patient selection props
  patients,
  selectedPatient,
  setSelectedPatient,
  navigateToPatient,
  
  // State management props
  currentState,
  updatePatientState,
  updateElectrodeSelection,
  
  // Configuration props
  type,
  mode,
  patient,
  timeline,
  
  // Export props
  onSaveAndClose,
  patientStates,
  totalS,
  v,
}) {
  const [showViewer, setShowViewer] = useState(true);
  const [namingConvention, setNamingConvention] = useState('clinical');
  const [hemisphereKey, setHemisphereKey] = useState('5'); // Current hemisphere/source selection

  // Get navbar data
  const getNavbarData = () => {
    if (!patient || !selectedPatient || !currentState) return null;
    
    const text = type === 'leadgroup' ? selectedPatient : patient.id;
    const text2 = type === 'leadgroup' ? currentState.model : patient.elmodel;
    
    return {
      text,
      text2,
      color1: '#375D7A',
      color2: 'lightgrey',
    };
  };

  // Handle electrode selection
  const handleElectrodeChange = (electrode, side) => {
    updateElectrodeSelection(electrode, side);
    
    // Clear existing quantities when electrode changes
    updatePatientState(selectedPatient, {
      allQuantities: {},
      allSelectedValues: {},
      allTotalAmplitudes: {},
    });
  };

  // Handle IPG selection
  const handleIPGChange = (ipg) => {
    updatePatientState(selectedPatient, { IPG: ipg });
  };

  // Handle hemisphere/source navigation
  const hemisphereButtons = [
    { name: 'Right', value: '5' },
    { name: 'Left', value: '1' },
  ];

  const getSourceButtons = () => {
    const isRight = parseInt(hemisphereKey) >= 5;
    const baseValue = isRight ? 5 : 1;
    
    return [1, 2, 3, 4].map(source => ({
      label: source.toString(),
      value: (baseValue + source - 1).toString(),
      isActive: hemisphereKey === (baseValue + source - 1).toString(),
    }));
  };

  // Handle save functionality
  const handleSave = () => {
    if (type !== 'leadgroup') {
      onSaveAndClose(patientStates, totalS, currentState.filePath, { patient, timeline });
    }
  };

  const navbarData = getNavbarData();
  // useEffect(() => {
  //   console.log('currentState', currentState);
  //   console.log('Imported V', v);
  //   const newV = Array.isArray(v) ? v : Object.values(v);
  //   const newState = { ...currentState };
  //   const convertToPercents = (array) => {
  //     const sum = array.reduce((acc, num) => acc + num, 0);
  //     return array.map(num => (num / sum) * 100);
  //   };
  //   const rounding = (array) => {
  //     const roundedArray = array.map(num => Math.round(num));
  //     const difference = 100 - roundedArray.reduce((acc, num) => acc + num, 0);
  //     if (difference !== 0) {
  //       const index = roundedArray.findIndex(num => num > 0);
  //       if (index !== -1) {
  //         roundedArray[index] += difference;
  //       }
  //     }
  //     return roundedArray;
  //   };

  //   newV.forEach((array, index) => {
  //     const percentArray = convertToPercents(array);
  //     newV[index] = percentArray;
  //     newV[index] = rounding(newV[index]);
  //   });
  //   console.log('percentArrays', newV);
  // }, [v]);

  return (
    <div className="electrode-manager">
      {/* Navbar */}
      {navbarData && (
        <Navbar
          text={navbarData.text}
          color1={navbarData.color1}
          text2={navbarData.text2}
          color2={navbarData.color2}
        />
      )}

      <div className="Sidebar">
        {/* Patient Selection */}
        <div className="patient-selection-container">
          <PatientSelector
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            navigateToPatient={navigateToPatient}
            type={type}
          />
        </div>

        {/* Hardware Configuration */}
        <div className="hardware-configuration">
          <Dropdown>
            <Dropdown.Toggle
              variant="secondary"
              style={{
                borderRadius: '20px',
                boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
                backgroundColor: 'white',
                color: 'black',
                fontWeight: 'bold',
                border: 'none',
                width: '250px',
              }}
            >
              Implanted Hardware
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '350px', padding: '10px' }}>
              {/* Left Electrode */}
              <h6>Left Electrode</h6>
              <select
                value={currentState.leftElectrode}
                onChange={(e) => handleElectrodeChange(e.target.value, 'left')}
                className="form-select mb-2"
              >
                {ELECTRODE_MODELS.map((electrode) => (
                  <option key={electrode.value} value={electrode.value}>
                    {electrode.displayName}
                  </option>
                ))}
              </select>

              {/* Right Electrode */}
              <h6>Right Electrode</h6>
              <select
                value={currentState.rightElectrode}
                onChange={(e) => handleElectrodeChange(e.target.value, 'right')}
                className="form-select mb-2"
              >
                {ELECTRODE_MODELS.map((electrode) => (
                  <option key={electrode.value} value={electrode.value}>
                    {electrode.displayName}
                  </option>
                ))}
              </select>

              {/* IPG */}
              <h6>IPG</h6>
              <select
                value={currentState.IPG}
                onChange={(e) => handleIPGChange(e.target.value)}
                className="form-select"
              >
                <option value="">None</option>
                {IPG_OPTIONS.map((ipg) => (
                  <option key={ipg.value} value={ipg.value}>
                    {ipg.label}
                  </option>
                ))}
              </select>
            </Dropdown.Menu>
          </Dropdown>

          {/* Naming Convention */}
          <ButtonGroup style={{ gap: '10px', marginLeft: '10px' }}>
            {NAMING_CONVENTIONS.map((convention, idx) => (
              <ToggleButton
                key={idx}
                id={`naming-${idx}`}
                type="radio"
                variant="outline-secondary"
                name="naming"
                value={convention.value}
                checked={namingConvention === convention.value}
                onChange={(e) => setNamingConvention(e.currentTarget.value)}
                style={{
                  borderRadius: '20px',
                  width: '120px',
                  backgroundColor: 'white',
                  color: 'navy',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  ...(namingConvention === convention.value && {
                    color: 'black',
                    boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)',
                  }),
                }}
              >
                {convention.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>

        {/* Hemisphere and Source Selection */}
        <div className="hemisphere-selection">
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Hemisphere</p>
          <ButtonGroup style={{ gap: '10px', marginBottom: '20px' }}>
            {hemisphereButtons.map((button, idx) => (
              <ToggleButton
                key={idx}
                id={`hemisphere-${idx}`}
                type="radio"
                name="hemisphere"
                value={button.value}
                checked={parseInt(hemisphereKey) >= 5 ? button.value === '5' : button.value === '1'}
                onChange={(e) => setHemisphereKey(e.currentTarget.value)}
                style={{
                  borderRadius: '20px',
                  width: '150px',
                  backgroundColor: 'white',
                  color: 'navy',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  ...((parseInt(hemisphereKey) >= 5 && button.value === '5') ||
                    (parseInt(hemisphereKey) < 5 && button.value === '1')) && {
                    color: 'black',
                    boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                {button.name}
              </ToggleButton>
            ))}
          </ButtonGroup>

          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Source</p>
          <div>
            {getSourceButtons().map((source) => (
              <Button
                key={source.value}
                style={{
                  borderRadius: '20px',
                  width: '70px',
                  marginRight: '10px',
                  backgroundColor: 'white',
                  color: 'navy',
                  fontWeight: 'bold',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                  ...(source.isActive && {
                    color: 'black',
                    boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)',
                  }),
                }}
                onClick={() => setHemisphereKey(source.value)}
              >
                {source.label}
              </Button>
            ))}
          </div>
        </div>
      </div>



      {/* Electrode Interface */}
      {currentState.leftElectrode && (
        <div className="electrode-interface">
          <Electrode
            name={hemisphereKey}
            allQuantities={currentState.allQuantities}
            quantities={currentState.allQuantities[hemisphereKey]}
            setQuantities={(quantities) =>
              updatePatientState(selectedPatient, {
                allQuantities: { ...currentState.allQuantities, [hemisphereKey]: quantities },
              })
            }
            selectedValues={currentState.allSelectedValues[hemisphereKey]}
            setSelectedValues={(values) =>
              updatePatientState(selectedPatient, {
                allSelectedValues: { ...currentState.allSelectedValues, [hemisphereKey]: values },
              })
            }
            IPG={currentState.IPG}
            totalAmplitude={currentState.allTotalAmplitudes[hemisphereKey]}
            setTotalAmplitude={(amplitude) =>
              updatePatientState(selectedPatient, {
                allTotalAmplitudes: { ...currentState.allTotalAmplitudes, [hemisphereKey]: amplitude },
              })
            }
            parameters={currentState.allStimulationParameters[hemisphereKey]}
            setParameters={(params) =>
              updatePatientState(selectedPatient, {
                allStimulationParameters: { ...currentState.allStimulationParameters, [hemisphereKey]: params },
              })
            }
            visModel={currentState.visModel}
            setVisModel={(model) => updatePatientState(selectedPatient, { visModel: model })}
            sessionTitle={currentState.sessionTitle[1]}
            togglePosition={currentState.allTogglePositions[hemisphereKey]}
            setTogglePosition={(position) =>
              updatePatientState(selectedPatient, {
                allTogglePositions: { ...currentState.allTogglePositions, [hemisphereKey]: position },
              })
            }
            percAmpToggle={currentState.allPercAmpToggles[hemisphereKey] || 'left'}
            setPercAmpToggle={(toggle) =>
              updatePatientState(selectedPatient, {
                allPercAmpToggles: { ...currentState.allPercAmpToggles, [hemisphereKey]: toggle },
              })
            }
            volAmpToggle={currentState.allVolAmpToggles[hemisphereKey]}
            setVolAmpToggle={(toggle) =>
              updatePatientState(selectedPatient, {
                allVolAmpToggles: { ...currentState.allVolAmpToggles, [hemisphereKey]: toggle },
              })
            }
            contactNaming={namingConvention}
            adornment={currentState.allVolAmpToggles[hemisphereKey] === 'right' ? 'V' : 'mA'}
            elspec={currentState.leftElectrode ? require('../utils/electrodeModels.json')[currentState.leftElectrode] : null}
            electrodeLabel={ELECTRODE_MODELS.find(e => e.value === currentState.leftElectrode)?.displayName || ''}
            templateSpace={currentState.allTemplateSpaces}
            setTemplateSpace={(space) => updatePatientState(selectedPatient, { allTemplateSpaces: space })}
            showViewer={showViewer}
            setShowViewer={setShowViewer}
          />
        </div>
      )}

      {/* Save Button */}
      {/* {type !== 'leadgroup' && (
        <div className="save-section">
          <Button
            onClick={handleSave}
            style={{
              width: '200px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              backgroundColor: 'green',
              color: 'white',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
            }}
            disabled={mode === 'demo'} // Disable in demo mode
          >
            {mode === 'stimulate' ? 'Stimulate and Close' : 'Save'}
          </Button>
        </div>
      )} */}
    </div>
  );
}

export default ElectrodeManager;