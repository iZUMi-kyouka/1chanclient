import { BASE_API_URL, BASE_URL } from '@/app/[locale]/layout';
import { SupportedLanguages } from '@/store/appState/appStateSlice';

export const makeProfilePictureURL = (filename: string): string => {
  return `${BASE_URL}/files/profile_pictures/${filename}`;
};

export const makeQueriedThreadListURL = ({
  apiPath,
  sortDir,
  sortParam,
  pageIndex,
  tags,
  customTags,
  q,
}: {
  apiPath: string;
  sortDir?: string;
  sortParam?: string;
  pageIndex?: number;
  tags?: number[];
  customTags?: string[];
  q?: string;
}): string => {
  const sortDirURL = sortDir !== undefined ? `&order=${sortDir}` : '';
  const sortParamURL = sortParam !== undefined ? `&sort_by=${sortParam}` : '';
  const pageIndexURL = pageIndex !== undefined ? `&page=${pageIndex}` : '';
  const tagURL = tags !== undefined ? `&tags=${tags.join(',')}` : '';
  const customTagURL =
    customTags !== undefined ? `&custom_tags=${customTags.join(',')}` : '';
  const searchQuery = q !== undefined ? `&q=${q}` : '';
  return `${BASE_API_URL}${apiPath}?${sortDirURL}${sortParamURL}${pageIndexURL}${tagURL}${customTagURL}${searchQuery}`;
};

/**
 * Outputs a the given URL 'prefixed' with the locale. i.e. if locale is 'ja' and url is '/login' 
 * then outputs '/ja/login' to improve the routing mechanism
 */
export const withLocale = (locale: SupportedLanguages, url: string): string => {
  return `/${locale}/${url}`;
}