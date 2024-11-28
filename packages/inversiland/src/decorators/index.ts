import {
  inject,
  injectable,
  multiInject,
  optional,
} from "@carlossalasamper/inversify";

import injectImported from "./injectImported";
import injectProvided from "./injectProvided";
import module from "./module";
import multiInjectImported from "./multiInjectImported";
import multiInjectProvided from "./multiInjectProvided";

export {
  module,
  inject,
  multiInject,
  injectProvided,
  multiInjectProvided,
  injectImported,
  multiInjectImported,
  injectable,
  optional,
};
