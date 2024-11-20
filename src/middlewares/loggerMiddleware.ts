import { interfaces } from "inversify";
import messagesMap from "../utils/messages/messagesMap";
import inversifySugarOptions from "../utils/inversifySugarOptions";

function loggerMiddleware(planAndResolve: interfaces.Next): interfaces.Next {
  return (args: interfaces.NextArgs) => {
    const nextContextInterceptor = args.contextInterceptor;
    args.contextInterceptor = (context: interfaces.Context) => {
      if (inversifySugarOptions.debug) {
        console.log(
          messagesMap.resolveProvider(
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

export default loggerMiddleware;
