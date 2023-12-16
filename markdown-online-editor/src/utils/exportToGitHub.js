// exportToGitHub.js

import axios from 'axios';

async function exportToGitHub(markdownContent, accessToken, username, repoName, filePath) {
  try {
    // 使用 GitHub API 上传 Markdown 文件
    await axios.put(`https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`, {
      message: '博文更新',
      content: Buffer.from(markdownContent).toString('base64'),
      branch: 'master',
      access_token: accessToken
    });

    console.log('Markdown file exported to GitHub successfully.');
  } catch (error) {
    console.error('Error exporting markdown file to GitHub:', error.response.data.message);
    // 这里可以添加一些用户反馈，例如通知用户导出失败等
  }
}

export default exportToGitHub;
