(() => {
  // 1. Registrasi Service Worker agar web bisa di-install ke beranda HP kayak APK
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // 2. Tangkap event install PWA & tampilkan tombol melayang "Install App"
  let deferredPrompt: any = null;
  const installBtn = document.createElement('button');
  installBtn.id = 'nans-pwa-install';
  installBtn.innerHTML = '📲 Install App';
  Object.assign(installBtn.style, {
    position: 'fixed', bottom: '20px', left: '20px', zIndex: '9999',
    padding: '10px 16px', borderRadius: '999px', border: '1px solid #38bdf8',
    background: 'rgba(6, 11, 20, 0.92)', color: '#38bdf8', fontWeight: '700',
    fontSize: '13px', cursor: 'pointer', display: 'none', backdropFilter: 'blur(8px)',
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

  // 3. Paket Multi-Bahasa Tambahan (Jepang, Arab, Prancis, Spanyol)
  const extraDict: Record<string, { dir: string; heroTitle: string; ctaText: string }> = {
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

  const applyExtraLang = (code: string) => {
    const pack = extraDict[code];
    if (!pack) {
      document.documentElement.dir = 'ltr';
      return;
    }
    document.documentElement.dir = pack.dir;
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = pack.heroTitle;
    const primaryBtn = document.querySelector('a[href="#estimator"], .btn-primary');
    if (primaryBtn) primaryBtn.textContent = pack.ctaText;
    localStorage.setItem('nans_extra_lang', code);
  };

  // Suntikkan opsi bahasa baru ke dropdown pemilih bahasa jika tersedia
  window.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.querySelector('select');
    if (langSelect) {
      const langs = [
        { code: 'ja', label: '🇯🇵 日本語 (JP)' },
        { code: 'ar', label: '🇸🇦 العربية (AR)' },
        { code: 'fr', label: '🇫🇷 Français (FR)' },
        { code: 'es', label: '🇪🇸 Español (ES)' }
      ];
      langs.forEach(({ code, label }) => {
        if (!langSelect.querySelector(`option[value="${code}"]`)) {
          const opt = document.createElement('option');
          opt.value = code;
          opt.textContent = label;
          langSelect.appendChild(opt);
        }
      });
      langSelect.addEventListener('change', (e) => {
        applyExtraLang((e.target as HTMLSelectElement).value);
      });
    }
    const saved = localStorage.getItem('nans_extra_lang');
    if (saved && extraDict[saved]) applyExtraLang(saved);
  });
})();
        
