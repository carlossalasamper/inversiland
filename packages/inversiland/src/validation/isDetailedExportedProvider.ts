/* eslint-disable @typescript-eslint/no-explicit-any */

const isDetailedExportedProvider = (data: any) => {
  return !!data && typeof data === "object" && "provide" in data;
};

export default isDetailedExportedProvider;
