import {
  ClassElementMetadata,
  ClassElementMetadataKind,
  getClassElementMetadataFromLegacyMetadata,
  LegacyTarget as Target,
  LegacyTargetImpl as TargetImpl,
} from "@inversifyjs/core";

import { interfaces } from "..";
import { Context } from "../planning/context";
import { Metadata } from "../planning/metadata";
import { Request } from "../planning/request";
import { getTargetMetadata } from "./metadata_utils";

function createMockRequest(
  container: interfaces.Container,
  serviceIdentifier: interfaces.ServiceIdentifier,
  key: string | number | symbol | undefined,
  value: unknown
): interfaces.Request {
  const metadataList: Metadata[] = getTargetMetadata(
    false,
    serviceIdentifier,
    key,
    value
  );

  const classElementMetadata: ClassElementMetadata =
    getClassElementMetadataFromLegacyMetadata(metadataList);

  if (classElementMetadata.kind === ClassElementMetadataKind.unmanaged) {
    throw new Error("Unexpected metadata when creating target");
  }

  const target: Target = new TargetImpl("", classElementMetadata, "Variable");

  const context: Context = new Context(container);
  const request: Request = new Request(
    serviceIdentifier,
    context,
    null,
    [],
    target
  );

  return request;
}

export { createMockRequest };
