import { useState, useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { deletePost } from 'src/actions/blog-ssr';

export function usePostDelete() {
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpenConfirm = useCallback((post) => {
    setPostToDelete(post);
    setOpenConfirm(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setPostToDelete(null);
    setOpenConfirm(false);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      await deletePost(postToDelete._id);
      handleCloseConfirm();
      router.push(paths.dashboard.post.root);
      router.refresh();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  }, [postToDelete, router, handleCloseConfirm]);

  return {
    openConfirm,
    postToDelete,
    loading,
    handleOpenConfirm,
    handleCloseConfirm,
    handleDelete,
  };
}
