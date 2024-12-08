import { ServiceIdentifier } from "../types/ServiceIdentifier";

export function stringifyServiceIdentifier(
  serviceIdentifier: ServiceIdentifier
): string {
  let result: string;

  switch (typeof serviceIdentifier) {
    case "string":
      result = serviceIdentifier;
      break;
    case "symbol":
      result = serviceIdentifier.toString();
      break;
    case "function":
      result = serviceIdentifier.name;
      break;
    default:
      throw new Error(`Unexpected ${typeof serviceIdentifier} service id type`);
  }

  return result;
}
