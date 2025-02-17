'use client';
import {
  LikedComments,
  LikedThreads,
  WrittenComments,
  WrittenThreads,
} from '@/interfaces/user';
import {
  LocaleParams,
  openSnackbarWithMessage,
} from '@/store/appState/appStateSlice';
import {
  selectDeviceID,
  updateAccessToken,
  updateDeviceID,
} from '@/store/auth/authSlice';
import {
  selectUserAccount,
  updateCommentLike,
  updateThreadLike,
  updateUser,
  updateWrittenComments,
  updateWrittenThreads,
} from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import { withLocale } from '@/utils/makeUrl';
import {
  LoginSharp,
  VisibilityOffSharp,
  VisibilitySharp,
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { BASE_API_URL } from '../layout';

const classes = {
  field: {
    marginTop: 1.25,
    marginBottom: 1.25,
  },
  button: {
    // backgroundColor: 'purple',
    // color: 'white',
    marginTop: 1.25,
  },
};

const Page = ({ params }: LocaleParams) => {
  const user = useSelector(selectUserAccount);
  const deviceID = useSelector(selectDeviceID);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = use(params).locale;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOK, setUsernameOK] = useState(true);
  const [passwordOK, setPasswordOK] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    if (newUsername === '') {
      setUsernameOK(false);
      return;
    } else {
      setUsernameOK(true);
    }

    setUsername(newUsername);
  };

  const handleLogin = async () => {
    if (!usernameOK || !passwordOK || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (deviceID === '') {
        dispatch(updateDeviceID(uuidv4()));
      }

      // Send login info
      let response = await fetch(`${BASE_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Device-ID': deviceID,
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      // Handle login error
      if (!response.ok) {
        const error = await response.json();
        if (
          response.status === 400 &&
          error.description &&
          error.description === 'missing device ID'
        ) {
          throw new Error('deviceID missing');
        } else {
          throw new Error('unhandled error');
        }
      }

      // Update local user state
      const data = await response.json();
      dispatch(updateAccessToken(data.account.access_token));
      dispatch(
        updateUser({
          account: {
            id: data.account.id,
            username: data.account.username,
          },
          profile: data.profile,
        })
      );

      // Fetch other user information (likes, dislikes, comments, and thread owned)
      response = await customFetch(`${BASE_API_URL}/users/likes`, {
        method: 'GET',
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        const threadLikes = jsonResponse.threads as LikedThreads;
        const commentLikes = jsonResponse.comments as LikedComments;
        dispatch(updateCommentLike(commentLikes));
        dispatch(updateThreadLike(threadLikes));
      } else {
        throw new Error('Failed to fetch liked threads.');
      }

      response = await customFetch(`${BASE_API_URL}/users/threads`, {
        method: 'GET',
      });
      if (response.ok) {
        const threads = (await response.json()) as WrittenThreads;
        dispatch(updateWrittenThreads(threads));
      } else {
        throw new Error('Failed to fetch written threads.');
      }

      response = await customFetch(`${BASE_API_URL}/users/comments`, {
        method: 'GET',
      });
      if (response.ok) {
        const comments = (await response.json()) as WrittenComments;
        dispatch(updateWrittenComments(comments));
      } else {
        throw new Error('Failed to fetch written threads.');
      }
      
      // Remove error message and redirect user to homepage
      setErrorMsg('');
      router.push('/');
    } catch (err: unknown) {
      // Make error message more user friendly
      const error = err as Error;
      if (error.message === 'NetworkError when attempting to fetch resource.') {
        dispatch(
          openSnackbarWithMessage(
            '1chan is currently unavailable or your internet may be unstable.'
          )
        );
        setErrorMsg('Nework error.');
      } else if (error.message === 'deviceID missing') {
        setErrorMsg('Device ID has been reset. Please try again.');
      } else {
        setErrorMsg(`Username or password may be invalid.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (newPassword === '' || newPassword.length < 8) {
      setPasswordOK(false);
      return;
    } else {
      setPasswordOK(true);
    }

    setPassword(newPassword);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: theme.spacing(2),
      }}
    >
      <title>{`1chan | Login`}</title>
      <Typography variant="h3" sx={{ marginBottom: theme.spacing(2) }}>
        1chan
      </Typography>
      <Card
        sx={{
          width: '100%',
          maxWidth: '750px',
        }}
      >
        <CardContent>
          <TextField
            error={!usernameOK}
            onChange={handleUsernameInput}
            sx={classes.field}
            fullWidth
            label="Username"
            variant="outlined"
            disabled={user.username ? true : false}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <OutlinedInput
              disabled={user.username ? true : false}
              fullWidth
              onChange={handlePasswordInput}
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffSharp />
                    ) : (
                      <VisibilitySharp />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errorMsg ? (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginTop: theme.spacing(1) }}
              >
                {errorMsg}
              </Typography>
            ) : (
              <div style={{ display: 'block', marginTop: theme.spacing(1) }}>
                <Typography variant="body2">&#8203;</Typography>
              </div>
            )}
          </FormControl>
          <Button
            fullWidth
            sx={classes.button}
            onClick={handleLogin}
            startIcon={
              isLoading ? <CircularProgress size={24} /> : <LoginSharp />
            }
            disabled={
              !(usernameOK && passwordOK) ||
              isLoading ||
              user.username !== undefined
            }
          >
            {isLoading
              ? 'Logging in...'
              : user.username
                ? 'Logged in'
                : 'Login'}
          </Button>
          <Container sx={{ marginTop: theme.spacing(3) }}></Container>
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link
              style={{ color: 'inherit' }}
              href={withLocale(locale, '/register')}
            >
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Page;
