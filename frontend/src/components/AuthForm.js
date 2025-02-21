import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  // useSearchParams is a hook that returns an array with two elements: the first element is a URLSearchParams object, and the second element is a function to update the search parameters
  const [searchParams] = useSearchParams();

  // get method is used to get the value of the 'mode' parameter from the URL
  const isLogin = searchParams.get("mode") === "login";

  const serverResponse = useActionData();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        {/* 422 status error handling */}
        {serverResponse?.errors && (
          <ul>
            {Object.values(serverResponse.errors).map((msg) => (
              <li>{msg}</li>
            ))}
          </ul>
        )}
        {/* 404 status error handling */}
        {serverResponse?.message && <p>{serverResponse.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
