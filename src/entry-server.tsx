import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import type { Readable } from 'node:stream';
import App, { type AppInitialData } from './App';

export async function render(url: string, initialData?: AppInitialData): Promise<string> {
  const application = (
    <StaticRouter location={url}>
      <App initialData={initialData} />
    </StaticRouter>
  );
  let renderingError: unknown;
  const result = await prerenderToNodeStream(application, { onError(error) { renderingError = error; } });
  if (renderingError) throw renderingError;

  // Drain the static prelude so every lazy route module is resolved, then create
  // one contiguous HTML fragment. This avoids React's streamed Suspense patch
  // scripts and keeps all indexable content inside its semantic <main> element.
  const prelude = result.prelude as Readable;
  for await (const _chunk of prelude) { /* drain */ }
  return renderToString(application);
}
