import json
from datetime import datetime, timezone

payload = {
    "last_built": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
    "metrics": [
        {"value": "99.9%", "label": "Lighthouse Performance"},
        {"value": "< 1.2s", "label": "Global Edge Load Time"},
        {"value": "100%", "label": "Scalable Vector Precision"}
    ],
    "projects": [
        {
            "id": "klinpro",
            "title": "KlinPro Express Laundry",
            "category": "web",
            "badge": "WEB APP & CALCULATOR",
            "desc": "Sistem web layanan laundry ekspres dengan kalkulator estimasi biaya multi-item otomatis dan panel pengaturan interaktif.",
            "stack": ["HTML5", "CSS3", "JavaScript", "Interactive UI"],
            "url": "https://klinpro-express-laundry.github.io/"
        },
        {
            "id": "tokobukyul",
            "title": "TokoBukYul Digital Store",
            "category": "web",
            "badge": "E-COMMERCE CATALOG",
            "desc": "Platform katalog toko modern yang dioptimalkan untuk konversi cepat melalui perangkat mobile dengan navigasi ringan.",
            "stack": ["Frontend Architecture", "Responsive Grid", "WA Checkout"],
            "url": "https://tokobukyul.github.io/TokoBukYul/"
        },
        {
            "id": "bizsnap",
            "title": "bizsnap Business Directory",
            "category": "system",
            "badge": "DIRECTORY PLATFORM",
            "desc": "Direktori bisnis digital terstruktur yang memetakan kafe dan tempat usaha lokal di berbagai kota besar Jawa.",
            "stack": ["Data Architecture", "Search & Filter", "UI System"],
            "url": "#estimator"
        },
        {
            "id": "vector-suite",
            "title": "Enterprise Brand & Vector Identity",
            "category": "design",
            "badge": "RASTER TO VECTOR",
            "desc": "Rekonstruksi logo resolusi rendah menjadi aset vektor murni (SVG/AI/EPS) siap cetak skala baliho maupun antarmuka digital.",
            "stack": ["Vector Geometry", "Brand System", "3D/2D Assets"],
            "url": "#vector-lab"
        }
    ],
    "services": [
        {
            "code": "01",
            "title": "Custom Web & System Engineering",
            "desc": "Pengembangan Company Profile korporat, E-Commerce, hingga Learning Management System (LMS) dengan arsitektur bersih dan cepat.",
            "specs": ["Custom UI/UX Architecture", "Mobile-First 120fps", "SEO & Speed Optimized"]
        },
        {
            "code": "02",
            "title": "Raster-to-Vector & Brand Identity",
            "desc": "Konversi logo pecah menjadi vektor presisi tinggi, perancangan identitas visual perusahaan, banner, dan aset media sosial.",
            "specs": ["100% Manual Pen-Tool Tracing", "Master File SVG, PDF, PNG HD", "Revisi Hingga Presisi"]
        },
        {
            "code": "03",
            "title": "UI/UX Prototyping & Visual Assets",
            "desc": "Perancangan sistem desain antarmuka web maupun mobile beserta aset visual berkarakter untuk meningkatkan daya jual produk.",
            "specs": ["Interactive Component System", "Dark & Light Theme Ready", "Conversion-Focused Layout"]
        },
        {
            "code": "04",
            "title": "PWA Architecture & Technical SEO",
            "desc": "Optimasi kecepatan muat sub-detik, instalasi aplikasi web langsung di layar HP pelanggan, dan struktur SEO ramah mesin pencari.",
            "specs": [
            "Installable Progressive Web App (PWA)",
            "Sub-Second Edge Caching & Compression",
            "Schema & Local Search Optimization"]
      }     
    ]
}

with open("dist/services.json", "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)

print("Enterprise JSON payload generated.")
