function getUserId() {
    console.log("User id being loaded: " + sessionStorage.getItem("userId"))
    return sessionStorage.getItem("userId")
}

function isAdmin() {
    console.log("Is admin? " + sessionStorage.getItem("isAdmin"))
    return sessionStorage.getItem("isAdmin")
}