import { RefreshSharp } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';

const RefreshButton = ({
  onClick,
  disabled
}: {
  disabled?: boolean
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <Tooltip title='Refresh'>
      <Box>
        <IconButton onClick={onClick} disabled={disabled}>
          <RefreshSharp />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default RefreshButton;
