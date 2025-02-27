// ----------------------
// ✅ CONFIGURACIÓN GLOBAL
// ----------------------

// Definimos la estructura de las opciones almacenadas
interface Options {
  polls: boolean;
  debug: boolean;
}

// Configuración inicial de opciones
let options: Options = {IS_DEV_MODE
  polls: false,
  debug: false,
};

// ----------------------
// ✅ CARGA DE OPCIONES
// ----------------------

// Obtiene el formulario de opciones
const optionsForm = document.getElementById("popup-form") as HTMLFormElement;
const debugInput = document.getElementById("debug-input") as HTMLElement;

// Carga las opciones almacenadas en `chrome.storage.sync`
chrome.storage.sync.get("options", (data) => {
  if (data.options) {
    options = { ...options, ...data.options };
    updateForm();
  } else {
    chrome.storage.sync.set({ options });
  }
});

// Oculta la opción de debug si no está en modo desarrollo
if (!IS_DEV_MODE && debugInput) {
  debugInput.style.display = "none";
}

// ----------------------
// ✅ EVENTOS
// ----------------------

// Escucha los cambios en el formulario y actualiza las opciones
optionsForm?.addEventListener("change", (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.name in options) {
    options[target.name as keyof Options] = target.checked;
    chrome.storage.sync.set({ options });
    chrome.tabs.reload();
  }
});

// ----------------------
// ✅ FUNCIONES AUXILIARES
// ----------------------

// Actualiza el formulario con las opciones actuales
function updateForm(): void {
  for (const key in options) {
    const input = optionsForm.elements.namedItem(
      key
    ) as HTMLInputElement | null;
    if (input) {
      input.checked = options[key as keyof Options];
    }
  }
}
