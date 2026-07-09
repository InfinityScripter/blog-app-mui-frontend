import { paths } from "src/routes/paths";
import { useTranslations } from "next-intl";
import { useRouter } from "src/routes/hooks";
import { useState, useCallback } from "react";
import { toast } from "src/components/snackbar";
import { deletePost } from "src/actions/blog-ssr";

// Only the post id is needed to confirm + perform a delete, so callers may pass
// any object carrying an `_id` (a full Post or just `{ _id }`).
interface PostToDelete {
  _id: string;
}

interface UsePostDeleteReturn {
  openConfirm: boolean;
  postToDelete: PostToDelete | null;
  loading: boolean;
  handleOpenConfirm: (post: PostToDelete) => void;
  handleCloseConfirm: () => void;
  handleDelete: () => Promise<void>;
}

export function usePostDelete(): UsePostDeleteReturn {
  const router = useRouter();
  const t = useTranslations("blog");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostToDelete | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenConfirm = useCallback((post: PostToDelete) => {
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
      toast.error(t("form.errorToast"));
    } finally {
      setLoading(false);
    }
  }, [postToDelete, router, handleCloseConfirm, t]);

  return {
    openConfirm,
    postToDelete,
    loading,
    handleOpenConfirm,
    handleCloseConfirm,
    handleDelete,
  };
}
