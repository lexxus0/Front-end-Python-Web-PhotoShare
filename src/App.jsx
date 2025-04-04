import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./index.css";
import Layout from "./Layout";
import UsersManagementPage from "./pages/UsersManagement/UsersManagementPage.jsx";
import Loader from "./components/UI/loader/Loader.jsx";

export default function App() {
  const MainPage = lazy(() => import("./pages/main/MainPage.jsx"));
  const ProfilePage = lazy(() => import("./pages/profile/ProfilePage.jsx"));
  const SignInPage = lazy(() => import("./pages/SignInPage/SignInPage.jsx"));
  const SignUpPage = lazy(() => import("./pages/SignUpPage/SignUpPage.jsx"));
  const ViewPublicationPage = lazy(() =>
    import("./pages/view/ViewPublicationPage.jsx")
  );

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />

        <Route element={<Layout />}>
          <Route index element={<Navigate to="/posts" replace />} />
          <Route path="posts" element={<MainPage />} />
          <Route path="posts/view" element={<ViewPublicationPage />} />
          <Route path="my-profile" element={<ProfilePage />} />
          <Route path="admin/users" element={<UsersManagementPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
