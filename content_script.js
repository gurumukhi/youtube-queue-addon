var loggingEnabled = false;
var initCalled = false;

var i = document.createElement('input');
i.type = "image";
i.src = "https://static.thenounproject.com/png/93129-200.png";
i.id = 'playNext';
i.classList.add('playNextAddonBtn');
i.title = "Play this video next";

addedCSSOn = [];

addButtonsIfRequired = function () {
  for (j=0; j < document.querySelectorAll('ytd-compact-video-renderer').length; j++) {
    ii = i.cloneNode();
    ii.id += j;
    if (document.querySelectorAll('ytd-compact-video-renderer')[j].querySelector('#'+ii.id)) {
    } else {
      document.querySelectorAll('ytd-compact-video-renderer')[j].appendChild(ii);
      ii.removeEventListener('click', clickAction);
      ii.addEventListener('click', clickAction);
    }
  }
  setTimeout(addButtonsIfRequired, 5000);
};

addCSS = function () {
  if (addedCSSOn.indexOf(document.location.href) > -1) {
    return;
  }
  addedCSSOn.push(document.location.href);
  var css = '';
  css += ".playNextAddonBtn:hover { opacity: 1; }";
  css += ".playNextAddonBtn { opacity: 0.4; margin-top: 30px; height: 20px; width: 20px; }";
  css += ".playNextAddonBtnActive { opacity: 1; border: 2px solid black; }";
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);
};

addButtonOnYoutubePlayer = function () {
  addButtonsIfRequired();
  addCSS();
  document.querySelector('video').addEventListener('ended', playNext);
};

clickAction = (e) => {
  setPlayNextURL(e.target.closest('ytd-compact-video-renderer').querySelector('a').href);
  currentActive = document.querySelector('.playNextAddonBtnActive');
  if (currentActive) {
    currentActive.classList.remove('playNextAddonBtnActive');
    currentActive.title = "Play this video next";
  }
  e.target.classList.add('playNextAddonBtnActive');
  e.target.title = "This video is added to queue to be played next.";
  e.preventDefault();
  e.stopPropagation();
};

setPlayNextURL = (url) => {
  var storageItem = browser.storage.local.get();
  storageItem.then((value) => {
    if (value.youtubePlayNextURL == url) {
      return false;
    } else {
      browser.storage.local.set({
        youtubePlayNextURL  : url
      });
      return true;
    }
  });
};

playNext = () => {
  var storageItem = browser.storage.local.get();
  storageItem.then((value) => {
    if (value.youtubePlayNextURL) {
      browser.storage.local.set({
        youtubePlayNextURL  : "#"
      });
      window.location.href = value.youtubePlayNextURL;
    }
  });
};

addEventListener = function() {
  logger('Adding button event listener');
  var youtubeScreenshotButton = document.querySelector('.ytp-screenshot');
  youtubeScreenshotButton.removeEventListener('click', captureScreenshot);
  youtubeScreenshotButton.addEventListener('click', captureScreenshot);
};

logger = function(message) {
  if (loggingEnabled) {
  }
};

init = function () {
  if (initCalled) {
    return;
  }

  initCalled = true;
  // Initialization
  var storageItem = browser.storage.local.get();
  storageItem.then((result) => {
    if (result.YouTubeQueueAddonisDebugModeOn) {
      logger('Addon initializing!');
      loggingEnabled = true;
    }
    addButtonOnYoutubePlayer();
    addEventListener();
  });
};

setTimeout(init, 5000);