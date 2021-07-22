import React from "react";
import useForm from "./UseForm";
import FieldContext from "./FieldContext";

export default function (
  {
    children,
    form,
    onFinish,
    onFinishFailed = () => {},
    onChange = () => {}
  }: {
    children: JSX.Element | JSX.Element[],
    form: any,
    onFinish: Function,
    onFinishFailed?: Function,
    onChange?: Function
  }
) {
  const [formInstance] = useForm(form)

  formInstance?.setCallback({
    onFinish,
    onFinishFailed,
    onChange
  })

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        formInstance?.submit();
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}