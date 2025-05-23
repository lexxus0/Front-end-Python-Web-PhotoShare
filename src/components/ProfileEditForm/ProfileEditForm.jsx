import { Formik, Form, Field } from "formik";
import css from "./ProfileEditForm.module.css";
import LabeledField from "../common/labeledField/LabeledField.jsx";
import Button from "../common/buttons/Button.jsx";
import { ProfileEditSchema } from "../../validation/schemas.js";
import { FaPenToSquare } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import def from "../../assets/images/EditProfilPage/AvatarDef.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { getUser, updateUser } from "../../store/auth/operations.js";

const normalize = (value) =>
  typeof value === "string" ? value : value ? String(value) : "";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const parsed = new Date(dateString);
  return isNaN(parsed) ? "" : format(parsed, "dd-MM-yyyy");
};

const ProfileEditForm = ({ user }) => {
  const dispatch = useDispatch();

  const INITIAL_VALUES = {
    avatar: user?.img_link ?? def,
    name: normalize(user?.name),
    email: normalize(user?.email),
    phone: normalize(user?.phone),
    password: "",
    birthdate:
      user?.birthdate && !isNaN(new Date(user.birthdate).getTime())
        ? format(new Date(user.birthdate), "dd-MM-yyyy")
        : "",
    description: normalize(user?.description),
  };

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

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

  const CustomDatePicker = ({ field, form, meta }) => {
    const selectedDate = (() => {
      if (!field.value) return null;
      const parsed = parse(field.value, "dd-MM-yyyy", new Date());
      return isNaN(parsed) ? null : parsed;
    })();

    return (
      <div className={css.datePickerWrap}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            const formattedDate = date ? format(date, "dd-MM-yyyy") : "";
            form.setFieldValue(field.name, formattedDate);
          }}
          dateFormat="dd-MM-yyyy"
          placeholderText="День народження"
          className={`${css.input} ${
            meta.touched && meta.error ? css.error : ""
          }`}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        {meta.touched && meta.error && (
          <div className={css.errorMsg}>{meta.error}</div>
        )}
      </div>
    );
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

            Object.entries(values).forEach(([key, value]) => {
              if (key === "birthdate" && value) {
                const parsed = parse(value, "dd-MM-yyyy", new Date());
                if (!isNaN(parsed)) {
                  formData.append(key, format(parsed, "yyyy-MM-dd"));
                }
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
              email: normalize(updatedUser.email),
              phone: normalize(updatedUser.phone),
              birthdate: formatDateForInput(updatedUser.birthdate),
              description: normalize(updatedUser.description),
            };

            resetForm({ values: newValues });

            toast.success("Профіль було оновлено!");
          } catch (err) {
            toast.error("Не вдалося оновити профіль. Спробуйте ще раз.");
            console.error("Помилка оновлення:", err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.avatarWrap}>
              <img
                className={css.avatarImg}
                src={avatarSrc}
                alt="Аватар"
                onError={handleImageError}
              />
              <button
                type="button"
                className={css.editBtn}
                onClick={handleEditClick}
              >
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
                <LabeledField
                  name="name"
                  label="Імʼя"
                  type="text"
                  placeholder="Імʼя"
                />
              </div>

              <div className={css.infoItem}>
                <LabeledField
                  name="email"
                  label="Електронна пошта"
                  type="email"
                  placeholder="Електронна пошта"
                />
              </div>

              <div className={css.infoItem}>
                <LabeledField
                  name="phone"
                  label="Номер телефону"
                  type="text"
                  placeholder="Номер телефону"
                />
              </div>

              <div className={css.infoItem}>
                <LabeledField
                  name="birthdate"
                  label="День народження"
                  customComponent={CustomDatePicker}
                />
              </div>

              <div className={css.infoItem}>
                <LabeledField
                  name="password"
                  label="Пароль"
                  type="password"
                  placeholder="Пароль"
                />
              </div>
            </div>

            <div className={css.wrapAdditionalInfo}>
              <p className={css.title}>Додаткові данні</p>

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
              <Button size="lg" variant="secondary" type="reset">
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
