'use client';

import { ForwardRefEditor } from '@/components/input/forwardRefEditor';
import IconPadding from '@/components/wrapper/IconPadding';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import { addToWrittenThreads } from '@/store/user/userSlice';
import { customFetch, generalFetch } from '@/utils/customFetch';
import { checkInvalidCustomTag } from '@/utils/inputValidator';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { InfoSharp, RestartAltSharp, SendSharp } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { postCategories, postCategoriesDict } from '../categories';
import { BASE_API_URL } from '../layout';

export interface Tag {
  id: number;
  tag: string;
}

const TagsPicker = ({
  selectedTags,
  setTags,
}: {
  selectedTags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}) => {
  const { data, error, isLoading } = useSWR<{ tags: Tag[] }>(
    `${BASE_API_URL}/threads/tags`,
    generalFetch()
  );
  const theme = useTheme();

  const handleEditTag = (event: SelectChangeEvent<number[]>) => {
    const newTags = event.target.value as number[];
    const newSelectedTags = (data as { tags: Tag[] }).tags.filter((tag) =>
      newTags.includes(tag.id)
    );
    setTags(newSelectedTags);
    // console.log(`Tag changed: ${newTags}`);
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error">{`Unable to load tags: ${error}`}</Typography>
    );
  if (data) {
    if (data.tags) {
      data.tags.sort((a, b) => (a.tag < b.tag ? -1 : 1));
    }

    return (
      <FormControl>
        <InputLabel id="tags-selector-chip-label">Tags</InputLabel>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1),
          }}
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
            fullWidth
            labelId="tags-selector-chip-label"
            id="tags-selector-chip"
            multiple
            value={selectedTags.map((tag) => tag.id)}
            onChange={handleEditTag}
            input={
              <OutlinedInput id="select-multiple-tags" label="Tags" fullWidth />
            }
            renderValue={() => (
              <Box
                sx={{
                  display: 'flex',
                  gap: theme.spacing(1),
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                {selectedTags.map((tag) => (
                  <Chip
                    sx={{ pl: theme.spacing(1) }}
                    icon={postCategoriesDict[tag.id].icon}
                    key={tag.id}
                    label={tag.tag}
                  />
                ))}
              </Box>
            )}
          >
            {data.tags ? (
              data.tags.map((tag, idx) => (
                <MenuItem key={tag.id} value={tag.id}>
                  <RowFlexBox>
                    {postCategories[idx].icon}
                    {tag.tag}
                  </RowFlexBox>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Tags are currently unavailable.</MenuItem>
            )}
          </Select>
          <Tooltip title="Reset tags">
            <IconButton onClick={() => setTags([])}>
              <RestartAltSharp />
            </IconButton>
          </Tooltip>
        </Box>
      </FormControl>
    );
  }
};

const Page = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const ref = useRef<MDXEditorMethods>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const customTagsRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();

  const handlePost = async () => {
    if (ref.current) {
      try {
        if (titleRef.current && titleRef.current.value === '') {
          alert('Posting a thread with empty title is not allowed.');
          return;
        } else if (ref.current.getMarkdown() === '') {
          alert('Posting an empty content is not allowed.');
          return;
        }

        let customTags: string[] = [];
        if (customTagsRef.current) {
          if (customTagsRef.current.value !== '') {
            customTags = customTagsRef.current.value.split(' ');
          }
        }

        for (let i = 0; i < customTags.length; i++) {
          if (checkInvalidCustomTag(customTags[i])) {
            alert(
              'Custom tag contains special characters other than "_". Special characters except "_" are not allowed in custom tags. Multiple words are joined with "_".'
            );
            return;
          }
        }

        const request = customFetch(`${BASE_API_URL}/threads/new`, {
          method: 'POST',
          body: JSON.stringify({
            title: titleRef.current ? titleRef.current.value : '',
            original_post: ref.current.getMarkdown(),
            tags: selectedTags,
            custom_tags: customTags,
          }),
        });

        const response = await request;
        if (response.ok) {
          dispatch(addToWrittenThreads((await response.json()).id));
          alert('Thread successfully created.');
          router.back();
        } else if (response.status === 400) {
          throw new Error('post object is invalid. check for any warning');
        } else {
          throw new Error('unhandled error');
        }
      } catch (err) {
        alert(`Failed to post a new thread: ${err}`);
      }
    }
  };

  useEffect(() => {
    titleRef.current?.focus();
  });

  return (
    <>
      <Typography variant="h4">New Post</Typography>
      <title>{`1chan | New Post`}</title>
      <br />
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <Typography variant="h5">Post Information</Typography>
          <TextField fullWidth label="Title" inputRef={titleRef} />
          <TagsPicker selectedTags={selectedTags} setTags={setSelectedTags} />
          <RowFlexBox>
            <TextField inputRef={customTagsRef} fullWidth label="Custom Tags" />
            <Tooltip title="Custom tags are case insensitive and space-separated. Multiple words are joined with underscore e.g. 'ice_skating japan'.">
              <Box>
                <IconPadding>
                  <InfoSharp />
                </IconPadding>
              </Box>
            </Tooltip>
          </RowFlexBox>
        </CardContent>
      </Card>
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1),
          }}
        >
          <Typography variant="h5">Post Content</Typography>
          <ForwardRefEditor markdown="" ref={ref} />
        </CardContent>
      </Card>
      <Button
        startIcon={<SendSharp />}
        variant="contained"
        onClick={handlePost}
      >
        Post
      </Button>
    </>
  );
};

export default Page;
