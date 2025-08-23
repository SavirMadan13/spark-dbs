import { useState, useEffect, useCallback } from 'react';
import { processTimelines, createInitialState } from '../services/dataProcessing';
import { getIPGFromElectrode } from '../constants/electrodeModelInterpreter';

export const useElectrodeState = (patient, timeline, type, mode) => {
  const [patientStates, setPatientStates] = useState({});
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [totalS, setTotalS] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selected patient
  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(timeline);
    }
  }, [patients, selectedPatient, timeline]);

  // Update patient state helper
  const updatePatientState = useCallback((patientId, updates) => {
    setPatientStates(prev => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        ...updates,
      },
    }));
  }, []);

  // Fetch data from FastAPI on patient change
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patient) return;

      setIsLoading(true);
      try {
        // const response = await fetch('http://localhost:8000/api/retrieve-electrode-data');
        // if (!response.ok) {
        //   console.error('Failed to fetch patient data');
        //   return;
        // }

        // const data = await response.json();

        // Get stimulation data from API response
        const stimulationData = {
          type: 'leaddbs',
          mode: 'standalone',
          electrodeModels: patient.elmodel,
          filepath: '',
          patientname: [patient.id],
          S: {}
        };

        // Get timelines from API response
        const patientTimelines = ['optimizer'];
        const timelineOutput = {};

        // Process each timeline
        patientTimelines.forEach(timelineData => {
          if (timelineData.hasStimulation) {
            timelineOutput[timelineData.timeline] = {
              S: timelineData.stimulationData
            };
          }
        });

        // Set total stimulation data
        setTotalS(stimulationData.S);

        // Process the timelines and set initial states
        const initialStates = processTimelines(timelineOutput, stimulationData, patient, timeline);
        setPatientStates(initialStates);
        setPatients(Object.keys(initialStates));

      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patient, timeline]);

  // Get current patient state
  const getCurrentPatientState = useCallback(() => {
    return selectedPatient ? patientStates[selectedPatient] || createInitialState() : createInitialState();
  }, [selectedPatient, patientStates]);

  // Navigate between patients (for leadgroup type)
  const navigateToPatient = useCallback((direction) => {
    if (type !== 'leadgroup' || patients.length === 0) return;

    const currentIndex = patients.indexOf(selectedPatient);
    let nextIndex;
    
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % patients.length;
    } else {
      nextIndex = (currentIndex - 1 + patients.length) % patients.length;
    }
    
    setSelectedPatient(patients[nextIndex]);
  }, [type, patients, selectedPatient]);

  // Update electrode selection and auto-set IPG
  const updateElectrodeSelection = useCallback((electrode, side = 'both') => {
    if (!selectedPatient) return;

    const currentState = patientStates[selectedPatient];
    if (!currentState) return;

    const ipg = getIPGFromElectrode(electrode);
    const updates = { IPG: ipg };

    if (side === 'left' || side === 'both') {
      updates.leftElectrode = electrode;
    }
    if (side === 'right' || side === 'both') {
      updates.rightElectrode = electrode;
    }

    updatePatientState(selectedPatient, updates);
  }, [selectedPatient, patientStates, updatePatientState]);

  return {
    // State
    patientStates,
    patients,
    selectedPatient,
    totalS,
    isLoading,
    
    // Current patient data
    currentPatientState: getCurrentPatientState(),
    
    // Actions
    setPatientStates,
    setSelectedPatient,
    updatePatientState,
    navigateToPatient,
    updateElectrodeSelection,
  };
};