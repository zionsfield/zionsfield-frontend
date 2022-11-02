import React, { useState } from "react";
import axios from "axios";
import { http } from "../utils/api";

interface UseRequest {
  url: string;
  method: string;
  body?: any;
  onSuccess?: (data?: any) => void;
}

const useRequest = ({ url, method, body, onSuccess }: UseRequest) => {
  const [errors, setErrors] = useState<any[]>([]);

  const doRequest = async (props = {}, extUrl = "", isFd = false) => {
    try {
      setErrors([]);
      // @ts-ignore
      const res = await http[method](
        url + extUrl,
        // @ts-ignore
        isFd ? props : { ...body, ...props }
      );
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (err: any) {
      console.log(err);
      setErrors(err.response?.data?.errors);
    }
  };

  return { doRequest, errors };
};
export default useRequest;
