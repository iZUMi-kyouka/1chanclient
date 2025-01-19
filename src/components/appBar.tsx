'use client';

import { AppBar, Avatar, Box, Button, ButtonBase, Chip, Icon, IconButton, Menu, MenuItem, Snackbar, Toolbar, Typography, useColorScheme, useTheme } from "@mui/material";
import { AccountCircleSharp, Create, CreateSharp, DarkModeSharp, LightModeSharp, LoginSharp, MenuSharp, MoreVertSharp, NotificationsSharp, SearchSharp, SettingsSharp } from "@mui/icons-material";
import { Search, SearchBarIconWrapper, SearchBarInputBase } from "./searchBar";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, selectUserAccount } from "@/store/user/userSlice";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetAuth, selectAccessToken, selectDeviceID, updateAccessToken } from "@/store/auth/authSlice";
import { customFetch } from "@/utils/customFetch";
import ColorSchemeSwitcher from "./colorSchemeSwitcher";

export default function PrimaryAppBar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const theme = useTheme();
	const user = useSelector(selectUserAccount);
	const accessToken = useSelector(selectAccessToken);
	const deviceID = useSelector(selectDeviceID);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [logoutSnackbarState, setLogoutSnackbarState] = useState(false);
	const handleProfileMenuClick = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};
  const searchBarRef = useRef<HTMLInputElement | null>(null);
	const handleMenuClose = () => setAnchorEl(null);
	const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const searchShortcutHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        if (searchBarRef !== null) {
          event.preventDefault();
          searchBarRef.current?.focus();
        }
      }
    };
  
    window.addEventListener('keydown', searchShortcutHandler);

    return () => {
      window.removeEventListener('keydown', searchShortcutHandler);
    }
  }, [searchBarRef]);

	const handleLogout = async () => {
		try {
			const response = await customFetch('http://localhost:8080/api/v1/users/logout', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Device-ID': deviceID
				},	
				credentials: 'include'
			})

			if (response.ok) {
				console.log('Logout success.')
				setLogoutSnackbarState(true);
				dispatch(resetUser())
        dispatch(resetAuth())
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
					<MenuItem onClick={() => {
            router.push(`/profile/${user.username}`);
            setAnchorEl(null);
            }}>Profile</MenuItem>
				</div>

				: <MenuItem>Login</MenuItem>
			}
		</Menu>
	);

	const logoutSuccessSnackbar = (
		<Snackbar
			open={logoutSnackbarState}
			anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
			autoHideDuration={5000}
			onClose={() => setLogoutSnackbarState(false)}
			message={"Logout successful."}
		/>
	);

	// const handleRefreshAccessToken = async () => {
	// 	const response = await fetch('http://localhost:8080/api/v1/users/refresh', {
	// 		headers: {
	// 			'Device-ID': deviceID || '',
	// 		},
	// 		credentials: 'include'
	// 	})

	// 	const data = await response.json();
	// 	dispatch(updateAccessToken(data.access_token));
	// }

	
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
              ref={searchBarRef}
              id="app-main-search"
							placeholder="Search... (Ctrl + K)"
							inputProps={{ 'aria-label': 'search'}}
						/>
					</Search>

					{/* DESKTOP layout */}
					<Box sx={{ display: { xs: 'none', sm: 'flex'}, alignItems: 'center'}}>
						{
							user.username
							? <Button
							disableElevation
							onClick={() => { router.push("/new") }}
							sx={{
								backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.grey[300]
                },
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
						<ColorSchemeSwitcher />
							{
								user.username 
								? <IconButton 
										onClick={handleProfileMenuClick}
										size='large' 
										color='inherit'>
									<CustomAvatar username={user.username} />
									</IconButton>
								: <Button
                  disableElevation
									color="secondary"
									sx={{
										marginLeft: theme.spacing(2),
										backgroundColor: 'white',
										color: theme.palette.primary.main,
                    height: '48px'
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
			{logoutSuccessSnackbar}
		</Box>
	);
}