'use strict';

const common = require('../common.js');
const path = require('path');
const fs = require('fs');
const file = path.join(path.resolve(__dirname, '../fixtures'), 'alice.html');

const bench = common.createBenchmark(main, {
  requests: [100, 1000, 5000],
  streams: [1, 10, 20, 40, 100, 200],
  clients: [2],
  benchmarker: ['h2load']
}, { flags: ['--no-warnings', '--expose-http2'] });

function main({ requests, streams, clients }) {
  const http2 = require('http2');
  const server = http2.createServer();
  server.on('stream', (stream) => {
    const out = fs.createReadStream(file);
    stream.respond();
    out.pipe(stream);
    stream.on('error', (err) => {});
  });
  server.listen(common.PORT, () => {
    bench.http({
      path: '/',
      requests,
      maxConcurrentStreams: streams,
      clients,
      threads: clients
    }, () => { server.close(); });
  });
}
