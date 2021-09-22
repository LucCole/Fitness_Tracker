// // logIn - which sets the token in localStorage
// // logOut - which clears the token in localStorage
// // isLoggedIn - which lets you know if there's a current user logged in

// // ----- Loging (in/out/etc) -----

// export const logIn = (token, setToken, history) => {
//     localStorage.setItem('st-token', token);
//     setToken(token);
//     history.push('/');
// }

// export const logOut = (setToken, setUserData) => {
//     localStorage.removeItem('st-token');
//     setToken('');
//     setUserData({});
// }

// export const isLoggedIn = (userData) => {
//     return userData.username !== undefined;
// }

// // ----- Users ----- 

// export const userToken = () => {
//     return localStorage.getItem('st-token');
// }
