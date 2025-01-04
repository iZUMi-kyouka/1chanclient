'use client';

import { selectCurrentHomePage } from '@/store/appState/appStateSlice';
import { HomeOutlined, HomeSharp, InboxOutlined, LocalMoviesSharp, PhonelinkSharp, TravelExploreSharp, VideogameAssetSharp, WhatshotSharp } from '@mui/icons-material';
import { Toolbar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const drawerWidth = 300;

const Sidebar = () => {
	const currentHomePage = useSelector(selectCurrentHomePage);
	const dispatch = useDispatch();
	const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
	const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

	const sidebarItems = [
		{
			name: "home",
			icon: <HomeSharp />,
		},
		{
			name: "trending",
			icon: <WhatshotSharp />
		},
	];

	const sidebarCategories = [
		{
			name: "technology",
			icon: <PhonelinkSharp />,
		},
		{
			name: "games",
			icon: <VideogameAssetSharp />
		},
		{
			name: "novies",
			icon: <LocalMoviesSharp />
		},
		{
			name: "travel",
			icon: <TravelExploreSharp />
		}
	];

	const handleHomepageNavigation = (route: string) => {
		if (route === 'home') {
			router.push('/')
		} else if (route === 'trending') {
			router.push('/trending') 
		} else {
			router.push(`/top/${route}`)
		}
	};

	const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {sidebarItems.map(({name, icon}, index) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              selected={currentHomePage === name}
							onClick={() => handleHomepageNavigation(name)}
						>
              <ListItemIcon>
								{icon}
              </ListItemIcon>
              <ListItemText primary={name[0].toUpperCase()+name.slice(1)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {sidebarCategories.map(({name, icon}, index) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              onClick={() => handleHomepageNavigation(name)}
            >
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={name[0].toUpperCase()+name.slice(1)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="permanent"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
  )
}

export default Sidebar;