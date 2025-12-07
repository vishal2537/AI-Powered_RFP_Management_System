import axios from "axios";
export const API_URL = "http://localhost:8800";

export const emailLogin = async (data) => {
  try {
    const result = await axios.post(`${API_URL}/auth/login`, data);
    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);
    return err;
  }
};

export const emailSignUp = async (data) => {
  try {
    const result = await axios.post(`${API_URL}/auth/signup`, data);
    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);
    return err;
  }
};

export const addVendor = async (data,token) => {
  try {
      const res = await axios.post(`${API_URL}/user/addVendor`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    return res?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log("Add Vendor Error:", err);
    return err;
  }
};

export const getVendorsByUser = async (userId,token) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}/vendors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log("Get Vendors Error:", err);
    return err;
  }
};

export const addRfp = async (data,token) => {
  try {
    const res = await axios.post(`${API_URL}/rfps/addRfp`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const getRfpsByUser = async (userId,token) => {
  try {
    const res = await axios.get(`${API_URL}/rfps/allRfpsByUserId/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const sendMailToVendors = async (data, token) => {
  try {
    const res = await axios.post(`${API_URL}/rfps/sendMail`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    const error = err.response?.data || err.response;
    console.log("Send Mail Error:", error);
    return error;
  }
};


  export const checkForAllRFP = async (data, token) => {
    try {
      const res = await axios.post(`${API_URL}/rfps/checkForAllRFP`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      const error = err.response?.data || err.response;
      console.log("Check For All RFP Error:", error);
      return error;
    }
  };


export const getAllRfpVendorDetails = async (userId, token) => { 
  try {
    const res = await axios.get(
      `${API_URL}/rfps/getAllRfpVendorDetails/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    const error = err.response?.data || err.response;
    console.log("Check For All RFP Error:", error);
    return error;
  }
}
