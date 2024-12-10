import PayloadType from './PayloadType';

type RequestType = Request & { user: PayloadType };

export default RequestType;
