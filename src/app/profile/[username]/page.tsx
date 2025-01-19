'use client';

import { BASE_API_URL } from '@/app/layout';
import BareContainer from '@/components/bareContainer';
import { UserProfile } from '@/interfaces/user';
import { selectUserAccount } from '@/store/user/userSlice'
import { customFetch } from '@/utils/customFetch';
import { EditSharp, KeySharp, PasswordSharp } from '@mui/icons-material';
import { Avatar, Badge, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, MenuItem, Select, Stack, styled, TextField, Typography, useTheme } from '@mui/material'
import { Params } from 'next/dist/server/request/params'
import React, { use, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr';

const url = `${BASE_API_URL}/users/profile`;

const Profile = ({ params }: { params: Promise<Params>}) => {
  const username = use(params).username;
  const user = useSelector(selectUserAccount);
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data, error, isLoading } = useSWR<UserProfile>(url, (url: string) => customFetch(url).then(response => response.json()));
  const isOwner = username === user.username;

  useEffect(() => {
    if (data) {
      console.log(data);
      setProfile(data);
    }
  }, [data]);

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    <Typography color='error'>An unexpected error occurred.</Typography>
  }

  if (data) {
    return (
      <Container
        sx={{
          paddingTop: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2)
        }}
      >
        {
          isOwner
          ? <Typography variant='h4'>My Account</Typography>
          : <Typography variant='h4'>{`${username}'s Profile`}</Typography>
        }
    
          <Card>
          <CardHeader 
            title={"Profile"}
          />
          <CardContent
            sx={{
              padding: theme.spacing(3)
            }}
          >
            <Stack direction='row' gap={theme.spacing(2)}>
            <Container sx={{flexShrink: 1, width: 'auto'}}>
              {
                isOwner ?
                <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  
                  <Avatar
                    sx={{bgcolor: theme.palette.grey[700]}}
                  >
                    <EditSharp />
                  </Avatar>}
              >
                <Avatar
                  sx={{width: '160px', height: '160px'}}
                >
                </Avatar>
              </Badge> :                 
              <Avatar
                sx={{width: '160px', height: '160px'}}
              >
              </Avatar>
              }
              
            </Container>
            <Stack direction='column' gap={theme.spacing(2)} sx={{width: '100%'}}>
              <TextField
                id="outlined-multiline-static"
                label="Biodata"
                multiline
                fullWidth
                rows={4}
                defaultValue={profile?.biodata}
                variant='outlined'
                disabled={!isEditing}
              />
              <TextField 
                label="Email"
                defaultValue={profile?.email}
                disabled={!isEditing}
              />
            </Stack>
            </Stack>
          </CardContent>
          {
            isOwner ?
            <CardActions>
            {
              isEditing
              ? <>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button>Update Profile</Button>
              </>
              : <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            }

            </CardActions>:
            <></>
          }
         
        </Card>

        {
          isOwner ?
          <Card>
          <CardHeader 
            title={"Account"}
          />
          <CardContent>
            <Stack direction='column' gap={theme.spacing(1)} sx={{width: '100%'}}>
              <TextField 
                type="password"
                label="Current Password"
              />
              <TextField 
                type="password"
                label="New Password"
              />
              <BareContainer>
                <Button
                  variant='contained'
                  startIcon={<KeySharp />}
                >Update Password</Button>
              </BareContainer>
            </Stack>
          </CardContent>
          </Card>
          : <></>
        }
      
      </Container>
    )
  }

  
}

export default Profile