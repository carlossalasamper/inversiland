import { Container } from "inversify";
import ExportedProviderRef from "../../types/ExportedProviderRef";
import bindWhenIsImported from "./bindWhenIsImported";

export default function bindExportedProviderRefToContainer(
  exportedProviderRef: ExportedProviderRef,
  container: Container
) {
  bindWhenIsImported(
    container
      .bind(exportedProviderRef.provide)
      .toDynamicValue(exportedProviderRef.getValue)
  );
}
