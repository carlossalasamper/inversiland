import { interfaces } from "../";

class Plan implements interfaces.Plan {
  public parentContext: interfaces.Context;
  public rootRequest: interfaces.Request;

  constructor(
    parentContext: interfaces.Context,
    rootRequest: interfaces.Request
  ) {
    this.parentContext = parentContext;
    this.rootRequest = rootRequest;
  }
}

export { Plan };
