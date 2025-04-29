document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const codigo = document.getElementById('codigo').value;
  const fecha = document.getElementById('fecha').value;
  const resultadoElement = document.getElementById('resultado');
  
  // Mostrar estado de carga
  resultadoElement.innerHTML = '<p class="loading">Consultando... ⏳</p>';
  
  try {
    const apiUrl = 'https://back-production-bcc4.up.railway.app/api/consulta';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ codigo, fecha })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la consulta');
    }
    
    const data = await response.json();
    
    // Mostrar resultados formateados
    resultadoElement.innerHTML = `
      <h3>Resultado de la consulta:</h3>
      <pre>${JSON.stringify(data.resultado, null, 2)}</pre>
    `;
    
  } catch (error) {
    console.error('Error:', error);
    resultadoElement.innerHTML = `
      <div class="error">
        <strong>❌ Error:</strong> ${error.message}
        <p>Verifica la consola (F12) para más detalles</p>
      </div>
    `;
  }
});
