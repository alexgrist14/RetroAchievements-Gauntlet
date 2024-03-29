import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./components/Main/Main";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import countVisitors from "./utils/visitors";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

 countVisitors();

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Main />
    </PersistGate>
  </Provider>
);
