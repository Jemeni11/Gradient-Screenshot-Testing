import { toast } from "sonner";

function unsecuredCopyToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  let successful = false;
  try {
    successful = document.execCommand("copy");

    if (!successful) {
      console.error("Unsecured clipboard copy failed");
    }
  } catch (err) {
    console.error("Failed to copy content to clipboard", err);
  } finally {
    document.body.removeChild(textArea);
  }

  return successful;
}

export default function copyToClipboard(content: string, successMessage?: string): void {
  const defaultMessage = "Copied to clipboard!";
  const message = successMessage || defaultMessage;

  if (window.isSecureContext && navigator?.clipboard?.writeText) {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success(message, {
          description: content,
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy content to clipboard", err);
        toast.error("Failed to copy to clipboard", {
          description: "Please try again",
          duration: 3000,
        });
      });
  } else {
    const success = unsecuredCopyToClipboard(content);
    if (success) {
      toast.success(message, {
        description: content,
        duration: 3000,
      });
    } else {
      toast.error("Failed to copy to clipboard", {
        description: "Please try again",
        duration: 3000,
      });
    }
  }
}
