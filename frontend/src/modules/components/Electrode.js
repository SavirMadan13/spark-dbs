/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
// /* eslint-disable no-restricted-globals */
// /* eslint-disable react/prop-types */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Tooltip from 'react-bootstrap/Tooltip';

import '../styling/Electrode.css';
import { ReactComponent as IPG1 } from '../utils/images/electrode_design/IPG.svg';
import { ReactComponent as NewBottomContact } from '../utils/images/electrode_design/BottomContact.svg';
import { ReactComponent as LeftContact } from '../utils/images/electrode_design/LeftContact.svg';
import { ReactComponent as RightContact } from '../utils/images/electrode_design/RightContact.svg';
import { ReactComponent as CenterContact } from '../utils/images/electrode_design/CenterContact.svg';
import { ReactComponent as Nondirectional } from '../utils/images/electrode_design/NonDirectionalContact.svg';
import { ReactComponent as Background } from '../utils/images/electrode_design/Background.svg';

import { ReactComponent as ForwardButton } from '../utils/images/buttons/FrontButton.svg';
import { ReactComponent as BackButton } from '../utils/images/buttons/BackButton.svg';
import { ReactComponent as LeftButton } from '../utils/images/buttons/LeftButton.svg';
import { ReactComponent as RightButton } from '../utils/images/buttons/RightButton.svg';
import { ReactComponent as SplitEvenButton } from '../utils/images/buttons/SplitEvenButton.svg';

import ContactParameters from './ContactParameters';
import { windowUtils } from '../services/windowUtils';

