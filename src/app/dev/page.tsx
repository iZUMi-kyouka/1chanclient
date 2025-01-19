'use client';

import Comment from "@/interfaces/comment";
import CommentCard from "@/components/commentCard";
import CommentCardEdit from "@/components/commentCardEdit";
import { ForwardRefEditor } from "@/components/forwardRefEditor";
import { Box, Button, Card, CardActionArea, CardActions, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import ThreadListFilterDropdown from "@/components/threadListFilterDropdown";

const testComment: Comment = {
  id: 0,
  username: "kyo73",
  comment: "Hello, this is a test comment. Hello, this is a test comment. Hello, this is a test comment. Hello, this is a test comment. \
  Hello, this is a test comment. Hello, this is a test comment. Hello, this is a test comment. Hello, this is a test comment. ",
  creation_date: "27 December 2024",
  updated_date: "",
  like_count: 100,
  dislike_count: 0
}

export default function Page() {
  return (
    <>
      <Typography>This is development route root.</Typography>
      <ForwardRefEditor markdown={"Hello, **world**!"} />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '500px',
        }}
      >
        <CommentCard comment={testComment} />
        <CommentCardEdit/>
        <ThreadListFilterDropdown />
      </Container>
    </>
  );
}