import {
    AppBar,
    Toolbar,
    Typography,
  } from '@mui/material';
  
  export default function Navbar({ text, text2, color1, color2 }) {  
    return (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: color1 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              {text}
            </Typography>
          </Toolbar>
        </AppBar>
        {color2 && (
          <AppBar
            position="fixed"
            style={{ backgroundColor: color2, top: '64px' }}
          >
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'black',  }}>
                {text2}
              </Typography>
            </Toolbar>
          </AppBar>
        )}
      </div>
    );
  }
  