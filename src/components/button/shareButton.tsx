import { ShareSharp } from '@mui/icons-material';
import { IconButton, IconButtonProps, Tooltip, useTheme } from '@mui/material';

interface ShareButtonProps extends IconButtonProps {
  onCopyToClipboard?: (e?: React.MouseEvent<HTMLElement>) => void;
  disableTooltip?: boolean;
}

const ShareButton = ({
  onCopyToClipboard,
  disableTooltip,
  ...props
}: ShareButtonProps) => {
  const theme = useTheme();

  return (
    <Tooltip title={`${disableTooltip ? '' : 'Copy link to clipboard'}`}>
      <IconButton
        onClick={onCopyToClipboard}
        aria-label="Copy link to clipboard."
        {...props}
      >
        <ShareSharp sx={{ color: theme.palette.primary.main }} />
      </IconButton>
    </Tooltip>
  );
};

export default ShareButton;
