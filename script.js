document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtener valores del formulario
  const codigo = document.getElementById('codigo').value;
  const fecha = document.getElementById('fecha').value;
  
  // Mostrar estado de carga
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = '<p style="color: blue;">Consultando... ⏳</p>';
  
  try {
    // URL de la API (asegúrate de que sea correcta)
    const apiUrl = 'https://back-production-bcc4.up.railway.app/api/consulta';
    
    console.log('Enviando petición a:', apiUrl);
    console.log('Datos enviados:', { codigo, fecha });
    
    // Controlar timeout para evitar esperas muy largas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
    
    // Realizar la petición con mejor control de errores
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si tienes algún token de autenticación, inclúyelo aquí
        // 'Authorization': 'Bearer tu-token'
      },
      body: JSON.stringify({ 
        codigo: codigo, 
        fecha: fecha 
      }),
      signal: controller.signal,
      // Intentar evitar cachés
      cache: 'no-cache',
      // Incluir cookies si es necesario para autenticación
      credentials: 'include'
    });
    
    clearTimeout(timeoutId);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
    }
    
    // Procesar respuesta exitosa
    const data = await response.json();
    console.log('Respuesta recibida:', data);
    
    // Mostrar resultado (formateado para mejor legibilidad)
    resultadoElement.innerHTML = `
      <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
        <h3 style="margin-bottom: 10px;">Resultado de la consulta:</h3>
        <pre style="white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(data.resultado, null, 2)}</pre>
      </div>
    `;
    
  } catch (error) {
    // Manejo de errores mejorado
    console.error('Error completo:', error);
    
    let errorMessage = error.message;
    
    // Detectar tipos específicos de errores
    if (error.name === 'AbortError') {
      errorMessage = 'La solicitud excedió el tiempo de espera. Servidor no responde.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = `Error de conexión. Posibles causas:
      - Servidor no disponible 
      - Error CORS (Política de origen cruzado)
      - Problemas de red
      - URL incorrecta`;
    }
    
    resultadoElement.innerHTML = `
      <div style="color: red; padding: 15px; background: #fff0f0; border-radius: 5px; border-left: 4px solid red;">
        <h3>❌ Error en la consulta</h3>
        <p>${errorMessage}</p>
        <p style="font-size: 0.9em; color: #666;">Consulta la consola (F12 > Console) para más detalles</p>
      </div>
    `;
  }
});
