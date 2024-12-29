'use client';

import TextField from "@mui/material/TextField";
import {Button, RadioGroup, Radio, FormLabel, FormControl} from "@mui/material";
import {ChangeEvent, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function Page() {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [visibility, setVisibility] = useState('public');

  const handleSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitleError(false);
    setDescriptionError(false);

    if (title !== '' && description !== '') {
      setTitleError(false);
      setDescriptionError(false);
      console.log(`submitted: {title: ${title}, description: ${description}}, visibility: ${visibility}`);
      return
    }

    if (title === '') {
      setTitleError(true);
    }

    if (description === '') {
      setDescriptionError(true);
    }
  };

  const classes = {
    field: {
      marginTop: 1,
      marginBottom: 1,
      display: 'block',
    }
  };

  return (
    <form noValidate autoComplete="off">
      <TextField
        onChange={(e) => setTitle(e.target.value)}
        sx={classes.field}
        label="Title"
        variant={"outlined"}
        color={"secondary"}
        fullWidth
        required
        error={titleError}
      />
      <TextField
        onChange={(e) =>
          setDescription(e.target.value)}
        sx={classes.field}
        label="Description"
        variant={"outlined"}
        color={"secondary"}
        multiline
        rows={6}
        fullWidth
        required
        error={descriptionError}
      />

      <FormControl sx={classes.field}>
        <FormLabel>Visibility</FormLabel>
        <RadioGroup
          value={visibility}
          onChange={(e) =>
            setVisibility(e.target.value)}
        >
          <FormControlLabel value="public" control={<Radio />} label="Public" />
          <FormControlLabel value="private" control={<Radio />} label="Private" />
        </RadioGroup>
      </FormControl>

      <Button
        onClick={handleSubmit}
        variant="contained"
      >Submit</Button>
    </form>
  )
}