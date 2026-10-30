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

function startLocalCursor() {
  const cursor = document.getElementById("localCursor");
  if (!cursor) return;

  let pointerX = 0;
  let pointerY = 0;
  let framePending = false;

  function moveCursor(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
        cursor.classList.add("visible");
        framePending = false;
      });
    }

    const target = document.elementFromPoint(pointerX, pointerY);
    const style = target ? window.getComputedStyle(target) : null;
    const cursorType = style ? style.cursor : "default";

    let kind = "default";
    if (cursorType === "text" || cursorType === "vertical-text") kind = "text";
    else if (cursorType === "pointer") kind = "pointer";
    else if (cursorType === "grab" || cursorType === "grabbing") kind = "grab";

    cursor.dataset.kind = kind;
  }

  window.addEventListener("pointermove", moveCursor, { passive: true });
  window.addEventListener("pointerdown", moveCursor, { passive: true });
  window.addEventListener("pointerleave", () => cursor.classList.remove("visible"));
  window.addEventListener("pointerenter", () => cursor.classList.add("visible"));
}

function startStartMenu() {
  const button = document.getElementById("startButton");
  const menu = document.getElementById("startMenu");
  if (!button || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", () => {
    setOpen(!menu.classList.contains("open"));
  });

  document.addEventListener("pointerdown", event => {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setOpen(false);
  });
}

function startDesktop() {
  startDesktopClock();
  startLocalCursor();
  startStartMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startDesktop, { once: true });
} else {
  startDesktop();
}
