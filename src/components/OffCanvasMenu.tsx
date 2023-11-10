import React from "react";
import Offcanvas, { OffcanvasPlacement } from "react-bootstrap/Offcanvas";

/**
 * Props for the OffCanvasExample component.
 */
interface OffCanvasExampleProps {
  show: boolean;
  handleClose: () => void;
  text: Array<any>; // Ensure that `text` is an array
  title?: string;
  placement: OffcanvasPlacement;
}

/**
 * OffCanvasExample is a React component that displays off-canvas content.
 *
 * @param {OffCanvasExampleProps} props - The component props.
 */
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
            <h2>{institute.name}</h2>
            <div className="black-stripe"></div>
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffCanvasExample;
