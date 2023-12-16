/** @format */
import exportToGitHub from '../utils/exportToGitHub';  // 替换成实际的路径

export const appTitle = '在线 Markdown 编辑器';

export const exportTextMap = {
  '/export/png': '导出 PNG',
  '/export/jpeg': '导出 JPEG',
  '/export/pdf': '导出 PDF',
  '/export/ppt': 'PPT 预览',
  '/export/md': '导出到GitHub并发表'
};

export async function handleExportToGitHub(markdownContent, accessToken, username, repoName, filePath) {
  await exportToGitHub(markdownContent, accessToken, username, repoName, filePath);
  // 这里可以添加一些用户反馈，例如通知用户导出成功等
  console.log('Export to GitHub completed.');
}

