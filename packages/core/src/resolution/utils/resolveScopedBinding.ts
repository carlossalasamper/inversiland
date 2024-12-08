import { BindingScope } from "../../binding/types/BindingScope";
import { BindingType } from "../../binding/types/BindingType";
import { ScopedBinding } from "../../binding/types/ScopedBinding";
import { getSelf } from "../../common/utils/getSelf";
import { ResolutionParams } from "../types/ResolutionParams";
import { resolveScoped } from "./resolveScoped";

export const resolveScopedBinding: <
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>
>(
  resolve: (params: ResolutionParams, binding: TBinding) => TActivated
) => (params: ResolutionParams, binding: TBinding) => TActivated = <
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>
>(
  resolve: (params: ResolutionParams, binding: TBinding) => TActivated
) => resolveScoped(getSelf, resolve);
