import os
import re
import json
from datetime import datetime, timezone, timedelta

BASE_URL = "https://nans-dev.pages.dev/"
REQUIRED_FILES = [
    "index.html",
    "src/main.ts",
    "src/style.scss",
    "scripts/generate_data.py",
    ".github/workflows/deploy.yml",
]


# 1. Audit kelengkapan file inti repositori
def audit_required_files() -> dict:
    report = {}
    for path in REQUIRED_FILES:
        exists = os.path.isfile(path)
        size = os.path.getsize(path) if exists else 0
        report[path] = {"exists": exists, "bytes": size}
    return report


# 2. Validasi tag SEO & struktur dasar index.html
def validate_html_integrity(html_path: str = "index.html") -> dict:
    if not os.path.isfile(html_path):
        return {"valid": False, "missing": ["index.html not found"]}
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read().lower()
    checks = {
        "title": "<title>" in content,
        "meta_description": 'name="description"' in content,
        "viewport": 'name="viewport"' in content,
        "og_title": 'property="og:title"' in content,
    }
    missing = [k for k, v in checks.items() if not v]
    return {"valid": len(missing) == 0, "missing": missing}


# 3. Ekstraksi & validasi format seluruh tautan eksternal
def check_external_links(html_path: str = "index.html") -> list:
    if not os.path.isfile(html_path):
        return []
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
    urls = sorted(set(re.findall(r'https?://[^\s"\'<>]+', content)))
    return [{"url": u, "https": u.startswith("https://")} for u in urls]


# 4. Generate file _headers keamanan standar produksi
def generate_security_headers(out_path: str = "_headers") -> str:
    rules = (
        "/*\n"
        "  X-Frame-Options: DENY\n"
        "  X-Content-Type-Options: nosniff\n"
        "  Referrer-Policy: strict-origin-when-cross-origin\n"
        "  Permissions-Policy: camera=(), microphone=(), geolocation=()\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(rules)
    return out_path


# 5. Generate robots.txt untuk indeksasi mesin pencari
def generate_robots_txt(out_path: str = "robots.txt") -> str:
    content = (
        "User-agent: *\n"
        "Allow: /\n\n"
        f"Sitemap: {BASE_URL}sitemap.xml\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    return out_path


# 6. Generate sitemap.xml dinamis dengan tanggal build terbaru
def generate_sitemap_xml(out_path: str = "sitemap.xml") -> str:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    routes = ["", "#services", "#architecture", "#vector-lab", "#portfolio", "#reviews", "#estimator"]
    entries = []
    for route in routes:
        prio = "1.0" if route == "" else "0.8"
        entries.append(
            f"  <url>\n"
            f"    <loc>{BASE_URL}{route}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <priority>{prio}</priority>\n"
            f"  </url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(xml)
    return out_path


# 7. Generate PWA manifest.json agar web bisa di-install di HP
def generate_pwa_manifest(out_path: str = "manifest.json") -> str:
    manifest = {
        "name": "Nans Dev — Enterprise Web & Visual Identity",
        "short_name": "Nans Dev",
        "start_url": "./index.html",
        "display": "standalone",
        "background_color": "#060b14",
        "theme_color": "#38bdf8",
        "description": "Pengembangan sistem web modern, katalog interaktif, dan rekonstruksi identitas vektor presisi.",
        "icons": [
            {
                "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='110' fill='%2338bdf8'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='300' fill='%23060b14'%3EN%3C/text%3E%3C/svg%3E",
                "sizes": "192x192 512x512",
                "type": "image/svg+xml",
                "purpose": "any maskable",
            }
        ],
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    return out_path


# 8. Generate JSON-LD Multi-Entity (Service + OfferCatalog + FAQPage)
def generate_json_ld_schema(out_path: str = "schema.json") -> str:
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfessionalService",
                "name": "Nans Dev",
                "url": BASE_URL,
                "founder": {"@type": "Person", "name": "Yusnan Yulyakso"},
                "areaServed": "ID",
                "knowsAbout": ["Web Development", "TypeScript", "Interactive 3D UI", "Vector Logo Reconstruction"],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Layanan Digital Nans Dev",
                    "itemListElement": [
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Company Profile & Landing Page Modern"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "E-Commerce, Katalog & LMS Interaktif"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Raster-to-Vector Logo Reconstruction HD"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Banner & Aset Visual Sosmed"}},
                    ],
                },
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Apakah layanan pembuatan website sudah termasuk panduan domain?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ya, klien dibantu koneksi custom domain secara gratis agar website langsung online siap pakai.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Berapa lama estimasi pengerjaan website dan desain vektor?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Rata-rata pengerjaan standar selesai dalam 3 sampai 7 hari kerja dengan revisi terstruktur.",
                        },
                    },
                ],
            },
        ],
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2, ensure_ascii=False)
    return out_path


# 9. Generate .well-known/security.txt & humans.txt standar enterprise
def generate_enterprise_identity() -> list:
    os.makedirs(".well-known", exist_ok=True)
    expires = (datetime.now(timezone.utc) + timedelta(days=365)).strftime("%Y-%m-%dT%H:%M:%SZ")
    sec_path = ".well-known/security.txt"
    with open(sec_path, "w", encoding="utf-8") as f:
        f.write(
            f"Contact: mailto:yusnanyulyakso29@gmail.com\n"
            f"Expires: {expires}\n"
            f"Preferred-Languages: id, en\n"
            f"Canonical: {BASE_URL}.well-known/security.txt\n"
        )
    hum_path = "humans.txt"
    with open(hum_path, "w", encoding="utf-8") as f:
        f.write(
            "/* TEAM */\n"
            "Founder & Lead Architect: Yusnan Yulyakso\n"
            "Location: Probolinggo, East Java, Indonesia\n\n"
            "/* TECHNOLOGY */\n"
            "Stack: TypeScript, HTML5, SCSS, Python Automation, Cloudflare Edge\n"
        )
    return [sec_path, hum_path]


# 10. Analisis metrik ukuran aset & estimasi performa
def analyze_bundle_metrics(file_report: dict) -> dict:
    total_bytes = sum(item["bytes"] for item in file_report.values())
    return {
        "total_source_bytes": total_bytes,
        "total_source_kb": round(total_bytes / 1024, 2),
        "estimated_fcp_seconds": 0.65 if total_bytes < 150_000 else 0.95,
    }


# 11. Ekspor laporan telemetri ke build-telemetry.json
def export_build_telemetry(out_path: str = "build-telemetry.json") -> dict:
    file_audit = audit_required_files()
    telemetry = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "file_audit": file_audit,
        "html_seo_check": validate_html_integrity(),
        "external_links_count": len(check_external_links()),
        "bundle_metrics": analyze_bundle_metrics(file_audit),
        "generated_artifacts": [
            generate_security_headers(),
            generate_robots_txt(),
            generate_sitemap_xml(),
            generate_pwa_manifest(),
            generate_json_ld_schema(),
            *generate_enterprise_identity(),
        ],
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(telemetry, f, indent=2, ensure_ascii=False)
    return telemetry


if __name__ == "__main__":
    result = export_build_telemetry()
    print(f"[NANS-OPS] Build telemetry generated: {result['bundle_metrics']}")
            
