/* ==========================================================================
   Sri Guru Kottureshwara Benne Dose Hotel JS Scripts
   Handles: Sticky Nav, Mobile Menu, Tabs, Carousel, Accordions, Exit Intent,
            Intersection Observer Scroll Animations, and Dynamic Analytics.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Sticky Navbar & Header Scroll State
  const header = document.querySelector('.main-header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
      if (scrollTopBtn) scrollTopBtn.style.display = 'flex';
    } else {
      header.classList.remove('scrolled');
      if (scrollTopBtn) scrollTopBtn.style.display = 'none';
    }
  });

  // 3. Scroll to Top Button Action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Mobile Drawer Toggle
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
      
      // Animate hamburger bars to 'X'
      const bars = hamburgerBtn.querySelectorAll('.hamburger-bar');
      if (hamburgerBtn.classList.contains('active')) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });

    // Close mobile menu on clicking any link
    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('active');
        const bars = hamburgerBtn.querySelectorAll('.hamburger-bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('active') && !mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('active');
        const bars = hamburgerBtn.querySelectorAll('.hamburger-bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  }

  // 5. Active Link Highlight on Scroll
  const navLinks = document.querySelectorAll('.desktop-nav a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120; // offset header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. Intersection Observer for Scroll Animations
  const animateElements = document.querySelectorAll('[data-animate]');
  
  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // trigger animation once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // trigger slightly before entering viewport
  });

  animateElements.forEach(el => animationObserver.observe(el));

  // 7. Menu Categorized Filter Tabs
  const menuTabBtns = document.querySelectorAll('.menu-tabs .tab-btn');
  const menuItemCards = document.querySelectorAll('.menu-grid .menu-item-card');

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active Tab class
      menuTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      // Filter logic
      menuItemCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hide');
          // Re-observe/re-trigger animations for displayed cards
          card.classList.add('animated');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // 8. Gallery Masonry Filter Logic
  const galleryFilterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.classList.remove('hide');
          item.classList.add('animated');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // 9. Testimonials Sliding Carousel
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (track && reviewCards.length > 0) {
    let currentIndex = 0;
    const cardCount = reviewCards.length;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cardCount;
        updateCarousel();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cardCount) % cardCount;
        updateCarousel();
        resetAutoPlay();
      });
    }

    // Auto Play Functionality
    let autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cardCount;
      updateCarousel();
    }, 6000);

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % cardCount;
        updateCarousel();
      }, 6000);
    };
  }

  // 10. FAQ Collapsible Accordions (Handles all 20 Items)
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other open accordion items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-content').style.maxHeight = '0';
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      });
    }
  });

  // 11. Exit Intent Detection and Modal Toggle
  const exitPopup = document.getElementById('exitPopup');
  const closeExitPopup = document.getElementById('closeExitPopup');
  const exitViewMenu = document.getElementById('exitViewMenu');
  let hasExited = sessionStorage.getItem('hasExited') || false;

  const showExitModal = () => {
    if (exitPopup && !hasExited) {
      exitPopup.classList.add('active');
      sessionStorage.setItem('hasExited', 'true');
      hasExited = true;
    }
  };

  // Trigger exit intent when mouse leaves the top boundary of the viewport
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 20) {
      showExitModal();
    }
  });

  if (closeExitPopup) {
    closeExitPopup.addEventListener('click', () => {
      exitPopup.classList.remove('active');
    });
  }

  if (exitViewMenu) {
    exitViewMenu.addEventListener('click', () => {
      exitPopup.classList.remove('active');
    });
  }

  // Close exit modal by clicking background overlay
  if (exitPopup) {
    exitPopup.addEventListener('click', (e) => {
      if (e.target === exitPopup) {
        exitPopup.classList.remove('active');
      }
    });
  }

  // 12. Conversion Tracking Analytics Placeholders
  const trackConversion = (eventName, metadata = {}) => {
    console.log(`[Google Tag Manager Event] name: ${eventName}`, metadata);
    // Real implementation hook for GA4 or Meta Pixel:
    // if (typeof window.dataLayer !== 'undefined') {
    //   window.dataLayer.push({ event: eventName, ...metadata });
    // }
  };

  // Wire conversion actions
  const directionButtons = document.querySelectorAll('a[href*="google.com/maps"]');
  directionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackConversion('click_directions', { destination: 'Google Maps Location' });
    });
  });

  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = new URL(btn.href);
      const message = url.searchParams.get('text') || '';
      trackConversion('click_whatsapp', { message_context: message });
    });
  });

  const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
  phoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackConversion('click_phone', { phone_number: btn.href });
    });
  });

  // 13. Admin Panel & Local Content Management System (CMS)
  const ADMIN_PIN = "9916"; // Default password
  const editableElements = document.querySelectorAll('[data-cms-id]');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const closeAdminLogin = document.getElementById('closeAdminLogin');
  const submitAdminPin = document.getElementById('submitAdminPin');
  const adminPinInput = document.getElementById('adminPin');
  const adminPinError = document.getElementById('adminPinError');
  const adminTriggerDot = document.getElementById('adminTriggerDot');

  const adminToolbar = document.getElementById('adminToolbar');
  const adminSaveBtn = document.getElementById('adminSaveBtn');
  const adminExportBtn = document.getElementById('adminExportBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  // A. Load Content from LocalStorage on page load
  const restoreCMSEdits = () => {
    editableElements.forEach(el => {
      const cmsId = el.getAttribute('data-cms-id');
      const savedVal = localStorage.getItem('cms-' + cmsId);
      if (savedVal !== null) {
        el.innerHTML = savedVal;
      }
    });
  };

  restoreCMSEdits();

  // B. Enable Edit Mode
  const enableEditMode = () => {
    document.body.classList.add('admin-mode-active');
    if (adminToolbar) adminToolbar.style.display = 'block';
    editableElements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
    });
  };

  // C. Disable Edit Mode
  const disableEditMode = () => {
    document.body.classList.remove('admin-mode-active');
    if (adminToolbar) adminToolbar.style.display = 'none';
    editableElements.forEach(el => {
      el.removeAttribute('contenteditable');
    });
  };

  // Check if admin is already logged in for this session
  if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
    enableEditMode();
  }

  // D. Handle Login PIN Access
  const showLoginModal = () => {
    if (adminLoginModal) {
      adminLoginModal.classList.add('active');
      adminPinInput.value = '';
      adminPinError.textContent = '';
      adminPinInput.focus();
    }
  };

  const hideLoginModal = () => {
    if (adminLoginModal) {
      adminLoginModal.classList.remove('active');
    }
  };

  // Trigger login modal via footer trigger dot
  if (adminTriggerDot) {
    adminTriggerDot.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginModal();
    });
  }

  // Trigger login modal via keyboard shortcut Ctrl + Shift + A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      showLoginModal();
    }
  });

  // Trigger login modal via URL query (?admin=true)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    window.history.replaceState({}, document.title, window.location.pathname);
    showLoginModal();
  }

  if (closeAdminLogin) {
    closeAdminLogin.addEventListener('click', hideLoginModal);
  }

  const verifyPin = () => {
    const enteredPin = adminPinInput.value.trim();
    if (enteredPin === ADMIN_PIN) {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      enableEditMode();
      hideLoginModal();
    } else {
      adminPinError.textContent = 'Incorrect PIN. Access Denied.';
      adminPinInput.value = '';
      adminPinInput.focus();
    }
  };

  if (submitAdminPin) {
    submitAdminPin.addEventListener('click', verifyPin);
  }

  if (adminPinInput) {
    adminPinInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        verifyPin();
      }
    });
  }

  // E. Save Changes to LocalStorage
  if (adminSaveBtn) {
    adminSaveBtn.addEventListener('click', () => {
      editableElements.forEach(el => {
        const cmsId = el.getAttribute('data-cms-id');
        const textVal = el.innerHTML;
        localStorage.setItem('cms-' + cmsId, textVal);
      });
      alert('Success! Content modifications saved locally in this browser. Reload the page to test.');
    });
  }

  // F. Logout Admin Mode
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('isAdminLoggedIn');
      disableEditMode();
      window.location.reload();
    });
  }

  // G. Export Clean, Production-Ready index.html Code
  if (adminExportBtn) {
    adminExportBtn.addEventListener('click', () => {
      const cleanDoc = document.cloneNode(true);
      
      const toolbarEl = cleanDoc.getElementById('adminToolbar');
      if (toolbarEl) toolbarEl.remove();
      
      const modalEl = cleanDoc.getElementById('adminLoginModal');
      if (modalEl) modalEl.remove();
      
      const triggerDotEl = cleanDoc.getElementById('adminTriggerDot');
      if (triggerDotEl) triggerDotEl.remove();

      cleanDoc.body.classList.remove('admin-mode-active');
      
      const cmsEditableNodes = cleanDoc.querySelectorAll('[data-cms-id]');
      cmsEditableNodes.forEach(node => {
        node.removeAttribute('contenteditable');
      });

      const htmlOutput = '<!DOCTYPE html>\n' + cleanDoc.documentElement.outerHTML;
      
      const blob = new Blob([htmlOutput], { type: 'text/html;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = 'index.html';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);
      
      alert('Pruned HTML file generated! Your modifications have been compiled directly into the HTML markup. Overwrite your server\'s "index.html" with this downloaded file to make the edits permanent for all users.');
    });
  }

});
