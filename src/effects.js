// fadeInOut
export const fadeInOut = {
  default: (duration) => `transition : opacity ${duration}ms;`,
  entering: "opacity: 0;",
  entered: "opacity: 1;",
  exiting: "opacity: 0;",
  exited: "opacity: 0;"
};

// slideInOut
const createTransform = (x, y, z) => `transform: translate3d(${x},${y},${z});`;

export const slideInOut = {
  create: (from, ref) => {
    if (!ref.current) {
      return {};
    }

    let transformed;

    switch (from) {
      case "left":
        transformed = ({ width, x }) =>
          createTransform(`${-width - x}px`, 0, 0);
        break;
      case "right":
        transformed = ({ x }) => createTransform(`calc(100vw - ${x}px)`, 0, 0);
        break;
      case "top":
        transformed = ({ y, height }) =>
          createTransform(0, `${-y - height}px`, 0);
        break;
      case "bottom":
        transformed = ({ y }) => createTransform(0, `calc(100vh - ${y}px)`, 0);
        break;
      default:
        throw new Error(
          "slideInOut can be created with left, right, top, bottom"
        );
    }

    let _duration;
    const transformedStyle = transformed(ref.current.getBoundingClientRect());

    return {
      default: (duration) => {
        _duration = duration;
        return ` transition: transform ${_duration}ms; `;
      },
      entering: `transition:none; ${transformedStyle}`,
      entered: createTransform(0, 0, 0),
      exiting: transformedStyle
    };
  }
};
