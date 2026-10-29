function startDesktopClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  function updateClock() {
    clock.textContent = formatter.format(new Date());
  }

  updateClock();
  window.setInterval(updateClock, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startDesktopClock, { once: true });
} else {
  startDesktopClock();
}
