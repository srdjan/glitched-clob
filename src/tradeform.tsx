import React from "react";
import { Form, Field, useForm } from "@leveluptuts/fresh";

const defaultValues: object = {
  user: "trader1",
  ticker: "TW",
  side: "Buy",
  limit: 100,
  quantity: 10,
};

type onSubmit = () => void

const TradeForm = ({ onSubmit }: {onSubmit: any}) => {
  const { data } = useForm();
  console.log(data);
  return (
    <div>
      <h3>Enter your trade:</h3>
      <Form
        formId="form"
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        cancelAction={()=> console.log('Cancelled')}
      >
        <Field>User</Field>
        <Field>Ticker</Field>
        <Field>Side</Field>
        <Field>Limit</Field>
        <Field>Quantity</Field>
      </Form>
    </div>
  );
};
export { TradeForm };