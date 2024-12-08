import { Container } from "@inversiland/inversify";

import Newable from "./Newable";

export default interface InversilandState {
  isRunning: boolean;
  globalContainer: Container;
  rootModule?: Newable;
}
