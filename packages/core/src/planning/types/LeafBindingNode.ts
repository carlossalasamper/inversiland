import { ConstantValueBinding } from "../../binding/types/ConstantValueBinding";
import { DynamicValueBinding } from "../../binding/types/DynamicValueBinding";
import { FactoryBinding } from "../../binding/types/FactoryBinding";
import { ProviderBinding } from "../../binding/types/ProviderBinding";
import { BaseBindingNode } from "./BaseBindingNode";

export type LeafBindingNode = BaseBindingNode<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ConstantValueBinding<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | DynamicValueBinding<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FactoryBinding<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ProviderBinding<any>
>;
