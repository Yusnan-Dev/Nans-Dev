(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  const fixStyle = document.createElement('style');
  fixStyle.textContent = `
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
    }
    #nans-addon-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      padding-top: 10px;
      margin-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    html[data-theme="light"] #nans-addon-controls {
      border-top-color: rgba(15, 23, 42, 0.1);
    }
    #nans-lang-switcher {
      width: 100%;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid rgba(56, 189, 248, 0.35);
      background: #0b1324;
      color: #f8fafc;
      font-weight: 600;
      font-size: 13.5px;
      cursor: pointer;
      outline: none;
    }
    html[data-theme="light"] #nans-lang-switcher {
      background: #f8fafc;
      color: #0f172a;
      border-color: rgba(15, 23, 42, 0.16);
    }
    #nans-install-btn {
      width: 100%;
      align-items: center;
      justify-content: center;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      font-weight: 700;
      font-size: 13.5px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(fixStyle);

  const svgIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;flex-shrink:0;"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';

  let deferredPrompt: any = null;
  const installItem = document.createElement('button');
  installItem.id = 'nans-install-btn';
  installItem.type = 'button';
  installItem.innerHTML = `${svgIcon}Install App`;
  installItem.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installItem.style.display = 'inline-flex';
  });

  installItem.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') installItem.style.display = 'none';
    deferredPrompt = null;
  });

  const instantDict: Record<string, Record<string, string>> = {
    en: {
      'Menu Cepat': 'Quick Menu', 'Arsitektur': 'Architecture', 'Portofolio': 'Portfolio',
      'AI Scope & Estimasi': 'AI Scope & Estimator',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Project Slots Available This Week',
      'Membangun Sistem Web & Identitas Visual Standar Korporat.': 'Engineering Corporate-Standard Web Systems & Visual Identity.',
      'Rakit Proyek Anda': 'Build Your Project', 'Eksplorasi Demo ↗': 'Explore Demos ↗',
      'Infrastruktur Layanan Digital': 'Digital Service Infrastructure',
      'Arsitektur Pipeline & Audit Performa Live': 'Pipeline Architecture & Live Performance Audit',
      'Portofolio & Arsitektur Live': 'Live Portfolio & Architecture', 'Semua Sistem': 'All Systems'
    },
    ja: {
      'Menu Cepat': 'クイックメニュー', 'Arsitektur': 'アーキテクチャ', 'Portofolio': 'ポートフォリオ',
      'AI Scope & Estimasi': 'AI見積もり・要件定義',
      '2 Slot Proyek Tersedia Minggu Ini': '今週対応可能なプロジェクト枠：残り2件',
      'Membangun Sistem Web & Identitas Visual Standar Korporat.': '法人基準のWebシステムとビジュアルアイデンティティの構築。',
      'Rakit Proyek Anda': 'プロジェクトを相談する', 'Eksplorasi Demo ↗': 'デモを見る ↗',
      'Infrastruktur Layanan Digital': 'デジタルサービス基盤',
      'Arsitektur Pipeline & Audit Performa Live': 'パイプライン設計とリアルタイム性能監査',
      'Portofolio & Arsitektur Live': '実績とライブシステム', 'Semua Sistem': 'すべて表示'
    },
    ar: {
      'Menu Cepat': 'القائمة السريعة', 'Arsitektur': 'الهندسة البرمجية', 'Portofolio': 'أعمالنا',
      'AI Scope & Estimasi': 'تقدير التكلفة بالذكاء الاصطناعي',
      '2 Slot Proyek Tersedia Minggu Ini': 'متاح مكانان لمشاريع جديدة هذا الأسبوع',
      'Membangun Sistem Web & Identitas Visual Standar Korporat.': 'بناء أنظمة الويب والهوية البصرية بمعايير الشركات.',
      'Rakit Proyek Anda': 'ابدأ مشروعك الآن', 'Eksplorasi Demo ↗': 'استكشف العروض ↗',
      'Infrastruktur Layanan Digital': 'البنية التحتية للخدمات الرقمية',
      'Arsitektur Pipeline & Audit Performa Live': 'هندسة النظام وتدقيق الأداء المباشر',
      'Portofolio & Arsitektur Live': 'معرض الأعمال والأنظمة الحية', 'Semua Sistem': 'جميع الأنظمة'
    },
    fr: {
      'Menu Cepat': 'Menu Rapide', 'Arsitektur': 'Architecture', 'Portofolio': 'Portfolio',
      'AI Scope & Estimasi': 'Estimation & Scope IA',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Créneaux Projets Disponibles Cette Semaine',
      'Membangun Sistem Web & Identitas Visual Standar Korporat.': 'Architecture Web & Identité Visuelle aux Standards Corporate.',
      'Rakit Proyek Anda': 'Lancer Votre Projet', 'Eksplorasi Demo ↗': 'Explorer les Démos ↗',
      'Infrastruktur Layanan Digital': 'Infrastructure des Services Numériques',
      'Arsitektur Pipeline & Audit Performa Live': 'Architecture Pipeline & Audit de Performance',
      'Portofolio & Arsitektur Live': 'Portfolio & Déploiements Live', 'Semua Sistem': 'Tous les Systèmes'
    },
    es: {
      'Menu Cepat': 'Menú Rápido', 'Arsitektur': 'Arquitectura', 'Portofolio': 'Portafolio',
      'AI Scope & Estimasi': 'Alcance y Cotizador IA',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Cupos de Proyecto Disponibles Esta Semana',
      'Membangun Sistem Web & Identitas Visual Standar Korporat.': 'Construyendo Sistemas Web e Identidad Visual Corporativa.',
      'Rakit Proyek Anda': 'Armar Tu Proyecto', 'Eksplorasi Demo ↗': 'Explorar Demos ↗',
      'Infrastruktur Layanan Digital': 'Infraestructura de Servicios Digitales',
      'Arsitektur Pipeline & Audit Performa Live': 'Arquitectura Pipeline y Auditoría en Vivo',
      'Portofolio & Arsitektur Live': 'Portafolio y Despliegues en Vivo', 'Semua Sistem': 'Todos los Sistemas'
    }
  };

  const trCache: Record<string, string> = JSON.parse(localStorage.getItem('nans_tr_cache') || '{}');
  let saveTimer: any = null;
  const saveCache = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem('nans_tr_cache', JSON.stringify(trCache)); } catch {}
    }, 500);
  };

  const translateText = async (text: string, target: string): Promise<string> => {
    const key = `${target}:${text}`;
    if (trCache[key]) return trCache[key];
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      const out = (data?.[0] || []).map((item: any) => item?.[0] || '').join('').trim();
      if (out) {
        trCache[key] = out;
        saveCache();
        return out;
      }
    } catch {}
    return text;
  };

  const langBox = document.createElement('select');
  langBox.id = 'nans-lang-switcher';
  langBox.setAttribute('aria-label', 'Pilih Bahasa');

  [
    ['id', '🌐 🇮🇩 ID'],
    ['en', '🌐 🇺🇸 EN'],
    ['ja', '🌐 🇯🇵 JP'],
    ['ar', '🌐 🇸🇦 AR'],
    ['fr', '🌐 🇫🇷 FR'],
    ['es', '🌐 🇪🇸 ES']
  ].forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    langBox.appendChild(opt);
  });

  const applyFullPageLang = async (code: string) => {
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    const fastMap = instantDict[code] || {};
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: { node: Text; orig: string }[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) {
      const parent = current.parentElement;
      if (!parent || langBox.contains(parent) || installItem.contains(parent)) continue;
      if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT'].includes(parent.tagName)) continue;
      const clean = (current.nodeValue || '').replace(/\s+/g, ' ').trim();
      if (!clean || clean.length < 3 || /^[\d\s.%+\-/•⌘K()]+$/.test(clean)) continue;
      if (/^(NANS|DEV|Install App|HTML5|CSS3|JavaScript|TypeScript|WebGL2|SCSS|SVG|PWA|SEO|99\.9%|100\/100)$/i.test(clean)) continue;
      nodes.push({ node: current as Text, orig: clean });
    }

    const pending: { node: Text; orig: string }[] = [];
    for (const item of nodes) {
      if (fastMap[item.orig]) {
        item.node.nodeValue = fastMap[item.orig];
      } else if (trCache[`${code}:${item.orig}`]) {
        item.node.nodeValue = trCache[`${code}:${item.orig}`];
      } else {
        pending.push(item);
      }
    }

    for (let i = 0; i < pending.length; i += 8) {
      if ((localStorage.getItem('nans_selected_lang') || 'id') !== code) break;
      const chunk = pending.slice(i, i + 8);
      await Promise.all(
        chunk.map(async ({ node, orig }) => {
          const translated = await translateText(orig, code);
          if ((localStorage.getItem('nans_selected_lang') || 'id') === code) {
            node.nodeValue = translated;
          }
        })
      );
    }
    installItem.innerHTML = `${svgIcon}Install App`;
  };

  ['click', 'touchstart', 'mousedown'].forEach((evt) =>
    langBox.addEventListener(evt, (e) => e.stopPropagation())
  );

  langBox.addEventListener('change', (e) => {
    e.stopPropagation();
    const chosen = langBox.value;
    localStorage.setItem('nans_selected_lang', chosen);
    if (chosen === 'id') {
      window.location.reload();
      return;
    }
    applyFullPageLang(chosen);
  });

  const mountInsideHamburger = () => {
    const navContainer = document.getElementById('nav-links') || document.querySelector('.nav-links, header nav');
    if (navContainer && !navContainer.contains(langBox)) {
      const wrapper = document.createElement('div');
      wrapper.id = 'nans-addon-controls';
      wrapper.appendChild(langBox);
      wrapper.appendChild(installItem);
      navContainer.appendChild(wrapper);
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    mountInsideHamburger();
    const saved = localStorage.getItem('nans_selected_lang') || 'id';
    langBox.value = saved;
    if (saved !== 'id') setTimeout(() => applyFullPageLang(saved), 650);
  });
})();
