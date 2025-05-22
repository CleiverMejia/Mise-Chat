import { Timestamp } from "firebase/firestore";
import { TypeMessage } from "@enums/typeMessage.enum";

export interface Message {
  mid?: string;
  uid: string;
  content: string;
  type: TypeMessage;
  date: Timestamp;
}