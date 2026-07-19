import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "/img/header_ic.jpg", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Levi",
	bio: "Life is simple, me too ❤",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/czy13724",
		},
		{
			name: "Telegram",
			icon: "fa7-brands:telegram",
			url: "https://t.me/i_Levibot",
		},
		{
			name: "Email",
			icon: "mdi:email",
			url: "mailto:contact@levifree.qzz.io",
		},
	],
};
