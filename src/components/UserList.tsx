"use client";
import { List, Datagrid, TextField, NumberField, ArrayField, SingleFieldList, ChipField } from "react-admin";

export default function UserList() {
  return (
    <List resource="users">
      <Datagrid rowClick="show">
        <TextField source="id" label="User ID" />
        <TextField source="name" label="Name" />
        <TextField source="email" label="Email" />
        <TextField source="phone" label="Phone" />
        <NumberField source="walletBalance" label="Wallet Balance (₹)" />

        <ArrayField source="transactions" label="Transactions">
          <SingleFieldList>
            <ChipField source="transactionId" />
          </SingleFieldList>
        </ArrayField>

        <ArrayField source="boughtProducts" label="Purchased Products">
          <SingleFieldList>
            <ChipField source="productName" />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
    </List>
  );
}
