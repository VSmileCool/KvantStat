import React, { useEffect } from "react";

const ScrollToElementOnLoad: React.FC<{ targetId: string }> = ({
  targetId,
}) => {
  useEffect(() => {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetId]);

  return null;
};

export default ScrollToElementOnLoad;
