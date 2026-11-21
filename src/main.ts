interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  metrics: string;
}

interface BuildData {
  last_built: string;
  services: ServiceItem[];
}

async function initCompanyProfile(): Promise<void> {
  const gridContainer = document.getElementById('services-grid');
  const buildBadge = document.getElementById('build-timestamp');

  if (!gridContainer) return;

  try {
    const response = await fetch('./services.json');
    if (!response.ok) throw new Error('Gagal memuat data layanan');

    const data: BuildData = await response.json();

    if (buildBadge) {
      buildBadge.textContent = `Build: ${data.last_built}`;
    }

    gridContainer.innerHTML = data.services
      .map(
        (item: ServiceItem) => `
        <article class="card">
          <span class="tag">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <div class="metric">⚡ ${item.metrics}</div>
        </article>
      `
      )
      .join('');
  } catch (error) {
    console.error(error);
    gridContainer.innerHTML = `<p style="color:#f87171;">Gagal memuat modul layanan.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', initCompanyProfile);
