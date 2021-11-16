const IS_DEV_MODE = !("update_url" in chrome.runtime.getManifest());

window.onload = function () {
  // This observer will actively hide when loading more feed
  let observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        for (let addedNode of mutation.addedNodes) {
          if (
            addedNode.nodeName === "DIV" &&
            (addedNode.classList.contains("feed-shared-update-v2") ||
              addedNode.classList.contains("occludable-update"))
          ) {
            if (addedNode.querySelector("div.feed-shared-poll")) {
              console.log("ocultando");
              addedNode.classList.add("hidden");
            }
          }
        }
      }
    }
  });

  // This will capture the initial doc
  // The observable won't capture it
  let initialPollList = document.querySelectorAll(
    "div.feed-shared-update-v2, div.occludable-update"
  );

  for (i = 0; i < initialPollList.length; ++i) {
    if (initialPollList[i].querySelector("div.feed-shared-poll")) {
      console.log("1er Ocultar");
      initialPollList[i].classList.add("hidden");
    }
  }

  // We put the observer over the document
  // TODO: better capture of nodes instead of document would be performant
  observer.observe(document, { childList: true, subtree: true });
};
