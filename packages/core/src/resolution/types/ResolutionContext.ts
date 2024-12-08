import { ServiceIdentifier } from "@inversiland/common";

import { GetOptions } from "./GetOptions";
import { OptionalGetOptions } from "./OptionalGetOptions";

export interface ResolutionContext {
  get<TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
    options: OptionalGetOptions
  ): TActivated | undefined;
  get<TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
    options?: GetOptions
  ): TActivated;

  getAll<TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
    options?: GetOptions
  ): TActivated[];

  getAllAsync<TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
    options?: GetOptions
  ): Promise<TActivated[]>;

  getAsync<TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
    options: OptionalGetOptions
  ): Promise<TActivated> | undefined;
  getAsync<TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
    options?: GetOptions
  ): Promise<TActivated>;
}
