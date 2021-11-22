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
  console.log(options);
});

const IS_DEV_MODE = !("update_url" in chrome.runtime.getManifest());

window.onload = function () {
  options.polls && filterPolls();
};

function filterPolls() {
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
            if (isPoll(addedNode)) {
              options.debug
                ? createFlag(addedNode, "Poll", "#FF5403", "#FFCA03")
                : addedNode.classList.add("hidden");
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
    if (isPoll(initialPollList[i])) {
      options.debug
        ? createFlag(initialPollList[i], "Poll", "#FF5403", "#FFCA03")
        : initialPollList[i].classList.add("hidden");
    }
  }

  // We put the observer over the document
  // TODO: better capture of nodes instead of document would be performant
  observer.observe(document, { childList: true, subtree: true });
}

// Check from component if it is or contains a poll
function isPoll(html) {
  return html.querySelector("div.feed-shared-poll");
}

function createFlag(element, type, background = "#fff", color = "#000") {
  // Create flag text
  let text = `This is a hidden ${type}`;

  // Create Header
  let header = document.createElement("h4");
  header.textContent = text;
  header.style.setProperty("color", color);

  // Mutate Post
  element.innerHTML = header.outerHTML;
  element.style.setProperty("text-align", "center");
  element.style.setProperty("magin", "5px");
  element.style.setProperty("background-color", background, "important");
}
