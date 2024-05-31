export function convertToTree(flatData: any, pid: number = 0) {
  const children = flatData.filter((node: any) => node.pid === pid);
  if (!children.length) {
    return null;
  }
  return children.map((node: any) => ({
    ...node,
    children: convertToTree(flatData, node.id),
  }));
}
