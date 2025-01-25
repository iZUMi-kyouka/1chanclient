'use client';

import { BASE_API_URL } from '@/app/[locale]/layout';
import { ForwardRefEditor } from '@/components/input/forwardRefEditor';
import FullPageSpinner from '@/components/loading/fullPageLoading';
import ColFlexBox from '@/components/wrapper/colFlexContainer';
import { ThreadViewResponse } from '@/interfaces/thread';
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
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import { useRouter } from 'next/navigation';
import { use, useRef } from 'react';
import useSWR from 'swr';

const Edit = ({ params }: { params: Promise<Params> }) => {
  const threadID = use(params).id;
  const { data, error, isLoading } = useSWR<ThreadViewResponse>(
    `${BASE_API_URL}/threads/${threadID}`,
    generalFetch()
  );
  const theme = useTheme();
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const handleEditThread = async () => {
    try {
      const response = await customFetch(
        `${BASE_API_URL}/threads/edit/${data?.thread.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            original_post: editorRef.current?.getMarkdown(),
            title: titleRef.current?.value,
          }),
        }
      );

      if (response.ok) {
        alert('Thread updated successfully!');
        router.back();
      } else {
        throw new Error('unhandled errror');
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return (
      <ColFlexBox>
        <Typography color="error">{`Failed to fetch thread: ${error}`}</Typography>
      </ColFlexBox>
    );
  }

  if (data && data.thread === undefined) {
    return (
      <ColFlexBox>
        <Typography color="error">
          Thread has been deleted or does not exist.
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
        <title>{`1chan | Edit Thread: ${data.thread.title}`}</title>
        <Typography variant="h4">Edit Post</Typography>
        <br />
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
            }}
          >
            <TextField
              label="Title"
              inputRef={titleRef}
              fullWidth
              defaultValue={data.thread.title}
            />
            <ForwardRefEditor
              ref={editorRef}
              markdown={data.thread.original_post}
            />
          </CardContent>
          <CardActions>
            <Container></Container>
            <Button
              sx={{
                flexShrink: 0.2,
              }}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              sx={{
                flexShrink: 0.2,
              }}
              variant="contained"
              disableElevation
              startIcon={<EditSharp />}
              onClick={handleEditThread}
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
