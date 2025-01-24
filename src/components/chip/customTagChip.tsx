import { TagSharp } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useRouter } from 'next/navigation';

const CustomTagChip = ({customTag}: {customTag: string}) => {
  const router = useRouter();
  
  return (
    <Chip
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        router.push(`/search?custom_tags=${customTag}`)
      }}
      size='small'
      label={customTag}
      icon={<TagSharp />}
    />
  )
}

export default CustomTagChip