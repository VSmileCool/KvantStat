import React from "react";
import Offcanvas, { OffcanvasPlacement } from "react-bootstrap/Offcanvas";

interface OffCanvasExampleProps {
  show: boolean;
  handleClose: () => void;
  text: any;
  title?: string;
  placement: OffcanvasPlacement;
}

const OffCanvasExample: React.FC<OffCanvasExampleProps> = ({
  show,
  handleClose,
  text,
  title,
  placement,
}) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement={placement}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title || ""}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {text.map((institute: any, index: number) => (
          <div key={index}>
            <h2>{institute}</h2>
            <div className="black-stripe"></div>
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffCanvasExample;
