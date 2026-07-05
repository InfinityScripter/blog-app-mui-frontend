"use client";

import { paths } from "src/routes/paths";
import { useTranslations } from "next-intl";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { PostNewEditForm } from "../post-new-edit-form";

import type { PostEditViewProps } from "./types";

// ----------------------------------------------------------------------

export function PostEditView({ post }: PostEditViewProps) {
  const t = useTranslations("blog");

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t("form.editHeading")}
        links={[
          { name: t("form.breadcrumbDashboard"), href: paths.dashboard.root },
          { name: t("form.breadcrumbBlog"), href: paths.dashboard.post.root },
          { name: post?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PostNewEditForm currentPost={post} />
    </DashboardContent>
  );
}
