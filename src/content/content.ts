// ----------------------
// ✅ CONFIGURACIÓN GLOBAL
// ----------------------

// Indica si el plugin está en modo de desarrollo (sin empaquetar)
const IS_DEV_MODE: boolean = !("update_url" in chrome.runtime.getManifest());

// Clases base de LinkedIn para identificar publicaciones
const BASE_FEED_CLASS: string = "feed-shared-update-v2";
const BASE_FEED_FIRST_ITEM_CLASS: string =
  "div.feed-shared-update-v2, div.occludable-update";
const USER_DESCRIPTION_CLASS: string = "feed-shared-actor__description";

// Tipos de opciones
interface Options {
  debug: boolean;
  polls: boolean;
}

// Configuración predeterminada de opciones del usuario
let options: Options = {
  debug: false,
  polls: true,
};

// ----------------------
// ✅ INICIALIZACIÓN
// ----------------------

// Carga las opciones almacenadas en `chrome.storage.sync`
function loadOptions(): void {
  chrome.storage.sync.get("options", (data) => {
    if (data.options) {
      options = { ...options, ...data.options };
    } else {
      chrome.storage.sync.set({ options });
    }
  });
}

// Ejecuta la función principal cuando la ventana carga
window.onload = (): void => {
  loadOptions();
  mainFilter();
};

// ----------------------
// ✅ FILTROS PRINCIPALES
// ----------------------

// Activa la observación de cambios en el DOM
function mainFilter(): void {
  // Carga inicial de filtros antes de observar cambios
  if (options.polls) filterPollOnLoad();

  // Observador de cambios en el feed
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && options.polls) {
        filterPolls(mutation);
      }
    });
  });

  // Observamos el documento completo
  observer.observe(document, { childList: true, subtree: true });
}

// Filtra encuestas dentro de los nuevos elementos agregados al feed
function filterPolls(mutation: MutationRecord): void {
  mutation.addedNodes.forEach((addedNode) => {
    if (addedNode instanceof HTMLElement) {
      if (
        addedNode.nodeName === "DIV" &&
        (addedNode.classList.contains(BASE_FEED_CLASS) ||
          addedNode.classList.contains("occludable-update"))
      ) {
        if (isPoll(addedNode)) {
          if (options.debug) {
            createFlag(addedNode, "Poll", "#FF5403", "#000");
          } else {
            addedNode.classList.add("hidden");
          }
        }
      }
    }
  });
}

// Filtra encuestas ya presentes al cargar la página
function filterPollOnLoad(): void {
  const initialPollList: NodeListOf<Element> = document.querySelectorAll(
    BASE_FEED_FIRST_ITEM_CLASS
  );

  initialPollList.forEach((post) => {
    if (post instanceof HTMLElement && isPoll(post)) {
      if (options.debug) {
        createFlag(post, "Poll", "#FF5403", "#000");
      } else {
        post.classList.add("hidden");
      }
    }
  });
}

// ----------------------
// ✅ FUNCIONES AUXILIARES
// ----------------------

// Verifica si un elemento del feed es una encuesta
function isPoll(element: HTMLElement): boolean {
  return element.querySelector("div.feed-shared-poll") !== null;
}

// Crea un cartel de depuración para elementos filtrados
function createFlag(
  element: HTMLElement,
  type: string,
  border: string = "#000",
  color: string = "#000"
): void {
  const header = document.createElement("h4");
  header.textContent = `This is a hidden ${type}`;
  header.style.color = color;

  element.innerHTML = header.outerHTML;
  element.style.textAlign = "center";
  element.style.margin = "5px";
  element.style.border = `2px solid ${border} !important`;
}
