/* ToDos:
  1. Better button
  2. Better button placement
  3. Add button to right side playlist videos too
  4. Enable auto play on navigating to next
  5. ..

  Debug / corner cases:
  1. How is it behaving with AutoPlay on
*/

var loggingEnabled = false;
var initCalled = false;

addButtonOnYoutubePlayer = function () {
  var i = document.createElement('input');
  i.type = "image";
  i.src = "https://static.thenounproject.com/png/93129-200.png";
  i.id = 'playNext';
  i.classList.add('playNextAddonBtn');
  i.title = "Play this video next";

  for (j=0; j < document.querySelectorAll('ytd-compact-video-renderer').length; j++) {
    console.log(document.querySelectorAll('ytd-video-meta-block')[j]);
    ii = i.cloneNode();
    ii.id += j;
    console.log(ii.id);
    // document.querySelectorAll('ytd-video-meta-block')[j].appendChild(ii);
    // console.log(document.querySelectorAll('ytd-compact-video-renderer')[j]);
    // document.querySelectorAll('a.yt-simple-endpoint')[j].appendChild(i);
    // document.querySelectorAll('span#video-title.style-scope.ytd-compact-video-renderer')[j].appendChild(i);
    document.querySelectorAll('ytd-compact-video-renderer')[j].appendChild(ii);
  }
  document.querySelectorAll('.playNextAddonBtn').forEach(b => {
    b.addEventListener('click', (e) => {
      setPlayNextURL(b.closest('ytd-compact-video-renderer').querySelector('a').href);
      currentActive = document.querySelector('.playNextAddonBtnActive');
      if (currentActive) {
        currentActive.classList.remove('playNextAddonBtnActive');
        currentActive.title = "Play this video next";
      }
      b.classList.add('playNextAddonBtnActive');
      b.title = "This video is added to queue to be played next.";
      e.preventDefault();
      e.stopPropagation();
    });
  });
  v = document.querySelector('video');
  v.addEventListener('ended', () => {console.log('ended current'); playNext();});

  var css = '';
  css += ".playNextAddonBtn:hover { opacity: 1; }";
  css += ".playNextAddonBtn { opacity: 0.4; margin-top: 30px; height: 20px; width: 20px; }";
  css += ".playNextAddonBtnActive { opacity: 1; border: 2px solid black; }";
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);
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
    console.log(value);
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
    console.log(`Youtube Screenshot Addon: ${message}`);
  }
};

init = function () {
  if (initCalled) {
    console.log('NOT SETTING');
    return;
  }

  console.log('SETTING');
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

autoPlay = () => {
  console.log("AUTOPLAY CHECK");
  var storageItem = browser.storage.local.get();
  storageItem.then((value) => {
    if (value.youtubePlayNextURL == '#') {
      browser.storage.local.set({
        youtubePlayNextURL  : ""
      });
      v = document.querySelector('video');
      v.play();
    }
  });
};

setTimeout(autoPlay, 2000);
setTimeout(init, 5000);