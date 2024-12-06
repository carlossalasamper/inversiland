/* eslint-disable @typescript-eslint/no-explicit-any */
import { Binding } from "../../binding/types/Binding";
import { BindingNodeParent } from "./BindingNodeParent";

export interface BaseBindingNode<TBinding extends Binding<any> = Binding<any>> {
  readonly parent: BindingNodeParent;
  readonly binding: TBinding;
}
