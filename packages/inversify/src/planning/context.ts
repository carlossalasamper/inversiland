import { interfaces } from "../";
import { id } from "../utils/id";

class Context implements interfaces.Context {
  public id: number;
  public container: interfaces.Container;
  public plan!: interfaces.Plan;
  public currentRequest!: interfaces.Request;

  constructor(container: interfaces.Container) {
    this.id = id();
    this.container = container;
  }

  public addPlan(plan: interfaces.Plan) {
    this.plan = plan;
  }

  public setCurrentRequest(currentRequest: interfaces.Request) {
    this.currentRequest = currentRequest;
  }

  public clone() {
    const copy: Context = new Context(this.container);

    copy.plan = this.plan;
    copy.currentRequest = this.currentRequest;

    return copy;
  }
}

export { Context };
