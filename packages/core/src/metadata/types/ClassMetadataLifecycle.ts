export interface ClassMetadataLifecycle {
  postConstructMethodName: string | symbol | undefined;
  preDestroyMethodName: string | symbol | undefined;
}
