import { useState, useCallback } from "react";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { deletePost } from "src/actions/blog-ssr";

import type { Post } from "src/types/domain";

interface PostWithId extends Post {
  _id: string;
}

interface UsePostDeleteReturn {
  openConfirm: boolean;
  postToDelete: PostWithId | null;
  loading: boolean;
  handleOpenConfirm: (post: PostWithId) => void;
  handleCloseConfirm: () => void;
  handleDelete: () => Promise<void>;
}

export function usePostDelete(): UsePostDeleteReturn {
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostWithId | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenConfirm = useCallback((post: PostWithId) => {
    setPostToDelete(post);
    setOpenConfirm(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setPostToDelete(null);
    setOpenConfirm(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!postToDelete?._id) return;

    try {
      setLoading(true);
      await deletePost(postToDelete._id);
      handleCloseConfirm();
      router.push(paths.dashboard.post.root);
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
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
