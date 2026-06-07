const root = document.documentElement;
const stage = document.querySelector(".stage");
const slider = document.querySelector("#stateSlider");
const sliderWrap = document.querySelector(".slider-wrap");
const navButtons = document.querySelectorAll("[data-target]");
const lifeItems = document.querySelectorAll(".life-item");
const workItems = document.querySelectorAll(".work-item");
const foundCount = document.querySelector("#foundCount");
const workFoundCount = document.querySelector("#workFoundCount");
const osWindow = document.querySelector(".os-window");
const osWindowItem = document.querySelector("#osWindowItem");
const osWindowTagline = document.querySelector("#osWindowTagline");
const osWindowText = document.querySelector("#osWindowText");
const osWindowMap = document.querySelector("#osWindowMap");
const osWindowPhone = document.querySelector(".os-window__phone");
const osWindowMessages = document.querySelector("#osWindowMessages");
const osWindowCameraRoll = document.querySelector("#osWindowCameraRoll");
const osCloseButtons = document.querySelectorAll("[data-close-os]");
const photoLightbox = document.querySelector("#photoLightbox");
const photoLightboxImage = document.querySelector("#photoLightboxImage");
const photoLightboxClose = document.querySelectorAll("[data-close-photo]");

let progress = 0;
let wheelLock = false;
let sliderDrag = null;
let pendingSliderProgress = null;
let sliderFrame = 0;
const foundItems = new Set();
const workFoundItems = new Set();
const interactiveItems = [...lifeItems, ...workItems];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value) => value * value * (3 - 2 * value);
const itemCopy = {
  "university sign":
    "After deciding to study economics, I looked into the courses and universities I could attend.\n\nCambridge and Oxford sent rejection emails within 24h as I did not take SAT exams (I studied in a public Italian high school with a specialization in applied sciences and had no clue what that was).\n\nA lot of friends were saying great things about the NL/BE universities, so I also had a look at those. Got to Rotterdam, Leuven, Tilburg, Amsterdam & Bocconi. Decided to go abroad and move to the city that sounded the most interesting.\n\nMy first year here was extremely depressing, as the coursework was too easy and I could not find anybody building anything. Luckily, I later joined Tulip, and everything changed.\n\nI currently love Amsterdam and the momentum that is being built over here.\n\nFun Fact: I applied to a Business Administration bachelor's program almost randomly, got in, then spoke to an alumna and immediately realized I hated the entire vibe. The 2nd week of August I practically begged the university to move me into Economics & Business Economics instead; luckily, I was in the top 1% of applicants according to the entrance exam.",
  "work letter box": [
    "Surround yourself with the best people you know, if possible organize the gatherings yourself",
    "Are you your own RDF?",
    "Iterate iterate iterate",
    "If you do what everybody else is doing how can you expect a different outcome",
  ],
  "life letter box": [
    "Did you know everybody eats sleeps and drinks",
    "Where do you locate in the work-life spectrum? You will soon have to decide where your boundarsies lie",
    "Would you project your head into a robot to overcome physical limitations (intolerances, hunger ecc)?",
    "Everyone assumes AI will inherit humanity's greed, lust for power, and envy.\n\nBut what if those are products of evolution, not intelligence?\n\nWhat if peace is the rational endpoint?",
  ],
  gecko:
    "This is Jerry. I bought him when I was 16 and built him an enclosure.\n\nJerry later escaped. I installed traps with crickets all over my place to catch him, but it didn't work out. While talking to the breeder to buy a new Jerry, I had the epiphany to check in a tiny space on top of the corridor.\n\nFrom that day on until age 18, I owned Jerry 1.0 and Jerry 2.0, two male crested geckos.",
  "Merende Funeste":
    "Me Carlo and Tommaso decied to the routine of the week by going at the Panchina Funesta in the fourth year of high school.\n\nWe hanged out near the canal on a special bench between two plants, and enjoyed different snacks meanwhile.\n\nThat same bench became a reference point for our whole friend group during the following years, and was part of many crucial moments of our life :=)\n\n-> We also 3d printed a time capsule that we put for 1.5 years into a handrail, and then opened it\n\nEverybody we know loves the Panchine Funeste, its a cult",
  "Nintendo 3DS XL":
    "When I was 15, I started selling random stuff online to pay for Sushi, and my red Nintendo 3ds was bought as soon as I placed it online. I figured I could buy more and sell them, and so I did.\n\nI later noticed that people were selling consoles with 1000 games on them, so I decided to learn how to hack them, and then expanded also into console repair. By the time I was 16, I had 5k in working capital, a consistent flow of games, consoles, repairs, and cracking going on perpetually in my bedroom.\n\nDropped 500$ on a pair of shoes, paid for my life, went to Prague alone for a month, and invested the rest into my clothing business.\n\nReps Gate (sneaker & clothing reselling) scaled even further, and I became a wholesaler for many distributors around the country.",
  tulips:
    "Throughout my first year of university, I was desperately searching for people I could genuinely relate to.\n\nAfter getting kicked out of my apartment and being given 14 days to find a new place, I built QuickDorm, an automated housing broker with scraping infrastructure behind it. By May 2026, it had helped around 80 UvA students find housing.\n\nOne of those students was Giovanni Antonelli. We met through QuickDorm, started talking, and he eventually invited me to join Tulip as an executive board member.\n\nThe year started relatively quietly, mostly with speaker events. Then, from December onward, things accelerated quickly.\n\nWe launched Bloom Network, an invite-only community for some of the most ambitious student builders in the Netherlands, with weekly gatherings bringing together people from across the country.\n\nWe also launched Odyssey, a six-week venture builder designed to push people from ideas into execution.\n\nThrough all of this, I learned an enormous amount. Looking back, I think what we were really trying to build, sometimes consciously and sometimes not, was a kind of reality distortion field: an environment where people start operating as if unreasonable things are actually achievable.\n\nI genuinely believe the next Dutch \"PayPal Mafia\" will come out of Tulip.\n\ntulipams.com",
  "bridge support tower":
    "I have always had a passion for physics and mechanical engineering thanks to my grandpa.\n\nWe used to build any sort of contraptions, chair lifts, buildings ecc We also built a 4x2m realistic and fully functioning railway model at scale.\n\nDue to too many hours spent playing Poly Bridge on my computer & a bridge restructuring project I did in Prague, I decided I wanted to study Civil Engineering and build bridges and dams. At 17 I got into Politecnico di Milano.\n\nI later started to spend every hour of my day ordering stock, managing people, and delivering packages for my clothing business, and LOVED IT. Therefore, I refused the spot to study economics.",
  "TenNine sign":
    "I reached out to Uros on LinkedIn; we later met and clicked.\n\nI built the entire software stack, hired a team of friends, and am currently GP Associate.\n\nWe believe that people do not see the huge grey rhino coming towards us, or at least they are not taking action to avoid it.\n\nWe are currently raising 10M to invest in Deep Tech for Essential Industries: Energy, Food, Climate & Health from pre-seed to series A.\n\nhttps://tennine.vc/",
};

