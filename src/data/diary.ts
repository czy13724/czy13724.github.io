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
		id: 11,
		content:
			"午后点了一支线香，盘腿做了二十分钟呼吸冥想。把注意力慢慢从满屏跳动的字符收束到鼻尖的一呼一吸之间。脑子里偶尔还是会冒出未解决的逻辑和琐事，不再急着去否定或纠正它们，只是像看着河面上漂过的树叶一样，静静看着念头升起再散去。起身时窗外天色清朗，内心难得的一片澄澈与安静。",
		date: "2026-10-28T15:30:00Z",
		location: "书房 / 坐垫",
		mood: "空灵",
		tags: ["冥想", "正念", "心流", "日常"],
	},
	{
		id: 10,
		content:
			"傍晚关掉显示器下楼散步，天边刚好挂着一层淡淡的晚霞。耳机里随机播放着久石让的原声集，微凉的晚风吹在脸上很舒服。不用思考任何代码架构和复杂协议，只是单纯地踩着落叶往前走，看路边卖烤红薯的小摊冒着热气，普通人烟里的烟火气最抚人心。",
		date: "2026-10-27T21:15:00Z",
		location: "河边绿道",
		mood: "惬意",
		tags: ["散步", "晚霞", "生活碎片"],
	},
	{
		id: 9,
		content:
			"深秋的早晨淅淅沥沥下了一场透雨，气温骤降。手冲了一杯日晒耶加雪菲，听着窗外的雨声翻完了半本《禅与摩托车维修艺术》。很多时候我们焦虑是因为总想立刻抵达结果，但真正让人感到踏实的，恰恰是打磨当下每一步细节的过程。",
		date: "2026-10-26T10:45:00Z",
		location: "窗前小桌",
		mood: "专注",
		tags: ["手冲咖啡", "阅读", "慢生活"],
	},
	{
		id: 8,
		content:
			"终于把手里积攒的云服务和域名彻底理顺了，全站正式绑定了属于自己的顶级域名 levifree.com。给数字生活做了一次深度断舍离，整个人都轻快了不少。",
		date: "2026-10-25T21:40:00Z",
		location: "书房",
		mood: "轻松",
		tags: ["断舍离", "建站日记", "随笔"],
		images: ["/images/diary/workspace.webp"],
	},
	{
		id: 7,
		content:
			"周末把手机丢在背包深处静音，去城郊的植物园坐了大半天。坐在巨大的水杉树下闭上眼睛冥想，周围只有沙沙的树叶摩擦声、远处清脆的鸟鸣和自己的心跳。以前总担心错过即时消息会有损失，真正抽离几个小时才发现，现实世界的呼吸感比任何信息流都真实充盈。",
		date: "2026-10-18T16:20:00Z",
		location: "植物园水杉林",
		mood: "放空",
		tags: ["冥想", "离线生活", "大自然"],
	},
	{
		id: 6,
		content:
			"假期最后一天，哪儿也没去。洗干净茶具，泡了一壶老白茶。看茶叶在沸水里翻滚舒展，茶香慢慢弥漫在整个屋子里。阳光透过百叶窗在木地板上切出一道道光栅，猫咪在脚边睡得呼噜震天。最好的休息不是狂欢，而是让紧绷的神经彻底松弛下来。",
		date: "2026-10-06T14:00:00Z",
		location: "茶台",
		mood: "安详",
		tags: ["喝茶", "独处", "慢生活"],
	},
	{
		id: 5,
		content:
			"翻出一台闲置的小主机，花了一个周末用 Docker Compose 搭建了 Uptime Kuma 监控和自动化心跳探针。虽然中间 DNS 解析踩了个小坑，但看着终端一排排绿色的启动日志，由代码掌控现实世界的满足感真让人上瘾。",
		date: "2026-09-20T17:30:00Z",
		location: "工作台",
		mood: "充实",
		tags: ["Homelab", "折腾记录", "Linux"],
	},
	{
		id: 4,
		content:
			"清晨六点醒来，趁着整座城市还在沉睡，在阳台做了一组晨间冥想与伸展。深吸一口微凉湿润的空气，看着地平线从青灰变成金黄，阳光一点点漫过阳台的绿植。一天从感知身体的存在开始，情绪就会变得特别稳定。",
		date: "2026-08-30T08:30:00Z",
		location: "阳台",
		mood: "平静",
		tags: ["晨间习惯", "冥想", "生活碎片"],
	},
	{
		id: 3,
		content:
			"深夜静下来写完了一篇两千多字的技术长文。在这个被算法投喂短视频的时代，能专注几个小时理清一个排错闭环，写字本身就是一种思维的深呼吸。",
		date: "2026-08-15T23:15:00Z",
		location: "书房",
		mood: "宁静",
		tags: ["慢生活", "写作思考", "随笔"],
	},
	{
		id: 2,
		content:
			"夏天夜晚的微风带着白日余温退去后的清凉。坐在露台抬头看星星，忽然想起那句话：人是一根会思想的芦苇。世事浮躁喧嚣，能够在自己的精神角落里保有一方小天地，何其幸运。",
		date: "2026-07-08T19:40:00Z",
		location: "露台",
		mood: "释然",
		tags: ["夏夜", "随感", "独处"],
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
