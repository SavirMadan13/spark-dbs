import React, { useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import { styled } from '@mui/system';

// Styled Components
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  // border: '1px solid #ccc',
  // borderRadius: '8px',
  // padding: '0.5rem 1rem',
  borderColor: 'transparent',
  fontSize: '16px',
  fontWeight: 600,
  // color: '#333', // Primary text color
  // color: 'transparent',
  backgroundColor: 'transparent',
  '&.Mui-selected': {
    backgroundColor: 'transparent', // Main primary color
    color: '#fff', // White text when selected
    borderColor: 'transparent', // Dark primary color
  },
  '&:hover': {
    backgroundColor: 'transparent', // Light primary color
    color: '#fff', // White text on hover
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '0rem', // Keep gap at 0
  '& .MuiToggleButton-root': {
    marginLeft: '-0.15rem', // Adjust the margin to bring buttons closer
    marginRight: '-0.15rem',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    // borderRadius: '2px',
    width: '100px',
    fontSize: '16px',
    fontWeight: '200',
    paddingLeft: '12px',
    textAlign: 'center',
    color: 'white',
    '& fieldset': {
      borderColor: 'transparent', // Light gray border
    },
    '&:hover fieldset': {
      borderColor: 'transparent', // Main primary color on hover
    },
    '&.Mui-focused fieldset': {
      // borderColor: '#1976d2', // Main primary color when focused
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    color: '#fff', // Secondary text color
  },
}));

function ContactParameters({
  value,
  switchPosition,
  quantity,
  onChange = () => {},
  onQuantityChange = () => {},
}) {
  const [currentPosition, setCurrentPosition] = useState(switchPosition);
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  useEffect(() => {
    setCurrentPosition(switchPosition);
    setCurrentQuantity(quantity);
  }, [switchPosition, quantity]);

  const handleSwitchChange = (event, newPosition) => {
    if (newPosition !== null) {
      setCurrentPosition(newPosition);
      onChange(newPosition);

      if (newPosition === 'left') {
        setCurrentQuantity(0); // Reset quantity when switching to 'left'
        onQuantityChange(newPosition, 0);
      }
    }
  };

  const handleQuantityChange = (event) => {
    const quantityValue = parseInt(event.target.value, 10) || 0;

    if (quantityValue !== 0 && currentPosition === 'left') {
      setCurrentPosition('center'); // Automatically switch to 'center' if quantity is adjusted from 'left'
      onChange('center');
    }

    setCurrentQuantity(quantityValue);
    onQuantityChange(currentPosition, quantityValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <StyledToggleButtonGroup
        value={currentPosition}
        exclusive
        onChange={handleSwitchChange}
        aria-label="contact parameters"
      >
        <StyledToggleButton value="left" aria-label="left">
          OFF
        </StyledToggleButton>
        <StyledToggleButton value="center" aria-label="center">
          -
        </StyledToggleButton>
        <StyledToggleButton value="right" aria-label="right">
          +
        </StyledToggleButton>
      </StyledToggleButtonGroup>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-30px',
          marginLeft: '40px',
        }}
      >
        <StyledTextField
          type="number"
          inputProps={{ min: 0 }}
          value={currentQuantity}
          onChange={handleQuantityChange}
          size="small"
          // variant="standard"
        />
      </div>
    </div>
  );
}

export default ContactParameters;
