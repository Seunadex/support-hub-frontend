import { useState } from "react";

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <span className="mr-2 bg-gray-600 text-white px-2.5 py-1.5 rounded text-xs z-50 h-auto">
          {text}
        </span>
      )}
      {children}
    </span>
  );
};

export default Tooltip;
