import PayloadType from './PayloadType';

type RequestType = Request & { user: PayloadType; imageUrl: string };

export default RequestType;
