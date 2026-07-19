const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '_backup', '_posts');
const outputDir = path.join(__dirname, 'src', 'content', 'posts');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.md'));
let successCount = 0;

for (const file of files) {
    const content = fs.readFileSync(path.join(backupDir, file), 'utf8');
    
    // Parse frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        console.log(`Skipping ${file} - no frontmatter`);
        continue;
    }
    
    const frontmatter = match[1];
    const body = match[2];
    
    // Extract fields
    const titleMatch = frontmatter.match(/title:\s*(.*)/);
    const title = titleMatch ? titleMatch[1].trim() : '""';
    
    const subtitleMatch = frontmatter.match(/subtitle:\s*(.*)/);
    const description = subtitleMatch ? subtitleMatch[1].trim() : '';
    
    // Parse date from file name YYYY-MM-DD-title.md or from date field
    let dateStr = '';
    const dateMatch = frontmatter.match(/date:\s*(.*)/);
    if (dateMatch) {
        const dateVal = dateMatch[1].trim().replace(/['"]/g, '');
        dateStr = dateVal.split(' ')[0]; // just get YYYY-MM-DD
    } else {
        const fileDateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
        if (fileDateMatch) dateStr = fileDateMatch[1];
    }
    
    // Extract tags
    let tags = [];
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
    if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
    } else {
        const tagsBlock = frontmatter.match(/tags:\n([\s\S]*?)(?:\n\w+:|$)/);
        if (tagsBlock) {
            const tagLines = tagsBlock[1].split('\n').filter(l => l.trim().startsWith('-'));
            tags = tagLines.map(l => l.replace(/^\s*-\s*/, '').trim().replace(/^['"]|['"]$/g, ''));
        }
    }
    
    // Set category (first tag or '未分类')
    const category = tags.length > 0 ? tags[0] : '未分类';
    
    // Generate new filename
    const newFilename = file.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    
    // Generate new frontmatter
    let newFm = `---\n`;
    newFm += `title: ${title}\n`;
    newFm += `published: ${dateStr}\n`;
    if (description) {
        newFm += `description: ${description}\n`;
    }
    newFm += `tags: [${tags.map(t => `"${t}"`).join(', ')}]\n`;
    newFm += `category: "${category}"\n`;
    newFm += `---\n`;
    
    fs.writeFileSync(path.join(outputDir, newFilename), newFm + body);
    successCount++;
}

console.log(`Converted ${successCount} files.`);
