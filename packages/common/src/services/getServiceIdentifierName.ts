import { ServiceIdentifier } from "../types/ServiceIdentifier";

export default function getServiceIdentifierName(
  serviceIdentifier: ServiceIdentifier
): string {
  let name: string;

  if (typeof serviceIdentifier === "function") {
    name = `class ${serviceIdentifier.name} {}`;
  } else {
    name = serviceIdentifier.toString();
  }

  return name;
}
