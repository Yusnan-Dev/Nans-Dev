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

  const translations: Record<string, Record<string, string>> = {
    en: {
      'Menu Cepat': 'Quick Menu',
      'Arsitektur': 'Architecture',
      'Portofolio': 'Portfolio',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Project Slots Available This Week',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'High-performance custom web engineering, modern UI architecture, and precision vector asset reconstruction to accelerate your digital business.',
      'Rakit Proyek Anda': 'Build Your Project',
      'Eksplorasi Demo ↗': 'Explore Demos ↗',
      'Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.':
        'Corporate company profiles, E-Commerce, and Learning Management Systems (LMS) engineered with clean, ultra-fast architecture.',
      'Arsitektur Pipeline & Audit Performa Live': 'Pipeline Architecture & Live Performance Audit',
      'Portofolio & Arsitektur Live': 'Live Portfolio & Architecture',
      'Semua Sistem': 'All Systems'
    },
    ja: {
      'Menu Cepat': 'クイックメニュー',
      'Arsitektur': 'アーキテクチャ',
      'Portofolio': 'ポートフォリオ',
      '2 Slot Proyek Tersedia Minggu Ini': '今週対応可能なプロジェクト枠：残り2件',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        '高性能カスタムWeb開発、モダンUI設計、精密ベクター資産の再構築でデジタルビジネスを加速します。',
      'Rakit Proyek Anda': 'プロジェクトを相談する',
      'Eksplorasi Demo ↗': 'デモを見る ↗',
      'Arsitektur Pipeline & Audit Performa Live': 'パイプライン設計とリアルタイム性能監査',
      'Portofolio & Arsitektur Live': '実績とライブシステム',
      'Semua Sistem': 'すべて表示'
    },
    ar: {
      'Menu Cepat': 'القائمة السريعة',
      'Arsitektur': 'الهندسة البرمجية',
      'Portofolio': 'أعمالنا',
      '2 Slot Proyek Tersedia Minggu Ini': 'متاح مكانان لمشاريع جديدة هذا الأسبوع',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'هندسة مواقع مخصصة عالية الأداء، تصميم واجهات عصرية، وإعادة بناء الشعارات الفيكتور بدقة لتسريع أعمالك الرقمية.',
      'Rakit Proyek Anda': 'ابدأ مشروعك الآن',
      'Eksplorasi Demo ↗': 'استكشف العروض ↗',
      'Arsitektur Pipeline & Audit Performa Live': 'هندسة النظام وتدقيق الأداء المباشر',
      'Portofolio & Arsitektur Live': 'معرض الأعمال والأنظمة الحية',
      'Semua Sistem': 'جميع الأنظمة'
    },
    fr: {
      'Menu Cepat': 'Menu Rapide',
      'Arsitektur': 'Architecture',
      'Portofolio': 'Portfolio',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Créneaux Projets Disponibles Cette Semaine',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'Ingénierie web sur mesure haute performance, design UI moderne et reconstruction vectorielle de précision pour accélérer votre activité.',
      'Rakit Proyek Anda': 'Lancer Votre Projet',
      'Eksplorasi Demo ↗': 'Explorer les Démos ↗',
      'Arsitektur Pipeline & Audit Performa Live': 'Architecture Pipeline & Audit de Performance',
      'Portofolio & Arsitektur Live': 'Portfolio & Architecture Live',
      'Semua Sistem': 'Tous les Systèmes'
    },
    es: {
      'Menu Cepat': 'Menú Rápido',
      'Arsitektur': 'Arquitectura',
      'Portofolio': 'Portafolio',
      '2 Slot Proyek Tersedia Minggu Ini': '2 Cupos de Proyecto Disponibles Esta Semana',
      'Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi untuk akselerasi bisnis digital Anda.':
        'Ingeniería web personalizada de alto rendimiento, diseño UI moderno y reconstrucción vectorial de precisión para impulsar tu negocio.',
      'Rakit Proyek Anda': 'Armar Tu Proyecto',
      'Eksplorasi Demo ↗': 'Explorar Demos ↗',
      'Arsitektur Pipeline & Audit Performa Live': 'Arquitectura Pipeline y Auditoría en Vivo',
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
    const map = translations[code] || {};
    document.querySelectorAll('h1, h2, h3, p, a, button, span, div').forEach((el) => {
      if (el.children.length > 0) return;
      const current = (el.textContent || '').trim();
      if (!current) return;
      if (!originalTexts.has(el)) originalTexts.set(el, current);
      const baseText = originalTexts.get(el) || current;
      if (code === 'id') {
        el.textContent = baseText;
      } else if (map[baseText]) {
        el.textContent = map[baseText];
      }
    });
    langBox.value = code;
    localStorage.setItem('nans_selected_lang', code);
  };

  langBox.addEventListener('change', (e) => applyLang((e.target as HTMLSelectElement).value));

  // Selipkan otomatis ke dalam barisan menu hamburger (tepat di bawah "Start Project Inquiry")
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
    const saved = localStorage.getItem('nans_selected_lang');
    if (saved && saved !== 'id') setTimeout(() => applyLang(saved), 250);
  });
})();
  
