import { Container, Divider, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { ArrowDownwardSharp, ArrowUpwardSharp, FilterSharp, SortSharp } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

type SortState = {
  criteria: string,
  direction: string
};

const ThreadListFilterDropdown = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [sortState, setSortState] = useState<SortState>({
    criteria: params.get('sort_by') || 'relevance',
    direction: params.get('order') || 'desc'
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
      variant='contained'
      onClick={() => setIsOpen(true)} 
      startIcon={<SortSharp />}>
      Filters
    </Button>
    <Dialog
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Filters</DialogTitle>
      <DialogContent>
        <Box display='flex' gap={theme.spacing(4)}>
          <Box display='flex' flexDirection='column' gap={theme.spacing(1)}>
            <Typography>SORT BY</Typography>
            <Divider></Divider>
            <ToggleButtonGroup
              exclusive
              orientation='vertical'
              value={sortState.criteria}
              onChange={(
                e: React.MouseEvent<HTMLElement>,
                val: string
              ) => {
                // Ensure val is valid before setting
                if (val) {
                  setSortState(prev => ({ ...prev, criteria: val }));
                }
              }}
              sx={{
                flexShrink: '0 !important'
              }}
            >
              <ToggleButton value="relevance">Relevance</ToggleButton>
              <ToggleButton value="views">Views</ToggleButton>
              <ToggleButton value="date">Date</ToggleButton>
              <ToggleButton value="likes">Likes</ToggleButton>
              <ToggleButton value="dislikes">Dislikes</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              exclusive
              value={sortState.direction}
              onChange={(
                e: React.MouseEvent<HTMLElement>,
                val: string
              ) => {
                // Ensure val is valid before setting
                if (val) {
                  setSortState(prev => ({ ...prev, direction: val }));
                }
              }}
            >
            <ToggleButton value="desc"><ArrowDownwardSharp /></ToggleButton>
            <ToggleButton value="asc"><ArrowUpwardSharp /></ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRefresh}>OK</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default ThreadListFilterDropdown;
