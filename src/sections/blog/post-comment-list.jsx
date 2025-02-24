import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { PostCommentItem } from './post-comment-item';

// ----------------------------------------------------------------------

export function PostCommentList({ comments = [], postId, onCommentUpdated }) {
  return (
    <>
      {comments.map((comment) => {
        const hasReply = !!comment.replyComment.length;

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
              comment.replyComment.map((reply) => {
                const userReply = comment.users.find((user) => user.id === reply.userId);

                return (
                  <PostCommentItem
                    key={reply.id}
                    name={userReply?.name || ''}
                    message={reply.message}
                    postedAt={reply.postedAt}
                    avatarUrl={userReply?.avatarUrl || ''}
                    tagUser={reply.tagUser}
                    hasReply
                    comment={reply}
                    postId={postId}
                    parentCommentId={comment.id}
                    onCommentUpdated={onCommentUpdated}
                  />
                );
              })}
          </Box>
        );
      })}

      <Pagination count={8} sx={{ my: { xs: 5, md: 8 }, mx: 'auto' }} />
    </>
  );
}
