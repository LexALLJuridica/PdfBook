
const GOOGLE_API_KEY = 'AIzaSyAlle5TnsjwD-JAQakHzXwUqXE5dpdTSfI';
const GOOGLE_CX = '835fe28288aab4d17';

async function buscarPDF(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query + ' filetype:pdf')}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    return data.items.filter(item => item.link.endsWith('.pdf')).map(item => ({
      titulo: item.title,
      enlace: item.link
    }));
  } catch (err) {
    console.error('Error al buscar en Google:', err);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formBusquedaPDF');
  const input = document.getElementById('entradaPDF');
  const resultados = document.getElementById('resultadosPDF');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const consulta = input.value.trim();
    if (!consulta) return;
    resultados.innerHTML = '<p>Buscando archivos PDF...</p>';
    const pdfs = await buscarPDF(consulta);

    if (pdfs.length === 0) {
      resultados.innerHTML = '<p>No se encontraron PDFs descargables.</p>';
    } else {
      resultados.innerHTML = '<ul>' + pdfs.map(p => `<li><a href="${p.enlace}" target="_blank">${p.titulo}</a></li>`).join('') + '</ul>';
    }
  });
});
