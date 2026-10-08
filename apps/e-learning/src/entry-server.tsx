import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { renderToString } from 'react-dom/server';
import type { Readable } from 'node:stream';
import App from './App';

export async function render(): Promise<string> {
  const application = <App />;
  let renderingError: unknown;
  const result = await prerenderToNodeStream(application, {
    onError(error) { renderingError = error; },
  });
  if (renderingError) throw renderingError;

  const prelude = result.prelude as Readable;
  for await (const _chunk of prelude) { /* drain */ }
  return renderToString(application);
}
