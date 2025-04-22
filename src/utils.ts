export function getFieldPath(name: string, index?: number): string {
  return index !== undefined ? `${name}[${index}].file` : `${name}.file`;
}
