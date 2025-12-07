export const saveUserInfo = (user, signIn) => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({ user: user?.user, token: user.token })
  );
  signIn({ user: user?.user, token: user.token });
  setTimeout(() => {
    window.history.back();
  }, 1500);
};
