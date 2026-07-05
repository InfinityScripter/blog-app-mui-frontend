import type { Comment, ReplyComment } from "src/types/domain";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useBoolean } from "src/hooks/use-boolean";
import { usePopover } from "src/components/custom-popover";
import { deleteComment, updateComment } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

interface UsePostCommentItemParams {
  message: string;
  hasReply?: boolean;
  comment: Comment | ReplyComment;
  postId?: string;
  parentCommentId?: string;
  onCommentUpdated?: () => void;
}

export function usePostCommentItem({
  message,
  hasReply,
  comment,
  postId: propPostId,
  parentCommentId,
  onCommentUpdated,
}: UsePostCommentItemParams) {
  const params = useParams<{ id: string }>();
  const postId = propPostId || params?.id;
  const popover = usePopover();

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const saving = useBoolean();
  const deleting = useBoolean();

  const handleSave = async () => {
    if (saving.value || !editedMessage.trim()) {
      return;
    }

    saving.onTrue();
    try {
      // Assign through an intermediate so TS's excess-property check on the
      // `Partial<Comment>` param doesn't reject the extra `isReply`/
      // `parentCommentId` keys the API route reads off the body.
      const updatePayload = {
        message: editedMessage,
        isReply: hasReply,
        parentCommentId,
      };
      await updateComment(postId, comment.id, updatePayload);

      if (onCommentUpdated) {
        onCommentUpdated();
      }
      setIsEditing(false);
      popover.onClose();
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      saving.onFalse();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    popover.onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message);
  };

  const handleDelete = async () => {
    if (deleting.value) {
      return;
    }

    deleting.onTrue();
    try {
      await deleteComment(postId, comment.id, {
        isReply: hasReply,
        parentCommentId,
      });

      if (onCommentUpdated) {
        onCommentUpdated();
      }
      popover.onClose();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      deleting.onFalse();
    }
  };

  return {
    popover,
    saving,
    deleting,
    isEditing,
    editedMessage,
    setEditedMessage,
    handleSave,
    handleKeyPress,
    handleStartEdit,
    handleCancelEdit,
    handleDelete,
  };
}
