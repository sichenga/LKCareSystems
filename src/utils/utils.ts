import { h } from "vue";
import { ElMessageBox } from "element-plus";
// 封装element-plus的messagebox
export const getMessageBox = async (
  text: string,
  texttwo: string,
  title: string = "删除"
) => {
  try {
    return await ElMessageBox({
      title,
      message: h("p", null, [
        h("div", { style: "font-size:16px;font-weight:bold;" }, text),
        h("div", { style: "color: #ccc" }, texttwo),
      ]),
      showCancelButton: true,
      lockScroll: false,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });
  } catch {
    return false;
  }
};

// 递归生成树形结构数据
export function TreeData<T>(data: Array<T>, pid: number = 0) {
  const tree: Array<T> = [];
  data.forEach((node: any) => {
    if (node.pid === pid) {
      const children = TreeData(data, node.id);
      if (children.length) {
        node.children = children;
      }
      tree.push(node);
    }
  });
  return tree;
}

//将base64转换为file文件
export const dataURLtoFile = (dataurl: any, filename: any) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// 扁平数据转树状 结构数据
export function convertToTree(flatData: any, pid: number = 0) {
  const children = flatData.filter((node: any) => node.pid === pid);
  if (!children.length) {
    return;
  }
  return children.map((node: any) => ({
    ...node,
    children: convertToTree(flatData, node.id),
  }));
}

// 自定义树状数据转扁平数据
export function CustomTree<T>(
  data: Array<T>,
  type: string,
  initial: number = 0
) {
  console.log(data, type, initial);

  const tree: Array<T> = [];
  data.forEach((node: any) => {
    if (node[type] === initial) {
      console.log(node);

      const children = TreeData(data, node.id);
      if (children.length) {
        node.children = children;
      }
      tree.push(node);
    }
  });
  return tree;
}
