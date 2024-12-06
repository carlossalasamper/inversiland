import { ManagedClassElementMetadata } from './ManagedClassElementMetadata';
import { UnmanagedClassElementMetadata } from './UnmanagedClassElementMetadata';

export type ClassElementMetadata =
  | ManagedClassElementMetadata
  | UnmanagedClassElementMetadata;
