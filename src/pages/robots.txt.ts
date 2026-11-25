import type { APIRoute } from "astro";

import { siteConfig } from "../config";

const featureDisallowRules: [boolean, string][] = [
	[!siteConfig.featurePages.anime, "Disallow: /anime/"],
	[!siteConfig.featurePages.diary, "Disallow: /diary/"],
	[!siteConfig.featurePages.friends, "Disallow: /friends/"],
	[!siteConfig.featurePages.projects, "Disallow: /projects/"],
	[!siteConfig.featurePages.skills, "Disallow: /skills/"],
	[!siteConfig.featurePages.timeline, "Disallow: /timeline/"],
	[!siteConfig.featurePages.albums, "Disallow: /albums/"],
	[!siteConfig.featurePages.devices, "Disallow: /devices/"],
	[!siteConfig.featurePages.aiTools, "Disallow: /ai-tools/"],
];

const disabledDisallows = featureDisallowRules
	.filter(([isDisabled]) => isDisabled)
	.map(([, rule]) => rule)
	.join("\n");

const robotsTxt = `
User-agent: *
Allow: /
Disallow: /api/
${disabledDisallows}

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
