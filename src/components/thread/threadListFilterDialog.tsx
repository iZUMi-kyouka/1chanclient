import { postCategories, postCategoriesDict } from '@/app/[locale]/categories';
import { splitTags } from '@/utils/tagsSplitter';
import {
  AdsClickSharp,
  ArrowDownwardSharp,
  ArrowUpwardSharp,
  CalendarMonthSharp,
  ExpandLessSharp,
  ExpandMoreSharp,
  FilterListSharp,
  InfoSharp,
  RestartAltSharp,
  SortSharp,
  ThumbDownSharp,
  ThumbUpSharp
} from '@mui/icons-material';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { useQueryState } from 'nuqs';
import React, { ReactElement, useRef, useState } from 'react';
import RefreshButton from '../button/refreshButton';
import StandardCard from '../StandardCard';
import ColFlexBox from '../wrapper/colFlexContainer';
import RowFlexBox from '../wrapper/rowFlexContainer';

const ThreadListFilterDropdown = ({
  disabled,
  disableRelevance,
  onRefresh,
  disableMoreFilters,
  defaultSort,
  disableViews,
  disableTagsFilter
}: {
  disableTagsFilter?: boolean,
  defaultSort?: 'views' | 'sort_by' | 'relevance' | 'likes' | 'dislikes';
  disableMoreFilters?: boolean;
  disabled?: boolean;
  disableRelevance?: boolean;
  disableViews?: boolean;
  onRefresh?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const [sortParam, setSortParam] = useQueryState('sort_by', {
    defaultValue: disableRelevance
      ? disableViews
        ? 'likes'
        : 'views'
      : defaultSort
        ? defaultSort
        : 'relevance',
  });
  const [orderParam, setOrderParam] = useQueryState('order', {
    defaultValue: 'desc',
  });

  const [tagsParam, setTagsParam] = useQueryState('tags'); // comma-separated query param
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customTagsParam, setCustomTagsParam] = useQueryState('custom_tags'); // comma-separated query param

  const [selectedTags, setSelectedTags] = useState(
    tagsParam ? splitTags(tagsParam) : []
  ); // array of numbers
  const customTagRef = useRef<HTMLInputElement | null>(null);

  const sortParams: [string, ReactElement][] = [
    ['relevance', <FilterListSharp key={1} />],
    ['views', <AdsClickSharp key={2} />],
    ['likes', <ThumbUpSharp key={4} />],
    ['dislikes', <ThumbDownSharp key={5} />],
    ['date', <CalendarMonthSharp key={3} />],
  ];

  const handleCustomTagSubmit = () => {
    if (customTagRef.current === null) {
      return;
    }
    const newValue = customTagRef.current.value;
    const sanitiedValue = newValue
      .trim()
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .join(',');
    setCustomTagsParam(sanitiedValue);
    customTagRef.current.value = sanitiedValue;
  };

  return (
    <>
      <ColFlexBox
        sx={{
          alignItems: 'flex-start',
          gap: 0,
        }}
      >
        <RowFlexBox alignItems={'center'}>
          <FormControl
            sx={{ m: 1, minWidth: 160, marginLeft: 0 }}
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
                if (disableViews && idx === 1) return null;
                return (
                  <MenuItem key={idx} value={p[0]}>
                    <RowFlexBox>
                      {p[1]}
                      {p[0][0].toUpperCase() + p[0].slice(1)}
                    </RowFlexBox>
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
            sx={{
              display: disableMoreFilters ? 'none' : 'flex',
              [theme.breakpoints.down(500)]: {
                display: 'none',
              },
            }}
            disableElevation
            disabled={disabled}
            variant="contained"
            onClick={() => setIsOpen(!isOpen)}
            startIcon={isOpen ? <ArrowUpwardSharp /> : <SortSharp />}
          >
            More Filters
          </Button>
          <Tooltip
            sx={{
              [theme.breakpoints.up(500)]: {
                display: 'none',
              },
            }}
            title="More Filters"
          >
            <Box>
              <IconButton
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
              >
                {isOpen ? <ExpandMoreSharp /> : <ExpandLessSharp />}
              </IconButton>
            </Box>
          </Tooltip>
          <RefreshButton disabled={disabled} onClick={onRefresh} />
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
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(2),
                    width: '100%',
                  }}
                >
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={theme.spacing(0.5)}
                  >
                    <RowFlexBox
                      sx={{ display: disableTagsFilter ? 'none' : 'flex' }}
                    >
                      <Typography variant="body2">Tags</Typography>
                      <Tooltip
                        title={
                          'Filter all threads that contain at least one selected tag.'
                        }
                      >
                        <InfoSharp sx={{
                          fontSize: '12px'
                        }} />
                      </Tooltip>
                    </RowFlexBox>
                    <Divider
                      sx={{ display: disableTagsFilter ? 'none' : 'flex' }}
                    />
                    <RowFlexBox
                      sx={{ display: disableTagsFilter ? 'none' : 'flex' }}
                    >
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 160,
                          marginLeft: 0,
                        }}
                        size="small"
                        disabled={disabled}
                        fullWidth
                      >
                        <Select
                          MenuProps={{
                            keepMounted: true,
                            PaperProps: {
                              style: {
                                maxHeight: '320px',
                                marginTop: theme.spacing(1),
                              },
                            },
                          }}
                          id="tag-filter"
                          multiple
                          value={selectedTags}
                          onChange={(e: SelectChangeEvent<number[]>) => {
                            setSelectedTags(e.target.value as number[]);
                            setTagsParam(
                              (e.target.value as number[]).join(',')
                            );
                          }}
                          renderValue={() => (
                            <Box
                              sx={{
                                display: 'flex',
                                gap: theme.spacing(1),
                                flexWrap: 'wrap',
                                alignItems: 'center',
                              }}
                            >
                              {selectedTags.map((tagId) => (
                                <Chip
                                  sx={{ pl: theme.spacing(1) }}
                                  icon={postCategoriesDict[tagId].icon}
                                  key={tagId}
                                  label={postCategoriesDict[tagId].displayName}
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {postCategories.map((c) => {
                            return (
                              <MenuItem key={c.id} value={c.id}>
                                <RowFlexBox>
                                  {c.icon}
                                  {c.displayName}
                                </RowFlexBox>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <Tooltip title="Reset tags">
                        <IconButton
                          onClick={() => {
                            setSelectedTags([]);
                            setTagsParam(null);
                          }}
                        >
                          <RestartAltSharp />
                        </IconButton>
                      </Tooltip>
                    </RowFlexBox>
                  </Box>
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={theme.spacing(0.5)}
                  >
                    <RowFlexBox>
                      <Typography variant="body2">
                        Custom Tags <i>(comma separated)</i>
                      </Typography>
                      <Tooltip
                        title={
                          'Filter all threads that contain at least one requested custom tag.'
                        }
                      >
                        <InfoSharp sx={{
                          fontSize: '12px'
                        }} />
                      </Tooltip>
                    </RowFlexBox>
                    <Divider />
                    <RowFlexBox alignItems={'center'}>
                      <TextField
                        sx={{ mt: 1 }}
                        size="small"
                        inputRef={customTagRef}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={handleCustomTagSubmit}
                      >
                        Filter
                      </Button>
                    </RowFlexBox>
                  </Box>
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
