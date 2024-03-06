import { createTheme } from "@mui/material/styles";

// Sans-serif font to add
const rich_black = "#001219";
const prussian_blue = "#22333b";
const midnight_green = "#005f73";
const dark_cyan = "#0a9396";
const tiffany_blue = "#94d2bd";
const baby_blue = "#D4F1F4";
const vanilla = "#e9d8a6";
const gamboge = "#ee9b00";
const alloy_orange = "#ca6702";
const rust = "#bb3e03";
const rufous = "#ae2012";
const auburn = "#9b2226";
const white = "#FFFFFF";
const mint_green = "#CBF3F0";
const sunset = "#FFCA85";
const antiue_white = "#FFF6EB";

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
      default: sunset,
    },
    primary: {
      main: alloy_orange,
    },
    secondary: {
      main: midnight_green,
    },
    text: {
      primary: rich_black,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: antiue_white,
          color: rich_black,
        }
      }
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: vanilla,
          color: rich_black,
          '&:hover': {
            backgroundColor: gamboge,
            color: rich_black,
          },
          '& .MuiSelect-icon': {
            color: rich_black,
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: antiue_white, 
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
