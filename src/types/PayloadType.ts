type PayloadType = {
  id: number;
  username: string;
  role: 'owner' | 'waiter' | 'admin';
  email: string;
};

export default PayloadType;