const cameraRolls = {
  camera: [
    "work-5.webp",
    "work-6.webp",
    "work-7a.webp",
    "work-7b.webp",
    "work-8.webp",
    "work-9.webp",
    "work-10.webp",
    "work-11.webp",
    "work-12.webp",
    "work-13.webp",
    "work-14.webp",
    "work-15.webp",
    "work-16.webp",
    "work-20.webp",
    "work-21.webp",
    "work-23.webp",
  ].map((file, index) => ({
    src: `assets/camera-roll/work/${file}`,
    alt: `Work camera photo ${index + 1}`,
  })),
  "photo camera": [
    "life-1.jpg",
    "life-2.webp",
    "life-3.webp",
    "life-4.webp",
    "life-5.webp",
    "life-6.webp",
    "life-7.webp",
    "life-8.jpg",
    "life-9.webp",
    "life-1b.webp",
    "life-2b.webp",
    "life-20.webp",
    "life-21.webp",
    "life-22.webp",
    "life-23.webp",
    "life-24.webp",
    "life-25.webp",
    "life-27.webp",
    "life-28.webp",
    "life-29.webp",
    "life-30.webp",
    "life-31.webp",
    "life-32.webp",
    "life-126.webp",
  ].map((file, index) => ({
    src: `assets/camera-roll/life/${file}`,
    alt: `Life camera photo ${index + 1}`,
  })),
};

