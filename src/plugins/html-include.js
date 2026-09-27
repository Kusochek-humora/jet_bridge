import fs from 'node:fs';
import path from 'node:path';

// <include src="src/components/header/header.html"></include>
// Путь относительно корня проекта. Вложенные include поддерживаются.
const INCLUDE_RE = /<include\s+src=["']([^"']+)["']\s*(?:\/>|>\s*<\/include>)/g;

function render(html, root, stack = []) {
  return html.replace(INCLUDE_RE, (_, src) => {
    const file = path.resolve(root, src);

    if (stack.includes(file)) {
      throw new Error(`[html-include] circular include: ${[...stack, file].join(' -> ')}`);
    }
    if (!fs.existsSync(file)) {
      throw new Error(`[html-include] file not found: ${src}`);
    }

    return render(fs.readFileSync(file, 'utf-8'), root, [...stack, file]);
  });
}

export default function htmlInclude() {
  let root;

  return {
    name: 'html-include',
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => render(html, root),
    },
    configureServer(server) {
      // при правке html-партиала перезагружаем страницу
      server.watcher.on('change', (file) => {
        if (file.endsWith('.html')) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
