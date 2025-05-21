import { myAxios } from "./helper";

export const getProfileByWallet = (wallet_address) => {
  return myAxios.get(`/profile/${wallet_address}`).then((response) => response.data);
};

export const updateClientProfile = (payload) => {
  return myAxios.put(`/profile/client/update`, payload).then((response) => response.data);
};

export const updateFreelancerProfile = (payload) => {
  return myAxios.put(`/profile/freelancer/update`, payload).then((response) => response.data);
};
