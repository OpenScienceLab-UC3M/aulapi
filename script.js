window.addEventListener('DOMContentLoaded', () => {
  Papa.parse('patentes.csv', {
    download: true,
    header: true,
    delimiter: ';',
    complete: function(results) {
      mostrarPatentes(results.data);
    }
  });
});

function mostrarPatentes(data) {
  const lista = document.getElementById('patentes-list');
  lista.innerHTML = '';

  const patentes = data.filter(p => p['Título:'] && p['Título:'].trim() !== '-' && p['Universidad de Origen:']).slice(0, 15);

  patentes.forEach((patente) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${patente['Título:']}</h3>
      <p><strong>Universidad:</strong> ${patente['Universidad de Origen:']}</p>
      <button onclick="generarRecursos('${escapeQuotes(patente['Título:'])}')">Generar recursos educativos</button>
    `;
    lista.appendChild(div);
  });
}

function escapeQuotes(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function generarRecursos(titulo) {
  const recursos = document.getElementById('recursos-generados');
  recursos.innerHTML = `
    <div class="card">
      <h2>Recursos para: ${titulo}</h2>
      <p><strong>📘 Resumen:</strong> Esta innovación aporta una solución tecnológica relevante en su área de aplicación.</p>
      <p><strong>📑 Ficha didáctica:</strong> Nivel recomendado: FP o Universidad. Competencias: Innovación, pensamiento científico.</p>
      <p><strong>📚 Glosario:</strong> Patente: Documento que protege legalmente una invención.</p>
      <p><strong>❓ Test:</strong> ¿Qué problema resuelve esta patente?</p>
      <p><strong>🧭 Guía:</strong> Busca en Espacenet o Google Patents tecnologías similares.</p>
    </div>
  `;
}

