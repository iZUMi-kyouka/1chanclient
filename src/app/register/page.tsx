'use client';
import { LoginSharp, MarginTwoTone, VisibilityOffSharp, VisibilitySharp } from '@mui/icons-material';
import { alpha, Button, Card, CardContent, colors, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import theme from '../theme';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserAccount, updateUser, User } from '@/store/user/userSlice';
import { selectDeviceID, updateAccessToken } from '@/store/auth/authSlice';

const classes = {
	field: {
		marginTop: 1.25,
		marginBottom: 1.25
	},
	button: {
		// backgroundColor: 'purple',
		// color: 'white',
		marginTop: 1.25
	}
}

const page = () => {
	const user = useSelector(selectUserAccount);
	const deviceID = useSelector(selectDeviceID);
	const router = useRouter();
	const dispatch = useDispatch();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [usernameOK, setUsernameOK] = useState(true);
	const [passwordOK, setPasswordOK] = useState(true);
	const [passwordHidden, setPasswordHidden] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);


	const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
		if (!usernameOK || !passwordOK || isLoading) {
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

      // if (!response.ok) {
      //   throw new Error('Failed to login. Please check your credentials.');
      // }

      const data = await response.json();

	  dispatch(
		updateAccessToken(data.account.access_token)
	  );

      dispatch(
        updateUser({
          account: {
            id: data.account.id,
            username: data.account.username,
          },
          profile: {
            profile_photo_path: '',
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
    } catch (err: any) {
			console.log("error during login: ", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
		
	};

	const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		if (newPassword === "" || newPassword.length < 8) {
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
				justifyContent: 'center'
			}}
    >
        <Typography
					variant='h3'
				>
					1chan
				</Typography>
				<Card>
					<CardContent>
						<TextField
							error={!usernameOK}
							onChange={handleUsernameInput}
							sx={classes.field}
							fullWidth 
							label="Username"
							variant='outlined'
						/>
						<FormControl variant='outlined' fullWidth>
							<InputLabel htmlFor='password-input'>Password</InputLabel>
							<OutlinedInput
								fullWidth
								onChange={handlePasswordInput}
								id='password-input'
								type={showPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton
											onClick={handleShowPassword}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge='end'
										>
											{showPassword ? <VisibilityOffSharp /> : <VisibilitySharp />}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
							/>
						</FormControl>
						<Button
							fullWidth
							sx={classes.button}
							onClick={handleRegister}
							startIcon={<LoginSharp />}
							disabled={!(usernameOK && passwordOK) && isLoading}
						>{isLoading ? 'Registering...' : 'Register'}</Button>
						<Container sx={{marginTop: theme.spacing(3)}}>

						</Container>
						<Typography variant='body2'>
							Already have an account? <Link style={{color: 'inherit'}} href="/login">Login</Link>
						</Typography>
					</CardContent>
				</Card>
    </Container>
  );
}

export default page;