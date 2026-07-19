// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Leviの导航站",
		imgurl: "/img/header_ic.jpg",
		desc: "Levi's Navigation",
		siteurl: "https://levifree.qzz.io",
		tags: ["Nav"],
	},
	{
		id: 2,
		title: "Leviの图标库",
		imgurl: "/img/header_ic.jpg",
		desc: "支持索引的常用脚本logo库",
		siteurl: "https://icons.levifree.qzz.io",
		tags: ["Levi"],
	},
	{
		id: 3,
		title: "Leviの脚本库",
		imgurl: "/img/header_ic.jpg",
		desc: "查找和使用Levi制作且可用的脚本、模块或插件等链接。",
		siteurl: "https://script.levifree.qzz.io",
		tags: ["Levi"],
	},
	{
		id: 4,
		title: "Surge 模块生成器",
		imgurl: "/img/header_ic.jpg",
		desc: "快速生成单一的 Surge 模块配置文件",
		siteurl: "https://surge-argu.levifree.qzz.io",
		tags: ["Levi"],
	},
	{
		id: 5,
		title: "Loon 插件扩展生成器",
		imgurl: "/img/header_ic.jpg",
		desc: "快速生成单一的 Loon 插件扩展(.lpx)配置文件",
		siteurl: "https://loon-argu.levifree.qzz.io",
		tags: ["Levi"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
