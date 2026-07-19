const titles = {
	"xian-ni": { cid: "mzc00200aaogpgh", vid: "r0047gdjpw6", rating: 9.4, description: "王林在逆境中求道、求真，走出自己的修行之路。", episodes: "连载中", progress: 1, totalEpisodes: 1, status: "watching" },
	"douluo-dalu": { cid: "mzc00200xf3rir6", vid: "i0046sewh4r", rating: 8.8, description: "唐三从魂师学院出发，与伙伴共同成长的热血冒险。", episodes: "全 263 集", progress: 263, totalEpisodes: 263, status: "completed" },
	"doupo-cangqiong": { cid: "mzc0020027yzd9e", vid: "q0043cz9x20", rating: 8.7, description: "少年萧炎重拾斗气，在历练与战斗中寻找属于自己的答案。", episodes: "连载中", progress: 1, totalEpisodes: 1, status: "watching" },
};

function respond(response, status, body) {
	if (typeof response.status === "function") return response.status(status).json(body);
	response.statusCode = status;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
	const id = new URL(request.url, "http://localhost").searchParams.get("id");
	const fallback = titles[id];
	if (!fallback) return respond(response, 400, { error: "Unsupported anime source" });
	let { rating, description, episodes, progress, totalEpisodes, status } = fallback;
	try {
		const url = `https://m.v.qq.com/x/m/play?cid=${fallback.cid}&vid=${fallback.vid}`;
		const upstream = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; LeviBlogMetadata/1.0)" }, signal: AbortSignal.timeout(5000) });
		const html = upstream.ok ? await upstream.text() : "";
		const score = html.match(/评分\s*([0-9]+(?:\.[0-9]+)?)/);
		const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
		const detail = html.match(/"detail_info":"([^"]*)"/)?.[1].replaceAll("\\u003C", "<").replaceAll("\\u003E", ">").replaceAll("\\u002F", "/") || "";
		const completed = detail.match(/全\s*(\d+)\s*集/) || html.match(/"episode_all":"(\d+)"/);
		const updated = detail.match(/(?:更新至|更新到)\s*(\d+)\s*集/) || html.match(/(?:更新至|更新到)\s*(\d+)\s*集/);
		if (score) rating = Number(score[1]);
		if (meta) description = meta[1].replaceAll("&quot;", '"').replaceAll("&amp;", "&").trim();
		if (completed) totalEpisodes = Number(completed[1]);
		if (updated) { progress = Number(updated[1]); episodes = `更新至 ${progress} 集 · 全 ${totalEpisodes} 集`; status = "watching"; }
		else if (completed) { progress = totalEpisodes; episodes = `全 ${totalEpisodes} 集`; status = "completed"; }
	} catch {
		// Use the curated fallback when Tencent Video is unavailable.
	}
	response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=900");
	return respond(response, 200, { rating, description, episodes, progress, totalEpisodes, status });
}
