import { getMetadata, updateMetadata } from "@inversiland/metadata";

const ID_METADATA = "@inversifyjs/core/targetId";

export function getTargetId(): number {
  const target = Object;
  const targetId: number = getMetadata<number>(ID_METADATA, target) ?? 0;

  if (targetId === Number.MAX_SAFE_INTEGER) {
    updateMetadata(
      ID_METADATA,
      targetId,
      () => Number.MIN_SAFE_INTEGER,
      target
    );
  } else {
    updateMetadata(ID_METADATA, targetId, (id: number) => id + 1, target);
  }

  return targetId;
}
