import { DarkModeSharp, LightModeSharp } from '@mui/icons-material';
import { IconButton, useColorScheme } from '@mui/material';

const ColorSchemeSwitcher = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  if (!colorScheme) {
    return null;
  }

  return (
    <>
      {colorScheme === 'dark' ? (
        <IconButton color="inherit" onClick={() => setColorScheme('light')}>
          <LightModeSharp />
        </IconButton>
      ) : (
        <IconButton color="inherit" onClick={() => setColorScheme('dark')}>
          <DarkModeSharp />
        </IconButton>
      )}
    </>
  );
};

export default ColorSchemeSwitcher;
