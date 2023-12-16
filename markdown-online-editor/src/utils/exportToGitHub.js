// czy13724.github.io/markdown-online-editor/src/utils/exportToGitHub.js

import axios from 'axios';

function formatNumber(value) {
  return String(value).padStart(2, '0');
}

async function extractTitle(markdownContent) {
  const titleMatch = markdownContent.match(/^#\s+(.*)/); // 假设标题在 Markdown 内容中以 # 开头
  return titleMatch ? titleMatch[1] : 'untitled'; // 如果没有找到标题，则使用 'untitled'
}

async function exportToGitHub(markdownContent, accessToken, username, repoName) {
  const title = await extractTitle(markdownContent);

  const today = new Date();
  const year = today.getFullYear();
  const month = formatNumber(today.getMonth() + 1);
  const day = formatNumber(today.getDate());
  
  const formattedDate = `${year}-${month}-${day}`;
  const fileName = `${formattedDate}-${title}.md`;
  const filePath = `_posts/${fileName}`;

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
