/**
 * Local capture API for the flow map Update buttons.
 * Requires: npm run web (Metro on :8081)
 * Run: npm run flow-map-capture-server
 */
import http from 'http';
import { captureFlowScreens, defaultAppBase, loadScreenList, screenIdsForFlow } from './capture-flow-screen-lib.mjs';
import { loadManifest } from './flow-map-manifest-utils.mjs';

const PORT = Number(process.env.FLOW_MAP_CAPTURE_PORT ?? 9876);

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && req.url === '/manifest') {
    sendJson(res, 200, { ok: true, manifest: loadManifest() });
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { ok: true, appBase: defaultAppBase });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readBody(req);

    if (req.url === '/capture/screens') {
      const screenIds = body.screenIds;
      if (!Array.isArray(screenIds) || !screenIds.length) {
        sendJson(res, 400, { ok: false, error: 'screenIds array required' });
        return;
      }
      const result = await captureFlowScreens({ screenIds });
      const manifest = loadManifest();
      sendJson(res, 200, { ok: true, manifest, ...result });
      return;
    }

    if (req.url === '/capture/flow') {
      const flowId = body.flowId;
      if (!flowId) {
        sendJson(res, 400, { ok: false, error: 'flowId required' });
        return;
      }
      const screenIds = screenIdsForFlow(flowId);
      const result = await captureFlowScreens({ screenIds });
      const manifest = loadManifest();
      sendJson(res, 200, { ok: true, flowId, manifest, ...result });
      return;
    }

    if (req.url === '/capture/all') {
      const screenIds = loadScreenList().map((s) => s.id);
      const result = await captureFlowScreens({ screenIds });
      const manifest = loadManifest();
      sendJson(res, 200, { ok: true, manifest, ...result });
      return;
    }

    sendJson(res, 404, { ok: false, error: 'Not found' });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { ok: false, error: err.message ?? String(err) });
  }
});

server.listen(PORT, () => {
  console.log(`Flow map capture server http://localhost:${PORT}`);
  console.log(`Expecting app at ${defaultAppBase}`);
});
