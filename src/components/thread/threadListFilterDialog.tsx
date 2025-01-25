import {
  ArrowDownwardSharp,
  ArrowUpwardSharp,
  SortSharp,
} from '@mui/icons-material';
import {
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { useQueryState } from 'nuqs';
import React, { useState } from 'react';
import RefreshButton from '../button/refreshButton';
import StandardCard from '../StandardCard';
import ColFlexBox from '../wrapper/colFlexContainer';
import RowFlexBox from '../wrapper/rowFlexContainer';

const ThreadListFilterDropdown = ({
  disabled,
  disableRelevance,
  onRefresh
}: {
  disabled?: boolean;
  disableRelevance?: boolean;
  onRefresh?: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const [sortParam, setSortParam] = useQueryState('sort_by', {
    defaultValue: disableRelevance ? 'views' : 'relevance',
  });
  const [orderParam, setOrderParam] = useQueryState('order', {
    defaultValue: 'desc',
  });

  const sortParams = ['relevance', 'views', 'date', 'likes', 'dislikes', 'comments'];
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ColFlexBox
        sx={{
          alignItems: 'flex-start',
          gap: 0
        }}
      >
        <RowFlexBox>
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            size="small"
            disabled={disabled}
          >
            <InputLabel id="sort-param-label">Sort By</InputLabel>
            <Select
              labelId="sort-param-label"
              id="sort-param"
              value={sortParam}
              label="Sort By"
              onChange={(e: SelectChangeEvent<string>) =>
                setSortParam(e.target.value)
              }
            >
              {sortParams.map((p, idx) => {
                if (disableRelevance && idx === 0) return null;
                return (
                  <MenuItem key={idx} value={p}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <ToggleButtonGroup
            disabled={disabled}
            size="small"
            exclusive
            value={orderParam}
            onChange={(_e: React.MouseEvent<HTMLElement>, val: string) => {
              // Ensure val is valid before setting
              if (val) {
                setOrderParam(val);
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
          <Button
            disabled={disabled}
            variant="contained"
            onClick={() => setIsOpen(!isOpen)}
            startIcon={isOpen ? <ArrowUpwardSharp /> : <SortSharp />}
          >
            More Filters
          </Button>
          <RefreshButton onClick={onRefresh} />
        </RowFlexBox>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { duration: 0.2, ease: 'easeInOut' },
                height: { duration: 0.2, ease: 'easeInOut' },
              }}
              style={{
                overflow: 'hidden', // Prevent content overflow during animation
                width: '100%',
                display: 'flex', // Keeps consistent styling for the card
              }}
            >
              <StandardCard
                sx={{
                  width: '100%',
                  display: 'flex',
                }}
              >
                <CardContent>
                  <Typography>Tags</Typography>
                  <Typography>Custom Tags</Typography>
                </CardContent>
              </StandardCard>
            </motion.div>
          )}
        </AnimatePresence>
      </ColFlexBox>
    </>
  );
};

export default ThreadListFilterDropdown;
