import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import {formatImageUrl} from "../../utils/format-image-url";

// ----------------------------------------------------------------------

export function PostSearch({ query, results, onSearch, hrefItem, loading }) {
  const router = useRouter();

  const handleClick = (postId) => {
    router.push(hrefItem(postId));
  };

  const handleKeyUp = (event) => {
    if (query) {
      if (event.key === 'Enter') {
        // Используем ID первого найденного поста
        handleClick(results[0]._id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} />}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      slotProps={{
        popper: { placement: 'bottom-start', sx: { minWidth: 320 } },
        paper: { sx: { [` .${autocompleteClasses.option}`]: { pl: 0.75 } } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, post) => {
        const matches = match(post.title, query);
        const parts = parse(post.title, matches);

        return (
          <li {...props} key={post._id}>
            <Avatar
              key={post._id}
              alt={post.title}
              src={formatImageUrl(post.coverUrl)}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <Link underline="none" onClick={() => handleClick(post._id)}>
              {parts.map((part, index) => (
                <Typography
                  key={`${post._id}-part-${index}`}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
