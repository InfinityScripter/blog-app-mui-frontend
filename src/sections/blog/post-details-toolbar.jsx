import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { deletePost } from 'src/actions/blog-ssr';

import { toast } from 'src/components/snackbar'; // если используете уведомления
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { paths } from '../../routes/paths';

// ----------------------------------------------------------------------

export function PostDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  postId,
  sx,
  ...other
}) {
  const popover = usePopover();
  const router = useRouter();
  const handleDelete = async () => {
    // можно добавить подтверждение через window.confirm
    if (window.confirm('Вы действительно хотите удалить пост?')) {
      try {
        await deletePost(postId);
        toast.success('Пост успешно удалён');
        // Перенаправляем пользователя на список постов (например, dashboard)

        router.push(paths.dashboard.post.root);
      } catch (error) {
        toast.error('Не удалось удалить пост');
        console.error(error);
      }
    }
  };

  return (
    <>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, ...sx }} {...other}>
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {publish === 'published' && (
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator="Loading…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {publish}
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {publishOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === publish}
              onClick={() => {
                popover.onClose();
                onChangePublish(option.value);
              }}
            >
              {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" />}
              {option.value === 'draft' && <Iconify icon="solar:file-text-bold" />}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
