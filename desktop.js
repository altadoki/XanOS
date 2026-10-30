function startDesktopClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  const formatter = new Intl.DateTimeFormat(undefined, {hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
  function updateClock() { clock.textContent = formatter.format(new Date()); }
  updateClock();
  window.setInterval(updateClock, 1000);
}

function startLocalCursor() {
  const cursor = document.getElementById("localCursor");
  if (!cursor) return;
  let x = 0;
  let y = 0;
  let frame = 0;

  function updateCursor(event) {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    x = event.clientX;
    y = event.clientY;

    if (!frame) {
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
        cursor.classList.add("visible");
        frame = 0;
      });
    }

    const target = document.elementFromPoint(x, y);
    const textTarget = target && target.closest("input,textarea,select,[contenteditable]:not([contenteditable='false']),[role='textbox']");
    const dragTarget = target && target.closest("[draggable='true']");
    const clickTarget = target && target.closest("button,a,[role='button'],label,summary,.clickable");
    cursor.dataset.kind = textTarget ? "text" : dragTarget ? "grab" : clickTarget ? "pointer" : "default";
  }

  document.addEventListener("pointermove", updateCursor, {passive:true});
  document.addEventListener("mousemove", updateCursor, {passive:true});
  document.addEventListener("pointerdown", updateCursor, {passive:true});
  document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
  document.addEventListener("mouseenter", () => cursor.classList.add("visible"));
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

  button.addEventListener("click", event => {
    event.stopPropagation();
    setOpen(!menu.classList.contains("open"));
  });

  menu.addEventListener("click", event => event.stopPropagation());

  document.addEventListener("click", event => {
    if (!menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
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
  document.addEventListener("DOMContentLoaded", startDesktop, {once:true});
} else {
  startDesktop();
}
