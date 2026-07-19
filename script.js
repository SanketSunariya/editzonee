(() => {
  "use strict";

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const root = document.documentElement;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;

  /* =========================================
     LOADER
  ========================================= */

  function hideLoader() {
    const loader = $(".loader");

    if (!loader) return;

    loader.classList.add("is-hidden");

    setTimeout(() => {
      loader.remove();
    }, 900);
  }

  window.addEventListener("load", () => {
    setTimeout(hideLoader, 500);
  });

  // CDN fail hone par bhi loader remove ho jayega.
  setTimeout(hideLoader, 3000);

  /* =========================================
     MOUSE SPOTLIGHT
  ========================================= */

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  const cursorGlow = $(".cursor-glow");
  const cursorDot = $(".cursor-dot");
  const cursorRing = $(".cursor-ring");

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    root.style.setProperty("--mx", `${mouseX}px`);
    root.style.setProperty("--my", `${mouseY}px`);

    if (cursorGlow) {
      cursorGlow.style.transform = `
        translate(${mouseX - 210}px, ${mouseY - 210}px)
      `;
    }

    if (cursorDot) {
      cursorDot.style.transform = `
        translate(${mouseX}px, ${mouseY}px)
        translate(-50%, -50%)
      `;
    }
  });

  /* =========================================
     CUSTOM CURSOR
  ========================================= */

  if (finePointer && cursorRing) {
    let ringX = mouseX;
    let ringY = mouseY;

    function cursorAnimation() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.transform = `
        translate(${ringX}px, ${ringY}px)
        translate(-50%, -50%)
      `;

      requestAnimationFrame(cursorAnimation);
    }

    cursorAnimation();

    $$(
      "a, button, .tilt-card, input, textarea, select"
    ).forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.classList.add("is-active");
      });

      element.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("is-active");
      });
    });
  }

  /* =========================================
     HEADER HIDE / SHOW
  ========================================= */

  let previousScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.scrollY;
      const header = $(".site-header");

      if (header) {
        header.classList.toggle(
          "is-hidden",
          currentScroll > previousScroll &&
            currentScroll > 180
        );
      }

      previousScroll = currentScroll;

      /* Scroll progress */

      const progress = $(".scroll-progress span");

      if (progress) {
        const pageHeight =
          document.documentElement.scrollHeight -
          window.innerHeight;

        const progressValue = pageHeight
          ? (currentScroll / pageHeight) * 100
          : 0;

        progress.style.width = `${progressValue}%`;
      }
    },
    {
      passive: true
    }
  );

  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuToggle = $(".menu-toggle");
  const navigation = $(".nav");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        navigation.classList.toggle("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      const lines = menuToggle.querySelectorAll("span");

      if (lines.length >= 2) {
        lines[0].style.transform = isOpen
          ? "translateY(4px) rotate(45deg)"
          : "";

        lines[1].style.transform = isOpen
          ? "translateY(-4px) rotate(-45deg)"
          : "";
      }
    });

    $$(".nav a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });
  }

  /* =========================================
     SMOOTH ANCHOR LINKS
  ========================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(target, {
          offset: -95,
          duration: 1.3
        });
      } else {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* =========================================
     RIPPLE CLICK EFFECT
  ========================================= */

  $$(".ripple").forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();

      const ripple = document.createElement("span");

      const size = Math.max(
        rect.width,
        rect.height
      );

      ripple.className = "ripple-effect";

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      ripple.style.left = `
        ${event.clientX - rect.left - size / 2}px
      `;

      ripple.style.top = `
        ${event.clientY - rect.top - size / 2}px
      `;

      button.appendChild(ripple);

      ripple.addEventListener(
        "animationend",
        () => {
          ripple.remove();
        }
      );
    });
  });

  /* =========================================
     MAGNETIC BUTTONS
  ========================================= */

  if (finePointer && !reducedMotion) {
    $$(".magnetic").forEach((element) => {
      element.addEventListener(
        "mousemove",
        (event) => {
          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          if (window.gsap) {
            gsap.to(element, {
              x: x * 0.14,
              y: y * 0.14,
              duration: 0.3,
              ease: "power3.out"
            });
          } else {
            element.style.transform = `
              translate(${x * 0.14}px, ${y * 0.14}px)
            `;
          }
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          if (window.gsap) {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.4)"
            });
          } else {
            element.style.transform = "";
          }
        }
      );
    });
  }

  /* =========================================
     5D TILT CARDS
  ========================================= */

  if (finePointer && !reducedMotion) {
    $$(".tilt-card").forEach((card) => {
      card.addEventListener(
        "mousemove",
        (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          card.style.setProperty(
            "--cx",
            `${x * 100}%`
          );

          card.style.setProperty(
            "--cy",
            `${y * 100}%`
          );

          const rotateY = (x - 0.5) * 8;
          const rotateX = (0.5 - y) * 7;

          if (window.gsap) {
            gsap.to(card, {
              rotateX,
              rotateY,
              y: -7,
              scale: 1.012,
              transformPerspective: 900,
              duration: 0.32,
              ease: "power2.out"
            });
          } else {
            card.style.transform = `
              perspective(900px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              translateY(-7px)
            `;
          }
        }
      );

      card.addEventListener(
        "mouseleave",
        () => {
          if (window.gsap) {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "elastic.out(1, 0.4)"
            });
          } else {
            card.style.transform = "";
          }
        }
      );
    });
  }

  /* =========================================
     FAQ ACCORDION
  ========================================= */

  $$(".accordion-item button").forEach(
    (button) => {
      button.addEventListener("click", () => {
        const item = button.closest(
          ".accordion-item"
        );

        $$(".accordion-item").forEach(
          (otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("open");
            }
          }
        );

        item.classList.toggle("open");
      });
    }
  );

  /* =========================================
     CONTACT FORM TO WHATSAPP
  ========================================= */

  const contactForm = $("#contactForm");

  if (contactForm) {
    contactForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const formData = new FormData(
          contactForm
        );

        const name =
          formData.get("name") || "";

        const phone =
          formData.get("phone") || "";

        const project =
          formData.get("project") || "";

        const message =
          formData.get("message") || "";

        const whatsappMessage = [
          "Hi EDITZONEE, I want to discuss a project.",
          "",
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Project Type: ${project}`,
          `Project Details: ${message}`
        ].join("\n");

        const whatsappURL =
          "https://wa.me/916376486873?text=" +
          encodeURIComponent(
            whatsappMessage
          );

        const status =
          $(".form-status", contactForm);

        if (status) {
          status.textContent =
            "Opening WhatsApp...";
        }

        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );

        setTimeout(() => {
          if (status) {
            status.textContent =
              "Your enquiry is ready on WhatsApp.";
          }
        }, 600);
      }
    );
  }

  /* =========================================
     AUTO YEAR
  ========================================= */

  const year = $("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  /* =========================================
     PARTICLES CANVAS
  ========================================= */

  const canvas = $("#particles");

  if (canvas) {
    const context = canvas.getContext("2d");

    let particles = [];

    function resizeCanvas() {
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        window.innerWidth * pixelRatio;

      canvas.height =
        window.innerHeight * pixelRatio;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      const particleCount =
        window.innerWidth < 700
          ? 28
          : 64;

      particles = Array.from(
        {
          length: particleCount
        },
        () => ({
          x:
            Math.random() *
            window.innerWidth,

          y:
            Math.random() *
            window.innerHeight,

          radius:
            Math.random() * 1.2 + 0.25,

          speed:
            Math.random() * 0.18 + 0.04,

          opacity:
            Math.random() * 0.35 + 0.08
        })
      );
    }

    function drawParticles() {
      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      particles.forEach((particle) => {
        particle.y -= particle.speed;

        if (particle.y < -5) {
          particle.y =
            window.innerHeight + 5;

          particle.x =
            Math.random() *
            window.innerWidth;
        }

        const distance = Math.hypot(
          particle.x - mouseX,
          particle.y - mouseY
        );

        const glowAmount = Math.max(
          0,
          1 - distance / 180
        );

        context.beginPath();

        context.arc(
          particle.x,
          particle.y,
          particle.radius + glowAmount,
          0,
          Math.PI * 2
        );

        const particleColor =
          glowAmount > 0.15
            ? "0,212,255"
            : "255,255,255";

        context.fillStyle = `
          rgba(
            ${particleColor},
            ${
              particle.opacity +
              glowAmount * 0.35
            }
          )
        `;

        context.fill();
      });

      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();

    window.addEventListener(
      "resize",
      resizeCanvas
    );
  }

  /* =========================================
     GSAP ANIMATIONS
  ========================================= */

  if (
    window.gsap &&
    window.ScrollTrigger &&
    !reducedMotion
  ) {
    gsap.registerPlugin(ScrollTrigger);

    /* Loader bar */

    gsap.to(".loader__bar span", {
      width: "100%",
      duration: 1.2,
      ease: "power2.inOut"
    });

    /* Hero heading */

    gsap.from(
      ".hero__title .line > span",
      {
        yPercent: 115,
        duration: 1.05,
        stagger: 0.09,
        ease: "power4.out",
        delay: 0.45
      }
    );

    /* Hero content */

    gsap.from(
      ".hero .eyebrow, .hero__text, .hero__actions, .hero__proof",
      {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.11,
        ease: "power3.out",
        delay: 0.75
      }
    );

    /* Editor visual */

    gsap.from(".hero__visual", {
      opacity: 0,
      y: 70,
      scale: 0.94,
      duration: 1.25,
      ease: "power3.out",
      delay: 0.65
    });

    /* Scroll reveal classes */

    $$(".reveal").forEach((element) => {
      gsap.from(element, {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 87%",
          once: true
        }
      });
    });

    $$(".reveal-up").forEach(
      (element) => {
        gsap.from(element, {
          y: 58,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        });
      }
    );

    $$(".reveal-left").forEach(
      (element) => {
        gsap.from(element, {
          x: -75,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 87%",
            once: true
          }
        });
      }
    );

    $$(".reveal-scale").forEach(
      (element) => {
        gsap.from(element, {
          scale: 0.91,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 87%",
            once: true
          }
        });
      }
    );

    $$(".reveal-blur").forEach(
      (element) => {
        gsap.from(element, {
          y: 35,
          opacity: 0,
          filter: "blur(14px)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 87%",
            once: true
          }
        });
      }
    );

    /* Service cards */

    if ($(".services-grid")) {
      gsap.from(".service-card", {
        y: 65,
        opacity: 0,
        rotateX: 10,
        stagger: 0.07,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 82%"
        }
      });
    }

    /* Course cards */

    if ($(".course-grid")) {
      gsap.from(".course-card", {
        y: 80,
        opacity: 0,
        scale: 0.95,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".course-grid",
          start: "top 82%"
        }
      });
    }

    /* Portfolio cards */

    if ($(".portfolio-grid")) {
      gsap.from(".portfolio-card", {
        y: 75,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".portfolio-grid",
          start: "top 84%"
        }
      });
    }

    /* Stats */

    if ($(".stats-grid")) {
      gsap.from(".stat", {
        scale: 0.86,
        opacity: 0,
        stagger: 0.11,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 86%"
        }
      });
    }

    /* Process steps */

    if ($(".process-line")) {
      gsap.from(".process-line article", {
        y: 45,
        opacity: 0,
        stagger: 0.13,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".process-line",
          start: "top 82%"
        }
      });
    }

    /* Hero editor parallax */

    if ($(".editor-shell")) {
      gsap.to(".editor-shell", {
        y: -35,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    /* Floating cards */

    gsap.to(
      ".floating-card--followers",
      {
        y: -18,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );

    gsap.to(
      ".floating-card--rating",
      {
        y: 16,
        duration: 3.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );

    /* Counters */

    $$("[data-count]").forEach(
      (counter) => {
        const finalValue = Number(
          counter.dataset.count
        );

        const object = {
          value: 0
        };

        gsap.to(object, {
          value: finalValue,
          duration: 1.8,
          ease: "power2.out",
          delay: 1,
          onUpdate: () => {
            counter.textContent =
              object.value.toFixed(1);
          }
        });
      }
    );
  }

  /* =========================================
     LENIS SMOOTH SCROLL
  ========================================= */

  if (window.Lenis && !reducedMotion) {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1
    });

    window.lenisInstance = lenis;

    if (
      window.gsap &&
      window.ScrollTrigger
    ) {
      lenis.on(
        "scroll",
        ScrollTrigger.update
      );
    }

    function smoothScrollFrame(time) {
      lenis.raf(time);

      requestAnimationFrame(
        smoothScrollFrame
      );
    }

    requestAnimationFrame(
      smoothScrollFrame
    );
  }
})();

/* =====================================
   PREMIUM INFINITE TESTIMONIAL SLIDER
===================================== */

document.addEventListener("", () => {
    const track = document.querySelector(".testimonial-track");

    if (!track) return;

    // Duplicate only once
    if (track.dataset.sliderReady === "true") return;
    track.dataset.sliderReady = "true";

    const originalCards = Array.from(track.children);

    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    let position = 0;
    let speed = 0.55;
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;
    let previousTime = performance.now();

    function getLoopWidth() {
        const gap = parseFloat(getComputedStyle(track).gap) || 0;

        return originalCards.reduce((total, card) => {
            return total + card.getBoundingClientRect().width + gap;
        }, 0);
    }

    function animate(currentTime) {
        const delta = Math.min(
            (currentTime - previousTime) / 16.67,
            2
        );

        previousTime = currentTime;

        if (!isPaused && !isDragging) {
            position -= speed * delta;
        }

        const loopWidth = getLoopWidth();

        if (loopWidth > 0) {
            while (position <= -loopWidth) {
                position += loopWidth;
            }

            while (position > 0) {
                position -= loopWidth;
            }
        }

        track.style.transform =
            `translate3d(${position}px, 0, 0)`;

        requestAnimationFrame(animate);
    }

    track.addEventListener("mouseenter", () => {
        isPaused = true;
    });

    track.addEventListener("mouseleave", () => {
        isPaused = false;
        isDragging = false;
    });

    track.addEventListener("pointerdown", (event) => {
        isDragging = true;
        isPaused = true;
        startX = event.clientX;
        startPosition = position;

        track.setPointerCapture?.(event.pointerId);
    });

    track.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        position =
            startPosition + (event.clientX - startX);
    });

    function finishDragging(event) {
        if (!isDragging) return;

        isDragging = false;
        isPaused = false;

        track.releasePointerCapture?.(event.pointerId);
    }

    track.addEventListener("pointerup", finishDragging);
    track.addEventListener("pointercancel", finishDragging);

    document.addEventListener("visibilitychange", () => {
        isPaused = document.hidden;
    });

    requestAnimationFrame(animate);
});

/* ===================================
   BEFORE / AFTER COMPARISON SLIDER
=================================== */

document.addEventListener("DOMContentLoaded", () => {
    const comparison = document.querySelector(".before-after");

    if (!comparison) return;

    const range = comparison.querySelector(".before-after__range");

    if (!range) return;

    function updateSlider() {
        comparison.style.setProperty(
            "--position",
            `${range.value}%`
        );
    }

    range.addEventListener("input", updateSlider);

    range.addEventListener("dblclick", () => {
        range.value = 50;
        updateSlider();
    });

    updateSlider();
});