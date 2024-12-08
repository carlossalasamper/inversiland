import { defineMetadata, hasOwnMetadata } from "@inversiland/metadata";

import { Metadata } from "../planning/metadata";

function propertyEventDecorator(eventKey: string, errorMessage: string) {
  return () => {
    return (target: { constructor: NewableFunction }, propertyKey: string) => {
      const metadata: Metadata = new Metadata(eventKey, propertyKey);

      if (hasOwnMetadata(eventKey, target.constructor)) {
        throw new Error(errorMessage);
      }
      defineMetadata(eventKey, metadata, target.constructor);
    };
  };
}

export { propertyEventDecorator };
