import { Formik, Form, Field } from "formik";
import css from "./ProfileEditForm.module.css";
import Input from "../common/inputs/Input.jsx";
import Button from "../common/buttons/Button.jsx";
import { ProfileEditSchema } from "../../validation/schemas.js";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/auth/operations.js";
import { FaPenToSquare } from "react-icons/fa6";
import { useRef, useState } from "react";
import def from "../../assets/images/EditProfilPage/AvatarDef.png";

const ProfileEditForm = ({ user }) => {
  console.log("User inside ProfileEditForm:", user);

  const normalize = (value) =>
    typeof value === "string" ? value : value ? String(value) : "";

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0]; //YYYY-MM-DD
  };
  
  const INITIAL_VALUES = {
    avatar: user?.img_link ?? def,
    name: normalize(user?.name),
    // username: normalize(user?.username),
    email: normalize(user?.email),
    phone: normalize(user?.phone),
    password: "",
    birthdate: formatDateForInput(user?.birthdate),
    description: normalize(user?.description),
  };

  // const INITIAL_VALUES = {
  //   avatar: user?.image_url ?? def,
  //   name: user?.name ?? "",
  //   email: user?.email ?? "",
  //   phone: user?.phone ?? "",
  //   password: "",
  //   birthdate: user?.birthdate ?? "",
  //   description: user?.description ?? "",
  // };

  const dispatch = useDispatch();
  const [avatarSrc, setAvatarSrc] = useState(INITIAL_VALUES.avatar || def);
  const fileInputRef = useRef(null);

  const handleImageError = () => {
    setAvatarSrc(def);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarSrc(imageUrl);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={INITIAL_VALUES}
        enableReinitialize
        validationSchema={ProfileEditSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const formData = new FormData();
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              if (isNaN(date)) return "";
              return date.toISOString().split("T")[0];
            };
        
            Object.entries(values).forEach(([key, value]) => {
              if (key === "birthdate") {
                formData.append(key, formatDate(value));
              } else if (key !== "avatar") {
                formData.append(key, value);
              }
            });
        
            if (fileInputRef.current?.files[0]) {
              formData.append("avatar", fileInputRef.current.files[0]);
            }
        
            const updatedUser = await dispatch(updateUser(formData)).unwrap();
        
            setAvatarSrc(updatedUser.img_link || def);
        
            const newValues = {
              avatar: updatedUser.img_link ?? def,
              name: normalize(updatedUser.name),
              username: normalize(updatedUser.username),
              email: normalize(updatedUser.email),
              phone: normalize(updatedUser.phone),
              password: "",
              birthdate: formatDateForInput(updatedUser.birthdate),
              description: normalize(updatedUser.description),
            };
        
            resetForm({ values: newValues });
            console.log("Форма оновлена:", newValues);
          } catch (err) {
            console.error("Помилка оновлення:", err);
          }
        }}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className={css.form}>
            <div className={css.avatarWrap}>
              <img
                className={css.avatarImg}
                src={avatarSrc}
                alt="Аватар"
                onError={handleImageError}
              />
              <button type="button" className={css.editBtn} onClick={handleEditClick}>
                {/* <svg width="16" height="16">
            <use href="/public/sprite.svg#pen" />
          </svg> */}
                <FaPenToSquare size={22} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <hr className={css.divider} />

            <p className={css.title}>Особисті данні</p>
            <div className={css.wrapInfo}>
              <div className={css.infoItem}>
                <Field name="name">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Імʼя"
                      error={meta.touched && meta.error}
                      errorMessage={
                        meta.touched && meta.error ? meta.error : ""
                      }
                    />
                  )}
                </Field>
              </div>

              <div className={css.infoItem}>
                <Field name="username">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="UserName"
                      error={meta.touched && meta.error}
                      errorMessage={
                        meta.touched && meta.error ? meta.error : ""
                      }
                    />
                  )}
                </Field>
              </div>

              <div className={css.infoItem}>
                <Field name="email">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Електронна пошта"
                      error={meta.touched && meta.error}
                      errorMessage={
                        meta.touched && meta.error ? meta.error : ""
                      }
                    />
                  )}
                </Field>
              </div>

              <div className={css.infoItem}>
                <Field name="phone">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Номер телефону"
                      error={meta.touched && meta.error}
                      errorMessage={
                        meta.touched && meta.error ? meta.error : ""
                      }
                    />
                  )}
                </Field>
              </div>

              <div className={css.infoItem}>
                <Field name="birthdate">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      type="date"
                      placeholder="День народження"
                      error={meta.touched && meta.error}
                      errorMessage={
                        meta.touched && meta.error ? meta.error : ""
                      }
                    />
                  )}
                </Field>
              </div>

              <div className={css.infoItem}>
                <Field name="password">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="Пароль"
                      error={meta.touched && meta.error}
                      errorMessage={
                        meta.touched && meta.error ? meta.error : ""
                      }
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className={css.wrapAdditionalInfo}>
              <p className={css.title}>Додаткові данні</p>
              {/* <textarea
                className={css.textarea}
                placeholder="Додаткові данні"
                rows="5"
              /> */}
              <Field name="description">
                {({ field, meta }) => (
                  <>
                    <textarea
                      {...field}
                      className={css.textarea}
                      placeholder="Додаткові данні"
                      rows="5"
                    />
                    {meta.touched && meta.error && (
                      <div className={css.error}>{meta.error}</div>
                    )}
                  </>
                )}
              </Field>
            </div>

            <div className={css.wrapBtn}>
              <Button
                size="lg"
                variant="secondary"
                type="reset"
              >
                Скинути
              </Button>

              <Button
                size="lg"
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Застосувати Зміни
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEditForm;
