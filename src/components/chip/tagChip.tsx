import { postCategoriesDict } from '@/app/categories';
import { Chip, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

const TagChip = ({ tagID }: { tagID: number }) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Chip
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        router.push(`/top/${tagID}`);
      }}
      size="small"
      sx={{
        pl: theme.spacing(1),
      }}
      icon={postCategoriesDict[tagID].icon}
      label={postCategoriesDict[tagID].displayName}
    />
  );
};

export default TagChip;