function Electrode({
  name,
  allQuantities,
  quantities,
  setQuantities,
  selectedValues,
  setSelectedValues,
  IPG,
  totalAmplitude,
  setTotalAmplitude,
  parameters,
  setParameters,
  visModel,
  setVisModel,
  sessionTitle,
  togglePosition,
  setTogglePosition,
  percAmpToggle,
  setPercAmpToggle,
  volAmpToggle,
  setVolAmpToggle,
  contactNaming,
  adornment,
  historical,
  elspec,
  electrodeLabel,
  templateSpace,
  setTemplateSpace,
  showViewer,
  setShowViewer,
  // data,
}) {
  console.log(name, allQuantities, quantities, selectedValues, IPG, totalAmplitude, parameters, visModel, sessionTitle, togglePosition, percAmpToggle, volAmpToggle, contactNaming, adornment, historical, elspec, electrodeLabel, templateSpace, setTemplateSpace, showViewer, setShowViewer);

  useEffect(() => {
    let newTogglePosition = 'mA';
    if (IPG === 'Boston') {
      if (percAmpToggle === 'left') {
        newTogglePosition = '%';
      } else {
        newTogglePosition = 'mA';
      }
    } else if (IPG === 'Medtronic_Activa') {
      if (volAmpToggle === 'right') {
        newTogglePosition = 'V';
      } else {
        newTogglePosition = 'mA';
      }
    }
    setTogglePosition(newTogglePosition);
  }, []);

  useEffect(() => {
    windowUtils.setZoomLevel(70); // This will zoom out to 70%
  }, []);

  const parseEtageidx = (etageidx) => {
    return etageidx.map((levelStr) => {
      if (levelStr.includes(':')) {
        const [start, end] = levelStr.split(':').map(Number);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
      return [Number(levelStr)];
    });
  };
  const newLevel = {
    0: 0,
  };
  const newFace = {
    0: '',
  };
  const newLevelArray = {};
  // Parse the etageidx to get levels
  let parsedEtageidx = [];
  // elspec.tipiscontact = 1;
  if (elspec.isdirected === 1) {
    parsedEtageidx = parseEtageidx(elspec.etageidx);
  } else {
    for (let i = 0; i < elspec.numel; i++) {
      parsedEtageidx.push([i + 1]);
    }
  }
  Object.keys(parsedEtageidx).forEach((key) => {
    if (parsedEtageidx[key].length === 1) {
      newFace[parsedEtageidx[key]] = 'all';
    } else {
      const levelArrayKey = parseFloat(key) + 1;
      newLevelArray[levelArrayKey] = parsedEtageidx[key];
      Object.keys(parsedEtageidx[key]).forEach((subKey) => {
        console.log('Subkey: ', subKey);
        console.log('Index: ', parsedEtageidx[key]);
        if (subKey === '0') {
          console.log('Index: ', parsedEtageidx[key][subKey]);
          newFace[parsedEtageidx[key][subKey]] = 'center';
        } else if (subKey === '1') {
          newFace[parsedEtageidx[key][subKey]] = 'left';
        } else {
          newFace[parsedEtageidx[key][subKey]] = 'right';
        }
      });
    }
  });
  console.log('New Level Array: ', newLevelArray);
  // const determineFace = (contactNum) => {
  //   Object.keys(newFace).forEach((key) => {

  //   })
  //   return 'all';
  // };
  console.log('Parsed: ', parsedEtageidx);
  // Generate Contact components based on parsed etageidx
  const centerColumn = [
    // <HeadTop key="headTop" />,
    // <Contact key="headBottom" fill="transparent" />,
  ];
  const rightColumn = [];
  const leftColumn = [];
  Object.keys(parsedEtageidx)
    .reverse()
    .forEach((key) => {
      const levelIndex = key;
      const sharedLevel = parsedEtageidx[key];
      console.log('Level index: ', levelIndex);
      console.log('Shared level: ', sharedLevel);
      sharedLevel.forEach((contactNum) => {
        console.log('Contact num: ', contactNum);
        const face = newFace[contactNum];
        newLevel[contactNum] = parseFloat(levelIndex) + 1;
        if (face === 'center' || face === 'all') {
          if (contactNum === 1) {
            console.log(elspec.tipiscontact);
            centerColumn.push(
              <NewBottomContact key={contactNum} level={levelIndex + 1} />,
            );
          } else if (face === 'center') {
            centerColumn.push(
              <CenterContact key={contactNum} level={levelIndex + 1} />,
              // <Nondirectional key={contactNum} level={levelIndex + 1} />,
            );
          } else {
            centerColumn.push(
              <Nondirectional key={contactNum} level={levelIndex + 1} />,
              // <Nondirectional key={contactNum} level={levelIndex + 1} />,
            );
          }
        } else if (face === 'right') {
          leftColumn.push(
            <LeftContact key={contactNum} level={levelIndex + 1} />,
          );
        } else {
          rightColumn.push(
            <RightContact key={contactNum} level={levelIndex + 1} />,
          );
        }
      });
    });
  // if (elspec.tipiscontact === 0) {
  //   centerColumn.push(
  //     <NewBottomContact key="tail" fill="rgb(27, 27, 27)" />,
  //   );
  // }

  const svgs = centerColumn;

  const ipgs = [<IPG1 key="0" />];
  const leftContacts = leftColumn;

  const rightContacts = rightColumn;

  const level = newLevel;
  const levelArray = newLevelArray;
  const face = newFace;

  const [names, setNames] = useState({
    0: 'IPG',
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
  });

  useEffect(() => {
    let newNames = [];
    if (elspec.numel === 4) {
      if (contactNaming === 'clinical') {
        if (elspec.matfname.includes('boston')) {
          newNames = {
            0: 'IPG',
            1: '1',
            2: '2',
            3: '3',
            4: '4',
          };
        } else {
          newNames = {
            0: 'IPG',
            1: '0',
            2: '1',
            3: '2',
            4: '3',
          };
        }
      } else {
        if (name < 5) {
          newNames = {
            0: 'IPG',
            1: 'k1',
            2: 'k2',
            3: 'k3',
            4: 'k4',
          };
        } else {
          newNames = {
            0: 'IPG',
            1: 'k1',
            2: 'k2',
            3: 'k3',
            4: 'k4',
          };
        }
      }
    } else if (elspec.numel === 8 && elspec.isdirected === 1) {
      if (contactNaming === 'clinical') {
        if (elspec.matfname.includes('boston')) {
          newNames = {
            0: 'IPG',
            1: '1',
            2: '2A',
            3: '2B',
            4: '2C',
            5: '3A',
            6: '3B',
            7: '3C',
            8: '4',
          };
        } else {
          newNames = {
            0: 'IPG',
            1: '0',
            2: '1A',
            3: '1B',
            4: '1C',
            5: '2A',
            6: '2B',
            7: '2C',
            8: '3',
          };
        }
      } else {
        if (name < 5) {
          newNames = {
            0: 'IPG',
            1: 'k1',
            2: 'k2',
            3: 'k3',
            4: 'k4',
            5: 'k5',
            6: 'k6',
            7: 'k7',
            8: 'k8',
          };
        } else {
          newNames = {
            0: 'IPG',
            1: 'k1',
            2: 'k2',
            3: 'k3',
            4: 'k4',
            5: 'k5',
            6: 'k6',
            7: 'k7',
            8: 'k8',
          };
        }
      }
    } else {
      if (contactNaming === 'clinical') {
        for (let i = 0; i < elspec.numel; i++) {
          newNames[i + 1] = i + 1;
        }
      } else {
        for (let i = 0; i < elspec.numel; i++) {
          newNames[i + 1] = `k${i + 1}`;
        }
      }
    }
    console.log('New Names: ', newNames);
    setNames(newNames);
  }, [contactNaming]);

  const [researchToggle, setResearchToggle] = useState('left');
  const [lastChangedKey, setLastChangedKey] = useState(null);
  const initialSelectedValues = { 0: 'right' };
  const initialQuantityBoston = { 0: 100 };
  const initialQuantity = { 0: 0 };
  const initialAnimation = { 0: null };
  for (let i = 0; i < elspec.numel; i++) {
    initialSelectedValues[i + 1] = 'left';
    initialQuantityBoston[i + 1] = 0;
    initialQuantity[i + 1] = 0;
    initialAnimation[i + 1] = null;
  }

  const [animation, setAnimation] = useState(initialAnimation);

  let isAssisted = false;

  const [lastChangedInstance, setLastChangedInstance] = useState({
    key: null,
    quantity: null,
    value: null,
    animation: null,
  });

  let outputTogglePosition = 'mA';

  const calculateLevelTotals = () => {
    const levelTotals = {};
    Object.keys(level).forEach((key) => {
      levelTotals[level[key]] = 0;
    });
    Object.keys(level).forEach((key) => {
      levelTotals[level[key]] =
        parseFloat(levelTotals[level[key]]) + parseFloat(quantities[key]);
      // console.log(levelQuantities);
    });
    return levelTotals;
  };

  const calculateQuantitiesWithDistribution = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    console.log('PROPS: ', name);
    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'center') {
      total = totalAmplitude;
      // console.log('Total: ', totalAmplitude);
    }

    // total = totalAmplitude;
    console.log('percAmpToggle: ', percAmpToggle);
    console.log('total: ', total);
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = centerCount > 0 ? total / centerCount : 0;
    // console.log('CenterCount: ', centerCount);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = rightCount > 0 ? total / rightCount : 0;

    const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

    // Update the quantities based on selected values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      // console.log("key="+key + ", value=" + value);
      if (value === 'left') {
        updatedQuantities[key] = 0;
      } else if (value === 'center') {
        console.log('CENTER: ', centerQuantityIncrement);
        updatedQuantities[key] = centerQuantityIncrement;
        console.log('updated: ', updatedQuantities);
      } else if (value === 'right') {
        updatedQuantities[key] = rightQuantityIncrement;
      }
      // updatedQuantities[key] = 20;
    });

    // console.log(quantities);
    setQuantities(updatedQuantities);
    // setSelectedValues(selectedValue);

    console.log(quantities);
    // Update the state with the new quantities
  };

  const handleTripleToggleChange = (value, anime, key) => {
    const updatedSelectedValues = { ...selectedValues, [key]: value };
    const updatedAnimationValues = { ...animation, [key]: anime };
    const updatedQuantities = { ...quantities };
    setSelectedValues(updatedSelectedValues);
    setAnimation(updatedAnimationValues);
    console.log(animation);
    if (IPG === 'Abbott') {
      Object.keys(updatedSelectedValues).forEach((thing) => {
        const newvalue = updatedSelectedValues[thing];
        if (newvalue === 'left') {
          updatedQuantities[key] = 0;
        } else if (newvalue === 'center') {
          updatedQuantities[key] = 10;
        } else if (newvalue === 'right') {
          updatedQuantities[key] = 10;
        }
      });
    }
    setQuantities(updatedQuantities);
    setLastChangedKey(key);
  };

  const roundToHundred = () => {
    // Initialize sum variables
    let totalCenterSum = 0;
    let totalRightSum = 0;
    const roundUpdatedQuantities = { ...quantities };

    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else {
      total = totalAmplitude;
    }

    // Calculate the sums for 'center' and 'right' values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'center') {
        totalCenterSum += parseFloat(roundUpdatedQuantities[key]);
        console.log('CenterSum: ', totalCenterSum);
      } else if (value === 'right') {
        totalRightSum += parseFloat(roundUpdatedQuantities[key]);
        console.log('RightSum: ', totalRightSum);
      }
    });

    // Calculate the quantity increments
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = (total - totalCenterSum) / centerCount;
    console.log('Center increment:', centerQuantityIncrement);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = (total - totalRightSum) / rightCount;

    // const updatedQuantities = { ...quantities }; // Create a copy of the quantities object
    console.log('CENTER COUNT: ', totalCenterSum);
    if (centerCount > 1) {
      if (totalCenterSum < total) {
        if (selectedValues[lastChangedKey] === 'center') {
          roundUpdatedQuantities[lastChangedKey] += total - totalCenterSum;
        } else {
          Object.keys(selectedValues).forEach((key) => {
            const value = selectedValues[key];
            if (value === 'left') {
              roundUpdatedQuantities[key] = 0;
            } else if (value === 'center') {
              console.log('CENTER QUANTITY INCREMENT: ', centerQuantityIncrement);
              roundUpdatedQuantities[key] =
                parseFloat(roundUpdatedQuantities[key]) + centerQuantityIncrement;
            }
          });
        }
      } else {
        Object.keys(selectedValues).forEach((key) => {
          const value = selectedValues[key];
          if (value === 'left') {
            roundUpdatedQuantities[key] = 0;
          } else if (value === 'center') {
            console.log('CENTER QUANTITY INCREMENT: ', centerQuantityIncrement);
            roundUpdatedQuantities[key] =
              parseFloat(roundUpdatedQuantities[key]) + centerQuantityIncrement;
          }
        });
      }
    } else {
      Object.keys(selectedValues).forEach((key) => {
        if (selectedValues[key] === 'center') {
          roundUpdatedQuantities[key] = total;
        }
      });
    }

    if (rightCount > 1) {
      if (totalRightSum < total) {
        if (selectedValues[lastChangedKey] === 'right') {
          roundUpdatedQuantities[lastChangedKey] = total - totalRightSum;
        }
      } else {
        Object.keys(selectedValues).forEach((key) => {
          const value = selectedValues[key];
          if (value === 'left') {
            roundUpdatedQuantities[key] = 0;
          } else if (value === 'right') {
            roundUpdatedQuantities[key] =
              parseFloat(roundUpdatedQuantities[key]) + rightQuantityIncrement;
          }
        });
      }
    } else {
      Object.keys(selectedValues).forEach((key) => {
        if (selectedValues[key] === 'right') {
          roundUpdatedQuantities[key] = total;
        }
      });
    }

    // Update the quantities based on selected values
    setQuantities(roundUpdatedQuantities); // Update the state with the new quantities
    console.log(roundUpdatedQuantities);
  };

  const newRoundToHundred = () => {
    // Initialize sum variables
    let totalCenterSum = 0;
    let totalRightSum = 0;
    const roundUpdatedQuantities = { ...quantities };

    let total = totalAmplitude;
    if (percAmpToggle === 'left') {
      total = 100;
    }

    // Calculate the sums for 'center' and 'right' values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'center') {
        totalCenterSum += parseFloat(roundUpdatedQuantities[key]);
        console.log('CenterSum: ', totalCenterSum);
      } else if (value === 'right') {
        totalRightSum += parseFloat(roundUpdatedQuantities[key]);
        console.log('RightSum: ', totalRightSum);
      }
    });

    // Calculate the quantity increments
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = (total - totalCenterSum) / centerCount;
    console.log('Center increment:', centerQuantityIncrement);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = (total - totalRightSum) / rightCount;

    // const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

    // Update the quantities based on selected values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'left') {
        roundUpdatedQuantities[key] = 0;
      } else if (value === 'center') {
        roundUpdatedQuantities[key] =
          parseFloat(roundUpdatedQuantities[key]) + centerQuantityIncrement;
      } else if (value === 'right') {
        roundUpdatedQuantities[key] =
          parseFloat(roundUpdatedQuantities[key]) + rightQuantityIncrement;
      }
    });
    return roundUpdatedQuantities;
    // console.log(roundUpdatedQuantities);
  };

  function checkQuantitiesAndValues(quantity, value) {
    const updatedQuantities = { ...quantity };
    const updatedSelectedValues = { ...value };
    let total = totalAmplitude;
    console.log('TOTALAMPLITUDE: ', totalAmplitude);
    console.log('PERCAMPTOGGLE: ', percAmpToggle);
    if (percAmpToggle === 'left') {
      total = 100;
    }
    Object.keys(updatedQuantities).forEach((key) => {
      if (updatedQuantities[key] <= 0) {
        updatedSelectedValues[key] = 'left';
      }
      if (updatedSelectedValues[key] === 'left') {
        updatedQuantities[key] = 0;
      }
      if (updatedQuantities[key] > total) {
        updatedQuantities[key] = total;
      }
    });
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  }

  /// //////////////////////// VECTOR //////////////////////////////
  // Need two vectors, one for each polarity
  // Important vector coords and constants
  const levelQuantities = {};
  let vectorLevel = 0;
  const vecCoords = [0, 0];
  let vectorDirection = 0;

  const vectorMakeUp = () => {
    // Calculating the level
    const updatedQuantities = { ...quantities };
    // console.log(vectorLevel);
    Object.keys(level).forEach((key) => {
      levelQuantities[level[key]] = 0;
    });
    Object.keys(level).forEach((key) => {
      levelQuantities[level[key]] =
        parseFloat(levelQuantities[level[key]]) +
        parseFloat(updatedQuantities[key]);
      // console.log(levelQuantities);
    });
    Object.keys(levelQuantities).forEach((levelQuantity) => {
      // console.log(vectorLevel);
      if (levelQuantity !== 0) {
        vectorLevel =
          parseFloat(vectorLevel) +
          parseFloat(
            (levelQuantity * parseFloat(levelQuantities[levelQuantity])) / 100,
          );
      }
    });
    console.log('VectorLevel: ', vectorLevel);
    console.log('LevelQuantities: ', levelQuantities);

    // Calculating the direction
    const faceTotals = {};
    // We want to get the faceTotals
    // Start by initializing the faceTotals variables
    Object.keys(face).forEach((key) => {
      faceTotals[face[key]] = 0;
    });
    // console.log(faceTotals);
    Object.keys(face).forEach((key) => {
      faceTotals[face[key]] =
        parseFloat(faceTotals[face[key]]) + parseFloat(updatedQuantities[key]);
    });
    // console.log(faceTotals);
    // Coordinates for each
    let aVec = [0, 0];
    let bVec = [0, 0];
    let cVec = [0, 0];
    const cos60 = Math.cos((60 * Math.PI) / 180);
    const cos30 = Math.cos((30 * Math.PI) / 180);
    const sin60 = Math.sin((60 * Math.PI) / 180);
    const sin30 = Math.sin((30 * Math.PI) / 180);
    Object.keys(faceTotals).forEach((key) => {
      if (key === 'left') {
        cVec = [
          parseFloat(-faceTotals[key]) / 2,
          parseFloat(-faceTotals[key]) * cos30,
        ];
      } else if (key === 'center') {
        aVec = [faceTotals[key], 0];
      } else if (key === 'right') {
        bVec = [
          parseFloat(-faceTotals[key]) / 2,
          parseFloat(faceTotals[key]) * sin60,
        ];
      }
    });
    for (let i = 0; i < aVec.length; i++) {
      vecCoords[i] = aVec[i] + bVec[i] + cVec[i];
    }
    vectorDirection = (Math.atan(vecCoords[1] / vecCoords[0]) * 180) / Math.PI;
    console.log('VecCoords', vecCoords);
    console.log(bVec);
  };

  const vectorMakeUpAmplitude = () => {
    // Calculating the level
    const updatedQuantities = { ...quantities };
    // console.log(vectorLevel);
    Object.keys(level).forEach((key) => {
      levelQuantities[level[key]] = 0;
    });
    Object.keys(level).forEach((key) => {
      levelQuantities[level[key]] =
        parseFloat(levelQuantities[level[key]]) +
        parseFloat(updatedQuantities[key]);
      // console.log(levelQuantities);
    });
    Object.keys(levelQuantities).forEach((levelQuantity) => {
      // console.log(vectorLevel);
      if (levelQuantity !== 0) {
        vectorLevel =
          parseFloat(vectorLevel) +
          parseFloat(
            (levelQuantity * parseFloat(levelQuantities[levelQuantity])) /
              totalAmplitude,
          ); // levelQuantity here is the actual level, and then levelQuantities[levelQuantity] is the total quantity at that level
      }
    });
    console.log('VectorLevel: ', vectorLevel);
    console.log('LevelQuantities: ', levelQuantities);

    // Calculating the direction
    const faceTotals = {};
    // We want to get the faceTotals
    // Start by initializing the faceTotals variables
    Object.keys(face).forEach((key) => {
      faceTotals[face[key]] = 0;
    });
    // console.log(faceTotals);
    Object.keys(face).forEach((key) => {
      faceTotals[face[key]] =
        parseFloat(faceTotals[face[key]]) + parseFloat(updatedQuantities[key]);
    });
    // console.log(faceTotals);
    // Coordinates for each
    let aVec = [0, 0];
    let bVec = [0, 0];
    let cVec = [0, 0];
    const cos60 = Math.cos((60 * Math.PI) / 180);
    const cos30 = Math.cos((30 * Math.PI) / 180);
    const sin60 = Math.sin((60 * Math.PI) / 180);
    const sin30 = Math.sin((30 * Math.PI) / 180);
    Object.keys(faceTotals).forEach((key) => {
      if (key === 'left') {
        cVec = [
          parseFloat(-faceTotals[key]) / 2,
          parseFloat(-faceTotals[key]) * cos30,
        ];
      } else if (key === 'center') {
        aVec = [faceTotals[key], 0];
      } else if (key === 'right') {
        bVec = [
          parseFloat(-faceTotals[key]) / 2,
          parseFloat(faceTotals[key]) * sin60,
        ];
      }
    });
    for (let i = 0; i < aVec.length; i++) {
      vecCoords[i] = aVec[i] + bVec[i] + cVec[i];
    }
    vectorDirection = (Math.atan(vecCoords[1] / vecCoords[0]) * 180) / Math.PI;
    console.log('VecCoords', vecCoords);
    console.log(bVec);
  };

  /// ///////////////////////////////////// DBS Controller ////////////////////////////////

  function getOnContacts(aLevel) {
    const onContacts = [];
    Object.keys(level).forEach((key) => {
      const numericKey = parseInt(key, 10); // Convert the string key to a number
      if (level[key] === aLevel && selectedValues[key] !== 'left') {
        onContacts.push(numericKey);
      }
    });
    return onContacts;
  }

  // Testing counter clockwise

  const handleCounterClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelChanges = {};
    Object.keys(levelArray).forEach((key) => {
      levelChanges[key] = 0;
    });
    console.log('levelchanges: ', levelChanges);
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) + 1;
        const previousKey = parseFloat(key) - 1;
        const leftNextKey = parseFloat(key) - 2;
        const centerpreviousKey = parseFloat(key) + 2;
        const currentFace = face[key];

        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
        const currentKeys = Object.keys(level).filter(
          (k) => level[k] === currentLevel,
        );
        const levelTotals = calculateLevelTotals();
        // console.log(levelTotals);
        let currentLevelTotal = 0;
        Object.keys(levelTotals).forEach((levels) => {
          if (level[key] === parseFloat(levels)) {
            currentLevelTotal = levelTotals[levels];
          }
        });
        let currentLeftCount = 0;
        let currentCenterCount = 0;
        let currentRightCount = 0;
        currentKeys.forEach((currentKey) => {
          const value = updatedSelectedValues[currentKey];
          if (value === 'left') {
            currentLeftCount += 1;
          } else if (value === 'center') {
            currentCenterCount += 1;
          } else if (value === 'right') {
            currentRightCount += 1;
          }
        });
        if (
          face[key] === 'left' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            console.log('FACE LEFT');
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] = parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'center' &&
          updatedQuantities[centerpreviousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              // updatedQuantities[centerNextKey] =
              //   parseFloat(updatedQuantities[centerNextKey]) +
              //   currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                console.log('true');
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'right' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] === updatedSelectedValues[leftNextKey]
            ) {
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                updatedQuantities[leftNextKey] =
                  parseFloat(updatedQuantities[leftNextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[leftNextKey] =
                  parseFloat(updatedQuantities[leftNextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
              // console.log('true');
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[leftNextKey] === 'left') {
              updatedSelectedValues[leftNextKey] = updatedSelectedValues[key];
              updatedQuantities[leftNextKey] =
                parseFloat(updatedQuantities[leftNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    console.log('newlevelquantities: ', levelChanges);
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const handleClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelChanges = {};
    Object.keys(levelArray).forEach((key) => {
      levelChanges[key] = 0;
    });
    // console.log('levelchanges: ', levelChanges);
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) - 1;
        const previousKey = parseFloat(key) + 1;
        const centerNextKey = parseFloat(key) + 2;
        // const centerpreviousKey = parseFloat(key) - 1;
        const rightPreviousKey = parseFloat(key) - 2;
        const currentFace = face[key];

        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
        const currentKeys = Object.keys(level).filter(
          (k) => level[k] === currentLevel,
        );
        const levelTotals = calculateLevelTotals();
        // console.log(levelTotals);
        let currentLevelTotal = 0;
        Object.keys(levelTotals).forEach((levels) => {
          if (level[key] === parseFloat(levels)) {
            currentLevelTotal = levelTotals[levels];
          }
        });
        let currentLeftCount = 0;
        let currentCenterCount = 0;
        let currentRightCount = 0;
        currentKeys.forEach((currentKey) => {
          const value = updatedSelectedValues[currentKey];
          if (value === 'left') {
            currentLeftCount += 1;
          } else if (value === 'center') {
            currentCenterCount += 1;
          } else if (value === 'right') {
            currentRightCount += 1;
          }
        });
        if (
          face[key] === 'left' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] <= currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] = parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'center' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] ===
              updatedSelectedValues[centerNextKey]
            ) {
              // updatedQuantities[centerNextKey] =
              //   parseFloat(updatedQuantities[centerNextKey]) +
              //   currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              if (updatedQuantities[key] <= currentLevelTotal / 10) {
                console.log('true');
                updatedQuantities[centerNextKey] =
                  parseFloat(updatedQuantities[centerNextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[centerNextKey] =
                  parseFloat(updatedQuantities[centerNextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
            } else if (updatedSelectedValues[centerNextKey] === 'left') {
              updatedSelectedValues[centerNextKey] = updatedSelectedValues[key];
              updatedQuantities[centerNextKey] =
                parseFloat(updatedQuantities[centerNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'right' &&
          updatedQuantities[rightPreviousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] <= currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
              // console.log('true');
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    // console.log('newlevelquantities: ', levelTotals);
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // easyRoundUp(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const handleClearButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = 0;
      updatedSelectedValues[key] = 'left';
    });
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  function segmentedContact(aKey) {
    let counter = 0;
    Object.keys(level).forEach((key) => {
      if (level[key] === level[aKey]) {
        counter += 1;
      }
    });
    console.log('hello1');
    if (counter > 1) {
      return true;
    }
    return false;
  }

  function segmentedLevel(aLevel) {
    let counter = 0;
    Object.keys(level).forEach((key) => {
      if (level[key] === aLevel) {
        counter += 1;
      }
    });
    if (counter > 1) {
      return true;
    }
    return false;
  }

  // function roundAlloc(
  //   beforeLevel,
  //   nextLevel,
  //   levelAboveTotal,
  //   levelBelowTotal,
  //   values,
  //   amtOnContacts,
  // ) {
  //   // let oldTotal = 0;
  //   let newAboveTotal = 0;
  //   let newBelowTotal = 0;
  //   let belowTotal = levelBelowTotal;
  //   let aboveTotal = levelAboveTotal;
  //   Object.keys(values).forEach((key) => {
  //     if (level[key] === beforeLevel) {
  //       values[key] = Math.floor(values[key] + 0.5);
  //       newBelowTotal += values[key];
  //     } else if (level[key] === nextLevel) {
  //       values[key] = Math.floor(values[key] + 0.5);
  //       newAboveTotal += values[key];
  //     }
  //     // values[key] = Math.floor(values[key] + 0.5);
  //     // newTotal += values[key];
  //   });
  //   // console.log('old', oldTotal);
  //   // console.log('new', newTotal);
  //   belowTotal = Math.floor(belowTotal + 0.5);
  //   const belowDiff = belowTotal - newBelowTotal;
  //   aboveTotal = Math.floor(aboveTotal + 0.5);
  //   const aboveDiff = aboveTotal - newAboveTotal;
  //   let doneUpdate = 0;
  //   console.log('above', aboveDiff);
  //   console.log('below', belowDiff);
  //   Object.keys(values).forEach((key) => {
  //     if (values[key] !== 0 && doneUpdate === 0 && level[key] === beforeLevel) {
  //       values[key] += belowDiff;
  //       doneUpdate = 1;
  //     }
  //   });
  //   doneUpdate = 0;
  //   console.log('below level total: ', belowTotal);
  //   Object.keys(values).forEach((key) => {
  //     if (values[key] !== 0 && doneUpdate === 0 && level[key] === nextLevel) {
  //       values[key] += aboveDiff;
  //       doneUpdate = 1;
  //     }
  //     if (amtOnContacts === 3) {
  //       if (aboveTotal % 3 === 0) {
  //         if (level[key] === nextLevel) {
  //           values[key] = aboveTotal / 3;
  //         }
  //       }
  //       if (belowTotal % 3 === 0) {
  //         if (level[key] === beforeLevel) {
  //           values[key] = belowTotal / 3;
  //           console.log('values[key]', values[key]);
  //         }
  //       }
  //     } else if (amtOnContacts === 1) {
  //       console.log('made it here');
  //       if (belowTotal % 3 === 0) {
  //         console.log(beforeLevel);
  //         if (level[key] === beforeLevel) {
  //           console.log('yes');
  //           values[key] = belowTotal / 3;
  //           console.log('values[key]', values[key]);
  //         }
  //       }
  //     }
  //   });
  //   return values;
  // }

  function roundAllocUp(
    beforeLevel,
    nextLevel,
    levelAboveTotal,
    levelBelowTotal,
    values,
    amtOnContacts,
    amtBelowOnContacts,
  ) {
    // let oldTotal = 0;
    let newAboveTotal = 0;
    let newBelowTotal = 0;
    let belowTotal = levelBelowTotal;
    let aboveTotal = levelAboveTotal;
    Object.keys(values).forEach((key) => {
      if (level[key] === beforeLevel) {
        values[key] = Math.floor(values[key] + 0.5);
        newBelowTotal += values[key];
      } else if (level[key] === nextLevel) {
        values[key] = Math.floor(values[key] + 0.5);
        newAboveTotal += values[key];
      }
      // values[key] = Math.floor(values[key] + 0.5);
      // newTotal += values[key];
    });
    // console.log('old', oldTotal);
    // console.log('new', newTotal);
    belowTotal = Math.floor(belowTotal + 0.5);
    const belowDiff = belowTotal - newBelowTotal;
    aboveTotal = Math.floor(aboveTotal + 0.5);
    const aboveDiff = aboveTotal - newAboveTotal;
    let doneUpdate = 0;
    console.log('above', aboveDiff);
    console.log('below', belowDiff);
    Object.keys(values).forEach((key) => {
      if (values[key] !== 0 && doneUpdate === 0 && level[key] === beforeLevel) {
        values[key] += belowDiff;
        doneUpdate = 1;
      }
    });
    doneUpdate = 0;
    console.log('below level total: ', belowTotal);
    Object.keys(values).forEach((key) => {
      if (values[key] !== 0 && doneUpdate === 0 && level[key] === nextLevel) {
        values[key] += aboveDiff;
        doneUpdate = 1;
      }
      if (amtOnContacts === 3) {
        if (aboveTotal % 3 === 0) {
          if (level[key] === nextLevel) {
            values[key] = aboveTotal / 3;
          }
        }
        if (belowTotal % 3 === 0) {
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('key', key);
            console.log(segmentedContact(key));
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      } else if (amtOnContacts === 1 && amtBelowOnContacts === 3) {
        console.log('belowOn: ', amtBelowOnContacts);
        console.log('made it here');
        if (belowTotal % 3 === 0) {
          console.log(beforeLevel);
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('yes');
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      }
    });
    return values;
  }

  // function easyRoundUp(values) {
  //   Object.keys(values).forEach((key) => {
  //     const decimalPart = values[key] % 1;
  //     if (decimalPart >= 0.99) {
  //       values[key] = Math.ceil(values[key]);
  //     }
  //   });
  //   return values;
  // }

  function easyRoundUp(values) {
    Object.keys(values).forEach((key) => {
      const decimalPart = values[key] % 1;

      if (decimalPart >= 0.99) {
        values[key] = Math.ceil(values[key]);
      } else if (decimalPart >= 0.199 && decimalPart < 0.2) {
        values[key] = Math.floor(values[key]) + 0.2;
      } else if (decimalPart >= 0.299 && decimalPart < 0.3) {
        values[key] = Math.floor(values[key]) + 0.3;
      } else if (decimalPart >= 0.399 && decimalPart < 0.4) {
        values[key] = Math.floor(values[key]) + 0.4;
      } else if (decimalPart >= 0.499 && decimalPart < 0.5) {
        values[key] = Math.floor(values[key]) + 0.5;
      } else if (decimalPart >= 0.599 && decimalPart < 0.6) {
        values[key] = Math.floor(values[key]) + 0.6;
      } else if (decimalPart >= 0.699 && decimalPart < 0.7) {
        values[key] = Math.floor(values[key]) + 0.7;
      } else if (decimalPart >= 0.799 && decimalPart < 0.8) {
        values[key] = Math.floor(values[key]) + 0.8;
      } else if (decimalPart >= 0.899 && decimalPart < 0.9) {
        values[key] = Math.floor(values[key]) + 0.9;
      } else if (decimalPart > 0 && decimalPart < 0.0001) {
        values[key] = Math.floor(values[key]);
      }

      // Remove trailing .00 if the value is a whole number
      if (values[key] % 1 === 0) {
        values[key] = Math.floor(values[key]);
      }
    });
    return values;
  }

  const newHandleUpButton = () => {
    // newRoundToHundred();
    console.log('passed');
    console.log('quantities: ', quantities);
    vectorMakeUp();
    const newQuantities = newRoundToHundred();
    console.log('newQuantities: ', newQuantities);
    const updatedQuantities = { ...newQuantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelIncrement = 0.1;
    const previousLevel = Math.floor(vectorLevel);
    vectorLevel += levelIncrement;
    const currentLevel = Math.floor(vectorLevel);
    console.log('currentLevel: ', currentLevel);
    console.log('previousLevel: ', previousLevel);
    const levelBelow =
      currentLevel !== previousLevel ? previousLevel : Math.floor(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelAbove = levelBelow + 1;
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = vectorLevel - levelBelow;
    const levelBelowQuantityTotal = 100 * (1 - percDiff);
    const levelAboveQuantityTotal = 100 - levelBelowQuantityTotal;
    // Want to figure out how many contacts are "on" at a level

    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    console.log('On Contacts', onContacts);
    Object.keys(level).forEach((key) => {
      // dealing with level below
      // vectorMakeUp();
      if (level[key] === levelBelow) {
        if (face[key] === 'all') {
          updatedQuantities[key] = levelBelowQuantityTotal;
        } else if (
          face[key] !== 'all' &&
          numOnContacts !== 0 &&
          updatedQuantities[key] !== 0
        ) {
          Object.keys(onContacts).forEach((contact) => {
            console.log('key: ', key);
            if (parseFloat(key) === onContacts[contact]) {
              // console.log('madeItHere');
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) -
                (100 * levelIncrement) / numOnContacts;
            }
          });
        }
        // if (levelBelowQuantityTotal === 0) {
        //   updatedSelectedValues[key] = 'left';
        // }
      }
      if (level[key] === levelAbove) {
        if (face[key] !== 'all') {
          if (segmentedContact(levelBelow)) {
            Object.keys(onContacts).forEach((contact) => {
              if (face[key] === face[onContacts[contact]]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) +
                  (100 * levelIncrement) / numOnContacts;
                updatedSelectedValues[key] =
                  updatedSelectedValues[onContacts[contact]];
              }
            });
          } else {
            let levelBelowKey = 0;
            Object.keys(level).forEach((keys) => {
              if (level[keys] === levelBelow) {
                levelBelowKey = keys;
              }
            });
            updatedQuantities[key] =
              parseFloat(updatedQuantities[key]) + (100 * levelIncrement) / 3;
            updatedSelectedValues[key] = updatedSelectedValues[levelBelowKey];
          }
        }
        if (face[key] === 'all') {
          updatedQuantities[key] = levelAboveQuantityTotal;
          updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        }
      }
    });
    setSelectedValues(updatedSelectedValues);
    console.log('before level', previousLevel);
    // roundAllocUp(
    //   previousLevel,
    //   levelAbove,
    //   levelAboveQuantityTotal,
    //   levelBelowQuantityTotal,
    //   updatedQuantities,
    //   numAboveOnContacts,
    //   numOnContacts,
    // );
    easyRoundUp(updatedQuantities);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const newHandleUpButtonAmplitude = () => {
    // newRoundToHundred();
    // console.log('passed');
    // console.log('quantities: ', quantities);
    vectorMakeUpAmplitude();
    const newQuantities = newRoundToHundred();
    // console.log('newQuantities: ', newQuantities);
    const updatedQuantities = { ...newQuantities };
    // const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelIncrement = 0.1;
    const previousLevel = Math.floor(vectorLevel);
    vectorLevel += levelIncrement;
    const currentLevel = Math.floor(vectorLevel);
    // console.log('currentLevel: ', currentLevel);
    // console.log('previousLevel: ', previousLevel);
    const levelBelow =
      currentLevel !== previousLevel ? previousLevel : Math.floor(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelAbove = levelBelow + 1;
    // console.log('Level Below', levelBelow);
    // console.log('level Above', levelAbove);
    const percDiff = vectorLevel - levelBelow;
    const levelBelowQuantityTotal = totalAmplitude * (1 - percDiff);
    console.log('HELEOELEO: ', percDiff);
    const levelAboveQuantityTotal = totalAmplitude - levelBelowQuantityTotal;
    // Want to figure out how many contacts are "on" at a level

    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    // console.log('On Contacts', onContacts);
    Object.keys(level).forEach((key) => {
      // dealing with level below
      // vectorMakeUp();
      if (level[key] === levelBelow) {
        if (face[key] === 'all') {
          updatedQuantities[key] = levelBelowQuantityTotal;
        } else if (
          face[key] !== 'all' &&
          numOnContacts !== 0 &&
          updatedQuantities[key] !== 0
        ) {
          // console.log('LevelBelowKey: ', key);
          Object.keys(onContacts).forEach((contact) => {
            console.log('ONCONTACTS: ', onContacts[contact]);
            if (parseFloat(key) === onContacts[contact]) {
              // console.log('madeItHere');
              console.log('HELLO: ', updatedQuantities[key]);
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) -
                (totalAmplitude * levelIncrement) / numOnContacts;
            }
          });
        }
        // if (levelBelowQuantityTotal === 0) {
        //   updatedSelectedValues[key] = 'left';
        // }
      }
      if (level[key] === levelAbove) {
        if (face[key] !== 'all') {
          if (segmentedContact(levelBelow)) {
            Object.keys(onContacts).forEach((contact) => {
              if (face[key] === face[onContacts[contact]]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) +
                  (totalAmplitude * levelIncrement) / numOnContacts;
                updatedSelectedValues[key] =
                  updatedSelectedValues[onContacts[contact]];
              }
            });
          } else {
            let levelBelowKey = 0;
            Object.keys(level).forEach((keys) => {
              if (level[keys] === levelBelow) {
                levelBelowKey = keys;
              }
            });
            updatedQuantities[key] =
              parseFloat(updatedQuantities[key]) +
              (totalAmplitude * levelIncrement) / 3;
            updatedSelectedValues[key] = updatedSelectedValues[levelBelowKey];
          }
        }
        if (face[key] === 'all') {
          updatedQuantities[key] = levelAboveQuantityTotal;
          updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        }
      }
    });
    setSelectedValues(updatedSelectedValues);
    console.log('before level', previousLevel);
    // roundAllocUp(
    //   previousLevel,
    //   levelAbove,
    //   levelAboveQuantityTotal,
    //   levelBelowQuantityTotal,
    //   updatedQuantities,
    //   numAboveOnContacts,
    //   numOnContacts,
    // );
    easyRoundUp(updatedQuantities);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  function roundAllocDown(
    beforeLevel,
    nextLevel,
    levelAboveTotal,
    levelBelowTotal,
    values,
    amtOnContacts,
    amtBelowOnContacts,
  ) {
    // let oldTotal = 0;
    let newAboveTotal = 0;
    let newBelowTotal = 0;
    let belowTotal = levelBelowTotal;
    let aboveTotal = levelAboveTotal;
    Object.keys(values).forEach((key) => {
      if (level[key] === beforeLevel) {
        values[key] = Math.floor(values[key] + 0.5);
        newBelowTotal += values[key];
      } else if (level[key] === nextLevel) {
        values[key] = Math.floor(values[key] + 0.5);
        newAboveTotal += values[key];
      }
      // values[key] = Math.floor(values[key] + 0.5);
      // newTotal += values[key];
    });
    // console.log('old', oldTotal);
    // console.log('new', newTotal);
    belowTotal = Math.floor(belowTotal + 0.5);
    const belowDiff = belowTotal - newBelowTotal;
    aboveTotal = Math.floor(aboveTotal + 0.5);
    const aboveDiff = aboveTotal - newAboveTotal;
    let doneUpdate = 0;
    console.log('above', aboveDiff);
    console.log('below', belowDiff);
    Object.keys(values).forEach((key) => {
      if (values[key] !== 0 && doneUpdate === 0 && level[key] === beforeLevel) {
        values[key] += belowDiff;
        doneUpdate = 1;
      }
    });
    doneUpdate = 0;
    console.log('below level total: ', belowTotal);
    Object.keys(values).forEach((key) => {
      if (values[key] !== 0 && doneUpdate === 0 && level[key] === nextLevel) {
        values[key] += aboveDiff;
        doneUpdate = 1;
      }
      if (amtOnContacts === 3) {
        if (aboveTotal % 3 === 0) {
          if (level[key] === nextLevel) {
            values[key] = aboveTotal / 3;
          }
        }
        if (belowTotal % 3 === 0) {
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('key', key);
            console.log(segmentedContact(key));
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      } else if (amtOnContacts === 1 && amtBelowOnContacts === 3) {
        console.log('belowOn: ', amtBelowOnContacts);
        console.log('made it here');
        if (belowTotal % 3 === 0) {
          console.log(beforeLevel);
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('yes');
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      }
    });
    return values;
  }
  const newHandleDownButton = () => {
    vectorMakeUp();
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    const levelIncrement = 0.1;
    const previousLevel = Math.ceil(vectorLevel);
    vectorLevel -= levelIncrement;
    const currentLevel = Math.ceil(vectorLevel);
    if (vectorLevel < 1) {
      return;
    }
    console.log('currentLevel: ', currentLevel);
    console.log('previousLevel: ', previousLevel);
    const levelAbove =
      currentLevel !== previousLevel ? previousLevel : Math.ceil(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelBelow = levelAbove - 1;
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = Math.abs(vectorLevel - levelAbove);
    const levelAboveQuantityTotal = 100 * (1 - percDiff);
    const levelBelowQuantityTotal = 100 - levelAboveQuantityTotal;
    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    console.log('On Contacts', aboveOnContacts);
    Object.keys(level)
      .reverse()
      .forEach((key) => {
        // dealing with level above, the one that is passing current
        // vectorMakeUp();
        if (level[key] === levelAbove) {
          if (face[key] === 'all') {
            updatedQuantities[key] = levelAboveQuantityTotal;
          } else if (
            face[key] !== 'all' &&
            numAboveOnContacts !== 0 &&
            updatedQuantities[key] !== 0
          ) {
            Object.keys(aboveOnContacts).forEach((contact) => {
              if (parseFloat(key) === aboveOnContacts[contact]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) -
                  (100 * levelIncrement) / numAboveOnContacts;
              }
            });
          }
          // if (levelBelowQuantityTotal === 0) {
          //   updatedSelectedValues[key] = 'left';
          // }
        }
        if (level[key] === levelBelow) {
          if (face[key] !== 'all') {
            if (segmentedLevel(levelAbove)) {
              // console.log(levelAbove);
              console.log('Madeit: ', levelAbove);
              Object.keys(aboveOnContacts).forEach((contact) => {
                if (face[key] === face[aboveOnContacts[contact]]) {
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) +
                    (100 * levelIncrement) / numAboveOnContacts;
                  updatedSelectedValues[key] =
                    updatedSelectedValues[aboveOnContacts[contact]];
                }
              });
            } else {
              console.log('Made it');
              let levelAboveKey = 0;
              Object.keys(level).forEach((keys) => {
                if (level[keys] === levelAbove) {
                  levelAboveKey = keys;
                }
              });
              updatedSelectedValues[key] = updatedSelectedValues[levelAboveKey];
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) + (100 * levelIncrement) / 3;
            }
          } else if (face[key] === 'all') {
            updatedQuantities[key] = levelBelowQuantityTotal;
            updatedSelectedValues[key] =
              updatedSelectedValues[aboveOnContacts[0]];
          }
        }
      });
    console.log('levelBelowQuantity: ', levelBelowQuantityTotal);
    if (Math.ceil(levelBelowQuantityTotal) === 100) {
      Object.keys(updatedQuantities).forEach((key) => {
        if (level[key] === levelAbove) {
          updatedQuantities[key] = 0;
          updatedSelectedValues[key] = 'left';
        }
      });
    }
    setSelectedValues(updatedSelectedValues);
    // roundAllocDown(
    //   previousLevel,
    //   levelAbove,
    //   levelBelowQuantityTotal,
    //   levelAboveQuantityTotal,
    //   updatedQuantities,
    //   numOnContacts,
    //   numAboveOnContacts,
    // );
    easyRoundUp(updatedQuantities);

    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const newHandleDownButtonAmplitude = () => {
    vectorMakeUpAmplitude();
    // const updatedQuantities = { ...quantities };
    const newQuantities = newRoundToHundred();
    console.log('newQuantities: ', newQuantities);
    const updatedQuantities = { ...newQuantities };
    const updatedSelectedValues = { ...selectedValues };
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    const levelIncrement = 0.1;
    const previousLevel = Math.ceil(vectorLevel);
    vectorLevel -= levelIncrement;
    const currentLevel = Math.ceil(vectorLevel);
    if (vectorLevel < 1) {
      return;
    }
    console.log('currentLevel: ', currentLevel);
    console.log('previousLevel: ', previousLevel);
    // if (currentLevel === 1) {
    //   return;
    // }
    const levelAbove =
      currentLevel !== previousLevel ? previousLevel : Math.ceil(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelBelow = levelAbove - 1;
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = Math.abs(vectorLevel - levelAbove);
    const levelAboveQuantityTotal = totalAmplitude * (1 - percDiff);
    const levelBelowQuantityTotal = totalAmplitude - levelAboveQuantityTotal;
    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    console.log('On Contacts', aboveOnContacts);
    Object.keys(level)
      .reverse()
      .forEach((key) => {
        // dealing with level above, the one that is passing current
        // vectorMakeUp();
        if (level[key] === levelAbove) {
          if (face[key] === 'all') {
            updatedQuantities[key] = levelAboveQuantityTotal;
          } else if (
            face[key] !== 'all' &&
            numAboveOnContacts !== 0 &&
            updatedQuantities[key] !== 0
          ) {
            Object.keys(aboveOnContacts).forEach((contact) => {
              if (parseFloat(key) === aboveOnContacts[contact]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) -
                  (totalAmplitude * levelIncrement) / numAboveOnContacts;
              }
            });
          }
          // if (levelBelowQuantityTotal === 0) {
          //   updatedSelectedValues[key] = 'left';
          // }
        }
        if (level[key] === levelBelow) {
          if (face[key] !== 'all') {
            if (segmentedLevel(levelAbove)) {
              // console.log(levelAbove);
              console.log('Madeit: ', levelAbove);
              Object.keys(aboveOnContacts).forEach((contact) => {
                if (face[key] === face[aboveOnContacts[contact]]) {
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) +
                    (totalAmplitude * levelIncrement) / numAboveOnContacts;
                  updatedSelectedValues[key] =
                    updatedSelectedValues[aboveOnContacts[contact]];
                }
              });
            } else {
              console.log('Made it');
              let levelAboveKey = 0;
              Object.keys(level).forEach((keys) => {
                if (level[keys] === levelAbove) {
                  levelAboveKey = keys;
                }
              });
              updatedSelectedValues[key] = updatedSelectedValues[levelAboveKey];
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) +
                (totalAmplitude * levelIncrement) / 3;
            }
          } else if (face[key] === 'all') {
            updatedQuantities[key] = levelBelowQuantityTotal;
            updatedSelectedValues[key] =
              updatedSelectedValues[aboveOnContacts[0]];
          }
        }
      });
    console.log('levelBelowQuantity: ', levelBelowQuantityTotal);
    if (Math.ceil(levelBelowQuantityTotal) === totalAmplitude) {
      Object.keys(updatedQuantities).forEach((key) => {
        if (level[key] === levelAbove) {
          updatedQuantities[key] = 0;
          updatedSelectedValues[key] = 'left';
        }
      });
    }
    setSelectedValues(updatedSelectedValues);
    // roundAllocDown(
    //   previousLevel,
    //   levelAbove,
    //   levelBelowQuantityTotal,
    //   levelAboveQuantityTotal,
    //   updatedQuantities,
    //   numOnContacts,
    //   numAboveOnContacts,
    // );
    easyRoundUp(updatedQuantities);

    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  let facesVec = [];

  const getOnFacesCount = () => {
    let centerCount = 0;
    let rightCount = 0;
    let leftCount = 0;
    Object.keys(face).forEach((key) => {
      if (quantities[key] !== 0) {
        if (face[key] === 'left') {
          leftCount += 1;
        } else if (face[key] === 'center') {
          centerCount += 1;
        } else if (face[key] === 'right') {
          rightCount += 1;
        }
      }
    });
    facesVec = [leftCount + centerCount + rightCount];
    return facesVec;
  };

  const getNumContacts = () => {
    let counter = 0;
    Object.keys(quantities).forEach((key) => {
      counter += 1;
    });
    return counter;
  };

  const handleForwardButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      // skip to next iteration
      // keyLevel = getOnContacts[level[key]]
      const levelOnContacts = getOnContacts(level[key]);
      if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        // updatedSelectedValues[key] = 'center';
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        updatedQuantities[key] = levelQuantities[level[key]];
        // }
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleBackButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      // keyLevel = getOnContacts[level[key]]
      const levelOnContacts = getOnContacts(level[key]);
      if (
        (face[key] === 'left' || face[key] === 'right') &&
        levelQuantities[level[key]] !== 0
      ) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        // updatedSelectedValues[key] = 'center';
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        updatedQuantities[key] = levelQuantities[level[key]] / 2;
        // }
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleLeftButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      // keyLevel = getOnContacts[level[key]]
      const levelOnContacts = getOnContacts(level[key]);
      if (face[key] === 'left' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = (3 * levelQuantities[level[key]]) / 4;
        // }
      } else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]] / 4;
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleRightButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      const levelOnContacts = getOnContacts(level[key]);
      if (
        face[key] === 'right' &&
        levelQuantities[level[key]] !== 0 &&
        key !== 0
      ) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = (3 * levelQuantities[level[key]]) / 4;
        // }
      } else if (
        face[key] === 'center' &&
        levelQuantities[level[key]] !== 0 &&
        key !== 0
      ) {
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]] / 4;
      } else if (key !== 0) {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleSplitEvenButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello:');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      // if (face[key] !== 'all' || face[key] !== '' && levelQuantities[level[key]] !== 0) {
      //   // console.log('length ', getOnContacts(level[key]).length);
      //   // if (getOnContacts(level[key]).length > 0) {
      //   // console.log('facesVec ', counter);
      //   updatedSelectedValues[key] = 'center'; // Need to fix this
      //   updatedQuantities[key] = levelQuantities[level[key]] / 3;
      //   // }
      // }
      if (levelQuantities[level[key]] !== 0 && level[key] !== 0) {
        const levelOnContacts = getOnContacts(level[key]);
        console.log('levelQuantities', levelQuantities);
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        if (face[key] !== 'all' && key !== 0) {
          updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
          updatedQuantities[key] = levelQuantities[level[key]] / 3;
        }
        // }
      }
      // else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
      //   updatedSelectedValues[key] = 'center';
      //   updatedQuantities[key] = levelQuantities[level[key]] / 4;
      // }
      // else {
      //   updatedSelectedValues[key] = 'left';
      //   updatedQuantities[key] = 0;
      // }
    });

    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // checkQuantitiesAndValues();
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const [assistedModeEnabled, setAssistedModeEnabled] = useState(false);

  function assistedMode() {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    let negativeSum = 0;
    let positiveSum = 0;
    let negativeModifiedKey = null;
    let positiveModifiedKey = null;
    let centerCount = 0;
    let rightCount = 0;

    Object.keys(updatedQuantities).forEach((key) => {
      // gets the sum of negative polarity
      if (updatedSelectedValues[key] === 'center') {
        negativeSum += parseFloat(updatedQuantities[key]);
        centerCount += 1;
        // console.log('negativeSum: ', negativeSum);
        // gets the sum of positive polarity
      } else if (updatedSelectedValues[key] === 'right') {
        positiveSum += parseFloat(updatedQuantities[key]);
        rightCount += 1;
        // console.log('positiveSum: ', positiveSum);
      }
    });

    Object.keys(updatedQuantities).find((key) => {
      // Negative polarity
      if (updatedSelectedValues[key] === 'center') {
        if (key === lastChangedKey) {
          negativeModifiedKey = key;
          // console.log('negativeModifiedKey: ', negativeModifiedKey);
          return true; // exit loop
        }
      }
      // Positive polarity
      if (updatedSelectedValues[key] === 'right') {
        if (key === lastChangedKey) {
          positiveModifiedKey = key;
          // console.log('positiveModifiedKey: ', positiveModifiedKey);
          return true; // exit loop
        }
      }
      return false; // continue looping
    });

    if (negativeSum === 100) {
      Object.keys(updatedQuantities).forEach((key) => {
        if (key === negativeModifiedKey && updatedQuantities[key] === 0) {
          updatedQuantities[key] = 10;
        }
      });
    }

    if (negativeSum !== 100) {
      const negativeDifference = 100 - parseFloat(negativeSum);
      Object.keys(updatedQuantities).forEach((key) => {
        if (
          key !== negativeModifiedKey &&
          updatedSelectedValues[key] === 'center' &&
          centerCount <= 2
        ) {
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) + parseFloat(negativeDifference);
        } else if (
          key !== negativeModifiedKey &&
          updatedSelectedValues[key] === 'center'
        ) {
          // console.log('passed');
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) +
            parseFloat(negativeDifference / (centerCount - 1));
        }
      });
      // console.log('negative difference: ', negativeDifference);
    }

    if (positiveSum !== 100) {
      const positiveDifference = 100 - parseFloat(positiveSum);
      Object.keys(updatedQuantities).forEach((key) => {
        if (
          key !== positiveModifiedKey &&
          updatedSelectedValues[key] === 'right' &&
          rightCount <= 2
        ) {
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) + parseFloat(positiveDifference);
        } else if (
          key !== positiveModifiedKey &&
          updatedSelectedValues[key] === 'right'
        ) {
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) +
            parseFloat(positiveDifference / (rightCount - 1));
        }
      });
    }
    // if (negativeSum === 100) {
    //   Object.keys(updatedQuantities).forEach((key) => {
    //     if ()
    //   })
    // }
    // roundAllocUp();
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    // return quantities;
    // Return the modified quantities
  }

  const handleCheckboxChange = (e) => {
    setTemplateSpace(e.target.checked ? 1 : 0);
  };

  // const semiAssist = useCallback(() => {
  //   // Function implementation
  //   const updatedQuantities = { ...quantities };
  //   let total = totalAmplitude;
  //   if (IPG === 'Boston') {
  //     if (percAmpToggle === 'left') {
  //       total = 100;
  //     }
  //   }
  //   if (IPG === 'Research') {
  //     if (researchToggle === 'left') {
  //       total = 100;
  //     }
  //   }
  //   // const updatedSelectedValues = { ...selectedValues };
  //   let count = 0;
  //   const lastKey = [];
  //   Object.keys(updatedQuantities).forEach((key) => {
  //     if (key !== 0 && selectedValues[key] === 'center') {
  //       count += 1;
  //       lastKey.push(key);
  //     }
  //   });
  //   if (count === 1) {
  //     updatedQuantities[lastKey[0]] = total;
  //   }

  //   let rightCount = 0;
  //   const rightLastKey = [];
  //   Object.keys(updatedQuantities).forEach((key) => {
  //     if (selectedValues[key] === 'right') {
  //       rightCount += 1;
  //       rightLastKey.push(key);
  //     }
  //   });
  //   if (rightCount === 1) {
  //     updatedQuantities[rightLastKey[0]] = total;
  //   }
  //   setQuantities(updatedQuantities);
  // }, [
  //   percAmpToggle,
  //   IPG,
  //   quantities,
  //   researchToggle,
  //   selectedValues,
  //   totalAmplitude,
  // ]);

  function assist() {
    isAssisted = !isAssisted;
    if (isAssisted) {
      assistedMode();
    }
    // console.log('isAssisted: ', isAssisted);
  }

  const handleQuantityChange = (quantity, key) => {
    const updatedQuantities = { ...quantities, [key]: quantity };
    /// /////Steering for two components logic///////
    if (assistedModeEnabled) {
      const newQuantities = assistedMode();
      setQuantities(newQuantities);
    }
    setQuantities(updatedQuantities);
    setLastChangedKey(key);
    console.log('lastChangedKey: ', lastChangedKey);
  };

  function gatherTripleToggleData(selectedValues, quantities) {
    const data = [];

    // Create a mapping object for the values
    const valueMapping = {
      left: 'OFF',
      center: '-',
      right: '+',
    };

    // Iterate through the selectedValues object and collect the data for each instance
    for (const key in selectedValues) {
      if (selectedValues.hasOwnProperty(key)) {
        const value = selectedValues[key];
        data.push({
          key,
          value: valueMapping[value] || value, // Use the mapped value or the original value
          quantity: quantities[value],
        });
      }
    }

    return data;
  }
  const tripleToggleData = gatherTripleToggleData(selectedValues, quantities);

  function exportToJsonFile(data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'tripleToggleData.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /// /////////////////////           Importing Data - doesn't really work yet ////////////////////////

  const [importedData, setImportedData] = useState(null);

  const reverseValueMapping = {
    OFF: 'left',
    '-': 'center',
    '+': 'right',
  };

  function getSwitchAnimation(from, to) {
    // Use the animation logic from TripleToggle to update the state
    // This is a simplified version; you may need to adjust it
    if (from === 'left' && to === 'center') {
      // Apply animation logic here
    } else if (from === 'center' && to === 'right') {
      // Apply animation logic here
    } else if (from === 'right' && to === 'center') {
      // Apply animation logic here
    } else if (from === 'center' && to === 'left') {
      // Apply animation logic here
    } else if (from === 'right' && to === 'left') {
      // Apply animation logic here
    } else if (from === 'left' && to === 'right') {
      // Apply animation logic here
    }
  }

  function updateDataFromJson(jsonData) {
    console.log('Imported JSON Data:', jsonData);
    if (Array.isArray(jsonData)) {
      const updatedSelectedValues = { ...selectedValues };
      const updatedQuantities = { ...quantities };

      jsonData.forEach((item) => {
        // const { key, value, quantity, animation } = item;
        const { key, value, quantity } = item;
        const originalValue = reverseValueMapping[value];
        if (selectedValues[key] !== undefined) {
          getSwitchAnimation(originalValue, value);
          updatedSelectedValues[key] = originalValue;
          // updatedQuantities[value] = quantity;
          updatedQuantities[originalValue] = quantity;
        }
      });
      setSelectedValues(updatedSelectedValues);
      setQuantities(updatedQuantities);
      console.log(selectedValues);
      console.log('Quantities:', quantities);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          setImportedData(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  const handlePercAmpChangeUp = () => {
    // console.log('PercAmpButton: ', percAmpToggle);
    roundToHundred();
    if (percAmpToggle === 'left') {
      newHandleUpButton();
    } else if (percAmpToggle === 'center') {
      newHandleUpButtonAmplitude();
    }
  };

  const handlePercAmpChangeClockwise = () => {
    if (percAmpToggle === 'left') {
      handleClockwiseButton();
    } else if (percAmpToggle === 'center') {
      handleClockwiseButton();
    }
  };

  const handlePercAmpChangeCounterClockwise = () => {
    if (percAmpToggle === 'left') {
      handleCounterClockwiseButton();
    } else if (percAmpToggle === 'center') {
      handleCounterClockwiseButton();
    }
  };

  const handlePercAmpChangeDown = () => {
    if (percAmpToggle === 'left') {
      newHandleDownButton();
    } else if (percAmpToggle === 'center') {
      newHandleDownButtonAmplitude();
    }
  };

  useEffect(() => {
    if (importedData) {
      updateDataFromJson(importedData);
    }
  }, [importedData]);


  /// /////////////////////////  Export to TabbedElectrodeIPGSelection   /////////////////////////////
  const getCartesiaData = () => {
    const data = [];
    for (const key in selectedValues) {
      if (selectedValues.hasOwnProperty(key)) {
        data.push({
          key,
          value: selectedValues[key],
          // quantity: quantities[selectedValues[key]],
          quantity: quantities[key],
        });
      }
    }
    return data;
  };

  const getStateQuantities = () => {
    return quantities;
  };

  const getStateSelectedValues = () => {
    return selectedValues;
  };

  const getStateAmplitude = () => {
    return totalAmplitude;
  };

  const getStateStimulationParameters = () => {
    return parameters;
  };

  const getStateSessionTitle = () => {
    return sessionTitle;
  };

  const getStateVisModel = () => {
    return visModel;
  };

  const getStatePercAmpToggle = () => {
    return percAmpToggle;
  };

  const getStateVolAmpToggle = () => {
    return volAmpToggle;
  };

  const getStateTogglePosition = () => {
    if (IPG === 'Boston') {
      if (percAmpToggle === 'left') {
        outputTogglePosition = '%';
        setTogglePosition(outputTogglePosition);
      }
    } else if (IPG === 'Medtronic_Activa') {
      console.log('volAmpToggle: ', volAmpToggle);
      if (volAmpToggle === 'right') {
        outputTogglePosition = 'V';
        setTogglePosition(outputTogglePosition);
      }
    }
    return outputTogglePosition;
  };

  // const getOutputIPG = () => {
  //   // if (IPG = 'Boston') {
  //   //   if (percAmpToggle === 'right') {
  //   //     handlePercAmpToggleChange('left');
  //   //   }
  //   // } else if ()
  //   return IPGforOutput;
  // };

  // useImperativeHandle(ref, () => ({
  //   getCartesiaData,
  //   getStateQuantities,
  //   getStateSelectedValues,
  //   getStateAmplitude,
  //   getStateStimulationParameters,
  //   getStateSessionTitle,
  //   getStateVisModel,
  //   getStateTogglePosition,
  //   getStatePercAmpToggle,
  //   getStateVolAmpToggle,
  // }));

  const handleParameterChange = (parameter) => (e) => {
    const newValue = e.target.value;
    setParameters((prevParams) => ({
      ...prevParams,
      [parameter]: newValue,
    }));
  };

  // const [totalAmplitude, setTotalAmplitude] = useState(0);

  // const handleActivaVoltage = () => {
  //   const updatedQuantities = { ...quantities };
  //   Object.keys(updatedQuantities).forEach((key) => {
  //     if (selectedValues[key] !== 'left') {
  //       updatedQuantities[key] = totalAmplitude;
  //     }
  //   });
  //   setQuantities(updatedQuantities);
  // };

  const handleActivaAmplitude = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // let numActiveContacts = 0;
    // const activeContacts = [];
    // Object.keys(quantities).forEach((key) => {
    //   if (quantities[key] > 0) {
    //     numActiveContacts += 1;
    //     activeContacts.push(key);
    //   }
    // });
    // if (numActiveContacts > 1) {
    //   for (let i = 0; i < numActiveContacts - 1; i++) {
    //     updatedQuantities[numActiveContacts[i]] = 0;
    //     updatedSelectedValues[numActiveContacts[i]] = 'left';
    //   }
    // }
    Object.keys(updatedQuantities).forEach((key) => {
      if (key !== lastChangedKey) {
        updatedQuantities[key] = 0;
        updatedSelectedValues[key] = 'left';
      }
    });
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  const handleTotalAmplitudeChange = (e) => {
    const newTotalAmplitude = e.target.value;
    setTotalAmplitude(newTotalAmplitude);
  };

  let stimController = 0;
  // const [currentLabel, setCurrentLabel] = useState('mA');
  const [currentLabel, setCurrentLabel] = useState(
    volAmpToggle === 'right' ? 'V' : 'mA',
  );
  // Generating here a more simple key code for the IPG that is selected
  const handleIPG = () => {
    if (IPG === 'Medtronic_Activa') {
      stimController = 1;
      if (percAmpToggle !== 'center') {
        setPercAmpToggle('center');
        // setIPGforOutput('')
      }
      // if (volAmpToggle === 'left') {
      //   setIPGforOutput('mA');
      // } else {
      //   setIPGforOutput('V');
      // }
    } else if (IPG === 'Abbott') {
      stimController = 2;
      // setIPGforOutput('mA');
    } else if (IPG === 'Medtronic_Percept') {
      stimController = 3;
      if (percAmpToggle !== 'center') {
        setPercAmpToggle('center');
      }
      // setIPGforOutput('mA');
    }
    // else if (IPG === 'Boston') {
    //   if (percAmpToggle === 'left') {
    //     setIPGforOutput('%');
    //   } else {
    //     setIPGforOutput('mA');
    //   }
    // }
    // console.log('stimController: ', stimController);
    // console.log('IPG', IPG);
  };

  const calculatePercentageFromAmplitude = () => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = (updatedQuantities[key] * 100) / totalAmplitude;
    });
    setQuantities(updatedQuantities);
  };

  const calculateAmplitudeFromPercentage = () => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = (updatedQuantities[key] * totalAmplitude) / 100;
    });
    setQuantities(updatedQuantities);
  };

  const [percAmpAnimation, setPercAmpAnimation] = useState(null);
  // Percentage vs mA toggle switch

  const handlePercAmpToggleChange = (value) => {
    console.log('value', value);
    const newValue = value;
    if (newValue === 'left') {
      // setTotalAmplitude(0);
      calculatePercentageFromAmplitude();
      outputTogglePosition = '%';
      setTogglePosition(outputTogglePosition);
    } else if (newValue === 'center') {
      outputTogglePosition = 'mA';
      setTogglePosition(outputTogglePosition);
      calculateAmplitudeFromPercentage();
    }
    console.log(value);
    setPercAmpToggle(value);
  };

  const handleResearchToggleChange = (value) => {
    console.log('ResearchToggle; ', researchToggle);
    console.log('NewValue: ', value);
    const newValue = value;
    console.log(newValue);
    if (newValue === 'left') {
      calculatePercentageFromAmplitude();
      outputTogglePosition = '%';
      setTogglePosition(outputTogglePosition);
      setCurrentLabel('mA');
    } else if (newValue === 'center' && researchToggle !== 'right') {
      calculateAmplitudeFromPercentage();
      outputTogglePosition = 'mA';
      setTogglePosition(outputTogglePosition);
      setCurrentLabel('mA');
    } else if (newValue === 'right') {
      if (researchToggle === 'left') {
        calculateAmplitudeFromPercentage();
      }
      outputTogglePosition = 'V';
      setTogglePosition(outputTogglePosition);
      setCurrentLabel('V');
      console.log(outputTogglePosition);
    }
    setResearchToggle(newValue);
    // setResearchTogg
  };

  const [assistedToggle, setAssistedToggle] = useState('left');

  const handleAssistedToggleChange = (value) => {
    setAssistedToggle(value);
  };

  const ampToggle = 'left';

  const handleVolAmpToggleChange = (value) => {
    const newValue = value;
    console.log('VolAmpToggleChange');
    if (newValue === 'left') {
      outputTogglePosition = 'mA';
      calculateQuantitiesWithDistribution();
      // setCurrentLabel('mA');
    } else if (newValue === 'right') {
      outputTogglePosition = 'V';
      // setCurrentLabel('V');
      console.log('Current Label: ', currentLabel);
    }
    setTogglePosition(outputTogglePosition);
    setCurrentLabel(outputTogglePosition);
    setVolAmpToggle(value);
  };

  const [show, setShow] = useState(false);

  const handleCheck = () => {
    handleIPG();
    if (stimController === 0) {
      if (percAmpToggle === 'left') {
        let negSum = 0;
        let posSum = 0;
        console.log('1');
        Object.keys(quantities).forEach((key) => {
          if (selectedValues[key] === 'center') {
            negSum += parseFloat(quantities[key]);
          } else if (selectedValues[key] === 'right') {
            posSum += parseFloat(quantities[key]);
          }
        });
        console.log('2');
        if ((negSum > 0 && negSum !== 100) || (posSum > 0 && posSum !== 100)) {
          // Popup logic
          console.log('3');
          setShow(true);
        }
      }
    }
  };

  const handleClose = () => {
    setShow(false);
    console.log('made it');
    handleCheck();
  };

  const [radioValue, setRadioValue] = useState('1');
  const handleSteeringModeChange = (value) => {
    let updatedSelectedValues = { ...selectedValues };
    let updatedQuantities = { ...quantities };
    let total = totalAmplitude;
    if (IPG === 'Boston') {
      if (percAmpToggle === 'left') {
        total = 100;
      }
    }
    console.log('Value: ', value);
    console.log('Total: ', total);
    if (value === '2') {
      console.log('Made it here');
      updatedSelectedValues = {
        0: 'right',
        1: 'center',
        2: 'left',
        3: 'left',
        4: 'left',
        5: 'left',
        6: 'left',
        7: 'left',
        8: 'left',
      };
      updatedQuantities = {
        0: total,
        1: total,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
      };
      // setSelectedValues(updatedSelectedValues);
      // setQuantities(updatedQuantities);
      // calculateQuantitiesWithDistribution();
    }
    console.log(updatedQuantities);
    setRadioValue(value);
    // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    // semiAssist();
    console.log('Quantities: ', quantities);
  };

  const radios = [
    { name: 'None', value: '1' },
    { name: 'Steering', value: '2' },
  ];

  const percAmpDef = [
    { name: '%', value: 'left' },
    { name: 'mA', value: 'center' },
  ];

  const volAmpDef = [
    { name: 'mA', value: 'center' },
    { name: 'V', value: 'right' },
  ];

  const ampDef = [{ name: 'mA', value: 'center' }];

  const researchDef = [
    { name: '%', value: 'left' },
    { name: 'mA', value: 'center' },
    { name: 'V', value: 'right' },
  ];

  const [stimMode, setStimMode] = useState('left');

  const stimulationModes = [
    { name: '%', value: 'left' },
    { name: 'mA', value: 'center' },
    { name: 'V', value: 'right' },
  ];

  const handleStimModeChange = (value) => {
    console.log('ResearchToggle; ', researchToggle);
    console.log('NewValue: ', value);
    const newValue = value;
    console.log(newValue);
    if (newValue === 'left') {
      calculatePercentageFromAmplitude();
      outputTogglePosition = '%';
      setTogglePosition(outputTogglePosition);
      setCurrentLabel('mA');
    } else if (newValue === 'center' && researchToggle !== 'right') {
      calculateAmplitudeFromPercentage();
      outputTogglePosition = 'mA';
      setTogglePosition(outputTogglePosition);
      setCurrentLabel('mA');
    } else if (newValue === 'right') {
      if (researchToggle === 'left') {
        calculateAmplitudeFromPercentage();
      }
      outputTogglePosition = 'V';
      setTogglePosition(outputTogglePosition);
      setCurrentLabel('V');
      console.log(outputTogglePosition);
    }
    setStimMode(newValue);
    // setResearchTogg
  };

  const handleVisModelChange = (event) => {
    setVisModel(event.target.value);
  };

  // const handleTitleChange = (event) => {
  //   setSessionTitle(event.target.value);
  // };

  const getVariant = (value) => {
    // if (value === 'left') {
    //     return 'outline-success';  // Green outline for 'left'
    // } else if (value === 'right') {
    //     return 'outline-danger';  // Red outline for 'right'
    // } else {
    //     return 'outline-secondary';  // Default secondary outline
    // }
    return 'outline-secondary';
  };

  const tooltipspliteven = (
    <Tooltip id="tooltip">
      Evenly share current between active contacts.
    </Tooltip>
  );

  const tooltiprefactor = (
    <Tooltip id="tooltip">Make sure contacts sum to 100.</Tooltip>
  );

  const getSwitchAnimationPercAmp = (value, switchPosition) => {
    if (value === 'right' && switchPosition === 'left') {
      setPercAmpAnimation('leftRight');
    } else if (value === 'left' && switchPosition === 'right') {
      setPercAmpAnimation('rightLeft');
    }
    // this.onChange(value, animation);
    // this.setState({ switchPosition: value, animation });
  };
  // const [showViewer, setShowViewer] = useState(false);
  const handleOpenViewer = () => {
    setShowViewer(!showViewer);
  };

  // Trying out input parameters
  const [paramInput, setParamInput] = useState('');

  // Helper function to get contacts for a given level
  function getContactsForLevel(level, activeLetters) {
    const contactMap = {
      0: { a: 1 }, // Contacts at level 1
      1: { a: 2, b: 3, c: 4 }, // Contacts at level 2
      2: { a: 5, b: 6, c: 7 },
      3: { a: 8 }, // Contacts at level 3 (only a and b here)
    };

    const fullRange = Object.values(contactMap[level]);

    // If no active letters (e.g., "1-"), return the full range of contacts for the level
    if (!activeLetters || activeLetters === 'abc') {
      return fullRange;
    }

    // Otherwise, return only the contacts specified by the letters (e.g., "ac")
    return activeLetters.split('').map((letter) => contactMap[level][letter]);
  }

  // Function to parse input string and update quantities and selectedValues arrays
  const parseInput = (input) => {
    // Initialize arrays for quantities and selectedValues
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // Split the input by '/'

    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = 0;
      updatedSelectedValues[key] = 'left';
    });

    let activePlusContacts = []; // Array to store all active '+' contacts
    let activeMinusContacts = []; // Array to store all active '-' contacts
    let totalPlusContacts = 0; // Counter for total '+' contacts
    let totalMinusContacts = 0; // Counter for total '-' contacts

    // Split the input by '/'
    const parts = input.split('/');

    parts.forEach((part) => {
      part = part.trim();

      if (part.match(/[0-3][a-c]*[+-]/)) {
        // Extract the contact level, active letters, and polarity (e.g., "1ac-")
        const contactLevel = parseInt(part[0]); // The first character is the level number
        const activeLetters = part.slice(1, -1); // Get the letters (if any), skipping the last '+/-'
        const polarity = part.slice(-1); // '+' or '-'

        const contactRange = getContactsForLevel(contactLevel, activeLetters);

        // Add to the appropriate contact array based on polarity
        if (polarity === '+') {
          activePlusContacts = [...activePlusContacts, ...contactRange];
          totalPlusContacts += contactRange.length;
        } else if (polarity === '-') {
          activeMinusContacts = [...activeMinusContacts, ...contactRange];
          totalMinusContacts += contactRange.length;
        }
      } else if (part.includes('C+')) {
        // Handle C+ (contact[0] with polarity 'right')
        activePlusContacts.push(0);
        totalPlusContacts++;
      } else if (part.includes('C-')) {
        // Handle C- (contact[0] with polarity 'center')
        activeMinusContacts.push(0);
        totalMinusContacts++;
      }
    });

    // Set quantities and selectedValues for '+' contacts
    const plusEvenSplit = 100 / totalPlusContacts;
    activePlusContacts.forEach((contact) => {
      updatedQuantities[contact] = plusEvenSplit;
      updatedSelectedValues[contact] = 'right'; // '+' corresponds to 'right'
    });

    // Set quantities and selectedValues for '-' contacts
    const minusEvenSplit = 100 / totalMinusContacts;
    activeMinusContacts.forEach((contact) => {
      updatedQuantities[contact] = minusEvenSplit;
      updatedSelectedValues[contact] = 'center'; // '-' corresponds to 'center'
    });

    // Split the input by ';' to separate the amplitude part
    const [contactPart, amplitudePart] = input.split(';');
    // Process amplitude part (2mA)
    if (amplitudePart) {
      const amplitudeMatch = amplitudePart.match(/(\d+\.?\d*)mA/);
      if (amplitudeMatch) {
        setTotalAmplitude(parseFloat(amplitudeMatch[1]));
      }
    }
    // Update the state with the new values
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  const handleInputParamButton = () => {
    const parsedResult = parseInput(paramInput);
  };

  // useEffect(() => {
  //   if (tempParamInput) {
  //     parseInput(tempParamInput);
  //   }
  // }, []);

  const [exportedText, setExportedText] = useState('');

  const reverseParse = () => {
    const result = [];

    // Function to convert contacts at a specific contactLevel into the appropriate letter(s)
    const getContactLetters = (contacts, contactLevel) => {
      const contactMap = {
        0: { 1: '' }, // Contacts at level 1
        1: { 2: 'a', 3: 'b', 4: 'c' }, // Contacts at level 2
        2: { 5: 'a', 6: 'b', 7: 'c' },
        3: { 8: '' }, // Contacts at level 3 (only a and b here)
      };
      return contacts
        .map((contact) => contactMap[contactLevel][contact])
        .join('');
    };

    // Process each contact level (1-3) and contacts
    for (let contactLevel = 0; contactLevel <= 3; contactLevel++) {
      const activePlusContacts = [];
      const activeMinusContacts = [];

      // Get contacts at the current contactLevel
      const contactRange = {
        0: [1],
        1: [2, 3, 4],
        2: [5, 6, 7],
        3: [8],
      }[contactLevel];

      contactRange.forEach((contact) => {
        if (quantities[contact] > 0) {
          if (selectedValues[contact] === 'right') {
            activePlusContacts.push(contact);
          } else if (selectedValues[contact] === 'center') {
            activeMinusContacts.push(contact);
          }
        }
      });

      // Construct text for '+' polarity
      if (activePlusContacts.length > 0) {
        const letters = getContactLetters(activePlusContacts, contactLevel);
        result.push(`${contactLevel}${letters}+`);
      }

      // Construct text for '-' polarity
      if (activeMinusContacts.length > 0) {
        const letters = getContactLetters(activeMinusContacts, contactLevel);
        result.push(`${contactLevel}${letters}-`);
      }
    }

    // Handle 'C' (contact 0)
    if (quantities[0] > 0) {
      if (selectedValues[0] === 'right') {
        result.push('C+');
      } else if (selectedValues[0] === 'center') {
        result.push('C-');
      }
    }

    // Add the amplitude at the end
    if (totalAmplitude > 0) {
      result.push(`${totalAmplitude}mA`);
    }
    const textoutput = result.join(' / ');
    setExportedText(textoutput);
    // return result.join(' / ');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportedText);
    // alert('Copied to clipboard!');
  };

  // useEffect(() => {
  //   if (showViewer) {
  //     window.electron.zoom.setZoomLevel(-4);
  //   } else {
  //     window.electron.zoom.setZoomLevel(-3);
  //   }
  // }, [showViewer]);

  // useEffect(() => {
  //   if (IPG === 'Abbott') {
  //     // const newQuantities = { ...quantities };
  //     calculateQuantitiesWithDistributionAbbott();
  //   }
  //   if (radioValue === '1' && IPG !== 'Abbott') {
  //     semiAssist();
  //   }
  //   if (currentLabel === 'V' && IPG === 'Medtronic_Activa') {
  //     // console.log('here');
  //     handleActivaVoltage();
  //   }
  // }, [
  //   currentLabel,
  //   IPG,
  //   radioValue,
  //   outputTogglePosition,
  //   calculateQuantitiesWithDistributionAbbott,
  //   semiAssist,
  //   handleActivaVoltage,
  // ]);

  useEffect(() => {
    const calculateQuantitiesWithDistributionAbbott = () => {
      // Calculate the quantity increment for 'center' and 'right' values
      const total = totalAmplitude;

      // total = totalAmplitude;
      console.log('total: ', total);
      const centerCount = Object.values(selectedValues).filter(
        (value) => value === 'center',
      ).length;
      const centerQuantityIncrement = centerCount > 0 ? total / centerCount : 0;
      // console.log('CenterCount: ', centerCount);

      const rightCount = Object.values(selectedValues).filter(
        (value) => value === 'right',
      ).length;
      const rightQuantityIncrement = rightCount > 0 ? total / rightCount : 0;

      const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

      // Update the quantities based on selected values
      Object.keys(selectedValues).forEach((key) => {
        const value = selectedValues[key];
        // console.log("key="+key + ", value=" + value);
        if (value === 'left') {
          updatedQuantities[key] = 0;
        } else if (value === 'center') {
          console.log('CENTER: ', centerQuantityIncrement);
          updatedQuantities[key] = centerQuantityIncrement;
          console.log('updated: ', updatedQuantities);
        } else if (value === 'right') {
          updatedQuantities[key] = rightQuantityIncrement;
        }
        // updatedQuantities[key] = 20;
      });

      // console.log(quantities);
      setQuantities(updatedQuantities);
      // setSelectedValues(selectedValue);

      console.log(quantities);
      // Update the state with the new quantities
    };
    if (IPG === 'Abbott') {
      calculateQuantitiesWithDistributionAbbott();
    }
  }, [IPG, selectedValues, totalAmplitude]);

  useEffect(() => {
    const semiAssist = () => {
      const updatedQuantities = { ...quantities };
      let total = totalAmplitude;
      if (IPG === 'Boston') {
        if (percAmpToggle === 'left') {
          total = 100;
        }
      }
      if (IPG === 'Research') {
        if (researchToggle === 'left') {
          total = 100;
        }
      }
      // const updatedSelectedValues = { ...selectedValues };
      let count = 0;
      const lastKey = [];
      Object.keys(updatedQuantities).forEach((key) => {
        if (key !== 0 && selectedValues[key] === 'center') {
          count += 1;
          lastKey.push(key);
        }
      });
      if (count === 1) {
        updatedQuantities[lastKey[0]] = total;
      }

      let rightCount = 0;
      const rightLastKey = [];
      Object.keys(updatedQuantities).forEach((key) => {
        if (selectedValues[key] === 'right') {
          rightCount += 1;
          rightLastKey.push(key);
        }
      });
      if (rightCount === 1) {
        updatedQuantities[rightLastKey[0]] = total;
      }
      setQuantities(updatedQuantities);
    };
    if (radioValue === '1' && IPG !== 'Abbott') {
      semiAssist();
    }
  }, [radioValue, IPG, totalAmplitude, selectedValues]);

  useEffect(() => {
    const handleActivaVoltage = () => {
      const updatedQuantities = { ...quantities };
      Object.keys(updatedQuantities).forEach((key) => {
        if (selectedValues[key] !== 'left') {
          updatedQuantities[key] = totalAmplitude;
        }
      });
      setQuantities(updatedQuantities);
    };
    if (currentLabel === 'V' && IPG === 'Medtronic_Activa') {
      handleActivaVoltage();
    }
  }, [currentLabel, IPG, totalAmplitude, selectedValues]);

  /// //////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div style={{ position: 'relative' }}>
      <div className="container">
        <div
          className={
            elspec.tipisactive === 0
              ? 'control-panel'
              : 'control-panel-inactive'
          }
        >
          {/* <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {electrodeLabel}
          </div> */}
          <div className="model-selector">
            <Form.Select
              aria-label="Select Visualization Model"
              value={visModel}
              onChange={handleVisModelChange}
              style={{
                borderRadius: '20px',
                boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <option>Choose a model</option>
              {elspec.isdirected === 0 && (
                <option value="1">Dembek 2017</option>
              )}
              <option value="2">FastField (Baniasadi 2020)</option>
              <option value="3">SimBio/FieldTrip (see Horn 2017)</option>
              {elspec.isdirected === 0 && (
                <option value="4">Kuncel 2008</option>
              )}
              {elspec.isdirected === 0 && (
                <option value="5">Maedler 2012</option>
              )}
              <option value="6">OSS-DBS (Butenko 2020)</option>
            </Form.Select>
          </div>
          <div style={{ marginTop: '-20px' }}>
            {(visModel === '3' || visModel === '6') && (
              <Form.Check
                label={
                  <span style={{ color: 'black' }}>
                    Estimate in template space
                  </span>
                }
                checked={templateSpace === 1}
                onChange={handleCheckboxChange}
              />
            )}
          </div>
          <div className="toggle-controls">
            <div className="input-field" style={{ fontSize: '18px' }}>
              <input
                className="amplitude-input"
                type="number"
                name="quantity"
                pattern="[0-9]+"
                step="0.1"
                min="0"
                value={totalAmplitude}
                onChange={handleTotalAmplitudeChange}
                style={{ fontSize: '18px', padding: '10px' }}
              />
              <span className="input-label" style={{ fontSize: '18px' }}>{currentLabel}</span>
            </div>
            <div style={{ marginTop: '-15px' }}>
              {IPG === 'Boston' && (
                <ButtonGroup className="toggle-group">
                  {percAmpDef.map((percAmp, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`percAmp-${idx}`}
                      type="radio"
                      variant={getVariant(percAmp.value)}
                      name="percAmp"
                      value={percAmp.value}
                      checked={percAmpToggle === percAmp.value}
                      onChange={(e) =>
                        handlePercAmpToggleChange(e.currentTarget.value)
                      }
                      style={{
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        color: 'navy',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                        border: 'none',
                        ...(percAmpToggle === percAmp.value && {
                          color: 'black',
                          fontWeight: 'bold',
                          border: 'none',
                          boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)', // Inward shadow for selected
                        }),
                      }}
                    >
                      {percAmp.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              )}
              {IPG === 'Medtronic_Activa' && (
                <ButtonGroup className="toggle-group">
                  {volAmpDef.map((volAmp, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`volAmp-${idx}`}
                      type="radio"
                      variant={getVariant(volAmp.value)}
                      name="volAmp"
                      value={volAmp.value}
                      checked={volAmpToggle === volAmp.value}
                      onChange={(e) =>
                        handleVolAmpToggleChange(e.currentTarget.value)
                      }
                    >
                      {volAmp.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              )}
              {IPG === 'Research' && (
                <ButtonGroup className="toggle-group">
                  {researchDef.map((res, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`res-${idx}`}
                      type="radio"
                      variant={getVariant(res.value)}
                      name="res"
                      value={res.value}
                      checked={researchToggle === res.value}
                      onChange={(e) =>
                        handleResearchToggleChange(e.currentTarget.value)
                      }
                    >
                      {res.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              )}
            </div>
          </div>
          <div className="input-controls">
            <div className="input-field">
              <input
                className="duration-input"
                type="number"
                name="quantity"
                pattern="[0-9]+"
                value={60}
                disabled
                onChange={handleParameterChange('parameter1')}
              />
              <span className="input-label">μs</span>
            </div>
            <div className="input-field">
              <input
                className="frequency-input"
                type="number"
                name="quantity"
                pattern="[0-9]+"
                disabled
                value={130}
                onChange={handleParameterChange('parameter2')}
              />
              <span className="input-label">hz</span>
            </div>
          </div>
          <div
            className="parameter-controls"
            style={{
              textAlign: 'left',
              zIndex: 100,
              marginTop: '-10px',
              marginBottom: '-50px',
            }}
          >
            <ButtonGroup horizontal>
              <Button
                variant="secondary"
                onClick={calculateQuantitiesWithDistribution}
                disabled={currentLabel === 'V'}
                title="Split evenly among active contacts"
                style={{
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  marginRight: '10px',
                  marginLeft: '-10px',
                }}
              >
                Split Even
              </Button>
              <Button
                variant="secondary"
                onClick={roundToHundred}
                disabled={currentLabel === 'V'}
                title="Adjust contact values to fill total amplitude"
                style={{
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  marginRight: '10px',
                }}
              >
                Refactor
              </Button>
              <Button
                variant="secondary"
                onClick={handleClearButton}
                style={{
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                }}
              >
                Clear
              </Button>
            </ButtonGroup>
          </div>
          {handleIPG()}
          {(IPG === 'Boston' || IPG === 'Medtronic_Percept') &&
            (stimController === 0 || stimController === 3) && (
              <div className="">
                <hr
                  style={{
                    width: '100%',
                    margin: '20px 0',
                    border: '1px solid #ccc',
                  }}
                />
                <span className="steering-label">Steering</span>
                <ButtonGroup className="steering-buttons" horizontal>
                  <Button
                    variant="secondary"
                    onClick={handlePercAmpChangeUp}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                      border: 'none',
                      marginRight: '10px',
                    }}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="secondary"
                    disabled
                    style={{
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                      border: 'none',
                      marginRight: '10px',
                    }}
                  >
                    Level
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handlePercAmpChangeDown}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                      border: 'none',
                    }}
                  >
                    ↓
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="steering-buttons" horizontal>
                  <Button
                    variant="secondary"
                    onClick={handlePercAmpChangeClockwise}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                      border: 'none',
                      marginRight: '10px',
                    }}
                  >
                    ↻
                  </Button>
                  <Button
                    variant="secondary"
                    disabled
                    style={{
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                      border: 'none',
                      marginRight: '10px',
                    }}
                  >
                    Post-Lat
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handlePercAmpChangeCounterClockwise}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                      border: 'none',
                    }}
                  >
                    ↺
                  </Button>
                </ButtonGroup>
              </div>
            )}
          {(IPG === 'Boston' || IPG === 'Medtronic_Percept') && (
            <div className="">
              <SplitEvenButton
                className="svgButtons"
                onClick={handleSplitEvenButton}
              />
              <ForwardButton
                className="svgButtons"
                onClick={handleForwardButton}
              />
              <BackButton className="svgButtons" onClick={handleBackButton} />
              <LeftButton className="svgButtons" onClick={handleRightButton} />
              <RightButton className="svgButtons" onClick={handleLeftButton} />
            </div>
          )}
          {IPG === 'Medtronic_Activa' && (
            <div
              style={{
                display: 'flex',
                width: '200px',
                height: '200px',
                margin:
                  '10px auto' /* Add margin auto to center horizontally */,
              }}
            />
          )}
          <hr
            style={{
              width: '100%',
              margin: '20px 0',
              border: '1px solid #ccc',
            }}
          />
          {/* <Button onClick={handleOpenViewer} style={{ backgroundColor: 'green' }}>
          {showViewer ? 'Close Viewer' : 'Open Viewer'}
        </Button> */}
          {/* <Button
            onClick={() => {
              handleOpenViewer();
              // if (!showViewer) {
              //   window.electron.zoom.setZoomLevel(-5);
              // } else {
              //   window.electron.zoom.setZoomLevel(-3);
              // }
              // window.electron.ipcRenderer.sendMessage(
              //   'increase-window-width',
              //   showViewer,
              // );
            }}
            variant="success"
            style={{
              borderRadius: '10px',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              border: 'none',
              outline: 'none',
              marginTop: '-60px',
            }}
          >
            {showViewer ? 'Close Viewer' : 'Open Viewer'}
          </Button> */}
        </div>
        <div className="electrode-container">
          <div className="container2">
            <div className="IPG">
              {ipgs.map((ipg) => (
                <div className="image-item">
                  <div className="image-container">
                    {React.cloneElement(ipg, {
                      key: ipg.key,
                      className: `${selectedValues[ipg.key]}-color`,
                    })}
                    {!isNaN(Number(ipg.key)) && (
                      <div className="triple-toggle-ipg-boston-test">
                        <ContactParameters
                          key={ipg.key}
                          value={selectedValues[ipg.key]}
                          switchPosition={selectedValues[ipg.key]}
                          animation={animation[ipg.key]}
                          quantity={quantities[ipg.key]}
                          onChange={(value, anime) =>
                            handleTripleToggleChange(value, anime, ipg.key)
                          }
                          onQuantityChange={(value, anime, quantity) =>
                            handleQuantityChange(quantity, ipg.key)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="left-contacts-test">
              {leftContacts.map((Lcon) => (
                <div
                  // className={
                  //   showViewer ? 'image-item-left' : 'image-item-default'
                  // }
                  className="image-item-left"
                  // className={elmodel === 'Boston Scientific Vercise Cartesia HX' ? 'image-item-cartesia-hx' : 'image-item-left'}
                >
                  <div className="image-container-left">
                    {React.cloneElement(Lcon, {
                      key: Lcon.key,
                      className: `${selectedValues[Lcon.key]}-color`,
                    })}
                    {!isNaN(Number(Lcon.key)) && (
                      <div className="triple-toggle-boston-test-left">
                        <ContactParameters
                          key={Lcon.key}
                          value={selectedValues[Lcon.key]}
                          switchPosition={selectedValues[Lcon.key]}
                          quantity={quantities[Lcon.key]}
                          onChange={(value, anime) =>
                            handleTripleToggleChange(value, anime, Lcon.key)
                          }
                          onQuantityChange={(value, anime, quantity) =>
                            handleQuantityChange(quantity, Lcon.key)
                          }
                        />
                      </div>
                    )}
                  </div>
                  <p
                    className="image-name-boston-left"
                    style={{ color: 'white' }}
                  >
                    {names[Lcon.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="Elmodel-center">
            {svgs.map((svg) => (
              <div
                // className="image-item-2"
                // className={showViewer ? 'image-item-2-viewer' : 'image-item-2'}
                className="image-item-2"
                style={{ zIndex: svg.key }}
              >
                <div className="background-image">
                  <Background />
                </div>
                <div className="image-container-test">
                  {React.cloneElement(svg, {
                    key: svg.key,
                    className: `${selectedValues[svg.key]}-color`,
                  })}
                  {!isNaN(Number(svg.key)) && (
                    <div className="triple-toggle-boston-test-2">
                      <ContactParameters
                        key={svg.key}
                        value={selectedValues[svg.key]}
                        switchPosition={selectedValues[svg.key]}
                        quantity={quantities[svg.key]}
                        onChange={(value, anime) =>
                          handleTripleToggleChange(value, anime, svg.key)
                        }
                        onQuantityChange={(value, anime, quantity) =>
                          handleQuantityChange(quantity, svg.key)
                        }
                      />
                    </div>
                  )}
                </div>
                <p
                  className="image-name-boston"
                  style={{
                    color: 'white',
                    paddingTop: '100px',
                    marginLeft: '95px',
                  }}
                >
                  {names[svg.key]}
                </p>
              </div>
            ))}
          </div>
          <div className="right-contacts-test">
            {rightContacts.map((rCon) => (
              <div className="image-item-right">
                <div className="image-container-right">
                  {React.cloneElement(rCon, {
                    key: rCon.key,
                    className: `${selectedValues[rCon.key]}-color`,
                  })}
                  {!isNaN(Number(rCon.key)) && (
                    <div className="triple-toggle-boston-test-right">
                      <ContactParameters
                        key={rCon.key}
                        value={selectedValues[rCon.key]}
                        switchPosition={selectedValues[rCon.key]}
                        quantity={quantities[rCon.key]}
                        onChange={(value, anime) =>
                          handleTripleToggleChange(value, anime, rCon.key)
                        }
                        onQuantityChange={(value, anime, quantity) =>
                          handleQuantityChange(quantity, rCon.key)
                        }
                      />
                    </div>
                  )}
                </div>
                <p
                  className="image-name-boston-right"
                  style={{ color: 'white' }}
                >
                  {names[rCon.key]}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* {showViewer && (
          <div
            style={{
              // width: '100%', // Use percentage for responsive width
              // padding: '20px',
              borderRadius: '30px',
              // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              // background: 'linear-gradient(to bottom, rgba(135, 162, 191, 0.6), #A9C3D1)',
              backgroundColor: 'black',
              display: 'flex', // Use flexbox for layout
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'visible',
              marginLeft: '160px',
            }}
          >
            <PlyViewer
              quantities={quantities}
              setQuantities={setQuantities}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              amplitude={totalAmplitude}
              setAmplitude={setTotalAmplitude}
              side={name}
              historical={historical}
              togglePosition={percAmpToggle}
              tab={name}
              names={names}
              elspec={elspec}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Electrode;