function formatItemName(name) {
  if (!name) return "Unknown item";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function toMessageList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(/\n\s*\n/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function renderMessages(messages) {
  osWindowMessages.replaceChildren();

  messages.forEach((message) => {
    const bubble = document.createElement("p");
    bubble.className = "os-window__message";
    bubble.textContent = message;
    osWindowMessages.appendChild(bubble);
  });
}

function renderCameraRoll(images) {
  osWindowCameraRoll.replaceChildren(
    ...images.map((image) => {
      const frame = document.createElement("figure");
      const button = document.createElement("button");
      const photo = document.createElement("img");
      button.className = "os-window__photo-button";
      button.type = "button";
      button.setAttribute("aria-label", `Open ${image.alt}`);
      photo.src = image.src;
      photo.alt = image.alt;
      photo.loading = "lazy";
      photo.decoding = "async";
      button.appendChild(photo);
      button.addEventListener("click", () => openPhotoLightbox(image));
      frame.appendChild(button);
      return frame;
    }),
  );
}

function openPhotoLightbox(image) {
  photoLightboxImage.src = image.src;
  photoLightboxImage.alt = image.alt;
  photoLightbox.classList.remove("is-hidden");
  photoLightbox.setAttribute("aria-hidden", "false");
}

function closePhotoLightbox() {
  photoLightbox.classList.add("is-hidden");
  photoLightbox.setAttribute("aria-hidden", "true");
  photoLightboxImage.removeAttribute("src");
}

function showPhoneMode(messages) {
  osWindowText.hidden = true;
  osWindowMap.hidden = true;
  osWindowCameraRoll.hidden = true;
  osWindowPhone.hidden = false;
  renderMessages(messages);
}

function showTextMode(messages) {
  osWindowPhone.hidden = true;
  osWindowMap.hidden = true;
  osWindowCameraRoll.hidden = true;
  osWindowText.hidden = false;
  osWindowText.replaceChildren(
    ...messages.map((message) => {
      const paragraph = document.createElement("p");
      if (/^https?:\/\//.test(message)) {
        const link = document.createElement("a");
        link.href = message;
        link.textContent = message;
        link.target = "_blank";
        link.rel = "noopener";
        paragraph.appendChild(link);
      } else {
        paragraph.textContent = message;
      }
      return paragraph;
    }),
  );
}

function showMapMode() {
  osWindowPhone.hidden = true;
  osWindowText.hidden = true;
  osWindowCameraRoll.hidden = true;
  osWindowMap.hidden = false;
}

function showCameraRollMode(images) {
  osWindowPhone.hidden = true;
  osWindowText.hidden = true;
  osWindowMap.hidden = true;
  osWindowCameraRoll.hidden = false;
  renderCameraRoll(images);
}

function openOsWindow(item) {
  const itemName = item.dataset.item;
  const itemLabel = item.dataset.label || formatItemName(itemName);
  const messages = toMessageList(itemCopy[itemName]);
  osWindowItem.textContent = itemLabel;
  osWindowTagline.hidden = !itemName.endsWith("letter box");
  if (cameraRolls[itemName]) {
    showCameraRollMode(cameraRolls[itemName]);
  } else if (itemName === "plane") {
    showMapMode();
  } else if (itemName.endsWith("letter box")) {
    showPhoneMode(messages);
  } else {
    showTextMode(messages);
  }
  osWindow.classList.remove("is-hidden");
  osWindow.setAttribute("aria-hidden", "false");
}

function closeOsWindow() {
  osWindow.classList.add("is-hidden");
  osWindow.setAttribute("aria-hidden", "true");
}

function isOsWindowOpen() {
  return !osWindow.classList.contains("is-hidden");
}

function setProgress(next) {
  progress = clamp(next);

  const close = 1 - Math.abs(progress - 0.5) * 2;
  const edge = smooth(clamp((close - 0.72) / 0.28));
  const life = progress >= 0.5 ? 1 : 0;
  const work = 1 - life;
  const formal = work;
  const informal = life;

  root.style.setProperty("--p", progress.toFixed(4));
  root.style.setProperty("--close", close.toFixed(4));
  root.style.setProperty("--edge", edge.toFixed(4));
  root.style.setProperty("--cloud-opacity", smooth(clamp(close * 1.25)).toFixed(4));
  root.style.setProperty("--work", work.toFixed(4));
  root.style.setProperty("--life", life.toFixed(4));
  root.style.setProperty("--formal", formal.toFixed(4));
  root.style.setProperty("--informal", informal.toFixed(4));
  stage.classList.toggle("is-life", life === 1);

  slider.value = Math.round(progress * 100);
  sliderWrap.setAttribute("aria-valuenow", slider.value);
}

slider.addEventListener("input", (event) => {
  setProgress(Number(event.target.value) / 100);
});

function queueSliderProgress(next) {
  pendingSliderProgress = next;
  if (sliderFrame) return;
  sliderFrame = requestAnimationFrame(() => {
    setProgress(pendingSliderProgress);
    pendingSliderProgress = null;
    sliderFrame = 0;
  });
}

sliderWrap.addEventListener("pointerdown", (event) => {
  if (isOsWindowOpen()) return;
  event.preventDefault();
  sliderWrap.setPointerCapture?.(event.pointerId);
  sliderWrap.classList.add("is-dragging");
  sliderDrag = {
    pointerId: event.pointerId,
    startProgress: progress,
  };
  const rect = sliderWrap.getBoundingClientRect();
  const isVertical = rect.height > rect.width;
  sliderDrag.startPosition = isVertical ? event.clientY : event.clientX;
  sliderDrag.size = Math.max(1, isVertical ? rect.height : rect.width);
  sliderDrag.axis = isVertical ? "y" : "x";
});

sliderWrap.addEventListener("pointermove", (event) => {
  if (!sliderDrag || event.pointerId !== sliderDrag.pointerId) return;
  event.preventDefault();
  const position = sliderDrag.axis === "y" ? event.clientY : event.clientX;
  const delta = (position - sliderDrag.startPosition) / sliderDrag.size;
  queueSliderProgress(sliderDrag.startProgress + delta);
});

function stopSliderDrag(event) {
  if (sliderDrag && event.pointerId !== sliderDrag.pointerId) return;
  sliderDrag = null;
  sliderWrap.classList.remove("is-dragging");
  sliderWrap.releasePointerCapture?.(event.pointerId);
}

sliderWrap.addEventListener("pointerup", stopSliderDrag);
sliderWrap.addEventListener("pointercancel", stopSliderDrag);
sliderWrap.addEventListener("click", (event) => event.preventDefault());
sliderWrap.addEventListener("keydown", (event) => {
  if (isOsWindowOpen()) return;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    setProgress(progress + 0.04);
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    setProgress(progress - 0.04);
  }
  if (event.key === "Home") {
    event.preventDefault();
    setProgress(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    setProgress(1);
  }
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setProgress(Number(button.dataset.target) / 100);
  });
});

