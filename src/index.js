import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSpring, animated, config } from "react-spring";
import * as Icons from "./icons";

const treeStyles = {
  tree: {
    position: "relative",
    padding: "4px 0px 0px 0px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    verticalAlign: "middle",
  },
  toggle: {
    width: "1em",
    height: "1em",
    marginRight: 10,
    cursor: "pointer",
    verticalAlign: "middle",
  },
  type: {
    textTransform: "uppercase",
    fontFamily: "monospace",
    fontSize: "0.6em",
    verticalAlign: "middle",
  },
  contents: {
    willChange: "transform, opacity, height",
    marginLeft: 6,
    padding: "4px 0px 0px 14px",
    borderLeft: "1px dashed rgba(255,255,255,0.4)",
  },
};

const Tree = ({
  open: propsOpen = false,
  visible: propsVisible = true,
  canHide = false,
  icons = {},
  content,
  children,
  type,
  style,
  springConfig,
  itemId,
  onItemClick,
  onItemToggle,
  onClick,
}) => {
  const [open, setOpen] = useState(propsOpen);
  const [visible, setVisible] = useState(propsVisible);
  const [immediate, setImmediate] = useState(false);
  const id = itemId;

  useEffect(() => {
    setOpen(propsOpen);
  }, [propsOpen]);

  useEffect(() => {
    setVisible(propsVisible);
  }, [propsVisible]);

  const toggle = () => {
    if (children) {
      onItemToggle && onItemToggle(id, !open);
      setOpen(!open);
      setImmediate(false);
    }
  };

  const toggleVisibility = () => {
    setVisible(!visible);
    setImmediate(true);
    onClick && onClick(!visible);
  };

  const handleItemClick = () => {
    onItemClick && onItemClick(id);
  };

  const icon = children
    ? open
      ? icons.minusIcon || "Minus"
      : icons.plusIcon || "Plus"
    : icons.closeIcon || "Close";
  const IconComponent = typeof icon === "string" ? Icons[icon] : icon;
  const IconEye = icons.eyeIcon || Icons.Eye;

  const animationStyles = useSpring({
    immediate: immediate,
    config: {
      ...config.default,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.01,
    },
    from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      transform: open ? "translate3d(0px,0,0)" : "translate3d(20px,0,0)",
    },
    ...(springConfig && springConfig(open)),
  });
  console.log("lalala");
  return (
    <div style={{ ...treeStyles.tree, ...style }} className="treeview">
      <IconComponent
        className="toggle"
        style={{ ...treeStyles.toggle, opacity: children ? 1 : 0.3 }}
        onClick={toggle}
      />
      <span style={{ ...treeStyles.type, marginRight: type ? 10 : 0 }}>{type}</span>
      {canHide && (
        <IconEye
          className="toggle"
          style={{ ...treeStyles.toggle, opacity: visible ? 1 : 0.4 }}
          onClick={toggleVisibility}
        />
      )}
      <span onClick={handleItemClick} style={{ verticalAlign: "middle" }}>
        {content}
      </span>
      <animated.div style={{ ...animationStyles, ...treeStyles.contents }}>
        {children}
      </animated.div>
    </div>
  );
};

Tree.propTypes = {
  open: PropTypes.bool,
  visible: PropTypes.bool,
  canHide: PropTypes.bool,
  content: PropTypes.node,
  springConfig: PropTypes.func,
  itemId: PropTypes.string,
  onItemClick: PropTypes.func,
  onItemToggle: PropTypes.func,
  icons: PropTypes.object,
};

export default Tree;
