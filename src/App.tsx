import { Fragment, useEffect, useRef, useState } from "react";
import s from "./App.module.css";
import { ModalSheet } from "./shared/ui";
import cn from "classnames";
import Loupe from "./shared/icons/loupe.svg";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.container}>
      <button className={s.button} onClick={() => setOpen(true)}>
        <Loupe />
      </button>
      <ModalSheet
        classnames={{
          wrapper: cn(s.sheetWrapper),
          swipeHead: cn(s.sheetHead),
        }}
        closeFactor={0.2}
        header={
          <input placeholder="Тестовый инпут" className={s.input} autoFocus />
        }
        id="searchEmployeeSheet"
        isOpened={open}
        onClose={() => setOpen(false)}
      >
        <div className={s.content}>
          <ul>
            {Array(50)
              .fill(null)
              .map((_, index) => (
                <Fragment key={index}>
                  <li>Lorem ipsum dolor sit amet.</li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Asperiores.
                  </li>
                </Fragment>
              ))}
          </ul>
        </div>
      </ModalSheet>
    </div>
  );
}

export default App;
