const ALLOWED_ORIGINS = new Set(['http://localhost:3000', 'https://finspend.app']);

function json(data: unknown, status = 200, origin?: string): Response {
	const headers = new Headers({
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-store',
		Vary: 'Origin',
	});

	if (origin && ALLOWED_ORIGINS.has(origin)) {
		headers.set('Access-Control-Allow-Origin', origin);
		headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	}

	return new Response(JSON.stringify(data), { status, headers });
}

export default {
	async fetch(request, _env, _ctx): Promise<Response> {
		const origin = request.headers.get('Origin') ?? undefined;
		const url = new URL(request.url);

		if (origin && !ALLOWED_ORIGINS.has(origin)) {
			return json({ error: 'Origin not allowed' }, 403);
		}

		if (request.method === 'OPTIONS') {
			if (origin && !ALLOWED_ORIGINS.has(origin)) {
				return json({ error: 'Origin not allowed' }, 403);
			}

			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': origin ?? '',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					'Access-Control-Max-Age': '86400',
					Vary: 'Origin',
				},
			});
		}

		if (request.method === 'GET' && url.pathname === '/api/health') {
			return json(
				{
					status: 'ok',
					service: 'finspend-api',
					timestamp: new Date().toISOString(),
				},
				200,
				origin,
			);
		}

		return json({ error: 'Not found' }, 404, origin);
	},
} satisfies ExportedHandler<Env>;
