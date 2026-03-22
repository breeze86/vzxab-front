export function scrollToSection(id: string, offset = 80) {
  if (typeof window === "undefined") {
    return;
  }

  const scroll = () => {
    const element = document.getElementById(id);
    if (!element) {
      return false;
    }

    const top = Math.max(
      element.getBoundingClientRect().top + window.scrollY - offset,
      0
    );

    window.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      const stableTop = Math.max(
        element.getBoundingClientRect().top + window.scrollY - offset,
        0
      );
      window.scrollTo({ top: stableTop, behavior: "auto" });
    }, 220);

    return true;
  };

  if (scroll()) {
    return;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (scroll() || attempts >= 10) {
      window.clearInterval(timer);
    }
  }, 120);
}
