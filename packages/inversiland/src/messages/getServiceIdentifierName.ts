import { interfaces } from "@inversiland/inversify";

export default function getServiceIdentifierName(
  serviceIdentifier: interfaces.ServiceIdentifier
): string {
  if (typeof serviceIdentifier === "function") {
    return `class ${serviceIdentifier.name} {}`;
  }

  return serviceIdentifier.toString();
}
