import './style.css'
import { setupScraperForm } from './scraper'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>Consulta de Procesos Judiciales</h1>
    <div class="form-container">
      <form id="scraperForm">
        <div class="form-group">
          <label for="processCode">Código del Proceso:</label>
          <input type="text" id="processCode" placeholder="Ingrese el código del proceso (ej: 11001400300120180092100)" required>
          <small>Formato: CCCCCEEEEAAAAAANNNNDD (Ciudad, Especialidad, Año, Número, Dígitos)</small>
        </div>
        <button type="submit">
          <span class="button-text">Consultar</span>
        </button>
      </form>
    </div>
    <div id="loading" class="loading hidden">
      <div class="spinner"></div>
      <p>Consultando información, por favor espere...</p>
    </div>
    <div id="results" class="results-container hidden">
      <h2>Resultados de la Consulta</h2>
      <div class="case-info">
        <div id="caseDetails"></div>
      </div>
      <h3>Actuaciones</h3>
      <div class="table-container">
        <table id="actuationsTable">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Actuación</th>
              <th>Anotación</th>
              <th>Fecha Inicial</th>
              <th>Fecha Final</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            <!-- Results will be inserted here -->
          </tbody>
        </table>
      </div>
    </div>
    <div id="error" class="error-container hidden">
      <p>No se encontraron resultados para el código ingresado o ocurrió un error durante la consulta.</p>
      <p>Por favor verifique el código e intente nuevamente.</p>
    </div>
  </div>
`

setupScraperForm()
