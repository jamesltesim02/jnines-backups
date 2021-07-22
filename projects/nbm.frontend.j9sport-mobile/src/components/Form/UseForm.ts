import { useRef } from "react";
import FormStore from "./FormStore";

export default function useForm(form?: any) {
  const formRef = useRef<any>()
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    }else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }
  return [formRef.current];
}