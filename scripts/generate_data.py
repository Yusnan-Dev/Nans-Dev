import json
import os
import re
from datetime import datetime, timezone, timedelta

BASE_URL = "https://yusnan-dev.github.io/Nans-Dev/"

def inject_seo_and_social_to_html(services: list):
    if not os.path.exists("index.html"):
        return
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    schema_obj = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Nans Dev",
        "url": BASE_URL,
        "description": "Enterprise Web Engineering, Custom Landing Page, Interactive 3D Web & Raster-to-Vector Design Architecture.",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Digital Architecture Services",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": s["title"]}}
                for s in services
            ]
        }
    }

    meta_block = (
        f'<!-- NANS_SEO_START -->\n'
        f'  <meta name="description" content="Nans Dev — Rekayasa website custom berperforma tinggi, desain antarmuka modern, dan rekonstruksi aset vektor presisi." />\n'
        f'  <meta property="og:title" content="Nans Dev — Enterprise Web Engineering & 3D Visual Architecture" />\n'
        f'  <meta property="og:url" content="{BASE_URL}" />\n'
        f'  <link rel="manifest" href="./manifest.json" />\n'
        f'  <script type="application/ld+json">{json.dumps(schema_obj, ensure_ascii=False)}</script>\n'
        f'  <!-- NANS_SEO_END -->'
    )

    pattern = re.compile(r"<!-- NANS_(?:SEO|SCHEMA)_START -->.*?<!-- NANS_(?:SEO|SCHEMA)_END -->", re.DOTALL)
    if pattern.search(html):
        html = pattern.sub(meta_block, html)
    elif "</head>" in html:
        html = html.replace("</head>", f"  {meta_block}\n</head>", 1)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)

def build_enterprise_assets():
    wib = timezone(timedelta(hours=7))
    now_wib = datetime.now(wib)
    build_stamp = now_wib.strftime("%Y.%m.%d %H:%M")
    iso_date = now_wib.strftime("%Y-%m-%d")

    projects = [
        {
            "id": "klinpro-laundry",
            "title": "KlinPro Express Laundry",
            "category": "web",
            "badge": "WEB APP & CALCULATOR • LIVE",
            "desc": "Sistem web layanan laundry ekspres dengan kalkulator estimasi biaya multi-item otomatis, panel pengaturan interaktif, dan integrasi checkout WhatsApp.",
            "stack": ["HTML5", "CSS3", "JavaScript", "Interactive UI"],
            "url": "https://klinpro-express-laundry.github.io/"
        },
        {
            "id": "tokobukyul-store",
            "title": "TokoBukYul Digital Catalog",
            "category": "web",
            "badge": "E-COMMERCE & CATALOG • LIVE",
            "desc": "Platform katalog toko buku digital dengan sistem filter kategori instan, keranjang belanja responsif, dan alur pemesanan cepat.",
            "stack": ["TypeScript", "SCSS", "Responsive Grid"],
            "url": "https://tokobukyul.github.io/TokoBukYul/"
        },
        {
            "id": "bizsnap-directory",
            "title": "bizsnap Local Business Hub",
            "category": "system",
            "badge": "DIRECTORY ARCHITECTURE",
            "desc": "Direktori bisnis & kafe lokal terkurasi di Jawa Timur dengan pemetaan lokasi akurat dan tampilan kartu bisnis modern.",
            "stack": ["Python Pipeline", "JSON API", "Maps Integration"],
            "url": "#portfolio"
        },
        {
            "id": "vector-emblem-suite",
            "title": "Precision Brand & Vector Reconstruction",
            "category": "design",
            "badge": "VECTOR GRAPHICS",
            "desc": "Rekonstruksi logo raster beresolusi rendah menjadi geometri kurva Bezier murni siap cetak skala besar maupun aset digital.",
            "stack": ["SVG", "EPS", "CMYK / RGB", "300 DPI"],
            "url": "#vector-lab"
        }
    ]

    services = [
        {
            "code": "01",
            "title": "Enterprise Web & Landing Page",
            "desc": "Pengembangan website profil perusahaan, katalog produk, dan aplikasi web interaktif dengan kecepatan muat instan.",
            "specs": [
                "Arsitektur Mobile-First & 60FPS Smooth UI",
                "Integrasi Kalkulator Order & WhatsApp API",
                "Optimasi Core Web Vitals & SEO Teknis"
            ]
        },
        {
            "code": "02",
            "title": "Interactive 3D & Motion Web",
            "desc": "Visualisasi WebGL ringan dan micro-interaction ala agensi teknologi untuk meningkatkan kredibilitas brand di mata klien.",
            "specs": [
                "Smart-Pause GPU Engine (Hemat Baterai HP)",
                "Cinematic Preloader & Command Palette",
                "Custom SVG Iconography & HUD Interface"
            ]
        },
        {
            "code": "03",
            "title": "Raster-to-Vector & Brand Assets",
            "desc": "Konversi ulang logo pecah menjadi aset vektor presisi tinggi lengkap dengan paket kebutuhan visual media sosial.",
            "specs": [
                "Tracing Manual Kurva Bezier Presisi",
                "Master File Lengkap (SVG, PDF, EPS, PNG HD)",
                "Siap Cetak Spanduk/Baliho Tanpa Pecah"
            ]
        }
    ]

    metrics = [
        {"value": "99.9%", "label": "SYSTEM UPTIME & RELIABILITY"},
        {"value": "<0.8s", "label": "FIRST CONTENTFUL PAINT"},
        {"value": f"{len(projects)}+ LIVE", "label": "DEPLOYED ARCHITECTURE MODULES"}
    ]

    payload = {
        "last_built": f"v3.0 • {build_stamp} WIB",
        "metrics": metrics,
        "projects": projects,
        "services": services
    }

    with open("services.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{BASE_URL}</loc><lastmod>{iso_date}</lastmod><priority>1.0</priority></url>\n</urlset>\n')

    with open("robots.txt", "w", encoding="utf-8") as f:
        f.write(f"User-agent: *\nAllow: /\nSitemap: {BASE_URL}sitemap.xml\n")

    with open("manifest.json", "w", encoding="utf-8") as f:
        json.dump({"name": "Nans Dev", "short_name": "Nans Dev", "start_url": "./", "display": "standalone", "background_color": "#04060b", "theme_color": "#38bdf8"}, f, indent=2)

    inject_seo_and_social_to_html(services)
    print(f"[OK] Built services.json & SEO at {build_stamp} WIB")

if __name__ == "__main__":
    build_enterprise_assets()
    
