/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { postCategories } from '@/app/[locale]/categories';
import {
  closeMobileSidebar,
  selectAlwaysShowCustomTags,
  selectAlwaysShowTags,
  selectCurrentHomePage,
  selectMobileSidebarOpen,
  setAlwaysShowCustomTags,
  setAlwaysShowTags,
  SupportedLanguages,
  updateCurrentHomePage
} from '@/store/appState/appStateSlice';
import { withLocale } from '@/utils/makeUrl';
import {
  EditSharp,
  ExpandMoreSharp,
  HomeSharp,
  SettingsSharp,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColorSchemeSwitcher from '../button/colorSchemeSwitcherButton';

const drawerWidth = 225;

const Sidebar = forwardRef<HTMLDivElement, ComponentProps<typeof Box>>(
  ({ ...props }, _ref) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();
    const isAlwaysShowTags = useSelector(selectAlwaysShowTags);
    const isAlwaysShowCustomTags = useSelector(selectAlwaysShowCustomTags);

    const locale = useLocale() as SupportedLanguages;
    const currentHomePage = useSelector(selectCurrentHomePage);
    const mobileOpen = useSelector(selectMobileSidebarOpen);

    const [_isClosing, setIsClosing] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleDrawerClose = () => {
      setIsClosing(true);
      dispatch(closeMobileSidebar());
    };

    const handleDrawerTransitionEnd = () => {
      setIsClosing(false);
    };

    const handleSwitches =
      (toggle: 'alwaysShowTags' | 'alwaysShowCustomTags') => () => {
        if (toggle === 'alwaysShowTags') {
          dispatch(setAlwaysShowTags(!isAlwaysShowTags));
        } else if (toggle === 'alwaysShowCustomTags') {
          dispatch(setAlwaysShowCustomTags(!isAlwaysShowCustomTags));
        }
      };

    const handleChangeCategory =
      ({
        id,
        name,
        displayName,
      }: {
        id: number;
        name: string;
        displayName: string;
      }) =>
      () => {
        dispatch(updateCurrentHomePage({ id, name, displayName }));
        router.push(withLocale(locale, `/top/${id}`));
        dispatch(closeMobileSidebar());
      };

    const drawer = (
      <Box display={'flex'} flexDirection={'column'}>
        <Toolbar sx={{ height: '64px' }} />
        {/* <Divider /> */}
        <List>
          <ListItem key={'home'} disablePadding>
            <ListItemButton
              LinkComponent={Link}
              href='/'
              selected={currentHomePage.name === 'home'}
              onClick={() => {
                dispatch(
                  updateCurrentHomePage({
                    id: 0,
                    name: 'home',
                    displayName: 'Home',
                  })
                );
                dispatch(closeMobileSidebar());
              }}
            >
              <ListItemIcon>
                <HomeSharp />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>
          <ListItem
            key={'new'}
            disablePadding
            sx={{
              [theme.breakpoints.up('sm')]: {
                display: 'none',
              },
            }}
          >
            <ListItemButton
              onClick={() => {
                router.push(withLocale(locale, '/new'));
                dispatch(closeMobileSidebar());
              }}
            >
              <ListItemIcon>
                <EditSharp />
              </ListItemIcon>
              <ListItemText primary={'New Post'} />
            </ListItemButton>
          </ListItem>
        </List>
        {/* <Divider /> */}
        <Accordion
          elevation={1}
          defaultExpanded
          sx={{
            boxShadow: 'none',
            border: 'none',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreSharp />}>
            <Typography>Explore</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
              maxHeight: theme.spacing(50),
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}
          >
            <List>
              {postCategories.map(({ id, name, displayName, icon }, _index) => (
                <ListItem key={name} disablePadding>
                  <ListItemButton
                    selected={currentHomePage.name === name}
                    onClick={handleChangeCategory({ id, name, displayName })}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
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
            onClick={() => {
              setSettingsOpen(true);
              dispatch(closeMobileSidebar());
            }}
          >
            <ListItemIcon>
              <SettingsSharp />
            </ListItemIcon>
            <ListItemText primary={'Settings'} />
          </ListItemButton>
        </List>
      </Box>
    );

    return (
      <Box
        component="nav"
        sx={{
          width: { xs: 0, sm: 0, md: drawerWidth },
          flexShrink: { sm: 0 },
          padding: theme.spacing(0),
          ...props.sx,
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            padding: theme.spacing(1),
            display: { xs: 'none', sm: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: 0, sm: 0, md: drawerWidth },
            },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Settings Popup */}
        <Dialog
          fullWidth
          maxWidth="xs"
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        >
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Color Scheme</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <ColorSchemeSwitcher />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Show tags on threads list</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Switch
                  checked={isAlwaysShowTags}
                  onChange={handleSwitches('alwaysShowTags')}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Show custom tags on threads list</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Switch
                  checked={isAlwaysShowCustomTags}
                  onChange={handleSwitches('alwaysShowCustomTags')}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setSettingsOpen(false);
            }}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