lifeItems.forEach((item) => {
  item.addEventListener("click", () => {
    foundItems.add(item.dataset.item);
    item.classList.add("is-found");
    item.setAttribute("aria-pressed", "true");
    foundCount.textContent = foundItems.size;
    openOsWindow(item);
  });
});

workItems.forEach((item) => {
  item.addEventListener("click", () => {
    workFoundItems.add(item.dataset.item);
    item.classList.add("is-found");
    item.setAttribute("aria-pressed", "true");
    workFoundCount.textContent = workFoundItems.size;
    openOsWindow(item);
  });
});

interactiveItems.forEach((item) => {
  item.addEventListener(
    "pointerdown",
    () => {
      if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
      item.classList.add("is-touch-highlight");
      window.setTimeout(() => item.classList.remove("is-touch-highlight"), 700);
    },
    { passive: true },
  );
});

osCloseButtons.forEach((button) => {
  button.addEventListener("click", closeOsWindow);
});

photoLightboxClose.forEach((button) => {
  button.addEventListener("click", closePhotoLightbox);
});

document.addEventListener("gesturestart", (event) => event.preventDefault());
document.addEventListener(
  "touchmove",
  (event) => {
    if (event.target.closest?.(".slider-wrap")) return;
    if (event.target.closest?.(".os-window__body")) return;
    event.preventDefault();
  },
  { passive: false },
);

window.addEventListener(
  "wheel",
  (event) => {
    if (isOsWindowOpen()) return;
    event.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    requestAnimationFrame(() => {
      setProgress(progress + event.deltaY / 1400);
      wheelLock = false;
    });
  },
  { passive: false },
);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !photoLightbox.classList.contains("is-hidden")) {
    closePhotoLightbox();
    return;
  }
  if (event.key === "Escape" && isOsWindowOpen()) {
    closeOsWindow();
    return;
  }
  if (isOsWindowOpen()) return;
  if (event.key === "ArrowRight") setProgress(progress + 0.04);
  if (event.key === "ArrowLeft") setProgress(progress - 0.04);
  if (event.key === "Home") setProgress(0);
  if (event.key === "End") setProgress(1);
});

const params = new URLSearchParams(window.location.search);
const initialState = Number(params.get("state"));
setProgress(params.has("state") && Number.isFinite(initialState) ? initialState / 100 : 1);
