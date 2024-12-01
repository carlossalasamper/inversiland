import { interfaces } from "@inversiland/inversify";

import inversilandOptions from "../inversiland/inversilandOptions";
import messagesMap from "../messages/messagesMap";

function debugMiddleware(planAndResolve: interfaces.Next): interfaces.Next {
  return (args: interfaces.NextArgs) => {
    const nextContextInterceptor = args.contextInterceptor;
    args.contextInterceptor = (context: interfaces.Context) => {
      if (inversilandOptions.debug) {
        console.log(
          messagesMap.providerRequested(
            args.serviceIdentifier,
            context.container.id
          )
        );
      }

      return nextContextInterceptor(context);
    };
    const result = planAndResolve(args);

    return result;
  };
}

export default debugMiddleware;
