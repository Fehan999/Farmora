export function authMessage(err) {
  const code = err?.code || "";
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/operation-not-allowed": "Email/password sign-in is not enabled in Firebase yet. Use a demo account for now.",
    "auth/configuration-not-found": "Account sign-up is not available yet. Please explore with a demo account for now.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    timeout: "The request timed out. Please try again.",
  };
  return map[code] || err?.message || "Something went wrong.";
}
