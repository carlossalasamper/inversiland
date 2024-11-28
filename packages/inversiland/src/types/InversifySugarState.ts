import { Container } from "@carlossalasamper/inversify";

import Newable from "./Newable";

export default interface InversifySugarState {
  isRunning: boolean;
  globalContainer: Container;
  rootModule?: Newable;
}
