'use client';

import { postCategories } from '@/app/categories';
import { selectCurrentHomePage } from '@/store/appState/appStateSlice';
import { HomeOutlined, HomeSharp, InboxOutlined, LocalMoviesSharp, PhonelinkSharp, TravelExploreSharp, VideogameAssetSharp, Whatshot, WhatshotSharp } from '@mui/icons-material';
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

	const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key={"home"} disablePadding>
          <ListItemButton
            onClick={() => router.push("/")}
          >
            <ListItemIcon>
              <HomeSharp />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"trending"} disablePadding>
          <ListItemButton
            onClick={() => router.push("/")}
          >
            <ListItemIcon>
              <WhatshotSharp />
            </ListItemIcon>
            <ListItemText primary={"Trending"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {postCategories.map(({id, name, displayName, icon}, index) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              selected={currentHomePage.name === name}
							onClick={() => router.push(`/top/${id}`)}
						>
              <ListItemIcon>
								{icon}
              </ListItemIcon>
              <ListItemText primary={displayName} />
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