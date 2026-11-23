export interface AssistantIntent {
  id: string;
  keywords: string[];
  answer: string;
  actionLabel?: string;
  actionHref?: string;
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

export function mountNansSmartAssistant(onClickSound?: (freq?: number) => void): void {
  if (document.getElementById('nans-smart-assistant-root')) return;

  const style = document.createElement('style');
  style.textContent = `
    #nans-smart-assistant-root{position:fixed;right:16px;bottom:66px;z-index:9985;font-family:inherit}
    #nans-ai-fab{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border-radius:999px;border:1px solid rgba(56,189,248,.5);background:linear-gradient(135deg,#0b1324,#13223d);color:#f8fafc;font-size:.78rem;font-weight:800;cursor:pointer;box-shadow:0 10px 26px rgba(2,6,23,.65);transition:transform .2s,border-color .2s}
    #nans-ai-fab:hover{transform:translateY(-2px);border-color:var(--v4-accent,#38bdf8)}
    #nans-ai-fab .ai-dot{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399}
    #nans-ai-panel{position:absolute;right:0;bottom:50px;width:min(350px,calc(100vw - 32px));border-radius:16px;background:#070c17;border:1px solid rgba(56,189,248,.35);box-shadow:0 18px 44px rgba(0,0,0,.78);overflow:hidden;display:none;flex-direction:column}
    #nans-ai-panel.open{display:flex}
    .nans-ai-head{padding:12px 14px;background:linear-gradient(135deg,rgba(56,189,248,.16),rgba(129,140,248,.14));border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center}
    .nans-ai-head strong{font-size:.84rem;color:#f8fafc;display:block}
    .nans-ai-head small{font-size:.69rem;color:#94a3b8}
    #nans-ai-close{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#e2e8f0;width:28px;height:28px;border-radius:8px;cursor:pointer;font-weight:800}
    #nans-ai-messages{padding:12px;max-height:255px;overflow-y:auto;display:flex;flex-direction:column;gap:9px}
    .nans-msg{padding:9px 11px;border-radius:12px;font-size:.77rem;line-height:1.48;max-width:90%}
    .nans-msg.bot{align-self:flex-start;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#e2e8f0}
    .nans-msg.user{align-self:flex-end;background:rgba(56,189,248,.2);border:1px solid rgba(56,189,248,.4);color:#f8fafc;font-weight:600}
    .nans-msg-cta{display:inline-block;margin-top:7px;padding:5px 10px;border-radius:8px;background:rgba(56,189,248,.16);border:1px solid rgba(56,189,248,.45);color:#7dd3fc;text-decoration:none;font-size:.71rem;font-weight:800}
    #nans-ai-chips{padding:0 12px 9px;display:flex;flex-wrap:wrap;gap:6px}
    .nans-chip{padding:5px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#cbd5e1;font-size:.69rem;cursor:pointer}
    .nans-chip:hover{border-color:#38bdf8;color:#f8fafc}
    #nans-ai-form{padding:9px 12px 12px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:7px}
    #nans-ai-input{flex:1;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:#050811;color:#f8fafc;font-size:.77rem;outline:none}
    #nans-ai-input:focus{border-color:#38bdf8}
    #nans-ai-send{padding:8px 12px;border-radius:10px;border:none;background:linear-gradient(135deg,#38bdf8,#818cf8);color:#05070c;font-weight:800;font-size:.76rem;cursor:pointer}
    @media print{#nans-smart-assistant-root{display:none!important}}
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
    <button type="button" id="nans-ai-fab" aria-expanded="false"><span class="ai-dot"></span><span>Tanya AI</span></button>
  `;
  document.body.appendChild(root);

  const fab = document.getElementById('nans-ai-fab') as HTMLButtonElement;
  const panel = document.getElementById('nans-ai-panel') as HTMLElement;
  const closeBtn = document.getElementById('nans-ai-close') as HTMLButtonElement;
  const form = document.getElementById('nans-ai-form') as HTMLFormElement;
  const input = document.getElementById('nans-ai-input') as HTMLInputElement;
  const messages = document.getElementById('nans-ai-messages') as HTMLElement;

  const setOpen = (open: boolean) => {
    panel.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => input.focus(), 40);
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
      else link.addEventListener('click', () => setOpen(false));
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

  fab.addEventListener('click', () => { onClickSound?.(620); setOpen(!panel.classList.contains('open')); });
  closeBtn.addEventListener('click', () => { onClickSound?.(500); setOpen(false); });
  root.querySelectorAll<HTMLButtonElement>('.nans-chip').forEach((c) => c.addEventListener('click', () => askQuestion(c.textContent || '')));
  form.addEventListener('submit', (e) => { e.preventDefault(); askQuestion(input.value); input.value = ''; });
}
