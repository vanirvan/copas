export type Webhook = {
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: string;
  timestamp: number;
  type: string;
};

export type UserCreatedWebhook = Webhook & {
  data: {
    email_addresses: {
      email_address: string;
      id: string;
    }[];
    first_name: string;
    id: string;
    last_name: string;
    primary_email_address_id: string;
    username: string;
  };
};

export type UserUpdatedWebhook = UserCreatedWebhook;

export type UserDeletedWebhook = Webhook & {
  data: {
    deleted: boolean;
    id: string;
    object: string;
  };
};
