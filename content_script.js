var loggingEnabled = false;
var initCalled = false;

var i = document.createElement('input');
i.type = "image";
i.id = 'playNext';
i.classList.add('playNextAddonBtn');
i.title = "Play this video next";

addButtonsIfRequired = function () {
  var isDarkThemeEnabled = document.querySelector('html').getAttribute('dark') == 'true';
  logger('isDarkThemeEnabled? - ' + isDarkThemeEnabled);

  for (j=0; j < document.querySelectorAll('ytd-compact-video-renderer').length; j++) {
    if (!document.querySelectorAll('ytd-compact-video-renderer')[j].querySelector('#'+'playNext'+j)) {
      ii = i.cloneNode();
      ii.id += j;
      if (isDarkThemeEnabled) {
        ii.src = browser.extension.getURL("icons/playnexticon-dark-theme.png");
      } else {
        ii.src = browser.extension.getURL("icons/playnexticon.png");
      }
      document.querySelectorAll('ytd-compact-video-renderer')[j].appendChild(ii);
      ii.removeEventListener('click', clickAction);
      ii.addEventListener('click', clickAction);
    }
  }

  allBtns = document.querySelectorAll('input.playNextAddonBtn');
  console.log('CHECKING image color issue');
  if (allBtns[0].src == browser.extension.getURL("icons/playnexticon.png") && isDarkThemeEnabled) {
    console.log('found white theme image in dark theme, fixing this');
    // found white theme image in dark theme, fix this
    allBtns.forEach(btn => {
      btn.src = browser.extension.getURL("icons/playnexticon-dark-theme.png");
      btn.classList.remove('whiteThemeBtn');
      btn.classList.add('blackThemeBtn');
    });
  }
  else if (allBtns[0].src == browser.extension.getURL("icons/playnexticon-dark-theme.png") && !isDarkThemeEnabled) {
    console.log('found dark theme image in white theme, fixing this');
    // found dark theme image in white theme, fix this
    allBtns.forEach(btn => {
      btn.src = browser.extension.getURL("icons/playnexticon.png");
      btn.classList.add('whiteThemeBtn');
      btn.classList.remove('blackThemeBtn');
    });
  }

  setTimeout(addButtonsIfRequired, 5000);
};

addButtonOnYoutubePlayer = function () {
  addButtonsIfRequired();
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
        youtubePlayNextURL  : ""
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