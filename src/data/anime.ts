// 本地动漫数据配置
export interface AnimeItem {
	sourceId: "xian-ni" | "douluo-dalu" | "doupo-cangqiong";
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
}

const localAnimeList: AnimeItem[] = [
	{
		sourceId: "xian-ni",
		title: "仙逆",
		status: "watching",
		rating: 9.0,
		cover: "https://vcover-vt-pic.puui.qpic.cn/vcover_vt_pic/0/mzc00200aaogpgh1766914172519/260?imageView2/2/w/344/h/480",
		description: "王林在逆境中求道、求真，走出自己的修行之路。",
		episodes: "连载中",
		year: "2023",
		genre: ["玄幻", "修仙", "国产动画"],
		studio: "铸梦动画",
		link: "https://v.qq.com/x/cover/mzc00200aaogpgh/r0047gdjpw6.html",
		progress: 1,
		totalEpisodes: 1,
		startDate: "2023-09",
		endDate: "",
	},
	{
		sourceId: "douluo-dalu",
		title: "斗罗大陆",
		status: "completed",
		rating: 8.8,
		cover: "https://vcover-vt-pic.puui.qpic.cn/vcover_vt_pic/0/mzc00200xf3rir61781944893526/260?imageView2/2/w/344/h/480",
		description: "唐三从魂师学院出发，与伙伴共同成长的热血冒险。",
		episodes: "全 263 集",
		year: "2018",
		genre: ["玄幻", "冒险", "国产动画"],
		studio: "玄机科技",
		link: "https://v.qq.com/x/cover/mzc00200xf3rir6/i0046sewh4r.html",
		progress: 263,
		totalEpisodes: 263,
		startDate: "2018-01",
		endDate: "2023-06",
	},
	{
		sourceId: "doupo-cangqiong",
		title: "斗破苍穹",
		status: "watching",
		rating: 8.7,
		cover: "https://vcover-vt-pic.puui.qpic.cn/vcover_vt_pic/0/mzc0020027yzd9e1754535470956/260?imageView2/2/w/344/h/480",
		description: "少年萧炎重拾斗气，在历练与战斗中寻找属于自己的答案。",
		episodes: "连载中",
		year: "2017",
		genre: ["玄幻", "热血", "国产动画"],
		studio: "幻维数码",
		link: "https://v.qq.com/x/cover/mzc0020027yzd9e/q0043cz9x20.html",
		progress: 1,
		totalEpisodes: 1,
		startDate: "2017-01",
		endDate: "",
	},
];

export default localAnimeList;
