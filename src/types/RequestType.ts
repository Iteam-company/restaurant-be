import PayloadType from './PayloadType';

type RequestType = Request & {
  user: PayloadType;
  imageUrl: string;
  fileData: string;
};

export default RequestType;
