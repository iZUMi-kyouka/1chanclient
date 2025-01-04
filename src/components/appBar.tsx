'use client';

import { AppBar, Avatar, Box, Button, ButtonBase, Chip, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from "@mui/material";
import { AccountCircleSharp, Create, CreateSharp, LoginSharp, MenuSharp, MoreVertSharp, NotificationsSharp, SearchSharp, SettingsSharp } from "@mui/icons-material";
import { Search, SearchBarIconWrapper, SearchBarInputBase } from "./searchBar";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, selectUserAccount, selectUserDeviceID, updateAccessToken, updateDeviceID } from "@/store/user/userSlice";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrimaryAppBar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const theme = useTheme();
	const user = useSelector(selectUserAccount);
	const deviceID = useSelector(selectUserDeviceID);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleProfileMenuClick = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleMenuClose = () => setAnchorEl(null);
	const isMenuOpen = Boolean(anchorEl);

	const handleLogout = async () => {
		try {
			const response = await fetch('http://localhost:8080/api/v1/users/logout', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${user.access_token}`
				},
				credentials: 'include'
			})

			if (response.status === 200) {
				console.log('Logout success.')
				dispatch(resetUser())
			} else {
				console.log('Logout failed.')
			}
		} catch (err: any) {
			console.log(`Error occured: ${err}`)
		} finally {
			router.push('/');
			setAnchorEl(null);
		}
	}

	const CustomAvatar = ({ username }: { username: string | undefined}) => (
		<Avatar>{username ? username[0].toUpperCase() : null}</Avatar>
	);

	const profileMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			id={'primary-account-menu'}
			open={isMenuOpen}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			onClose={handleMenuClose}
		>
			{
				user.username
				? <div>
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
					<MenuItem>Profile</MenuItem>
				</div>

				: <MenuItem>Login</MenuItem>
			}
		</Menu>
	);

	const handleRefreshAccessToken = async () => {
		const response = await fetch('http://localhost:8080/api/v1/users/refresh', {
			headers: {
				'Device-ID': deviceID || '',
			},
			credentials: 'include'
		})

		const data = await response.json();
		dispatch(updateAccessToken(data.access_token));
	}

	return (
		<Box sx={{ flexGrow: 1}}>
			<AppBar 
				position='fixed'
				sx={{
					zIndex: theme => theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar sx={{alignItems: 'center'}}>
					{/* Hamburger menu icon */}
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='open drawer'
						sx={{ mr: 1 }}
					>
						<MenuSharp />
					</IconButton>

					{/* 1chan Logo */}
					<ButtonBase
						onClick={() => router.push('/')}
						disableRipple
						disableTouchRipple
					>
						<Typography 
							color="inherit"
							variant="h6"
						>
							1chan
						</Typography>
					</ButtonBase>

					<Box sx={{ flexGrow: 1}} />

					{/* Search bar */}
					<Search>
						<SearchBarIconWrapper>
							<SearchSharp />
						</SearchBarIconWrapper>
						<SearchBarInputBase 
							placeholder="Search..."
							inputProps={{ 'aria-label': 'search'}}
						/>
					</Search>

					{/* DESKTOP layout */}
					<Box sx={{ display: { xs: 'none', sm: 'flex'}, alignItems: 'center'}}>
						{
							user.username
							? <Button
							disableElevation
							sx={{
								color: 'purple',
								backgroundColor: 'white',
								height: '48px',
								alignItems: 'center',
								marginRight: theme.spacing(2)
							}}
							variant='contained'
							startIcon={<CreateSharp />}
						>
							New Post
						</Button>
						: <></>
						}
						{/* <Button
							onClick={handleRefreshAccessToken}
						>
							Refresh Token
						</Button> */}
						<IconButton
							size='large'
							color='inherit'
						>
							<NotificationsSharp />
						</IconButton>
						<IconButton
							size='large'
							color='inherit'
						>
							<SettingsSharp />
						</IconButton>

							{
								user.username 
								? <IconButton 
										onClick={handleProfileMenuClick}
										size='large' 
										color='inherit'>
									<CustomAvatar username={user.username} />
									</IconButton>
								: <Button
									sx={{
										marginLeft: theme.spacing(2),
										backgroundColor: 'white',
										color: 'purple'
									}}
									startIcon={<LoginSharp 
										color='inherit'
									/>}
									href="/login" 
									LinkComponent={Link} 
									variant="contained"
								>Login</Button>
							}
					</Box>

					{/* MOBILE layout */}
					<Box 
						sx={{ 
							display: { xs: 'flex', sm: 'none'},
							ml: 1
						}}
					>
						<IconButton
							size='large'
							aria-label='show more'
							color='inherit'
						>
							<MoreVertSharp />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			{profileMenu}
		</Box>
	);
}