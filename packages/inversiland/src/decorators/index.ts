import {
  inject,
  injectable,
  optional,
  multiInject,
} from "@carlossalasamper/inversify";
import module from "./module";
import injectProvided from "./injectProvided";
import multiInjectProvided from "./multiInjectProvided";
import injectImported from "./injectImported";
import multiInjectImported from "./multiInjectImported";

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
