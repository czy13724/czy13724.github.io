// exportToGitHub.js

import axios from 'axios';

async function exportToGitHub(markdownContent, accessToken, username, repoName) {
  // 获取当前时间
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  // 构造文件名
  const title = markdownContent.match(/^# (.+)$/m); // 从标题行获取文章标题
  const fileName = title ? `${year}-${month}-${day}-${title[1]}.md` : `${year}-${month}-${day}-untitled.md`;

  // 构造文件路径
  const filePath = `_posts/${fileName}`;

  // GitHub API 请求地址
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`;

  try {
    // 获取当前文件的 SHA（用于更新文件）
    const response = await axios.get(apiUrl);
    const sha = response.data.sha;

    // 构造请求头
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `token ${accessToken}`
    };

    // 构造请求体
    const data = {
      message: '博文更新',
      content: Buffer.from(markdownContent).toString('base64'),
      sha: sha
    };

    // 发送 PUT 请求更新文件内容
    await axios.put(apiUrl, data, { headers: headers });

    console.log(`Successfully updated: ${filePath}`);
  } catch (error) {
    // 如果文件不存在，则创建新文件
    if (error.response && error.response.status === 404) {
      // 构造请求体
      const data = {
        message: '博文更新',
        content: Buffer.from(markdownContent).toString('base64')
      };

      // 发送 PUT 请求创建新文件
      await axios.put(apiUrl, data, { headers: headers });

      console.log(`Successfully created: ${filePath}`);
    } else {
      console.error('Error updating or creating file:', error.message);
    }
  }
}

export default exportToGitHub;
