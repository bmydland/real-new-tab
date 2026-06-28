export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read the selected file."));
    });

    reader.addEventListener("error", () => {
      reject(new Error("Could not read the selected file."));
    });

    reader.readAsDataURL(file);
  });
}
