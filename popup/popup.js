// In-page cache of the user's options
const options = {
  polls: false,
  debug: false,
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

let optionsForm = document.getElementById("popup-form");

optionsForm.addEventListener("change", function (event) {
  options[event.target.name] = event.target.checked;
  chrome.storage.sync.set({ options });
});

function updateForm() {
  for (const property in options) {
    optionsForm[property].checked = options[property];
  }
}
