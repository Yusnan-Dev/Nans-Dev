(() => {
  // 1. Registrasi Service Worker untuk PWA (Install ke Beranda kayak APK)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // 2. Tombol Install App melayang di pojok kiri bawah
  let deferredPrompt: any = null;
  const installBtn = document.createElement('button');
  installBtn.innerHTML = '📲 Install App';
  Object.assign(installBtn.style, {
    position: 'fixed', bottom: '18px', left: '16px', zIndex: '9999',
    padding: '10px 15px', borderRadius: '999px', border: '1px solid #38bdf8',
    background: 'rgba(6, 11, 20, 0.94)', color: '#38bdf8', fontWeight: '700',
    fontSize: '12px', cursor: 'pointer', display: 'none', backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 24px rgba(56, 189, 248, 0.25)'
  });
  document.body.appendChild(installBtn);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') installBtn.style.display = 'none';
    deferredPrompt = null;
  });

  // 3. Kamus Multi-Bahasa Lengkap (ID, EN, JP, AR, FR, ES)
  const dict: Record<string, { dir: string; heroTitle: string; ctaText: string }> = {
    id: {
      dir: 'ltr',
      heroTitle: 'Membangun Ekosistem Web & Identitas Visual',
      ctaText: 'Mulai Konsultasi Proyek'
    },
    en: {
      dir: 'ltr',
      heroTitle: 'Engineering High-Performance Web & Vector Identity',
      ctaText: 'Start Project Inquiry'
    },
    ja: {
      dir: 'ltr',
      heroTitle: '次世代のWebシステムとベクターデザイン構築',
      ctaText: 'プロジェクトを相談する'
    },
    ar: {
      dir: 'rtl',
      heroTitle: 'تطوير أنظمة الويب الحديثة والهوية البصرية المتكاملة',
      ctaText: 'ابدأ مشروعك الآن'
    },
    fr: {
      dir: 'ltr',
      heroTitle: 'Architecture Web Moderne & Identité Vectorielle',
      ctaText: 'Lancer un Projet'
    },
    es: {
      dir: 'ltr',
      heroTitle: 'Desarrollo Web de Alto Rendimiento e Identidad Vectorial',
      ctaText: 'Iniciar Proyecto'
    }
  };

  // 4. Bikin Pemilih Bahasa Melayang di Pojok Kanan Bawah (Pasti Muncul!)
  const langBox = document.createElement('select');
  langBox.setAttribute('aria-label', 'Pilih Bahasa');
  Object.assign(langBox.style, {
    position: 'fixed', bottom: '18px', right: '16px', zIndex: '9999',
    padding: '10px 14px', borderRadius: '999px', border: '1px solid #38bdf8',
    background: 'rgba(6, 11, 20, 0.94)', color: '#f8fafc', fontWeight: '700',
    fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)', outline: 'none'
  });

  const options = [
    ['id', '🇮🇩 ID'],
    ['en', '🇺🇸 EN'],
    ['ja', '🇯🇵 JP'],
    ['ar', '🇸🇦 AR'],
    ['fr', '🇫🇷 FR'],
    ['es', '🇪🇸 ES']
  ];
  options.forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    langBox.appendChild(opt);
  });
  document.body.appendChild(langBox);

  const applyLang = (code: string) => {
    const pack = dict[code] || dict.id;
    document.documentElement.dir = pack.dir;
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = pack.heroTitle;
    const cta = document.querySelector('a[href="#estimator"], .btn-primary');
    if (cta) cta.textContent = pack.ctaText;
    langBox.value = code;
    localStorage.setItem('nans_selected_lang', code);
  };

  langBox.addEventListener('change', (e) => {
    applyLang((e.target as HTMLSelectElement).value);
  });

  const saved = localStorage.getItem('nans_selected_lang');
  if (saved && dict[saved]) applyLang(saved);
})();
