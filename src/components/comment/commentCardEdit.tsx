import { selectUserAccount } from '@/store/user/userSlice';
import { MDXEditorMethods } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { ForwardRefEditor } from '../input/forwardRefEditor';
import StandardCard from '../StandardCard';
import UserAvatar from '../user/userAvatar';

export interface Comment {
  id: number;
  username: string;
  comment: string;
  creation_date: string;
  updated_date: string;
  like_count: number;
  dislike_count: number;
}

const CommentCardEdit = ({
  width,
  onSubmit,
  onCancel,
}: {
  width?: string;
  onSubmit?: (markdown: string) => void;
  onCancel?: () => void;
}) => {
  const theme = useTheme();
  const userAccount = useSelector(selectUserAccount);
  const ref = useRef<MDXEditorMethods>(null);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(ref.current ? ref.current.getMarkdown() : '');
    }
  };

  return (
    <StandardCard width={width}>
      <CardHeader
        avatar={<UserAvatar currentUser={true} />}
        subheader={<Typography>@{userAccount.username}</Typography>}
        sx={{
          padding: theme.spacing(2),
          paddingBottom: '0 !important',
        }}
      />
      <CardContent
        sx={{
          '&:last-child': {
            paddingBottom: theme.spacing(2),
          },
          padding: theme.spacing(2),
          paddingTop: theme.spacing(1),
        }}
      >
        <Container sx={{ padding: '0 !important', margin: '0 !important' }}>
          <ForwardRefEditor ref={ref} markdown="" />
        </Container>
      </CardContent>
      <CardActions>
        <Container></Container>
        <Button
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </CardActions>
    </StandardCard>
  );
};

export default CommentCardEdit;
