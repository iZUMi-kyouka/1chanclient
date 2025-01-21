import { selectUserAccount, selectUserProfile } from '@/store/user/userSlice';
import { makeProfilePictureURL } from '@/utils/makeUrl';
import { Avatar, AvatarProps, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * An avatar that takes the filename of the image and handles the src URL formatting
 */
const UserAvatar = forwardRef<
  HTMLDivElement,
  AvatarProps & {
    currentUser?: boolean;
    fontSize?: string;
    username?: string;
    filename?: string;
    src?: string;
    alt?: string;
  }
>(({ src, alt, username, currentUser, fontSize, filename, ...props }, ref) => {
  const userProfile = useSelector(selectUserProfile);
  const userAccount = useSelector(selectUserAccount);

  return (
    <Avatar
      ref={ref}
      src={
        currentUser
          ? makeProfilePictureURL(userProfile.profile_picture_path)
          : filename
            ? makeProfilePictureURL(filename)
            : src
              ? src
              : undefined
      }
      alt={alt}
      {...props}
    >
      <Typography sx={{ fontSize: fontSize }}>
        {username && username.length > 1
          ? username[0].toUpperCase()
          : userAccount.username
            ? userAccount.username[0].toUpperCase()
            : ''}
      </Typography>
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
