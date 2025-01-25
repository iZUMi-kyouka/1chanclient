import { postCategoriesDict } from '@/app/[locale]/categories';
import { SupportedLanguages } from '@/store/appState/appStateSlice';
import { withLocale } from '@/utils/makeUrl';
import { Chip, useTheme } from '@mui/material';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const TagChip = ({ tagID }: { tagID: number }) => {
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale() as SupportedLanguages;

  return (
    <Chip
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        router.push(withLocale(locale, `/top/${tagID}`));
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
