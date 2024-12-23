type PayloadType = {
  id: number;
  username: string;
  role: 'owner' | 'waiter' | 'admin';
  email: string;
  icon: string | null;
};

export default PayloadType;
