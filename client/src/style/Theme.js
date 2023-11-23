import { createTheme } from "@mui/material/styles";

// Sans-serif font to add
const rich_black = "#001219";
const prussian_blue = "#22333b";
const midnight_green = "#005f73";
const dark_cyan = "#0a9396";
const tiffany_blue = "#94d2bd";
const vanilla = "#e9d8a6";
const gamboge = "#ee9b00";
const alloy_orange = "#ca6702";
const rust = "#bb3e03";
const rufous = "#ae2012";
const auburn = "#9b2226";

const Theme = createTheme({
  typography: {
    
    fontFamily: "Arial",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,  
  },
  palette: {
    background: {
      default: rich_black,
    },
    primary: {
      main: alloy_orange,
    },
    secondary: {
      main: midnight_green,
    },
    text: {
      primary: vanilla,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: tiffany_blue,
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: midnight_green,
          color: vanilla,
          '&:hover': {
            backgroundColor: gamboge,
            color: rich_black,
          },
          '& .MuiSelect-icon': {
            color: tiffany_blue,
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: prussian_blue, 
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: gamboge,
            color: rich_black,
          }
        }
      }
    }
  }
});

export default Theme;
