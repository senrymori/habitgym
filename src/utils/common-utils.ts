export function getValueIfTruthy<T>(
  value: T | undefined | null,
  flag: unknown = null
): NonNullable<typeof value> | undefined {
  if (flag || (flag === null && value)) {
    return value ?? undefined;
  } else {
    return undefined;
  }
}
