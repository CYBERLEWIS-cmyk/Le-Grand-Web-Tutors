document.addEventListener("DOMContentLoaded", () => {
    // =============================
    // Mobile nav toggle
    // =============================
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // Close menu when a link is clicked (mobile UX)
        nav.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                if (nav.classList.contains("open")) {
                    nav.classList.remove("open");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    // =============================
    // Footer year
    // =============================
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    const revealTargets = [
        ".section-head",
        ".card",
        ".step",
        ".trust-item",
        ".hero-card",
        ".mini-card",
        ".profile-card"
    ];

    const elements = document.querySelectorAll(revealTargets.join(","));
    elements.forEach((el) => {
        // Avoid double-adding in case you already had reveal classes
        if (!el.classList.contains("reveal")) el.classList.add("reveal");

        // Make cards/steps feel slightly more premium
        if (
            el.classList.contains("card") ||
            el.classList.contains("step") ||
            el.classList.contains("mini-card")
        ) {
            el.classList.add("pop");
        }
    });

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced && elements.length) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        elements.forEach((el) => io.observe(el));
    } else {
        // If reduced motion, show everything
        elements.forEach((el) => el.classList.add("is-visible"));
    }


    const form = document.getElementById("quoteForm");
    const waBtn = document.getElementById("whatsAppBtn");


    const EMAIL_TO = "legrantvankradenburg26@gmail.com";
    const WHATSAPP_TO = "27720880388"; // digits only. SA example: 0821234567 -> 27821234567

    const digitsOnly = (s) => (s || "").toString().replace(/\D/g, "");

    function requiredFilled(formEl) {
        const name = formEl.querySelector('input[name="name"]')?.value?.trim();
        const service = formEl.querySelector('select[name="service"]')?.value?.trim();
        const details = formEl.querySelector('textarea[name="details"]')?.value?.trim();
        return Boolean(name && service && details);
    }

    function buildMessage(formEl) {
        const name = formEl.querySelector('input[name="name"]')?.value?.trim() || "";
        const service = formEl.querySelector('select[name="service"]')?.value?.trim() || "";
        const details = formEl.querySelector('textarea[name="details"]')?.value?.trim() || "";
        const clientWhatsapp = formEl.querySelector('input[name="whatsapp"]')?.value?.trim() || "Not provided";

        return (
            `Name: ${name}\n` +
            `Request: ${service}\n` +
            `Client WhatsApp: ${clientWhatsapp}\n\n` +
            `Details:\n${details}`
        );
    }

    function validateWa(raw) {
        const n = digitsOnly(raw);
        if (!n) return { ok: false, reason: "WhatsApp number is empty." };
        if (n.startsWith("0")) return { ok: false, reason: "Do not start with 0. Use country code (27...)." };
        if (n.length < 10 || n.length > 15) return { ok: false, reason: "Number length is invalid." };
        return { ok: true, number: n };
    }

    if (form) {
        // Email submit (mailto)
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!requiredFilled(form)) {
                alert("Please fill in your name, select a service, and add details.");
                return;
            }

            const subject = encodeURIComponent("Website / Tutoring Request");
            const body = encodeURIComponent(buildMessage(form));
            window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
        });
    }

    if (form && waBtn) {
        waBtn.addEventListener("click", () => {
            if (!requiredFilled(form)) {
                alert("Please fill in your name, select a service, and add details.");
                return;
            }

            const check = validateWa(WHATSAPP_TO);
            if (!check.ok) {
                alert(`Fix WHATSAPP_TO in js/main.js:\n\n${check.reason}`);
                return;
            }

            const msg = encodeURIComponent(buildMessage(form));
            window.location.href = `https://wa.me/${check.number}?text=${msg}`;
        });
    }
});
