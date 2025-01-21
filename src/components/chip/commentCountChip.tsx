import beautifyNumber from '@/utils/beautifyNumber';
import { CommentSharp } from '@mui/icons-material';
import { Chip, useTheme } from '@mui/material';

const CommentCountChip = ({ commentCount }: { commentCount: number }) => {
  const theme = useTheme();

  return (
    <Chip
      sx={{
        paddingLeft: theme.spacing(0.5),
      }}
      icon={
        <CommentSharp
          sx={{
            color: theme.palette.primary.main,
            fontSize: '22px !important',
          }}
        />
      }
      label={beautifyNumber(commentCount)}
    />
  );
};

export default CommentCountChip;
