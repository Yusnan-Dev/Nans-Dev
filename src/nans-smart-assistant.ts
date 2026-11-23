export interface AssistantIntent {
  id: string;
  keywords: string[];
  answer: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface DropupMountOptions {
  onClickSound?: (freq?: number) => void;
  onToggleSfx?: () => boolean;
  initialSfxEnabled?: boolean;
}

const INTENTS: AssistantIntent[] = [
  {
    id: 'services',
    keywords: ['layanan', 'jasa', 'bikin apa', 'kategori', 'website', 'web', 'katalog', 'landing', 'company', 'profile', 'aplikasi', 'app'],
    answer: 'Nans Dev ngerjain custom website (landing page, katalog toko online, company profile, direktori bisnis), fitur kalkulator otomatis, sampai desain & rekonstruksi logo vektor HD.',
    actionLabel: 'Lihat Kalkulator Estimasi',
    actionHref: '#estimator',
  },
  {
    id: 'vector',
    keywords: ['vektor', 'vector', 'logo', 'pecah', 'blur', 'svg', 'eps', 'raster', 'cetak', 'baliho', 'spanduk'],
    answer: 'Logo lama yang buram atau pecah bisa ditarik ulang jadi geometri vektor murni yang tajam di segala ukuran (siap cetak spanduk, kemasan, maupun layar Retina) dengan file master siap pakai.',
    actionLabel: 'Uji di Vector Lab',
    actionHref: '#vector-lab',
  },
  {
    id: 'pricing',
    keywords: ['harga', 'biaya', 'tarif', 'berapa', 'estimasi', 'dp', 'bayar', 'pembayaran', 'hari', 'lama', 'durasi', 'pengerjaan'],
    answer: 'Biaya & estimasi hari kerja bisa dihitung langsung lewat kalkulator di bawah (tersedia opsi IDR & USD). Umumnya skema DP 50% di awal dan pelunasan 50% sebelum serah terima final, atau lewat rekening bersama Fastwork.',
    actionLabel: 'Hitung Estimasi Biaya',
    actionHref: '#estimator',
  },
  {
    id: 'order',
    keywords: ['order', 'pesan', 'hubungi', 'kontak', 'wa', 'whatsapp', 'fastwork', 'email', 'gmail', 'yusnan', 'rekening', 'escrow'],
    answer: 'Lu bisa kirim brief langsung ke WhatsApp 0831-8752-1130, order lewat Fastwork (@yusnanyulyakso1) buat transaksi terproteksi, atau kirim detail lewat email yusnanyulyakso29@gmail.com.',
    actionLabel: 'Buka WhatsApp Nans Dev',
    actionHref: 'https://wa.me/6283187521130',
  },
  {
    id: 'proposal',
    keywords: ['cetak', 'penawaran', 'pdf', 'proposal', 'quotation', 'kertas', 'a4', 'salin', 'brief'],
    answer: 'Setelah pilih modul & isi nama brand di kalkulator, lu bisa klik "Cetak Penawaran" buat bikin dokumen A4 1 halaman penuh atau "Salin Brief" buat ditempel ke chat.',
    actionLabel: 'Ke Bagian Penawaran',
    actionHref: '#estimator',
  },
];

const QUICK_PROMPTS = [
  'Bisa bikin web apa aja?',
  'Berapa estimasi biaya & durasinya?',
  'Bisa rekonstruksi logo pecah jadi vektor?',
  'Cara order via Fastwork / WA gimana?',
];

export function matchAssistantReply(rawInput: string): AssistantIntent {
  const q = rawInput.toLowerCase().trim();
  if (!q) {
    return {
      id: 'empty',
      keywords: [],
      answer: 'Ketik pertanyaan lu soal layanan web, vektor logo, estimasi biaya, atau cara order via WA 0831-8752-1130 & Fastwork @yusnanyulyakso1.',
    };
  }
  let best: AssistantIntent | null = null;
  let bestScore = 0;
  for (const item of INTENTS) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) score += kw.length >= 5 ? 3 : 2;
    }
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return best && bestScore > 0 ? best : {
    id: 'fallback',
    keywords: [],
    answer: 'Pertanyaan spesifik kayak gitu paling enak dibahas langsung biar pas sama kebutuhan proyek lu. Hubungi WA 0831-8752-1130, Fastwork @yusnanyulyakso1, atau email yusnanyulyakso29@gmail.com.',
    actionLabel: 'Order via Fastwork (@yusnanyulyakso1)',
    actionHref: 'https://fastwork.id/user/yusnanyulyakso1',
  };
}

