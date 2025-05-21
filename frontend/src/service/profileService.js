import { myAxios } from "./helper";

export const getProfileByWallet = (walletAddress, role = "freelancer") => {
  return myAxios
    .get(`/profile/${walletAddress}?role=${role}`)
    .then((res) => res.data);
};

export const updateClientProfile = (payload) => {
  return myAxios
    .put(`/profile/client/update`, payload)
    .then((response) => response.data);
};

export const updateFreelancerProfile = (payload) => {
  return myAxios
    .put(`/profile/freelancer/update`, payload)
    .then((response) => response.data);
};
