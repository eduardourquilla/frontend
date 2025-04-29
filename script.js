document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtener valores del formulario
  const codigo = document.getElementById('codigo').value;
  const fecha = document.getElementById('fecha').value;
  
  // Mostrar estado de carga
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = '<p style="color: blue;">Consultando... ⏳</p>';
  
  try {
    // URL CORREGIDA (usa tu URL real de Railway)
    const apiUrl = 'https://back-production-8e44.up.railway.app/api/consulta';
    
    // Realizar la petición
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        codigo: codigo, 
        fecha: fecha 
      }),
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
    }
    
    // Procesar respuesta exitosa
    const data = await response.json();
    
    // Mostrar resultado (formateado para mejor legibilidad)
    resultadoElement.innerHTML = `
      <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
        <h3 style="margin-bottom: 10px;">Resultado de la consulta:</h3>
        <pre style="white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(data.resultado, null, 2)}</pre>
      </div>
    `;
    
  } catch (error) {
    // Manejo de errores
    console.error('Error completo:', error);
    resultadoElement.innerHTML = `
      <p style="color: red;">❌ Error: ${error.message}</p>
      <p style="font-size: 0.9em; color: #666;">Verifica la consola (F12 > Console) para más detalles</p>
    `;
  }
});
