import path from 'path';
import { fileURLToPath } from 'url';
import type {
  ModoScaffoldManifest,
  ModoScaffoldSourceRoots,
} from './types.js';

const DEFAULT_BUNDLED_ASSET_ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'bundled-assets',
  'modo-scaffold'
);

const MODO_THEME_REGISTRY_CONTENT = `'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { modoThemeToken } from '@/theme/antd-theme-token';
import { modoAlgorithm } from '@/theme/modo-algorithm';

dayjs.locale('zh-cn');

export default function ModoThemeRegistry({ children }: React.PropsWithChildren) {
  const cache = React.useMemo<Entity>(() => createCache(), []);

  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider locale={zhCN} theme={{ ...modoThemeToken, algorithm: modoAlgorithm }}>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
`;

const APP_LAYOUT_CONTENT = `import type { Metadata } from 'next';
import { App as AntdApp } from 'antd';
import ModoThemeRegistry from '@/components/ModoThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'MODO Scaffold',
  description: 'OpenSpec generated MODO scaffold',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <ModoThemeRegistry>
          <AntdApp>{children}</AntdApp>
        </ModoThemeRegistry>
      </body>
    </html>
  );
}
`;

const APP_PAGE_CONTENT = `export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>MODO Scaffold</h1>
      <p>项目已初始化完成，可在此基础上继续实现业务页面。</p>
    </main>
  );
}
`;

export function resolveModoScaffoldSourceRoots(
  overrides: Partial<ModoScaffoldSourceRoots> = {}
): ModoScaffoldSourceRoots {
  return {
    bundledRoot: overrides.bundledRoot
      ?? process.env.OPENSPEC_MODO_SCAFFOLD_ASSET_ROOT
      ?? DEFAULT_BUNDLED_ASSET_ROOT,
  };
}

export function getDefaultModoScaffoldManifest(): ModoScaffoldManifest {
  return {
    copyItems: [
      { source: 'bundled', kind: 'file', from: 'package.json', to: 'package.json', required: true },
      { source: 'bundled', kind: 'file', from: '.b-end-adapter', to: '.b-end-adapter', required: true },
      { source: 'bundled', kind: 'file', from: 'next.config.ts', to: 'next.config.ts', required: true },
      { source: 'bundled', kind: 'file', from: 'tsconfig.json', to: 'tsconfig.json', required: true },
      { source: 'bundled', kind: 'file', from: 'postcss.config.mjs', to: 'postcss.config.mjs', required: true },
      { source: 'bundled', kind: 'file', from: 'components.json', to: 'components.json', required: false },
      { source: 'bundled', kind: 'file', from: 'bunfig.toml', to: 'bunfig.toml', required: false },
      { source: 'bundled', kind: 'file', from: 'turbo.json', to: 'turbo.json', required: false },
      { source: 'bundled', kind: 'directory', from: 'public', to: 'public', required: false },
      { source: 'bundled', kind: 'directory', from: 'src/theme', to: 'src/theme', required: true },
      { source: 'bundled', kind: 'file', from: 'src/app/globals.css', to: 'src/app/globals.css', required: true },
      { source: 'bundled', kind: 'directory', from: 'src/components/templates', to: 'src/components/templates', required: true },
      { source: 'bundled', kind: 'directory', from: 'src/components/biz', to: 'src/components/biz', required: true },
      { source: 'bundled', kind: 'directory', from: 'openspec/b-end', to: 'openspec/b-end', required: true },
    ],
    generatedFiles: [
      { to: 'src/components/ModoThemeRegistry.tsx', content: MODO_THEME_REGISTRY_CONTENT },
      { to: 'src/app/layout.tsx', content: APP_LAYOUT_CONTENT },
      { to: 'src/app/page.tsx', content: APP_PAGE_CONTENT },
    ],
    emptyDirs: [
      'src/app/actions',
      'src/app/api',
      'src/app/(auth)/login',
      'src/app/(main)/dashboard',
      'src/db',
      'src/lib',
      'src/test',
      'src/types',
    ],
    exclusions: {
      exactPaths: [
        'src/db/schema.ts',
        'src/proxy.ts',
      ],
      pathPrefixes: [
        '.git/',
        'drizzle/',
        'src/app/actions/',
        'src/lib/auth/',
        'src/components/icons/',
        'src/assets/icons/',
      ],
      fileNames: ['.DS_Store'],
    },
  };
}
