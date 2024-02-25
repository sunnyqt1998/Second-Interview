export interface iTransaction {
    "_id": string;
    "direction": string;
    "description":string;
    "accountId": string;
    "_revalTransaction": boolean;
    "_quantity": object;
    "_valuation":object;
    "_transactionDate": string | object;
    "category":string;
    "classifications": string[];
  }