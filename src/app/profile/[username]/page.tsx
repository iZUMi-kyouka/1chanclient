'use client';

import { BASE_API_URL } from '@/app/layout';
import FullPageSpinner from '@/components/loading/fullPageLoading';
import UserAvatar from '@/components/user/userAvatar';
import VisuallyHiddenInput from '@/components/visuallyHiddenInput';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import { UserProfile } from '@/interfaces/user';
import {
  selectUserAccount,
  updateProfilePicture,
} from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import { EditSharp, KeySharp } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  InputLabel,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import React, { use, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';

const Profile = ({ params }: { params: Promise<Params> }) => {
  const username = use(params).username;
  const user = useSelector(selectUserAccount);
  const theme = useTheme();
  const dispatch = useDispatch();

  const isDesktopWidth = useMediaQuery('(min-width: 600px)');

  const oldPasswordRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const biodataRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = username === user.username;
  let url: string;
  if (isOwner) {
    url = `${BASE_API_URL}/users/profile`;
  } else {
    url = `${BASE_API_URL}/users/profile/${username}`;
  }

  const { data, error, isLoading } = useSWR<UserProfile>(url, (url: string) =>
    customFetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        throw new Error('user does not exist');
      } else {
        throw new Error('unhandled error');
      }
    })
  );

  const handleUploadProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e?.target.files?.[0];
    if (!file) {
      return;
    }

    // Limit size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file should not exceed 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await customFetch(
        `${BASE_API_URL}/users/profile/picture`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const newProfilePictureURL = (await response.json()).url;
        if (newProfilePictureURL) {
          dispatch(updateProfilePicture(newProfilePictureURL));
          alert('Profile picture updated');
        }
      } else {
        throw new Error('failed to update profile picture');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await customFetch(`${BASE_API_URL}/users/profile`, {
        method: 'POST',
        body: JSON.stringify({
          biodata: biodataRef.current?.value,
          email: emailRef.current?.value,
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        throw new Error('failed to updated profile');
      }
    } catch (err) {
      alert(`error: ${err}`);
    }
  };

  const handleUpdatePassword = async () => {
    const response = await customFetch(
      `${BASE_API_URL}/users/update_password`,
      {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPasswordRef.current?.value,
          new_password: newPasswordRef.current?.value,
        }),
      }
    );

    if (response.ok) {
      alert('Password successfully updated!');
    } else if (response.status === 403) {
      alert('Current password is incorrect.');
    } else {
      alert('Unexpected error occurred. Failed to update password.');
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      setProfile(data);
    }
  }, [data]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    if (error.message === 'user does not exist') {
      return (
        <Box display={'flex'} flexGrow={1} justifyContent={'center'} alignItems={'center'} minHeight={'calc(100vh - 64px)'}>
          <Typography>User does not exist.</Typography> 
        </Box>
      );
    }

    return (
      <RowFlexBox>
        <Typography color="error">{`Failed to fetch profile: ${error.message}`}</Typography>
      </RowFlexBox>
    );
  }

  if (data) {
    return (
      <Container
        sx={{
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
        }}
      >
        {isOwner ? (
          <Typography variant="h4">My Account</Typography>
        ) : (
          <Typography variant="h4">{`${username}'s Profile`}</Typography>
        )}

        <Card>
          <CardHeader title={'Profile'} />
          <CardContent
            sx={{
              padding: theme.spacing(3),
            }}
          >
            {isDesktopWidth ? (
              <Stack direction="row" gap={theme.spacing(2)}>
                <Container sx={{ flexShrink: 1, width: 'auto' }}>
                  {isOwner ? (
                    <InputLabel
                      htmlFor="upload-profile-picture"
                      sx={{ '& :hover': { cursor: 'pointer' } }}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={
                          <Avatar sx={{ bgcolor: theme.palette.grey[700] }}>
                            <EditSharp />
                          </Avatar>
                        }
                      >
                        <UserAvatar
                          currentUser={true}
                          sx={{ width: '160px', height: '160px' }}
                          fontSize={'6rem'}
                        />
                      </Badge>
                      <VisuallyHiddenInput
                        onChange={handleUploadProfilePicture}
                        type="file"
                        id="upload-profile-picture"
                      />
                    </InputLabel>
                  ) : (
                    <UserAvatar
                      fontSize="6rem"
                      username={username as string | undefined}
                      sx={{ width: '160px', height: '160px' }}
                    />
                  )}
                  <Typography
                    sx={{ marginTop: theme.spacing(2) }}
                    textAlign={'center'}
                    variant="h6"
                  >
                    {username}
                  </Typography>
                </Container>
                <Stack
                  direction="column"
                  gap={theme.spacing(2)}
                  sx={{ width: '100%' }}
                >
                  <TextField
                    id="outlined-multiline-static"
                    label="Biodata"
                    multiline
                    fullWidth
                    rows={4}
                    defaultValue={profile?.biodata}
                    inputRef={biodataRef}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                  <TextField
                    inputRef={emailRef}
                    label="Email"
                    defaultValue={profile?.email}
                    disabled={!isEditing}
                  />
                </Stack>
              </Stack>
            ) : (
              <Stack direction="column" gap={theme.spacing(2)}>
                <Container sx={{ flexShrink: 1, width: 'auto' }}>
                  {isOwner ? (
                    <InputLabel
                      htmlFor="upload-profile-picture"
                      sx={{ '& :hover': { cursor: 'pointer' } }}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={
                          <Avatar sx={{ bgcolor: theme.palette.grey[700] }}>
                            <EditSharp />
                          </Avatar>
                        }
                      >
                        <UserAvatar
                          currentUser={true}
                          sx={{ width: '160px', height: '160px' }}
                          fontSize={'6rem'}
                        />
                      </Badge>
                      <VisuallyHiddenInput
                        onChange={handleUploadProfilePicture}
                        type="file"
                        id="upload-profile-picture"
                      />
                    </InputLabel>
                  ) : (
                    <UserAvatar
                      fontSize="6rem"
                      username={username as string | undefined}
                      sx={{ width: '160px', height: '160px' }}
                    />
                  )}
                  <Typography
                    sx={{ marginTop: theme.spacing(2) }}
                    textAlign={'center'}
                    variant="h6"
                  >
                    {username}
                  </Typography>
                </Container>
                <Stack
                  direction="column"
                  gap={theme.spacing(2)}
                  sx={{ width: '100%' }}
                >
                  <TextField
                    id="outlined-multiline-static"
                    label="Biodata"
                    multiline
                    fullWidth
                    rows={4}
                    defaultValue={profile?.biodata}
                    inputRef={biodataRef}
                    variant="outlined"
                    disabled={!isEditing}
                  />
                  <TextField
                    inputRef={emailRef}
                    label="Email"
                    defaultValue={profile?.email}
                    disabled={!isEditing}
                  />
                </Stack>
              </Stack>
            )}
          </CardContent>
          {isOwner ? (
            <CardActions>
              {isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile}>Update Profile</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardActions>
          ) : (
            <></>
          )}
        </Card>

        {isOwner ? (
          <Card>
            <CardHeader title={'Account'} />
            <CardContent>
              <Stack
                direction="column"
                gap={theme.spacing(1)}
                sx={{ width: '100%' }}
              >
                <TextField
                  inputRef={oldPasswordRef}
                  type="password"
                  label="Current Password"
                />
                <TextField
                  inputRef={newPasswordRef}
                  type="password"
                  label="New Password"
                />
              </Stack>
            </CardContent>
            <CardActions
              sx={{
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
                paddingBottom: theme.spacing(2),
              }}
            >
              <Button
                onClick={handleUpdatePassword}
                variant="contained"
                startIcon={<KeySharp />}
              >
                Update Password
              </Button>
            </CardActions>
          </Card>
        ) : (
          <></>
        )}
      </Container>
    );
  }
};

export default Profile;
