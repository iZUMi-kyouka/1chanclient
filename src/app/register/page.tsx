'use client';
import { selectDeviceID, updateAccessToken } from '@/store/auth/authSlice';
import { updateUser } from '@/store/user/userSlice';
import { LoginSharp, VisibilityOffSharp, VisibilitySharp } from '@mui/icons-material';
import { Button, Card, CardContent, CircularProgress, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import theme from '../theme';

// const classes = {
// 	field: {
// 		marginTop: 1.25,
// 		marginBottom: 1.25
// 	},
// 	button: {
// 		// backgroundColor: 'purple',
// 		// color: 'white',
// 		marginTop: 1.25
// 	}
// }

const Page = () => {
	const deviceID = useSelector(selectDeviceID);
	const router = useRouter();
	const dispatch = useDispatch();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [usernameOK, setUsernameOK] = useState(true);
	const [passwordOK, setPasswordOK] = useState(true);
  const [passwordVerifyOK, setPasswordVerifyOK] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);


	const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (error === "Username already exists.") {
      setError(null);
    }

    const newUsername = e.target.value;
		if (newUsername === "") {
			setUsernameOK(false);
			return;
		} else {
			setUsernameOK(true);
		}

		setUsername(newUsername);
	};

	const handleRegister = async () => {
		if (!usernameOK || !passwordOK || !passwordVerifyOK || isLoading || password !== passwordVerify) {
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
      const response = await fetch('http://localhost:8080/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Device-ID': deviceID
        },
        body: JSON.stringify({ username, password }),
			credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Username already exists.")
        } else {
          throw new Error('Failed to register. Please try again soon.');
        }
      }
      
      const data = await response.json();

	    dispatch(updateAccessToken(data.account.access_token));

      dispatch(
        updateUser({
          account: {
            id: data.account.id,
            username: data.account.username,
          },
          profile: {
            profile_picture_path: '',
            biodata: '',
            email: '',
            post_count: 0,
            comment_count: 0,
            preferred_lang: 'id',
            preferred_theme: 'auto',
            creation_date: '',
            last_login: '',
          },
        })
      );
		console.log('Updated user data!');
		router.push('/');
    } catch (err: unknown) {
			console.log("error during login: ", (err as Error).message);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
		
	};

	const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		if (newPassword === "" || newPassword.length < 8) {
			setPasswordOK(false);
		} else {
			setPasswordOK(true);
		}

		setPassword(newPassword);
	};

  const handlePasswordInputVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		if (newPassword === "" || newPassword.length < 8) {
			setPasswordVerifyOK(false);
		} else {
			setPasswordVerifyOK(true);
		}

		setPasswordVerify(newPassword);
	};


	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      <title>{`1chan | Register`}</title>
      <Typography
        variant="h3"
        sx={{
          marginBottom: theme.spacing(2),
        }}
      >
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
            fullWidth
            label="Username"
            variant="outlined"
            sx={{ marginBottom: theme.spacing(1.25) }}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <OutlinedInput
              fullWidth
              sx={{ marginBottom: theme.spacing(1.25) }}
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
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="password-input-verify">
              Verify Password
            </InputLabel>
            <OutlinedInput
              sx={{ marginBottom: theme.spacing(1.25) }}
              fullWidth
              onChange={handlePasswordInputVerify}
              id="password-input-verify"
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
              label="Verify Password"
            />
          </FormControl>
          {error ? (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: theme.spacing(1) }}
            >
              {error}
            </Typography>
          ) : password.length < 8 ? (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: theme.spacing(1) }}
            >
              Password must consist of at least 8 characters.
            </Typography>
          ) : password !== passwordVerify ? (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: theme.spacing(1) }}
            >
              Passwords do not match.
            </Typography>
          ) : (
            <div style={{ display: 'block', marginTop: theme.spacing(1) }}>
              <Typography variant="body2">&#8203;</Typography>
            </div>
          )}
          <Button
            fullWidth
            onClick={handleRegister}
            startIcon={
              isLoading ? <CircularProgress size={24} /> : <LoginSharp />
            }
            disabled={!(usernameOK && passwordOK) || isLoading}
            sx={{ marginTop: theme.spacing(1.25) }}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          <Container sx={{ marginTop: theme.spacing(3) }}></Container>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link style={{ color: 'inherit' }} href="/login">
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Page;