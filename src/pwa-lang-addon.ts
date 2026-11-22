(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  let deferredPrompt: any = null;
  const installItem = document.createElement('button');
  installItem.type = 'button';
  installItem.textContent = '📲 Install App (APK)';
  Object.assign(installItem.style, {
    display: 'none', width: '100%', textAlign: 'left', padding: '10px 14px',
    marginTop: '8px', borderRadius: '10px', border: '1px solid #38bdf8',
    background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer'
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installItem.style.display = 'block';
  });

  installItem.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') installItem.style.display = 'none';
    deferredPrompt = null;
  });

  // Kamus Lengkap Seluruh Halaman (Header, Hero, Cards, Pipeline, Portofolio, Estimator)
  const dict: Record<string, Record<string, string>> = {
    en: {
      'Menu Cepat': 'Quick Menu',
      'Arsitektur': 'Architecture',
      'Portofolio': 'Portfolio',
      'AI Scope & Estimasi': 'AI Scope & Estimator',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Project Slots Available This Week',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'High-performance custom web engineering, modern UI architecture, and precision vector asset reconstruction to accelerate your digital business.',
      'Rakit Proyek Anda': 'Build Your Project',
      'Eksplorasi Demo ↗': 'Explore Demos ↗',
      'Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.':
        'Corporate company profiles, E-Commerce, and Learning Management Systems (LMS) engineered with clean, ultra-fast architecture.',
      'Konversi logo pecah menjadi vektor tajam (SVG/EPS/AI) serta perancangan sistem identitas visual brand berstandar industri.':
        'Crisp raster-to-vector logo conversion (SVG/EPS/AI) and industry-standard brand visual identity systems.',
      'Perancangan sistem desain antarmuka web maupun mobile beserta aset visual berkarakter untuk meningkatkan daya jual produk.':
        'Web and mobile UI design systems paired with distinctive visual assets engineered to boost product conversion.',
      'Arsitektur Pipeline & Audit Performa Live': 'Pipeline Architecture & Live Performance Audit',
      'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.':
        'Modern Mobile-First responsive UI design crafted with razor-sharp vector assets and lightweight 3D WebGL accents.',
      'Portofolio & Arsitektur Live': 'Live Portfolio & Architecture',
      'Semua Sistem': 'All Systems'
    },
    ja: {
      'Menu Cepat': 'クイックメニュー',
      'Arsitektur': 'アーキテクチャ',
      'Portofolio': 'ポートフォリオ',
      'AI Scope & Estimasi': 'AI見積もり・要件定義',
      '2 Slot Proyek Tersedia Minggu Ini': '今週対応可能なプロジェクト枠：残り2件',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        '高性能カスタムWeb開発、モダンUI設計、精密ベクター資産の再構築でデジタルビジネスを加速します。',
      'Rakit Proyek Anda': 'プロジェクトを相談する',
      'Eksplorasi Demo ↗': 'デモを見る ↗',
      'Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.':
        '企業サイト、ECサイト、学習管理システム（LMS）を高速かつクリーンな設計で開発します。',
      'Konversi logo pecah menjadi vektor tajam (SVG/EPS/AI) serta perancangan sistem identitas visual brand berstandar industri.':
        '粗いロゴの高精細ベクター化（SVG/EPS/AI）および業界標準のブランドビジュアル設計。',
      'Perancangan sistem desain antarmuka web maupun mobile beserta aset visual berkarakter untuk meningkatkan daya jual produk.':
        '商品の訴求力を高めるWeb・モバイルUIデザインシステムと独自ビジュアル資産の構築。',
      'Arsitektur Pipeline & Audit Performa Live': 'パイプライン設計とリアルタイム性能監査',
      'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.':
        '鮮明なベクター素材と軽量3D WebGLを備えたモバイルファーストの最新UI設計。',
      'Portofolio & Arsitektur Live': '実績とライブシステム',
      'Semua Sistem': 'すべて表示'
    },
    ar: {
      'Menu Cepat': 'القائمة السريعة',
      'Arsitektur': 'الهندسة البرمجية',
      'Portofolio': 'أعمالنا',
      'AI Scope & Estimasi': 'تقدير التكلفة بالذكاء الاصطناعي',
      '2 Slot Proyek Tersedia Minggu Ini': 'متاح مكانان لمشاريع جديدة هذا الأسبوع',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'هندسة مواقع مخصصة عالية الأداء، تصميم واجهات عصرية، وإعادة بناء الشعارات الفيكتور بدقة لتسريع أعمالك الرقمية.',
      'Rakit Proyek Anda': 'ابدأ مشروعك الآن',
      'Eksplorasi Demo ↗': 'استكشف العروض ↗',
      'Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.':
        'تطوير مواقع الشركات والمتاجر الإلكترونية وأنظمة إدارة التعلم ببنية برمجية نظيفة وفائقة السرعة.',
      'Konversi logo pecah menjadi vektor tajam (SVG/EPS/AI) serta perancangan sistem identitas visual brand berstandar industri.':
        'تحويل الشعارات منخفضة الدقة إلى فيكتور احترافي (SVG/EPS/AI) وتصميم الهوية البصرية المتكاملة.',
      'Perancangan sistem desain antarmuka web maupun mobile beserta aset visual berkarakter untuk meningkatkan daya jual produk.':
        'تصميم واجهات الويب والجوال مع أصول بصرية مميزة لزيادة جاذبية ومبيعات منتجك.',
      'Arsitektur Pipeline & Audit Performa Live': 'هندسة النظام وتدقيق الأداء المباشر',
      'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.':
        'تصميم واجهات متجاوبة للهواتف أولاً بأصول فيكتور حادة وتأثيرات ثلاثية الأبعاد خفيفة.',
      'Portofolio & Arsitektur Live': 'معرض الأعمال والأنظمة الحية',
      'Semua Sistem': 'جميع الأنظمة'
    },
    fr: {
      'Menu Cepat': 'Menu Rapide',
      'Arsitektur': 'Architecture',
      'Portofolio': 'Portfolio',
      'AI Scope & Estimasi': 'Estimation & Scope IA',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Créneaux Projets Disponibles Cette Semaine',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'Ingénierie web sur mesure haute performance, design UI moderne et reconstruction vectorielle de précision pour accélérer votre activité.',
      'Rakit Proyek Anda': 'Lancer Votre Projet',
      'Eksplorasi Demo ↗': 'Explorer les Démos ↗',
      'Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.':
        'Développement de sites vitrines, E-Commerce et plateformes LMS avec une architecture rapide et épurée.',
      'Konversi logo pecah menjadi vektor tajam (SVG/EPS/AI) serta perancangan sistem identitas visual brand berstandar industri.':
        'Vectorisation haute précision de logos (SVG/EPS/AI) et création d’identités visuelles professionnelles.',
      'Perancangan sistem desain antarmuka web maupun mobile beserta aset visual berkarakter untuk meningkatkan daya jual produk.':
        'Conception d’interfaces web et mobiles avec des actifs visuels distinctifs pour maximiser l’impact commercial.',
      'Arsitektur Pipeline & Audit Performa Live': 'Architecture Pipeline & Audit de Performance',
      'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.':
        'Conception d’interfaces modernes Mobile-First avec des actifs vectoriels nets et des accents 3D WebGL légers.',
      'Portofolio & Arsitektur Live': 'Portfolio & Architecture Live',
      'Semua Sistem': 'Tous les Systèmes'
    },
    es: {
      'Menu Cepat': 'Menú Rápido',
      'Arsitektur': 'Arquitectura',
      'Portofolio': 'Portafolio',
      'AI Scope & Estimasi': 'Alcance y Cotizador IA',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Cupos de Proyecto Disponibles Esta Semana',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'Ingeniería web personalizada de alto rendimiento, diseño UI moderno y reconstrucción vectorial de precisión para impulsar tu negocio.',
      'Rakit Proyek Anda': 'Armar Tu Proyecto',
      'Eksplorasi Demo ↗': 'Explorar Demos ↗',
      'Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.':
        'Desarrollo de sitios corporativos, E-Commerce y plataformas LMS con arquitectura limpia y ultrarrápida.',
      'Konversi logo pecah menjadi vektor tajam (SVG/EPS/AI) serta perancangan sistem identitas visual brand berstandar industri.':
        'Vectorización nítida de logotipos (SVG/EPS/AI) y diseño de identidad visual de nivel profesional.',
      'Perancangan sistem desain antarmuka web maupun mobile beserta aset visual berkarakter untuk meningkatkan daya jual produk.':
        'Sistemas de diseño UI web y móvil con activos visuales distintivos para potenciar las ventas de tu producto.',
      'Arsitektur Pipeline & Audit Performa Live': 'Arquitectura Pipeline y Auditoría en Vivo',
      'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.':
        'Diseño de interfaces modernas Mobile-First con activos vectoriales nítidos y acentos 3D WebGL ligeros.',
      'Portofolio & Arsitektur Live': 'Portafolio y Arquitectura en Vivo',
      'Semua Sistem': 'Todos los Sistemas'
    }
  };

  const originalTexts = new WeakMap<Element, string>();
  const langBox = document.createElement('select');
  langBox.setAttribute('aria-label', 'Pilih Bahasa');
  Object.assign(langBox.style, {
    width: '100%', padding: '10px 12px', marginTop: '10px', borderRadius: '10px',
    border: '1px solid rgba(56, 189, 248, 0.35)', background: '#0b1324',
    color: '#f8fafc', fontWeight: '600', fontSize: '14px', cursor: 'pointer', outline: 'none'
  });

  [
    ['id', '🌐 Bahasa: 🇮🇩 Indonesia (ID)'],
    ['en', '🌐 Language: 🇺🇸 English (EN)'],
    ['ja', '🌐 言語: 🇯🇵 日本語 (JP)'],
    ['ar', '🌐 اللغة: 🇸🇦 العربية (AR)'],
    ['fr', '🌐 Langue: 🇫🇷 Français (FR)'],
    ['es', '🌐 Idioma: 🇪🇸 Español (ES)']
  ].forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    langBox.appendChild(opt);
  });

  const applyLang = (code: string) => {
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    const map = dict[code] || {};
    document.querySelectorAll('h1, h2, h3, h4, p, a, button, span, div, label').forEach((el) => {
      if (el.children.length > 0) return;
      const raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!raw) return;
      if (!originalTexts.has(el)) originalTexts.set(el, raw);
      const base = originalTexts.get(el) || raw;
      if (code === 'id') {
        el.textContent = base;
      } else if (map[base]) {
        el.textContent = map[base];
      }
    });
    langBox.value = code;
    localStorage.setItem('nans_selected_lang', code);
  };

  langBox.addEventListener('change', (e) => applyLang((e.target as HTMLSelectElement).value));

  const mountInsideHamburger = () => {
    const navContainer =
      document.querySelector('nav ul, .nav-links, .mobile-menu, header nav') ||
      Array.from(document.querySelectorAll('a')).find((a) =>
        /Portofolio|Vector Lab/i.test(a.textContent || '')
      )?.parentElement?.parentElement;

    if (navContainer && !navContainer.contains(langBox)) {
      const wrapper = document.createElement('div');
      wrapper.style.padding = '8px 0 4px';
      wrapper.appendChild(langBox);
      wrapper.appendChild(installItem);
      navContainer.appendChild(wrapper);
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    mountInsideHamburger();
    const saved = localStorage.getItem('nans_selected_lang') || 'id';
    if (saved !== 'id') setTimeout(() => applyLang(saved), 350);

    // Pantau elemen dinamis dari main.ts agar ikut terjemah otomatis
    const observer = new MutationObserver(() => {
      const active = localStorage.getItem('nans_selected_lang') || 'id';
      if (active !== 'id') applyLang(active);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
    
