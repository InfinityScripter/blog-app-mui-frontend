"use client";

import type { Post } from "src/types/domain";

import { paths } from "src/routes/paths";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { PostNewEditForm } from "../post-new-edit-form";

// ----------------------------------------------------------------------

interface PostEditViewProps {
  post?: Post;
}

export function PostEditView({ post }: PostEditViewProps) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Blog", href: paths.dashboard.post.root },
          { name: post?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PostNewEditForm currentPost={post} />
    </DashboardContent>
  );
}
