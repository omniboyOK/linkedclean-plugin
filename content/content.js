// To know if plugin is runing unpacked
const IS_DEV_MODE = !("update_url" in chrome.runtime.getManifest());
// Base class for a feed card
const BASE_FEED_CLASS = "feed-shared-update-v2";
// For some reason the first item on a feed list has different classes
const BASE_FEED_FIRST_ITEM_CLASS =
  "div.feed-shared-update-v2, div.occludable-update";
// User description class
const USER_DESCRIPTION_CLASS = "feed-shared-actor__description";

// ---- CACHE ----
// In-page cache of the user's options
options = {
  debug: false,
  polls: true,
};

chrome.storage.sync.get("options", function (data) {
  // Load data and update options
  if (data.options) {
    Object.assign(options, data.options);
    updateForm();
  } else {
    // if not then save the options
    chrome.storage.sync.set({ options });
  }
});

// ---- MAIN FUNCTION ----
/** Here we execute all the features based on user preference */
window.onload = function () {
  mainFilter();
};

// ---- FUNCTIONS ----
function mainFilter() {
  // Listen to DOM mutations to filter new feeds
  let observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        options.polls && filterPolls(mutation);
      }
    }
  });

  // On first load
  options.polls && filterPollOnLoad();

  // We put the observer over the document
  // TODO: better capture of nodes instead of document would be performant
  observer.observe(document, { childList: true, subtree: true });
}

function filterPolls(mutation) {
  for (let addedNode of mutation.addedNodes) {
    if (
      addedNode.nodeName === "DIV" &&
      (addedNode.classList.contains(BASE_FEED_CLASS) ||
        addedNode.classList.contains("occludable-update"))
    ) {
      if (isPoll(addedNode)) {
        options.debug
          ? createFlag(addedNode, "Poll", "#FF5403", "#000")
          : addedNode.classList.add("hidden");
      }
    }
  }
}

function filterPollOnLoad() {
  // This will capture the initial doc since the observable won't capture it
  let initialPollList = document.querySelectorAll(BASE_FEED_FIRST_ITEM_CLASS);

  for (i = 0; i < initialPollList.length; ++i) {
    if (isPoll(initialPollList[i])) {
      options.debug
        ? createFlag(initialPollList[i], "Poll", "#FF5403", "#000")
        : initialPollList[i].classList.add("hidden");
    }
  }
}

// Check from component if it is or contains a poll
function isPoll(html) {
  return html.querySelector("div.feed-shared-poll");
}

// A simple linkedin card for debuging
function createFlag(element, type, border = "#000", color = "#000") {
  // Create flag text
  let text = `This is a hidden ${type}`;

  // Create Header
  let header = document.createElement("h4");
  header.textContent = text;
  header.style.setProperty("color", color);

  // Mutate Post
  element.innerHTML = header.outerHTML;
  element.style.setProperty("text-align", "center");
  element.style.setProperty("border", "2px solid", "important")
  element.style.setProperty("margin", "5px");
  element.style.setProperty("border-color", border, "important");
}
