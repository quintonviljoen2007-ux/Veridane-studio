const businessEmail = "viljoenq352@gmail.com";
const formEndpoint = `https://formsubmit.co/ajax/${businessEmail}`;

const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

window.addEventListener("load", () => {
  qs("#pageLoader")?.classList.add("hidden");
});

const header = qs(".site-header");
const progressBar = qs("#progressBar");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  header?.classList.toggle("scrolled", scrollTop > 24);
});

const navToggle = qs("#navToggle");
const navMenu = qs("#navMenu");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

qsa(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

qsa(".reveal").forEach((element) => revealObserver.observe(element));

// Interactive custom cursor
const cursorDot = qs(".cursor-dot");
const cursorRing = qs(".cursor-ring");
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && cursorDot && cursorRing) {
  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  const hoverTargets = "a, button, input, textarea, select, label, .interactive-card";
  qsa(hoverTargets).forEach((target) => {
    target.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-hover"));
    target.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-hover"));
  });

  window.addEventListener("mousedown", () => cursorRing.classList.add("cursor-click"));
  window.addEventListener("mouseup", () => cursorRing.classList.remove("cursor-click"));
}

// Active nav link while scrolling
const sections = qsa("main section[id]");
const navLinks = qsa(".nav-menu a");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((section) => navObserver.observe(section));

// Currency toggle
qsa(".toggle-pill").forEach((button) => {
  button.addEventListener("click", () => {
    const currency = button.dataset.currency;
    qsa(".toggle-pill").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    qsa(".price").forEach((price) => {
      price.textContent = currency === "usd" ? price.dataset.usd : price.dataset.zar;
    });
  });
});

// Package buttons fill form
qsa(".choose-package").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPackage = button.dataset.package;
    const serviceSelect = qs("#service");
    const message = qs("#message");

    if (serviceSelect) {
      const matchingOption = [...serviceSelect.options].find((option) => selectedPackage.toLowerCase().includes(option.value.toLowerCase().split(" ")[0]));
      serviceSelect.value = matchingOption?.value || "Complete Web Presence";
    }

    if (message) {
      message.value = `Hi, I am interested in the ${selectedPackage} package. Please send me more information and a quote.`;
    }

    qs("#quote")?.scrollIntoView({ behavior: "smooth" });
  });
});

// Estimator
const pageRange = qs("#pageRange");
const pageCount = qs("#pageCount");
const estimatePrice = qs("#estimatePrice");
const needsCopy = qs("#needsCopy");
const needsForm = qs("#needsForm");
const rushDelivery = qs("#rushDelivery");
const useEstimate = qs("#useEstimate");

function calculateEstimate() {
  const pages = Number(pageRange?.value || 1);
  let total = 500 + pages * 250;
  if (needsCopy?.checked) total += 300;
  if (needsForm?.checked) total += 250;
  if (rushDelivery?.checked) total += 400;

  if (pageCount) pageCount.textContent = String(pages);
  if (estimatePrice) estimatePrice.textContent = `R${total.toLocaleString("en-ZA")}`;
  return total;
}

[pageRange, needsCopy, needsForm, rushDelivery].forEach((input) => {
  input?.addEventListener("input", calculateEstimate);
  input?.addEventListener("change", calculateEstimate);
});
calculateEstimate();

useEstimate?.addEventListener("click", () => {
  const pages = Number(pageRange?.value || 1);
  const total = calculateEstimate();
  const options = [];
  if (needsCopy?.checked) options.push("help with wording/copy");
  if (needsForm?.checked) options.push("a contact/quote form");
  if (rushDelivery?.checked) options.push("faster delivery");

  const message = qs("#message");
  const budget = qs("#budget");
  const service = qs("#service");

  if (service) service.value = pages > 1 ? "Complete Web Presence" : "One-page Website";
  if (budget) {
    budget.value = total <= 900 ? "R500 - R900" : total <= 1500 ? "R900 - R1,500" : total <= 2500 ? "R1,500 - R2,500" : "R2,500+";
  }
  if (message) {
    message.value = `Hi, I used the website estimator. My rough estimate is R${total.toLocaleString("en-ZA")} for ${pages} page(s). I need ${options.length ? options.join(", ") : "a simple website"}. Please contact me with the next steps.`;
  }

  qs("#quote")?.scrollIntoView({ behavior: "smooth" });
});

// Work filter
qsa(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    qsa(".filter-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    qsa(".work-card").forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

// FAQ accordion
qsa(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const answer = item.nextElementSibling;
    const isOpen = item.classList.toggle("open");
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0px";
  });
});

// Copy email
qs("#copyEmail")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(businessEmail);
    qs("#copyEmail").textContent = "Email copied";
    setTimeout(() => (qs("#copyEmail").textContent = "Copy email"), 1800);
  } catch {
    window.location.href = `mailto:${businessEmail}`;
  }
});

// Direct quote form submission through FormSubmit AJAX endpoint
const quoteForm = qs("#quoteForm");
const formStatus = qs("#formStatus");
const submitBtn = qs("#submitBtn");
const nextUrl = qs("#nextUrl");

if (nextUrl) {
  const cleanPath = window.location.pathname.replace(/index\.html$/, "");
  nextUrl.value = `${window.location.origin}${cleanPath}thanks.html`;
}

quoteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    return;
  }

  const formData = new FormData(quoteForm);
  const payload = Object.fromEntries(formData.entries());

  if (payload._honey) return;

  formStatus.textContent = "Sending your quote request...";
  formStatus.className = "form-status";
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const response = await fetch(formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Form service could not process the request.");

    quoteForm.reset();
    calculateEstimate();
    formStatus.textContent = "Thank you — your quote request has been sent. I will get back to you soon.";
    formStatus.className = "form-status success";
    submitBtn.textContent = "Request Sent";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Quote Request";
    }, 2500);
  } catch (error) {
    formStatus.textContent = "Something went wrong. Please try again, or email viljoenq352@gmail.com directly.";
    formStatus.className = "form-status error";
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Quote Request";
  }
});
