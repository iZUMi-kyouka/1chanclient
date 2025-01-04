'use client';
import { LoginSharp, MarginTwoTone } from '@mui/icons-material';
import { alpha, Button, Card, CardContent, colors, Container, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import theme from '../theme';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserAccount, selectUserDeviceID, updateUser, User } from '@/store/user/userSlice';

const classes = {
	field: {
		marginTop: 0.75,
		marginBottom: 0.75
	},
	button: {
		backgroundColor: 'purple',
		color: 'white',
		marginTop: 0.75
	}
}

const page = () => {
	const user = useSelector(selectUserAccount);
	const deviceID = useSelector(selectUserDeviceID);
	const router = useRouter();
	const dispatch = useDispatch();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
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

	const handleLogin = async () => {
		if (!usernameOK || !passwordOK || isLoading) {
			return;
		}
		
		setError(null);
		setIsLoading(true);

		try {
      const response = await fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
					'Device-ID': deviceID ? deviceID : ''
        },
        body: JSON.stringify({ username, password }),
				credentials: 'include'
      });

      // if (!response.ok) {
      //   throw new Error('Failed to login. Please check your credentials.');
      // }

      const data = await response.json();

      dispatch(
        updateUser({
          account: {
            id: data.account.id,
            username: data.account.username,
            access_token: data.account.access_token,
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
						<TextField
							onChange={handlePasswordInput}
							sx={classes.field}
							fullWidth
							label='Password'
							variant='outlined'
							type='password'
						/>
						<Button
							fullWidth
							sx={classes.button}
							onClick={handleLogin}
							startIcon={<LoginSharp />}
							disabled={!(usernameOK && passwordOK) && isLoading}
						>{isLoading ? 'Logging in...' : 'Login'}</Button>
						<Container sx={{marginTop: theme.spacing(3)}}>

						</Container>
						<Typography variant='body2' color={alpha('#000000', 0.75)}>
							Don't have an account?   <Link href="/register">Register</Link>
						</Typography>
					</CardContent>
				</Card>
    </Container>
  );
}

export default page;