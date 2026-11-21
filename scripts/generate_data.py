import json
from datetime import datetime

company_services = [
    {
        "id": "web-dev",
        "title": "Custom Website & Landing Page",
        "tag": "WEB ENGINEERING",
        "desc": "Pembuatan website company profile, toko online, hingga sistem interaktif modern dengan performa cepat dan responsif di semua perangkat.",
        "metrics": "99% Performance Score"
    },
    {
        "id": "vector-logo",
        "title": "Raster to Vector & Brand Identity",
        "tag": "GRAPHIC DESIGN",
        "desc": "Ubah logo pecah menjadi vektor tajam resolusi tak terbatas, desain banner promosi, serta identitas visual profesional.",
        "metrics": "100% Scalable Vector"
    },
    {
        "id": "ui-ux",
        "title": "UI/UX & Visual Asset Production",
        "tag": "CREATIVE STUDIO",
        "desc": "Perancangan tampilan antarmuka aplikasi, thumbnail media sosial, dan aset visual kreatif untuk kebutuhan branding bisnis.",
        "metrics": "60-120 FPS Smooth UI"
    }
]

output_payload = {
    "last_built": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
    "services": company_services
}

with open("dist/services.json", "w", encoding="utf-8") as f:
    json.dump(output_payload, f, indent=2)

print("Python berhasil memproses data layanan ke dist/services.json")
