// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Apple: [
		{
			name: "iPhone 17 Pro Max",
			image: "/images/device/iphone17promax.webp",
			specs: "A19 Pro 芯片",
			description: "当前日常主力手机。",
			link: "https://www.apple.com/iphone/",
		},
		{
			name: "MacBook Air M4",
			image: "/images/device/macbookairm4.webp",
			specs: "Apple M4 芯片",
			description: "当前日常主力笔记本。",
			link: "https://www.apple.com/macbook-air/",
		},
		{
			name: "MacBook Pro 2018",
			image: "/images/device/macbookpro2018.webp",
			specs: "双系统",
			description: "曾经的主力笔记本，曾在台式电脑上尝试过安装黑苹果。",
			link: "https://support.apple.com/kb/SP776",
		},
		{
			name: "iPad 2021",
			image: "/images/device/ipad2021.webp",
			specs: "第9代 iPad",
			description: "日常使用的平板设备。",
			link: "https://www.apple.com/shop/product/MK2L3LL/A/ipad",
		},
	],
	OPPO: [
		{
			name: "OPPO A5 Pro",
			image: "/images/device/oppoa5pro.webp",
			specs: "天玑 7300 / 5G",
			description: "目前手里在用的备用机。",
			link: "https://www.oppo.com/cn/smartphones/series-a/a5-pro/",
		},
	],
	vivo: [
		{
			name: "vivo iQOO 7",
			image: "/images/device/iqoo7.webp",
			specs: "骁龙888 / 120W闪充",
			description: "曾经的主力手机。",
			link: "https://www.iqoo.com/cn/products/param/iqoo7.html",
		},
		{
			name: "vivo Y71",
			image: "/images/device/vivoy71.webp",
			specs: "自主学习中",
			description: "曾用于尝试解锁BL并刷入模块和降级包。",
			link: "",
		},
	],
	HONOR: [
		{
			name: "HONOR 9 Lite",
			image: "/images/device/honor9lite.webp",
			specs: "已刷入类原生系统",
			description: "已刷入类原生系统，用起来比EMUI较流畅。",
			link: "",
		},
	],
};
