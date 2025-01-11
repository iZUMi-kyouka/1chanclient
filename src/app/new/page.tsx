'use client';

import { ForwardRefEditor } from '@/components/forwardRefEditor'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography, useTheme } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import useSWR from 'swr';
import { BASE_API_URL } from '../layout';
import { customFetch, generalFetch } from '@/utils/customFetch';
import { useRouter } from 'next/navigation';

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
        <Select
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
              gap: theme.spacing(1)
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
    </FormControl>
    );
  }
};

const page = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState('');
  const theme = useTheme();
  const [post, setPost] = useState("");
  const handleEditorUpdate = (e: string) => {
    setPost(e);
  }
  const router = useRouter();

  const handlePost = async () => {
    try {
      const request = customFetch(`${BASE_API_URL}/threads/new`, {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          original_post: post,
          tags: selectedTags
        })
      });

      const response = await request;
      if (response.ok) {
        alert("Thread successfully created.")
        router.push("/");
      }
    } catch (err: any) {

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
            onChange={(e) => {
              const newTitle = e.target.value;
              setTitle(newTitle);
            }}
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
            onChange={handleEditorUpdate}
            markdown=''
          />          
        </CardContent>
      </Card>
      <Button onClick={handlePost}>
        Post
      </Button>
    </>

  )
}

export default page