'use client';
import {
  LikedThreads,
  WrittenComments,
  WrittenThreads,
} from '@/interfaces/user';
import { LocaleParams } from '@/store/appState/appStateSlice';
import { selectDeviceID, updateAccessToken } from '@/store/auth/authSlice';
import {
  selectUserAccount,
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
  const [errorMsg, setErrorMsg] = useState(false);

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
      let response = await fetch(`${BASE_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Device-ID': deviceID,
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to login. Please check your credentials.');
      }

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

      // Get liked threads
      try {
        response = await customFetch(`${BASE_API_URL}/users/likes`, {
          method: 'GET',
        });

        if (response.ok) {
          const likes = (await response.json()) as LikedThreads;
          dispatch(updateThreadLike(likes));
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
      } catch (err) {
        console.log(`error: ${err}`);
      }

      setErrorMsg(false);
      console.log('Updated user data!');
      router.push('/');
    } catch (err: unknown) {
      console.log('error during login: ', (err as Error).message);
      if (
        (err as Error).message ===
        'NetworkError when attempting to fetch resource.'
      ) {
        alert(
          '1chan is currently unavailable or your internet connection may be unstable.'
        );
      }
      setErrorMsg(true);
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
                Invalid username or password.
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
            <Link style={{ color: 'inherit' }} href={withLocale(locale, '/register')}>
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Page;
