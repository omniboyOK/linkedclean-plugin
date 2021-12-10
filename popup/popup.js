// To know if plugin is runing unpacked
const IS_DEV_MODE = true;

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

// -- Let's hide debuging from our users
!IS_DEV_MODE && (document.getElementById("debug-input").style.display = "none");

optionsForm.addEventListener("change", function (event) {
  options[event.target.name] = event.target.checked;
  chrome.storage.sync.set({ options });
  chrome.tabs.reload(function(){});
});

function updateForm() {
  for (const property in options) {
    optionsForm[property].checked = options[property];
  }
}
