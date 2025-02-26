import { scrapeJudicialProcess } from './api';

interface ProcessResult {
  JuzgadoActual: string;
  Ponente: string;
  Tipo: string;
  Clase: string;
  Recurso: string;
  Ubicacion: string;
  NomDemandante: string;
  NomDemandado: string;
  Contenido: string;
  Codigo: string;
  actuaciones: Actuation[];
}

interface Actuation {
  date: string;
  action: string;
  annotation: string;
  startDate: string;
  endDate: string;
  registerDate: string;
}

export function setupScraperForm() {
  const form = document.getElementById('scraperForm') as HTMLFormElement;
  const loadingElement = document.getElementById('loading') as HTMLDivElement;
  const resultsElement = document.getElementById('results') as HTMLDivElement;
  const errorElement = document.getElementById('error') as HTMLDivElement;
  const caseDetailsElement = document.getElementById('caseDetails') as HTMLDivElement;
  const actuationsTableBody = document.querySelector('#actuationsTable tbody') as HTMLTableSectionElement;
  const buttonText = document.querySelector('.button-text') as HTMLSpanElement;
  const processCodeInput = document.getElementById('processCode') as HTMLInputElement;

  // Add animation to input focus
  processCodeInput.addEventListener('focus', () => {
    const formGroup = processCodeInput.closest('.form-group');
    formGroup?.querySelector('label')?.classList.add('active');
  });

  processCodeInput.addEventListener('blur', () => {
    if (!processCodeInput.value) {
      const formGroup = processCodeInput.closest('.form-group');
      formGroup?.querySelector('label')?.classList.remove('active');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get the process code
    const processCode = processCodeInput.value.trim();
    
    if (!processCode) {
      // Shake the input to indicate error
      processCodeInput.classList.add('error-shake');
      setTimeout(() => processCodeInput.classList.remove('error-shake'), 500);
      return;
    }
    
    // Show loading indicator and change button text
    buttonText.textContent = 'Consultando...';
    loadingElement.classList.remove('hidden');
    resultsElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    
    try {
      // Call the API to scrape the judicial process
      const result = await scrapeJudicialProcess(processCode);
      
      // Hide loading indicator
      loadingElement.classList.add('hidden');
      buttonText.textContent = 'Consultar';
      
      if (!result || typeof result === 'string' || Object.keys(result).length === 0) {
        // Show error message with animation
        errorElement.classList.remove('hidden');
        return;
      }
      
      // Display the results with animation
      displayResults(result, caseDetailsElement, actuationsTableBody);
      resultsElement.classList.remove('hidden');
      
      // Scroll to results with smooth animation
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
    } catch (error) {
      console.error('Error during scraping:', error);
      loadingElement.classList.add('hidden');
      buttonText.textContent = 'Consultar';
      errorElement.classList.remove('hidden');
    }
  });

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .error-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    .form-group label.active {
      color: var(--primary-color);
      transform: translateY(-5px);
    }
    
    .form-group label {
      transition: all 0.3s ease;
    }
    
    tr {
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.3s ease forwards;
    }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

function displayResults(
  result: ProcessResult, 
  caseDetailsElement: HTMLDivElement, 
  actuationsTableBody: HTMLTableSectionElement
) {
  // Display case details
  caseDetailsElement.innerHTML = `
    <p><strong>Juzgado Actual:</strong> ${result.JuzgadoActual || 'No disponible'}</p>
    <p><strong>Ponente:</strong> ${result.Ponente || 'No disponible'}</p>
    <p><strong>Tipo:</strong> ${result.Tipo || 'No disponible'}</p>
    <p><strong>Clase:</strong> ${result.Clase || 'No disponible'}</p>
    <p><strong>Recurso:</strong> ${result.Recurso || 'No disponible'}</p>
    <p><strong>Ubicación:</strong> ${result.Ubicacion || 'No disponible'}</p>
    <p><strong>Demandante:</strong> ${result.NomDemandante || 'No disponible'}</p>
    <p><strong>Demandado:</strong> ${result.NomDemandado || 'No disponible'}</p>
    <p><strong>Contenido:</strong> ${result.Contenido || 'No disponible'}</p>
    <p><strong>Código:</strong> ${result.Codigo || 'No disponible'}</p>
  `;
  
  // Clear previous results
  actuationsTableBody.innerHTML = '';
  
  // Display actuations in the table with staggered animation
  if (result.actuaciones && result.actuaciones.length > 0) {
    result.actuaciones.forEach((actuation, index) => {
      const row = document.createElement('tr');
      row.style.animationDelay = `${index * 0.1}s`;
      row.innerHTML = `
        <td>${actuation.date || 'N/A'}</td>
        <td>${actuation.action || 'N/A'}</td>
        <td>${actuation.annotation || 'N/A'}</td>
        <td>${actuation.startDate || 'N/A'}</td>
        <td>${actuation.endDate || 'N/A'}</td>
        <td>${actuation.registerDate || 'N/A'}</td>
      `;
      actuationsTableBody.appendChild(row);
    });
  } else {
    // If no actuations, display a message
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="6" style="text-align: center;">No hay actuaciones disponibles</td>
    `;
    actuationsTableBody.appendChild(row);
  }
}
