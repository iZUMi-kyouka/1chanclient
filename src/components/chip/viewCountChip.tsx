import beautifyNumber from '@/utils/beautifyNumber';
import { AdsClickSharp } from '@mui/icons-material';
import { Chip, useTheme } from '@mui/material';

const ViewCountChip = ({ viewCount }: { viewCount: number }) => {
  const theme = useTheme();

  return (
    <Chip
      icon={
        <AdsClickSharp
          sx={{
            marginRight: 1,
            color: theme.palette.primary.main,
          }}
        />
      }
      label={beautifyNumber(viewCount)}
    />
  );
};

export default ViewCountChip;
