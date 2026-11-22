export interface StackSpec {
  lang: string;
  role: string;
  accent: string;
}

export function createDomNode(tag: string, props: Record<string, any> | null, ...children: any[]): HTMLElement {
  const el = document.createElement(tag);
  if (props) {
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'className') el.className = v;
      else if (k === 'style' && typeof v === 'string') el.setAttribute('style', v);
      else el.setAttribute(k, String(v));
    });
  }
  children.flat().forEach((c) => {
    if (c == null) return;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return el;
}

export function renderPolyglotStrip(container: HTMLElement): void {
  const stacks: StackSpec[] = [
    { lang: 'TypeScript + TSX', role: 'UI & WebGL2', accent: '#38bdf8' },
    { lang: 'Rust -> WASM', role: 'Benchmark Core', accent: '#f97316' },
    { lang: 'Go (Golang)', role: 'Edge Telemetry', accent: '#22d3ee' },
    { lang: 'Python 3.11', role: 'Data & SEO Ops', accent: '#34d399' },
    { lang: 'SCSS', role: 'Design System', accent: '#f472b6' },
  ];

  const strip = createDomNode(
    'div',
    {
      className: 'polyglot-strip',
      style: 'display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;align-items:center;',
    },
    ...stacks.map((s) =>
      createDomNode(
        'span',
        {
          style: `display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;background:rgba(15,23,42,0.85);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;`,
        },
        createDomNode('span', {
          style: `width:7px;height:7px;border-radius:50%;background:${s.accent};display:inline-block;`,
        }),
        `${s.lang} · ${s.role}`
      )
    )
  );

  container.appendChild(strip);
}
