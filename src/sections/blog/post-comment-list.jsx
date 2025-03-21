import Box from "@mui/material/Box";

import PostCommentItem from "./post-comment-item";

// ----------------------------------------------------------------------

export function PostCommentList({ comments = [], postId, onCommentUpdated }) {
  return (
    <>
      {comments.map((comment) => {
        const hasReply = !!comment.replyComment?.length;

        return (
          <Box key={comment.id}>
            <PostCommentItem
              name={comment.name}
              message={comment.message}
              postedAt={comment.postedAt}
              avatarUrl={comment.avatarUrl}
              comment={comment}
              postId={postId}
              onCommentUpdated={onCommentUpdated}
            />
            {hasReply &&
              comment.replyComment.map((reply) => (
                <PostCommentItem
                  key={reply.id}
                  name={reply.name}
                  message={reply.message}
                  postedAt={reply.postedAt}
                  avatarUrl={reply.avatarUrl}
                  tagUser={reply.tagUser}
                  hasReply
                  comment={reply}
                  postId={postId}
                  parentCommentId={comment.id}
                  onCommentUpdated={onCommentUpdated}
                />
              ))}
          </Box>
        );
      })}
    </>
  );
}
