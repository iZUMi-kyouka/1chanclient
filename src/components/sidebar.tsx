'use client';

import { postCategories } from '@/app/categories';
import { selectCurrentHomePage, selectMobileSidebarOpen, setMobileSidebarOpen, updateCurrentHomePage } from '@/store/appState/appStateSlice';
import { ExpandMoreSharp, HomeOutlined, HomeSharp, InboxOutlined, LocalMoviesSharp, PhonelinkSharp, SettingsSharp, TravelExploreSharp, VideogameAssetSharp, Whatshot, WhatshotSharp } from '@mui/icons-material';
import { Toolbar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Box, Accordion, AccordionSummary, AccordionDetails, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, InputLabel } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ColorSchemeSwitcher from './colorSchemeSwitcher';

const drawerWidth = 250;

const Sidebar = () => {
  const theme = useTheme();
	const dispatch = useDispatch();
	const router = useRouter();

	const currentHomePage = useSelector(selectCurrentHomePage);
  const mobileOpen = useSelector(selectMobileSidebarOpen);
  
  const [isClosing, setIsClosing] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
  
  const handleDrawerClose = () => {
    setIsClosing(true);
    dispatch(setMobileSidebarOpen(false));
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleChangeCategory = ({id, name, displayName}: {id: number, name: string, displayName: string}) => () => {
    dispatch(updateCurrentHomePage({id, name, displayName}));
    router.push(`/top/${id}`);
  };

	const drawer = (
    <Box
      display={'flex'}
      flexDirection={'column'}
    >
      <Toolbar />
      {/* <Divider /> */}
      <List>
        <ListItem key={"home"} disablePadding>
          <ListItemButton
            selected={currentHomePage.name === "home"}
            onClick={handleChangeCategory({id: 0, name: "home", displayName: "Home"})}
          >
            <ListItemIcon>
              <HomeSharp />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
      </List>
      {/* <Divider /> */}
      <Accordion
        elevation={1}
        defaultExpanded
        sx={{
          boxShadow: 'none',
          border: 'none'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreSharp />}
        >
          <Typography>Explore</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: 0,
            maxHeight: theme.spacing(50),
            overflowY: 'auto'
          }}
        >
          <List>
          {postCategories.map(({id, name, displayName, icon}, index) => (
            <ListItem key={name} disablePadding>
              <ListItemButton
                selected={currentHomePage.name === name}
                onClick={handleChangeCategory({id, name, displayName})}
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={displayName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        </AccordionDetails>
      </Accordion>

      <Divider />

      <List>
        <ListItemButton
          onClick={() => {setSettingsOpen(true)}}
        >
          <ListItemIcon>
            <SettingsSharp />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, padding: theme.spacing(0) }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant='temporary'
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

        {/* Desktop sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            padding: theme.spacing(1),
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Settings Popup */}
        <Dialog fullWidth maxWidth='xs' open={settingsOpen} onClose={() => setSettingsOpen(false)}>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Box>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography>Color Scheme</Typography>
                <Box sx={{flexGrow: 1}} />
                <ColorSchemeSwitcher />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
  )
}

export default Sidebar;