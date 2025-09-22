import { errorconfig } from '@/config/errorConfig';
import toast from 'react-hot-toast';

export const HandelError = (error: any, transactionName: string,defaultmessage:string) => {
  let message = defaultmessage;
  const data = error?.error?.data;
  message = errorconfig[data]?.message

  if (!message) {
    toast.error("Transaction failed: Something went wrong", {
      id: transactionName,
    });
  } else {
    toast.error(`Transaction failed: ${message}`, {
      id: transactionName,
    });
  }
}
