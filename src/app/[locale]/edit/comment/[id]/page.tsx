'use client';

import { BASE_API_URL } from '@/app/[locale]/layout';
import { ForwardRefEditor } from '@/components/input/forwardRefEditor';
import FullPageSpinner from '@/components/loading/fullPageLoading';
import ColFlexBox from '@/components/wrapper/colFlexContainer';
import Comment from '@/interfaces/comment';
import { customFetch, generalFetch } from '@/utils/customFetch';
import { MDXEditorMethods } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { EditSharp } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Typography,
    useTheme,
} from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef } from 'react';
import useSWR from 'swr';

const Edit = ({ params }: { params: Promise<Params> }) => {
  const commentID = use(params).id;
  const { data, error, isLoading } = useSWR<Comment>(
    `${BASE_API_URL}/comments/${commentID}`,
    generalFetch()
  );
  const theme = useTheme();
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const handleEditComment = async () => {
    try {
      const response = await customFetch(
        `${BASE_API_URL}/comments/edit/${data?.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            comment: editorRef.current?.getMarkdown(),
          }),
        }
      );

      if (response.ok) {
        alert('Comment updated successfully!');
        router.back();
      } else {
        throw new Error('unhandled errror');
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  useEffect(() => {
    editorRef.current?.focus();
  });

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return (
      <ColFlexBox>
        <Typography color="error">{`Failed to fetch comment: ${error}`}</Typography>
      </ColFlexBox>
    );
  }

  if (data && data.comment === undefined) {
    return (
      <ColFlexBox>
        <Typography color="error">
          Comments has been deleted or does not exist.
        </Typography>
      </ColFlexBox>
    );
  }

  if (data) {
    return (
      <Container
        sx={{
          height: '100%',
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        }}
      >
        <title>{`1chan | Edit Comment (ID: ${commentID})`}</title>
        <Typography variant="h4">Edit Comment</Typography>
        <br />
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
            }}
          >
            <ForwardRefEditor ref={editorRef} markdown={data.comment} />
          </CardContent>
          <CardActions>
            <Container></Container>
            <Button onClick={() => router.back()}>Cancel</Button>
            <Button
              variant="contained"
              disableElevation
              startIcon={<EditSharp />}
              onClick={handleEditComment}
            >
              Edit
            </Button>
          </CardActions>
        </Card>
      </Container>
    );
  }
};

export default Edit;
