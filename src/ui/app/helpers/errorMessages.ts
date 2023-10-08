
export function getSignerOperationErrorMessage(error: unknown) {
  return (
    getXdagApplicationErrorMessage(error) ||
    (error as Error).message ||
    "Something went wrong."
  );
}


export function getXdagApplicationErrorMessage(error: any) {
  return "Make sure the Xdag app is open on your device.\n"+error.toString();
}