export function mountNansSmartAssistant(options?: DropupMountOptions | ((freq?: number) => void)): void {
  if (document.getElementById('nans-smart-assistant-root')) return;

  const opts: DropupMountOptions = typeof options === 'function' ? { onClickSound: options } : (options || {});
  const onClickSound = opts.onClickSound;
  const onToggleSfx = opts.onToggleSfx;
  let sfxOn = Boolean(opts.initialSfxEnabled);

  const style = document.createElement('style');
  style.textContent = `
    #nans-smart-assistant-root{position:fixed;right:14px;bottom:16px;z-index:9985;font-family:inherit;display:flex;flex-direction:column;align-items:flex-end}
    #nans-dropup-menu{display:none;flex-direction:column;gap:8px;margin-bottom:9px;align-items:flex-end}
    #nans-dropup-menu.open{display:flex}
    .nans-up-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 13px;border-radius:999px;border:1px solid rgba(56,189,248,.42);background:rgba(11,19,36,.95);color:#f8fafc;font-size:.75rem;font-weight:800;cursor:pointer;box-shadow:0 8px 22px rgba(2,6,23,.65);white-space:nowrap}
    .nans-up-btn:hover{border-color:var(--v4-accent,#38bdf8)}
    .nans-up-btn .ai-dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 7px #34d399}
    #nans-dropup-toggle{display:inline-flex;align-items:center;gap:6px;padding:9px 13px;border-radius:999px;border:1px solid rgba(56,189,248,.48);background:linear-gradient(135deg,#0b1324,#13223d);color:#f8fafc;font-size:.76rem;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(2,6,23,.65)}
    #nans-dropup-toggle:hover{border-color:var(--v4-accent,#38bdf8)}
    #nans-ai-panel{position:fixed;right:14px;bottom:62px;width:min(346px,calc(100vw - 28px));border-radius:16px;background:#070c17;border:1px solid rgba(56,189,248,.35);box-shadow:0 18px 44px rgba(0,0,0,.78);overflow:hidden;display:none;flex-direction:column;z-index:9990}
    #nans-ai-panel.open{display:flex}
    .nans-ai-head{padding:11px 14px;background:linear-gradient(135deg,rgba(56,189,248,.16),rgba(129,140,248,.14));border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center}
    .nans-ai-head strong{font-size:.82rem;color:#f8fafc;display:block}
    .nans-ai-head small{font-size:.68rem;color:#94a3b8}
    #nans-ai-close{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#e2e8f0;width:27px;height:27px;border-radius:8px;cursor:pointer;font-weight:800}
    #nans-ai-messages{padding:11px;max-height:245px;overflow-y:auto;display:flex;flex-direction:column;gap:8px}
    .nans-msg{padding:8px 11px;border-radius:12px;font-size:.76rem;line-height:1.45;max-width:90%}
    .nans-msg.bot{align-self:flex-start;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#e2e8f0}
    .nans-msg.user{align-self:flex-end;background:rgba(56,189,248,.2);border:1px solid rgba(56,189,248,.4);color:#f8fafc;font-weight:600}
    .nans-msg-cta{display:inline-block;margin-top:6px;padding:5px 9px;border-radius:8px;background:rgba(56,189,248,.16);border:1px solid rgba(56,189,248,.45);color:#7dd3fc;text-decoration:none;font-size:.7rem;font-weight:800}
    #nans-ai-chips{padding:0 11px 8px;display:flex;flex-wrap:wrap;gap:5px}
    .nans-chip{padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#cbd5e1;font-size:.68rem;cursor:pointer}
    .nans-chip:hover{border-color:#38bdf8;color:#f8fafc}
    #nans-ai-form{padding:8px 11px 11px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:6px}
    #nans-ai-input{flex:1;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:#050811;color:#f8fafc;font-size:.76rem;outline:none}
    #nans-ai-input:focus{border-color:#38bdf8}
    #nans-ai-send{padding:8px 11px;border-radius:10px;border:none;background:linear-gradient(135deg,#38bdf8,#818cf8);color:#05070c;font-weight:800;font-size:.75rem;cursor:pointer}
    @media print{#nans-smart-assistant-root,#nans-ai-panel{display:none!important}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'nans-smart-assistant-root';
  root.innerHTML = `
    <div id="nans-ai-panel" role="dialog" aria-label="Nans Dev Smart Assistant">
      <div class="nans-ai-head">
        <div><strong>Nans Dev Smart Q&amp;A</strong><small>Local Knowledge Engine · Zero Limit</small></div>
        <button type="button" id="nans-ai-close" aria-label="Tutup Chat">✕</button>
      </div>
      <div id="nans-ai-messages">
        <div class="nans-msg bot">Halo! Ada yang mau lu tanyain soal layanan web, rekonstruksi vektor logo, estimasi biaya, atau cara order via WA &amp; Fastwork?</div>
      </div>
      <div id="nans-ai-chips">${QUICK_PROMPTS.map((q) => `<button type="button" class="nans-chip">${q}</button>`).join('')}</div>
      <form id="nans-ai-form">
        <input type="text" id="nans-ai-input" placeholder="Tanya soal web, vektor, harga, atau order..." autocomplete="off" />
        <button type="submit" id="nans-ai-send">Kirim</button>
      </form>
    </div>
    <div id="nans-dropup-menu" role="menu">
      <button type="button" class="nans-up-btn" id="nans-up-ai-btn"><span class="ai-dot"></span><span>Tanya AI</span></button>
      <button type="button" class="nans-up-btn" id="nans-up-sfx-btn"><span id="nans-up-sfx-text">${sfxOn ? '🔊 SFX ON' : '🔇 SFX OFF'}</span></button>
    </div>
    <button type="button" id="nans-dropup-toggle" aria-expanded="false"><span>Menu ▲</span></button>
  `;
  document.body.appendChild(root);

  const toggleBtn = document.getElementById('nans-dropup-toggle') as HTMLButtonElement;
  const dropupMenu = document.getElementById('nans-dropup-menu') as HTMLElement;
  const aiBtn = document.getElementById('nans-up-ai-btn') as HTMLButtonElement;
  const sfxBtn = document.getElementById('nans-up-sfx-btn') as HTMLButtonElement;
  const sfxText = document.getElementById('nans-up-sfx-text') as HTMLElement;
  const panel = document.getElementById('nans-ai-panel') as HTMLElement;
  const closeBtn = document.getElementById('nans-ai-close') as HTMLButtonElement;
  const form = document.getElementById('nans-ai-form') as HTMLFormElement;
  const input = document.getElementById('nans-ai-input') as HTMLInputElement;
  const messages = document.getElementById('nans-ai-messages') as HTMLElement;

  const setMenuOpen = (open: boolean) => {
    dropupMenu.classList.toggle('open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.innerHTML = open ? '<span>Menu ▼</span>' : '<span>Menu ▲</span>';
  };

  const setChatOpen = (open: boolean) => {
    panel.classList.toggle('open', open);
    if (open) {
      setMenuOpen(false);
      setTimeout(() => input.focus(), 40);
    }
  };

  const syncSfxLabel = (enabled: boolean) => {
    sfxOn = enabled;
    sfxText.textContent = enabled ? '🔊 SFX ON' : '🔇 SFX OFF';
  };

  const appendMsg = (text: string, sender: 'user' | 'bot', ctaLabel?: string, ctaHref?: string) => {
    const bubble = document.createElement('div');
    bubble.className = `nans-msg ${sender}`;
    bubble.textContent = text;
    if (sender === 'bot' && ctaLabel && ctaHref) {
      const link = document.createElement('a');
      link.className = 'nans-msg-cta';
      link.href = ctaHref;
      link.textContent = ctaLabel;
      if (ctaHref.startsWith('http')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else link.addEventListener('click', () => setChatOpen(false));
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(link);
    }
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const askQuestion = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    onClickSound?.(640);
    appendMsg(clean, 'user');
    const reply = matchAssistantReply(clean);
    setTimeout(() => {
      onClickSound?.(740);
      appendMsg(reply.answer, 'bot', reply.actionLabel, reply.actionHref);
    }, 180);
  };

  toggleBtn.addEventListener('click', () => {
    onClickSound?.(600);
    setMenuOpen(!dropupMenu.classList.contains('open'));
  });

  aiBtn.addEventListener('click', () => {
    onClickSound?.(650);
    setChatOpen(!panel.classList.contains('open'));
  });

  sfxBtn.addEventListener('click', () => {
    if (onToggleSfx) {
      syncSfxLabel(onToggleSfx());
    } else {
      const legacyBtn = document.getElementById('audio-toggle') as HTMLButtonElement | null;
      legacyBtn?.click();
      const active = legacyBtn?.classList.contains('active') ?? !sfxOn;
      syncSfxLabel(active);
    }
  });

  closeBtn.addEventListener('click', () => { onClickSound?.(500); setChatOpen(false); });
  root.querySelectorAll<HTMLButtonElement>('.nans-chip').forEach((c) => c.addEventListener('click', () => askQuestion(c.textContent || '')));
  form.addEventListener('submit', (e) => { e.preventDefault(); askQuestion(input.value); input.value = ''; });
}
