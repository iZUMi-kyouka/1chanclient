import {
  ArrowDownwardSharp,
  ArrowUpwardSharp,
  SortSharp,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

type SortState = {
  criteria: string;
  direction: string;
};

const ThreadListFilterDropdown = ({disableRelevance}: {disableRelevance?: boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [sortState, setSortState] = useState<SortState>({
    criteria: params.get('sort_by') || disableRelevance ? 'views' : 'relevance',
    direction: params.get('order') || 'desc',
  });

  const handleRefresh = () => {
    const newParams: URLSearchParams = new URLSearchParams(params.toString());
    newParams.set('sort_by', sortState.criteria);
    newParams.set('order', sortState.direction);
    router.push(`${pathname}?${newParams.toString()}`);
    setIsOpen(false);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setIsOpen(true)}
        startIcon={<SortSharp />}
      >
        Filters
      </Button>
      <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={handleClose}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={theme.spacing(4)} justifyContent={'center'}>
            <Box display="flex" flexDirection="column" gap={theme.spacing(1)}>
              <Typography>SORT BY</Typography>
              <Divider></Divider>
              <ToggleButtonGroup
                exclusive
                orientation="vertical"
                value={sortState.criteria}
                onChange={(e: React.MouseEvent<HTMLElement>, val: string) => {
                  // Ensure val is valid before setting
                  if (val) {
                    setSortState((prev) => ({ ...prev, criteria: val }));
                  }
                }}
                sx={{
                  flexShrink: '0 !important',
                }}
              >
                {disableRelevance ? null : <ToggleButton value="relevance">Relevance</ToggleButton>}
                <ToggleButton value="views">Views</ToggleButton>
                <ToggleButton value="date">Date</ToggleButton>
                <ToggleButton value="likes">Likes</ToggleButton>
                <ToggleButton value="dislikes">Dislikes</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                exclusive
                value={sortState.direction}
                onChange={(e: React.MouseEvent<HTMLElement>, val: string) => {
                  // Ensure val is valid before setting
                  if (val) {
                    setSortState((prev) => ({ ...prev, direction: val }));
                  }
                }}
              >
                <ToggleButton value="desc">
                  <ArrowDownwardSharp />
                </ToggleButton>
                <ToggleButton value="asc">
                  <ArrowUpwardSharp />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRefresh}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ThreadListFilterDropdown;
