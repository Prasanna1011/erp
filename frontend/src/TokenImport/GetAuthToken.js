const GetAuthToken = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"))
  if (!authUser || !authUser.data.token) {
    console.log("Token not found in localStorage")
    return null
  }

  const config = {
    headers: {
      Authorization: `token ${authUser.data.token}`, 
    },
  }

  return config
}

export default GetAuthToken

export const getUsername = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"))
  return authUser
}
