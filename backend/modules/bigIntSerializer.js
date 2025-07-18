export const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(
      data,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // Convert BigInt to string
    )
  );
};
