// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 站长日记与生活随笔数据
const diaryData: DiaryItem[] = [
	{
		id: 4,
		content:
			"终于把手里积攒的云服务和域名彻底理顺了，全站正式绑定了属于自己的顶级域名 levifree.com。给数字生活做了一次深度断舍离，整个人都轻快了不少。",
		date: "2026-10-25T21:40:00Z",
		location: "书房",
		mood: "轻松",
		tags: ["断舍离", "建站日记", "随笔"],
		images: ["/images/diary/workspace.webp"],
	},
	{
		id: 3,
		content:
			"翻出一台闲置的小主机，花了一个周末用 Docker Compose 搭建了 Uptime Kuma 监控和自动化心跳探针。虽然中间 DNS 解析踩了个小坑，但看着终端一排排绿色的启动日志，由代码掌控现实世界的满足感真让人上瘾。",
		date: "2026-09-20T17:30:00Z",
		location: "工作台",
		mood: "充实",
		tags: ["Homelab", "折腾记录", "Linux"],
	},
	{
		id: 2,
		content:
			"深夜静下来写完了一篇两千多字的技术长文。在这个被算法投喂短视频的时代，能专注几个小时理清一个排错闭环，写字本身就是一种思维的深呼吸。",
		date: "2026-08-15T23:15:00Z",
		location: "书房",
		mood: "宁静",
		tags: ["慢生活", "写作思考", "随笔"],
	},
	{
		id: 1,
		content:
			"樱花飘落的速度是秒速五厘米，而代码编译通过的喜悦就在那一瞬间。生活简单，我也是。",
		date: "2026-05-10T14:20:00Z",
		images: ["/images/diary/sakura.jpg", "/images/diary/1.webp"],
		location: "公园",
		mood: "愉快",
		tags: ["生活", "摄影"],
	},
];

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	for (const item of diaryData) {
		if (item.tags) {
			for (const tag of item.tags) {
				tags.add(tag);
			}
		}
	}
	return Array.from(tags).sort();
};
