const bee = document.querySelector(".bee");
const bee_placeholder = document.querySelector(".bee__hidden");

const toPx = (num) => `${num}px`;

let isPlaying = false;

function flyInFromRight() {
  return bee.animate(
    [
      {
        transform: "rotate(0deg)",
        left: "110%",
        top: bee.style.top,
        right: "auto",
      },
      {
        transform: "rotate(0deg)",
        left: bee.style.left,
        top: bee.style.top,
        right: "auto",
      },
    ],
    {
      duration: 3000,
      iterations: 1,
      easing: "ease-out",
    }
  );
}

function loopDeLoop() {
  return bee.animate(
    [
      {
        transform: "rotate(0deg)",
        left: bee.style.left,
        top: bee.style.top,
      },
      {
        transform: "rotate(0deg)",
        left: toPx(parseInt(bee.style.left) - 50),
        top: toPx(parseInt(bee.style.top) - 20),
      },
      {
        transform: "rotate(180deg)",
        left: bee.style.left,
        top: bee.style.top,
      },
      {
        transform: "rotate(360deg)",
        left: bee.style.left,
        top: bee.style.top,
      },
      {
        transform: "rotate(360deg)",
        left: "-30%",
        top: bee.style.top,
      },
    ],
    {
      duration: 4000,
      iterations: 1,
      easing: "ease",
    }
  );
}

async function flightOfTheBee() {
  if (isPlaying || !bee) return;

  const { top, left } = bee.getBoundingClientRect();
  const scrollOffset = document.scrollingElement.scrollTop;

  isPlaying = true;

  const TURNING_CIRCLE = 60;
  const BEE_SIZE = 24;

  bee_placeholder.style.display = "inline-block";
  bee_placeholder.style.visibility = "visible";
  bee.style.position = "absolute";

  bee.style.paddingTop = toPx(TURNING_CIRCLE - BEE_SIZE);
  bee.style.top = toPx(top - TURNING_CIRCLE + BEE_SIZE + scrollOffset);
  bee.style.left = toPx(left - TURNING_CIRCLE + BEE_SIZE);
  bee.style.width = toPx(TURNING_CIRCLE);
  bee.style.height = toPx(TURNING_CIRCLE);
  bee.style.textAlign = "right";
  bee.style.transformOrigin = "top";

  const loop_animation = loopDeLoop();

  loop_animation.onfinish = function () {
    const fly_in = flyInFromRight();

    fly_in.onfinish = () => {
      bee.style = "";
      bee_placeholder.style.display = "none";
      isPlaying = false;
    };
  };
}

bee && bee.addEventListener("mouseover", flightOfTheBee);
