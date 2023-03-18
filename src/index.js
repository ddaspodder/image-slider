import "./styles.css";

const CIRCULAR = false;
const FULL_WIDTH = true;
const HEIGHT = 400;
const WIDTH = 600;

const data = [
  "https://cdn.pixabay.com/photo/2018/08/12/16/59/parrot-3601194__480.jpg",
  "https://images.pexels.com/photos/133459/pexels-photo-133459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://cdn.pixabay.com/photo/2016/03/27/22/22/fox-1284512__480.jpg"
];

const createInitialImageList = (images) => {
  const processedImages = images.map((image) => {
    const randId = Math.floor(Math.random() * 10000);
    return { id: randId, src: image };
  });

  return processedImages;
};

const createImageStrip = (processedImages) => {
  const newImages = [...processedImages];
  const lastImg = newImages.pop();
  newImages.unshift(lastImg);
  return newImages;
};

const initialImageList = createInitialImageList(data);
const imageStrip = createImageStrip([...initialImageList]);

let ptr = 1;
let index = 0;

const createImageListDOM = (imageStrip) => {
  return `${imageStrip.reduce((str, image) => {
    return (
      str +
      `<div class="image-wrapper">
  <img class="image-tile"
  src=${image.src}
  / >
</div>`
    );
  }, "")}`;
};

const initializeCarousel = () => {
  if (FULL_WIDTH) {
    const width =
      document.querySelector(".image-carousel").parentElement.clientWidth +
      "px";
    console.log("width", width);
    console.log("wibndow width", window.innerWidth);
    document.documentElement.style.setProperty("--img_width", width);
  } else {
    document.documentElement.style.setProperty("--img_width", WIDTH + "px");
  }
  document.documentElement.style.setProperty("--img_height", HEIGHT + "px");
};

initializeCarousel();

window.addEventListener("resize", initializeCarousel);

const ImageListWrapper = document.querySelector(
  "div[data-target = 'image-list-wrapper']"
);
ImageListWrapper.innerHTML = createImageListDOM(imageStrip);

const getIndex = (activeImage) => {
  return initialImageList.reduce(
    (acc, image, ind) => (activeImage.id === image.id ? ind : acc),
    1
  );
};

const rightBtn = document.querySelector("button[data-target='right-btn']");

const goRight = () => {
  const newPtr = (ptr + 1) % imageStrip.length;
  const newActiveImage = imageStrip[newPtr];
  const newIndex = getIndex(newActiveImage);

  if (CIRCULAR || (!CIRCULAR && newIndex - index === 1)) {
    ImageListWrapper.classList.remove("reset-slide");
    ImageListWrapper.classList.add("add-transition", "slide-left");
    const imagePop = ImageListWrapper.children[0];
    rightBtn.setAttribute("disabled", true);
    setTimeout(() => {
      ImageListWrapper.removeChild(imagePop);
      ImageListWrapper.appendChild(imagePop);
      ImageListWrapper.classList.remove("add-transition", "slide-left");
      ImageListWrapper.classList.add("reset-slide");
      rightBtn.removeAttribute("disabled");
      ptr = newPtr;
      index = newIndex;
      updateMarker();
    }, 1000);
  }
};

rightBtn.onclick = goRight;

const leftBtn = document.querySelector("button[data-target='left-btn']");

const goLeft = () => {
  const newPtr =
    (imageStrip.length + ptr - 1 + imageStrip.length) % imageStrip.length;
  const newActiveImage = imageStrip[newPtr];
  const newIndex = getIndex(newActiveImage);

  if (CIRCULAR || (!CIRCULAR && newIndex - index === -1)) {
    ImageListWrapper.classList.remove("reset-slide");
    ImageListWrapper.classList.add("add-transition", "slide-right");
    const imagePop = ImageListWrapper.children[imageStrip.length - 1];
    leftBtn.setAttribute("disabled", true);
    setTimeout(() => {
      ImageListWrapper.removeChild(imagePop);
      ImageListWrapper.prepend(imagePop);
      ImageListWrapper.classList.remove("add-transition", "slide-right");
      ImageListWrapper.classList.add("reset-slide");
      leftBtn.removeAttribute("disabled");
      ptr = newPtr;
      index = newIndex;
      updateMarker();
    }, 1000);
  }
};

leftBtn.onclick = goLeft;

const markers = document.querySelector("div[data-target='markers']");

const createMarkers = (images) => {
  return `<div class="marker-wrapper">
  ${images.reduce((str, image, index) => {
    return (
      str +
      (index === 0
        ? `<div class="marker active-marker"></div>`
        : `<div class="marker"></div>`)
    );
  }, "")}</div>`;
};

markers.innerHTML = createMarkers(initialImageList);

const updateMarker = () => {
  const targetMarker = document.querySelector(".active-marker");
  targetMarker.classList.remove("active-marker");
  const newActiveMarker = document.querySelector(".marker-wrapper").children[
    index
  ];
  newActiveMarker.classList.add("active-marker");
};
