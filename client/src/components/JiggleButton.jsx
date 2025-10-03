import React from "react";
export default function JiggleButton({ className = "btn btn-primary", onClick, children, ...rest }) {
  const ref = React.useRef(null);
  const jiggle = () => {
    const el = ref.current; if (!el) return;
    el.classList.remove("jiggle-active"); void el.offsetWidth; el.classList.add("jiggle-active");
    setTimeout(() => el.classList.remove("jiggle-active"), 400);
  };
  return (
    <button ref={ref} className={`${className}`} onClick={(e)=>{ jiggle(); onClick?.(e); }} {...rest}>
      {children}
    </button>
  );
}
