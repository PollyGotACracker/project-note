export const getUserData = async () => {
  const res = await fetch(`/user/get`).then((data) => data.json());
  if (res.error) {
    console.log(res.error);
    return false;
  }
  if (res.data) return res.data;
};
