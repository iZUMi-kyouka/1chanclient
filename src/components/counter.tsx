'use client';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button, TextField, Typography } from "@mui/material";
import { decrement, increment, incrementAsync, incrementByAmount, reset } from "@/store/counter/counterSlice";
import { useState } from "react";

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  const [incrementAmount, setIncrementAmount] = useState(0);

  return (
    <>
    <Typography variant="h5">{count}</Typography>
    <Button onClick={() => dispatch(incrementAsync(incrementAmount))} variant={"outlined"}>
      Increment by {incrementAmount}
    </Button>
    <Button onClick={() => dispatch(decrement())} variant={"outlined"}>
      Decrement
    </Button>
    <Button onClick={() => dispatch(reset())} variant="outlined">Reset</Button><br />
    <TextField 
      value={incrementAmount}
      onChange={e => {
        setIncrementAmount(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))
      }} id="incrementAmount" label="Increment Amount" variant="outlined" sx={{marginTop: 1}}/>
    </>
  )
}

export default Counter;