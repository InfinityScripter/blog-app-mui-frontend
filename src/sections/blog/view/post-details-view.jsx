'use client';

import { useState, useEffect, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';

import { fShortenNumber } from 'src/utils/format-number';

import { POST_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { PostDetailsHero } from '../post-details-hero';
import { PostCommentList } from '../post-comment-list';
import { PostCommentForm } from '../post-comment-form';
import { PostDetailsToolbar } from '../post-details-toolbar';

import { updatePostPublish } from 'src/actions/blog-ssr';

// ----------------------------------------------------------------------

export function PostDetailsView({ post }) {
  const [publish, setPublish] = useState('');

  const handleChangePublish = useCallback(async (newValue) => {
    try {
      await updatePostPublish(post._id, newValue);
      setPublish(newValue);
    } catch (error) {
      console.error('Failed to update publish status:', error);
    }
  }, [post._id]);

  useEffect(() => {
    if (post) {
      setPublish(post?.publish);
    }
  }, [post]);

  return (
    <DashboardContent maxWidth={false} disablePadding>
      <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
        <PostDetailsToolbar
          backLink={paths.dashboard.post.root}
          editLink={paths.dashboard.post.edit(`${post?._id}`)}
          liveLink={paths.post.details(`${post?._id}`)}
          publish={`${publish}`}
          onChangePublish={handleChangePublish}
          publishOptions={POST_PUBLISH_OPTIONS}
          postId={post._id}
        />
      </Container>

      <PostDetailsHero title={`${post?.title}`} coverUrl={`${post?.coverUrl}`} />

      <Stack
        sx={{
          pb: 5,
          mx: 'auto',
          maxWidth: 720,
          mt: { xs: 5, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="subtitle1">{post?.description}</Typography>

        <Markdown children={post?.content} />

        <Stack
          spacing={3}
          sx={{
            py: 3,
            borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
            borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {post?.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="soft" />
            ))}
          </Stack>

          <Stack direction="row" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  size="small"
                  color="error"
                  icon={<Iconify icon="solar:heart-bold" />}
                  checkedIcon={<Iconify icon="solar:heart-bold" />}
                  inputProps={{ id: 'favorite-checkbox', 'aria-label': 'Favorite checkbox' }}
                />
              }
              label={fShortenNumber(post?.totalFavorites)}
              sx={{ mr: 1 }}
            />

            <AvatarGroup sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
              {post?.favoritePerson.map((person) => (
                <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
              ))}
            </AvatarGroup>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
          <Typography variant="h4">Comments</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            ({post?.comments.length})
          </Typography>
        </Stack>

        <PostCommentForm />

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={post?.comments ?? []} />
      </Stack>
    </DashboardContent>
  );
}
