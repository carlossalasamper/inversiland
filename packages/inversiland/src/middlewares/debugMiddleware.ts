import { interfaces } from "@carlossalasamper/inversify";

import inversifySugarOptions from "../inversifySugar/inversifySugarOptions";
import messagesMap from "../messages/messagesMap";

function debugMiddleware(planAndResolve: interfaces.Next): interfaces.Next {
  return (args: interfaces.NextArgs) => {
    const nextContextInterceptor = args.contextInterceptor;
    args.contextInterceptor = (context: interfaces.Context) => {
      if (inversifySugarOptions.debug) {
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
