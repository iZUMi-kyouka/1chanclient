import { SupportedLanguages } from '@/store/appState/appStateSlice';
import { withLocale } from '@/utils/makeUrl';
import { TagSharp } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const CustomTagChip = ({ customTag }: { customTag: string }) => {
  const router = useRouter();
  const locale = useLocale() as SupportedLanguages;

  return (
    <Chip
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        router.push(withLocale(locale, `/search?custom_tags=${customTag}`));
      }}
      size="small"
      label={customTag}
      icon={<TagSharp />}
    />
  );
};

export default CustomTagChip;
