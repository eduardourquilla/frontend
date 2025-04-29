document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const codigo = document.getElementById('codigo').value;
  const fecha = document.getElementById('fecha').value;
  
  try {
    const response = await fetch('back-production-8e44.up.railway.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo, fecha }),
    });
    
    const data = await response.json();
    document.getElementById('resultado').innerText = data.resultado;
  } catch (error) {
    document.getElementById('resultado').innerText = 'Error: ' + error.message;
  }
});
