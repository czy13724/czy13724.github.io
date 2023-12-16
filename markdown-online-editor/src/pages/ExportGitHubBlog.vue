<!-- ExportGitHubBlog.vue -->

<template>
  <div>
    <button @click="exportToGitHub">导出到GitHub</button>
  </div>
</template>

<script>
import exportToGitHub from '@/utils/exportToGitHub'; // 替换成实际的路径

export default {
  methods: {
    async exportToGitHub() {
      const markdownContent = '...'; // 获取你的 Markdown 内容
      const accessToken = 'your_default_access_token'; // 默认的 Access Token
      const username = 'czy13724'; // 你的用户名
      const repoName = 'czy13724.github.io'; // 你的仓库名

      await exportToGitHub(markdownContent, accessToken, username, repoName);
    },
  },
};
</script>
