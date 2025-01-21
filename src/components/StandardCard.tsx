import { Card, CardProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';
/**
 * An MUI card with standardised default width
 */
const StandardCard = ({
  children,
  width,
  ...props
}: CardProps & {
  children: ReactNode;
  width?: string;
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: width || '85ch',
        [theme.breakpoints.down('lg')]: {
          width: '100%',
        },
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default StandardCard;
