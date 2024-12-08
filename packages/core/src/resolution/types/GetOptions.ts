import { MetadataName } from "../../metadata/types/MetadataName";
import { GetOptionsTagConstraint } from "./GetOptionsTagConstraint";

export interface GetOptions {
  name?: MetadataName;
  optional?: boolean;
  tag?: GetOptionsTagConstraint;
}
