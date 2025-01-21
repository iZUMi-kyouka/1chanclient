'use client';

import {
  selectMobileSidebarOpen,
  setMobileSidebarOpen,
} from '@/store/appState/appStateSlice';
import {
  resetAuth,
  selectAccessToken,
  selectDeviceID,
} from '@/store/auth/authSlice';
import { resetUser, selectUserAccount } from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import {
  CreateSharp,
  LoginSharp,
  MenuSharp,
  NotificationsSharp,
  SearchSharp,
  SettingsSharp,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColorSchemeSwitcher from '../button/colorSchemeSwitcherButton';
import { Search, SearchBarIconWrapper, SearchBarInputBase } from '../input/searchBar';
import UserAvatar from '../user/userAvatar';

export default function PrimaryAppBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  
  const user = useSelector(selectUserAccount);
  const accessToken = useSelector(selectAccessToken);
  const deviceID = useSelector(selectDeviceID);
  const mobileSidebarOpen = useSelector(selectMobileSidebarOpen);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutSnackbarState, setLogoutSnackbarState] = useState(false);
  
  const isDesktopWidth = useMediaQuery('(min-width: 900px)');
  
  const searchBarRef = useRef<HTMLInputElement | null>(null);
  
  const isDarkMode = colorScheme === 'dark';
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
    };
  }, [searchBarRef]);

  const handleProfileMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      const response = await customFetch(
        'http://localhost:8080/api/v1/users/logout',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Device-ID': deviceID,
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        console.log('Logout success.');
        setLogoutSnackbarState(true);
        dispatch(resetUser());
        dispatch(resetAuth());
      } else {
        console.log('Logout failed.');
      }
    } catch (err) {
      console.log(`Error occured: ${err}`);
    } finally {
      router.push('/');
      setAnchorEl(null);
    }
  };

  const handleSearch = (q: string) => {
    router.push(`/search/${q}`);
  };

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={'primary-account-menu'}
      open={isMenuOpen}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={handleMenuClose}
    >
      {user.username ? (
        <div>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem
            onClick={() => {
              router.push(`/profile/${user.username}`);
              setAnchorEl(null);
            }}
          >
            Profile
          </MenuItem>
        </div>
      ) : (
        <MenuItem>Login</MenuItem>
      )}
    </Menu>
  );

  const logoutSuccessSnackbar = (
    <Snackbar
      open={logoutSnackbarState}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      autoHideDuration={5000}
      onClose={() => setLogoutSnackbarState(false)}
      message={'Logout successful.'}
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ alignItems: 'center' }}>
          {/* Hamburger menu icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 1 }}
            onClick={() => {
              dispatch(setMobileSidebarOpen(!mobileSidebarOpen));
            }}
          >
            <MenuSharp />
          </IconButton>

          {/* 1chan Logo */}
          <ButtonBase
            onClick={() => router.push('/')}
            disableRipple
            disableTouchRipple
          >
            <Typography color="inherit" variant="h6">
              1chan
            </Typography>
          </ButtonBase>

          <Box sx={{ flexGrow: 1 }} />

          {/* Search bar */}
          <Search>
            <SearchBarIconWrapper>
              <SearchSharp />
            </SearchBarIconWrapper>
            <SearchBarInputBase
              ref={searchBarRef}
              id="app-main-search"
              placeholder={`${isDesktopWidth ? 'Search 1chan... (Ctrl + K)' : 'Search...'}`}
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchBarRef.current?.value) {
                    handleSearch(searchBarRef.current.value);
                  }
                }
              }}
            />
          </Search>

          {/* DESKTOP layout */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            {user.username ? (
              <Button
                disableElevation
                onClick={() => {
                  router.push('/new');
                }}
                sx={{
                  backgroundColor: `${isDarkMode ? 'default' : 'white'}`,
                  color: `${isDarkMode ? 'default' : theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[300],
                  },
                  height: '48px',
                  alignItems: 'center',
                  marginRight: theme.spacing(2),
                }}
                variant="contained"
                startIcon={<CreateSharp />}
              >
                New Post
              </Button>
            ) : (
              <></>
            )}

            <IconButton size="large" color="inherit">
              <NotificationsSharp />
            </IconButton>
            <IconButton size="large" color="inherit">
              <SettingsSharp />
            </IconButton>
            <ColorSchemeSwitcher />
          </Box>
          <Box>
            {user.username ? (
              <IconButton
                onClick={handleProfileMenuClick}
                size="large"
                color="inherit"
              >
                <UserAvatar currentUser={true} />
              </IconButton>
            ) : (
              <Button
                disableElevation
                color="secondary"
                sx={{
                  marginLeft: theme.spacing(2),
                  backgroundColor: `${isDarkMode ? 'default' : 'white'}`,
                  color: `${isDarkMode ? 'default' : theme.palette.primary.main}`,
                  height: '48px',
                }}
                startIcon={<LoginSharp color="inherit" />}
                href="/login"
                LinkComponent={Link}
                variant="contained"
              >
                Login
              </Button>
            )}
          </Box>
          {/* MOBILE layout */}
          {/* <Box 
						sx={{ 
							display: { xs: 'flex', sm: 'flex'},
						}}
					>
						<IconButton
							size='large'
							aria-label='show more'
							color='inherit'
						>
							<MoreVertSharp />
						</IconButton>
					</Box> */}
        </Toolbar>
      </AppBar>
      {profileMenu}
      {logoutSuccessSnackbar}
    </Box>
  );
}
