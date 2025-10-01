import React from "react";
import ReactDOM from "react-dom";
import "./Portal.css";

type TPortalProps = {
  children: React.ReactNode;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  prefix?: string;
  id?: string;
};

export class Portal extends React.Component<TPortalProps> {
  container: HTMLElement;

  constructor(props: TPortalProps) {
    super(props);
    this.container = document.createElement("div");

    this.applyContainerStyles(props);
  }

  componentDidMount() {
    document.body.appendChild(this.container);
    this.forceUpdate();
  }

  componentDidUpdate(prevProps: TPortalProps) {
    if (
      prevProps.zIndex !== this.props.zIndex ||
      prevProps.style !== this.props.style ||
      prevProps.className !== this.props.className
    ) {
      this.applyContainerStyles(this.props);
    }
  }

  componentWillUnmount() {
    if (document.body.contains(this.container)) {
      document.body.removeChild(this.container);
    }
  }

  applyContainerStyles(props: TPortalProps) {
    const { style, zIndex, className } = props;

    this.container.className = className || "portal";

    this.container.role = "presentation";
    this.container.setAttribute("aria-describedby", props.prefix || "modal");
    this.container.setAttribute("id", props.id || "modal");

    this.container.style.cssText = "";

    if (zIndex !== undefined) {
      this.container.style.zIndex = String(zIndex);
    }
    if (style) {
      Object.assign(this.container.style, style);
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.container);
  }
}
