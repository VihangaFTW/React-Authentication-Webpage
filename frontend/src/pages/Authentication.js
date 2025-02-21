import { redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export async function action({ request }) {
  // request is an object that contains information about the HTTP request, such as the URL, method, headers, and body
  // searchParams is an instance of URLSearchParams, which is a built-in JavaScript object that provides methods for working with the query string of a URL
  const searchParams = new URL(request.url).searchParams;
  // when the AuthenticationPage is loaded for the first time, there will be no mode search query parameter in the URL, so we set the default value to 'login'
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw new Response("Unsupported mode", { status: 422 });
  }

  const inputData = await request.formData();

  const authData = {
    email: inputData.get("email"),
    password: inputData.get("password"),
  };

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    body: JSON.stringify(authData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // these errors will be extracted and displayed on the login UI for better UX as these are issues with the user input
  if (response.status === 422 || response.status === 401) {
    return response;
  }
  // other errors will be thrown and extracted onto coresponding errorElement
  if (!response.ok) {
    throw new Response("Could not authenticate user", { status: 500 });
  }

  //TODO
  return redirect("/");
}

export default AuthenticationPage;
