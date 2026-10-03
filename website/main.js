/**
 * CodeUI Download Website - Interactive logic
 * - OS Auto-detection
 * - Dynamic "YOUR OS" badge
 * - Dropdown download handler
 * - Download toast feedback
 */

(function () {
  'use strict';

  // 1. Detect User Operating System
  function detectOS() {
    var userAgent = window.navigator.userAgent || '';
    var platform = window.navigator.platform || '';
    var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'darwin'];
    var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1 || /Windows NT/i.test(userAgent)) {
      return 'windows';
    }
    if (macosPlatforms.indexOf(platform) !== -1 || /Macintosh|Mac OS X/i.test(userAgent)) {
      return 'mac';
    }
    if (/Linux/i.test(platform) || /Linux|Ubuntu|Debian|Fedora|X11/i.test(userAgent)) {
      return 'linux';
    }
    return null;
  }

  // 2. Highlight Detected OS Card
  function setupOSBadge() {
    var detected = detectOS();
    if (!detected) return;

    var cardMap = {
      'windows': { card: 'card-windows', badge: 'badge-windows' },
      'mac': { card: 'card-mac', badge: 'badge-mac' },
      'linux': { card: 'card-linux', badge: 'badge-linux' }
    };

    var target = cardMap[detected];
    if (target) {
      var cardEl = document.getElementById(target.card);
      var badgeEl = document.getElementById(target.badge);

      if (cardEl) {
        cardEl.classList.add('detected');
      }
      if (badgeEl) {
        badgeEl.style.display = 'inline-block';
      }
    }
  }

  // 3. Toast Notification for Download Feedback
  var toastTimer = null;
  function showDownloadToast(filename) {
    var toast = document.getElementById('download-toast');
    var toastTitle = document.getElementById('toast-title');
    var toastSub = document.getElementById('toast-sub');

    if (!toast) return;

    if (toastTitle) {
      toastTitle.textContent = 'Downloading ' + (filename || 'CodeUI') + '...';
    }
    if (toastSub) {
      toastSub.textContent = 'Thank you for choosing CodeUI for your computer lab.';
    }

    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 4500);
  }

  // 4. Attach Click Handlers to All Download Links
  function setupDownloadListeners() {
    var downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var filename = link.getAttribute('data-filename') || link.getAttribute('download') || 'CodeUI';
        showDownloadToast(filename);
      });
    });

    // Dropdown selects
    var selects = document.querySelectorAll('.download-select');
    selects.forEach(function (sel) {
      sel.addEventListener('change', function () {
        var val = sel.value;
        if (!val) return;

        if (val.startsWith('http')) {
          window.open(val, '_blank', 'noopener,noreferrer');
        } else {
          // Trigger local download
          var a = document.createElement('a');
          a.href = val;
          var parts = val.split('/');
          var name = parts[parts.length - 1];
          a.setAttribute('download', name);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showDownloadToast(name);
        }

        // Reset select to default
        sel.selectedIndex = 0;
      });
    });
  }

  // 5. Keyboard shortcut Ctrl+Shift+P
  function setupSearchKbd() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        var searchEl = document.querySelector('.nav-search');
        if (searchEl) {
          searchEl.style.borderColor = '#0098ff';
          setTimeout(function () {
            searchEl.style.borderColor = '';
          }, 800);
        }
        showDownloadToast('CodeUI Search / Command Palette');
      }
    });
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    setupOSBadge();
    setupDownloadListeners();
    setupSearchKbd();
  });

})();
