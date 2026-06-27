const businessEmail = "your.email@example.com"; // Replace this with your real business email before publishing.

const navToggle = document.querySelector("#navToggle");
const siteNav = document.querySelector("#siteNav");
const navLinks = document.querySelectorAll(".site-nav a");
const progressBar = document.querySelector("#progressBar");
const cursorGlow = document.querySelector("#cursorGlow");

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / height) * 100}%`;
});

window.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll("main section[id]");
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach((section) => activeObserver.observe(section));

const toggleButtons = document.querySelectorAll(".toggle-btn");
const priceElements = document.querySelectorAll(".price");

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const currency = button.dataset.currency;
    priceElements.forEach((price) => {
      price.textContent = currency === "zar" ? price.dataset.zar : price.dataset.usd;
    });
  });
});

const pages = document.querySelector("#pages");
const pageCount = document.querySelector("#pageCount");
const needsForm = document.querySelector("#needsForm");
const needsCopy = document.querySelector("#needsCopy");
const needsRush = document.querySelector("#needsRush");
const estimateTotal = document.querySelector("#estimateTotal");
const estimateCta = document.querySelector("#estimateCta");

function calculateEstimate() {
  const pageValue = Number(pages.value);
  let total = 500 + ((pageValue - 1) * 220);
  if (needsForm.checked) total += 180;
  if (needsCopy.checked) total += 250;
  if (needsRush.checked) total += 300;
  pageCount.textContent = pageValue;
  estimateTotal.textContent = `R${total.toLocaleString("en-ZA")}`;
  estimateCta.dataset.estimate = estimateTotal.textContent;
}

[pages, needsForm, needsCopy, needsRush].forEach((input) => {
  input.addEventListener("input", calculateEstimate);
});
calculateEstimate();

estimateCta.addEventListener("click", () => {
  const message = document.querySelector("#message");
  message.value = `Hi, I used the estimate tool and my rough estimate was ${estimateCta.dataset.estimate}. I need a website with ${pages.value} page(s).`;
});

const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    workCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !shouldShow);
    });
  });
});

const packageButtons = document.querySelectorAll(".choose-package");
const packageSelect = document.querySelector("#package");

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".price-card");
    packageSelect.value = card.dataset.package;
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  });
});

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const isOpen = question.classList.toggle("open");
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0";
  });
});

const copyEmail = document.querySelector("#copyEmail");
copyEmail.dataset.email = businessEmail;
copyEmail.textContent = `Copy email: ${businessEmail}`;

copyEmail.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(businessEmail);
    copyEmail.textContent = "Email copied ✓";
    setTimeout(() => copyEmail.textContent = `Copy email: ${businessEmail}`, 1800);
  } catch (error) {
    copyEmail.textContent = "Copy failed — replace email in code";
  }
});

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const selectedPackage = document.querySelector("#package").value;
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in all required fields.";
    return;
  }

  const subject = encodeURIComponent(`Website enquiry — ${selectedPackage}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPackage: ${selectedPackage}\n\nProject details:\n${message}`);
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email app. Replace the placeholder email before publishing.";
});

document.querySelector("#year").textContent = new Date().getFullYear();
