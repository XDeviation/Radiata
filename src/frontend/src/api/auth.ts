const clientID = "dcc1db3a4a9ef1f4ad03";
const URL = process.env.URL || "http://localhost:3000";
export const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    console.log(URL);
    window.open(
      "https://github.com/login/oauth/authorize?client_id=" +
        clientID +
        `&redirect_uri=${URL}/oauth/redirect`,
      "_self"
    );
    // fetch();
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export async function getGithubUserName(code = "") {
  // Default options are marked with *

  const url = `/api/user_info?code=${code}`;
  const user_info = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return user_info;
}
