/**
 * CodeUI Download Website - Interactive logic
 * - OS Auto-detection & Dynamic "YOUR OS" badge
 * - Dropdown & Direct installer download handler
 * - Download toast feedback
 * - Developer Profiles Modal (@iamriteshhh & @Serion89)
 * - Tab bar GitHub Star button with live stars count
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

  // 3. Versatile Toast Notification Feedback
  var toastTimer = null;
  function showToast(title, subtitle, icon) {
    var toast = document.getElementById('download-toast');
    var toastTitle = document.getElementById('toast-title');
    var toastSub = document.getElementById('toast-sub');
    var toastIcon = toast ? toast.querySelector('.toast-icon') : null;

    if (!toast) return;

    if (toastTitle) toastTitle.textContent = title || 'CodeUI';
    if (toastSub) toastSub.textContent = subtitle || '';
    if (toastIcon && icon) toastIcon.textContent = icon;

    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      if (toastIcon) toastIcon.textContent = '⬇';
    }, 4500);
  }

  function showDownloadToast(filename) {
    showToast(
      'Downloading ' + (filename || 'CodeUI') + '...',
      'Thank you for choosing CodeUI for your computer lab.',
      '⬇'
    );
  }

  // 4. Attach Click Handlers to All Download Links & Selects
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

        if (val.indexOf('/releases/download/') !== -1) {
          // Direct installer binary download from GitHub Releases
          var parts = val.split('/');
          var name = parts[parts.length - 1];
          var a = document.createElement('a');
          a.href = val;
          a.setAttribute('download', name);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showDownloadToast(name);
        } else if (val.startsWith('http')) {
          window.open(val, '_blank', 'noopener,noreferrer');
        } else {
          // Fallback local download
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

  // 5. Developer Profiles Modal (@iamriteshhh & @Serion89)
  function setupDeveloperModal() {
    var modal = document.getElementById('dev-modal');
    var closeBtn = document.getElementById('modal-close-btn');
    var navTrigger = document.getElementById('nav-github-btn');
    var footerTrigger = document.getElementById('footer-github-btn');

    if (!modal) return;

    function openModal() {
      modal.style.display = 'flex';
      // Force reflow for smooth opacity & transform transition
      void modal.offsetWidth;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('show');
      setTimeout(function () {
        if (!modal.classList.contains('show')) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      }, 250);
    }

    if (navTrigger) {
      navTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }

    if (footerTrigger) {
      footerTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });
  }

  // 6. Tab Bar GitHub Star Button & Live Count
  function setupStarButtons() {
    var starBtns = [
      document.getElementById('btn-star-repo'),
      document.getElementById('btn-star-mobile')
    ];
    var starCountEls = [
      document.getElementById('star-count'),
      document.getElementById('star-count-mobile')
    ];

    var currentStars = 2; // Baseline stars count

    function updateDisplay(count) {
      starCountEls.forEach(function (el) {
        if (el) el.textContent = String(count);
      });
    }

    // Attempt live star count fetch from GitHub API
    fetch('https://api.github.com/repos/iamriteshhh/CodeUI')
      .then(function (res) {
        if (res.ok) return res.json();
        throw new Error('API unavailable');
      })
      .then(function (data) {
        if (data && typeof data.stargazers_count === 'number') {
          currentStars = data.stargazers_count;
          updateDisplay(currentStars);
        }
      })
      .catch(function () {
        // Fallback to baseline
        updateDisplay(currentStars);
      });

    var hasStarred = false;

    starBtns.forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        if (!hasStarred) {
          hasStarred = true;
          currentStars += 1;
          updateDisplay(currentStars);
          starBtns.forEach(function (b) {
            if (b) b.classList.add('starred');
          });
          showToast(
            'Thank you for starring CodeUI! ⭐',
            'Redirecting to github.com/iamriteshhh/CodeUI',
            '⭐'
          );
        } else {
          showToast(
            'CodeUI on GitHub ⭐',
            'Opening github.com/iamriteshhh/CodeUI',
            '⭐'
          );
        }
      });
    });
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    setupOSBadge();
    setupDownloadListeners();
    setupDeveloperModal();
    setupStarButtons();
  });

})();
