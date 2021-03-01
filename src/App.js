/** @jsx jsx */

import "./styles.css";
import { fadeInOut, slideInOut, scaleUpDown } from "./effects";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";
import { TransitionGroup, Transition } from "react-transition-group";
import uuid from "uuid";
import "./styles.css";

const useToggle = () => {
  const [on, setOnState] = useState(false);

  return {
    on,
    toggle: (prev) => setOnState(!prev),
    setOff: () => setOnState(false),
    setOn: () => setOnState(true)
  };
};

const AddItem = ({ setItems }) => {
  const [text, setText] = useState("");

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />;
      <button
        onClick={(e) => {
          setItems((prev) => [
            ...prev,
            {
              id: uuid(),
              text
            }
          ]);
        }}
      >
        add
      </button>
    </>
  );
};

const StyledItem = styled.li`
  list-style: none;
  display: inline-block;
  border: 1px solid;
`;

const createItemFrom = (direction) => ({ id, text, setItems, state }) => {
  const ref = React.useRef();
  const [effect, setEffect] = React.useState();

  useEffect(() => {
    setEffect(slideInOut.create(direction, ref));
  }, []);

  return (
    <StyledItem
      ref={ref}
      css={css`
        ${effect && `${effect.default(1000)} ${effect[state]}`}
      `}
    >
      <p>{text}</p>
      <button
        onClick={() =>
          setItems((prev) => prev.filter((item) => item.id !== id))
        }
      >
        x
      </button>
    </StyledItem>
  );
};

const ItemsFrom = ({ direction }) => {
  const [items, setItems] = useState([
    { id: uuid(), text: "Buy eggs" },
    { id: uuid(), text: "Pay bills" },
    { id: uuid(), text: "Invite friends over" },
    { id: uuid(), text: "Fix the TV" }
  ]);

  const Item = createItemFrom(direction);

  return (
    <>
      <TransitionGroup>
        {items.map(({ id, text }) => (
          <Transition key={id} timeout={1000}>
            {(state) => (
              <Item
                key={id}
                id={id}
                text={text}
                setItems={setItems}
                state={state}
              />
            )}
          </Transition>
        ))}
      </TransitionGroup>
      <AddItem setItems={setItems} />
    </>
  );
};

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  color: #fff;
`;

const Modal = ({ show, onClose, children, ...otherProps }) => {
  return show ? (
    <Backdrop {...otherProps} onClick={() => onClose()}>
      {children}
    </Backdrop>
  ) : null;
};

const Card = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid #fff;
  ${scaleUpDown.default(300)}
  ${({ effectState }) => scaleUpDown[effectState]}
`;
console.log(Card);

export default function App() {
  const [inProp, setInProp] = useState(false);

  const showModal = useToggle(false);
  const modalEffect = useToggle(true);

  return (
    <div className="App">
      <Transition in={inProp}>
        {(state) => {
          return (
            <div
              css={css`
                ${fadeInOut.default(300)}
                ${fadeInOut[state]}
              `}
            >
              helloasdasd
            </div>
          );
        }}
      </Transition>
      <button onClick={() => setInProp((prev) => !prev)}>toggle</button>
      <ItemsFrom direction="left" />
      <ItemsFrom direction="right" />
      <ItemsFrom direction="top" />
      <ItemsFrom direction="bottom" />
      <Transition
        in={modalEffect.on}
        onExited={(node) => (node.ontransitionend = showModal.setOff)}
      >
        {(state) => (
          <Modal show={showModal.on} onClose={modalEffect.setOff}>
            <Card effectState={state}>modal</Card>
          </Modal>
        )}
      </Transition>
      <button
        onClick={() => {
          modalEffect.setOn();
          showModal.setOn();
        }}
      >
        modal
      </button>
    </div>
  );
}
