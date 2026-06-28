import toast from "react-hot-toast";

export type ToastKind = "default" | "success" | "error";

export function showToast(message: string, kind: ToastKind = "default") {
  if (kind === "success") {
    toast.success(message);
    return;
  }

  if (kind === "error") {
    toast.error(message);
    return;
  }

  toast(message);
}
