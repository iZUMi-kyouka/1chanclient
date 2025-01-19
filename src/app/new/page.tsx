'use client';

import { ForwardRefEditor } from '@/components/forwardRefEditor'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, CircularProgress, Container, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import useSWR from 'swr';
import { BASE_API_URL } from '../layout';
import { customFetch, generalFetch } from '@/utils/customFetch';
import { useRouter } from 'next/navigation';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { RestartAltSharp, RestoreSharp, SendSharp } from '@mui/icons-material';

export interface Tag {
  id: number,
  tag: string
}

const TagsPicker = ({ selectedTags, setTags }: { selectedTags: Tag[], setTags: React.Dispatch<React.SetStateAction<Tag[]>>}) => {
  const { data, error, isLoading } = useSWR<{tags: Tag[]}>(`${BASE_API_URL}/threads/tags`, generalFetch());
  const theme = useTheme();
  
  const handleEditTag = (event: SelectChangeEvent<number[]>) => {
    const newTags = event.target.value as number[];
    const newSelectedTags = (data as {tags: Tag[]}).tags.filter(tag => newTags.includes(tag.id))
    setTags(newSelectedTags);
    // console.log(`Tag changed: ${newTags}`);
  };
  
  if (isLoading) return <CircularProgress />
  if (error) return <Typography color="error">{`Unable to load tags: ${error}`}</Typography>
  if (data) {
    return (
      <FormControl>
        <InputLabel id="tags-selector-chip-label">Tags</InputLabel>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1)
          }}
        >
          <Select
            MenuProps={{
              keepMounted: true,
              PaperProps: {
                style: {
                  maxHeight: '320px',
                  marginTop: theme.spacing(1)
                }
              }
            }}
            fullWidth
            labelId="tags-selector-chip-label"
            id="tags-selector-chip"
            multiple
            value={selectedTags.map(tag => tag.id)}
            onChange={handleEditTag}
            input={<OutlinedInput id="select-multiple-tags" label="Tags" fullWidth/>}
            renderValue={(selected) => (
              <Box sx={{
                display: 'flex',
                gap: theme.spacing(1),
                flexWrap: 'wrap',
              }}>
                {
                  selectedTags.map(tag => (
                    <Chip key={tag.id} label={tag.tag} />
                  ))
                }
              </Box>
            )}
          >
            {data.tags.map((tag) => (
              <MenuItem
                key={tag.id}
                value={tag.id}
              >
                {tag.tag}
              </MenuItem>
            ))}
          </Select>
          <Tooltip
            title="Reset tags"
          >
            <IconButton
              sx={{
                width: theme.spacing(6),
                height: theme.spacing(6)
              }}
              onClick={() => setTags([])}
            >
              <RestartAltSharp />
            </IconButton>
          </Tooltip>

        </Box>
     
    </FormControl>
    );
  }
};

const page = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const ref = useRef<MDXEditorMethods>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const router = useRouter();

  const handlePost = async () => {
    if (ref.current) {
      try {
        if (titleRef.current && titleRef.current.value === '') {
          alert('Title must not be empty.');
          return
        } else if (ref.current.getMarkdown() === '') {
          alert('Post must not be empty.');
          return
        }

        const request = customFetch(`${BASE_API_URL}/threads/new`, {
          method: 'POST',
          body: JSON.stringify({
            title: titleRef.current ? titleRef.current.value : '',
            original_post: ref.current.getMarkdown(),
            tags: selectedTags
          })
        });
  
        const response = await request;
        if (response.ok) {
          alert("Thread successfully created.")
          router.push("/");
        } else {
          throw new Error("failed to post")
        }
      } catch (err: any) {
          console.log(err);
      }
    }
  };

  return (
    <>
      <Typography variant='h4'>New Post</Typography>
      <br />
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2)
          }}
        >
          <Typography variant='h5'>Post Information</Typography>
          <TextField
            fullWidth
            label='Title'
            inputRef={titleRef}
          />
          <TagsPicker selectedTags={selectedTags} setTags={setSelectedTags}/>
        </CardContent>
      </Card>
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1)
          }}
        >
          <Typography variant='h5'>Post Content</Typography>
          <ForwardRefEditor
            markdown=''
            ref={ref}
          />          
        </CardContent>
      </Card>
      <Button 
        startIcon={<SendSharp />}
        variant='contained' 
        onClick={handlePost}>
        Post
      </Button>
    </>

  )
}

export default page