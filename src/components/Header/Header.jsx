import { Link } from "react-router-dom";
import Logo from "../Logo/Logo.jsx";
import Button from "../UI/buttons/Button.jsx";
import css from "./Header.module.css";
import { useState } from "react";

const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  const addButton = {
    display: "flex",
    justifyContent: "space-between",
    columnGap: "10",
    padding: "10px 16px",
    minWidth: "190px",
    height: "40px",
    color: "var(--additional-text)",
  };

  return (
    <header className={css.header}>
      <div className={`container ${css.headerСontainer}`}>
        <Logo className={css.logo} />
        <div className={css.headerWrap}>
          <button className={css.burgerBtn} onClick={toggleMenu}>
            {menuIsOpen ? (
              <img
                className={css.closeIcon}
                src="/public/close@2x.png"
                width={32}
                height={32}
                alt="Close"
              />
            ) : (
              <img
                className={css.burgerIcon}
                src="/public/burger@2x.png"
                width={32}
                height={32}
                alt="Burger"
              />
            )}
          </button>
          <div className={css.userSettings}>
            <Link to="/my-profile">
              <div className={css.userIcon}>👤</div>
            </Link>
            <p className={css.userName}>Ім'я</p>
            <div className={css.settingsIcon}>⚙️</div>
          </div>

          <Button
            size="sm"
            variant="primary"
            disabled={false}
            withArrow={false}
            style={addButton}
          >
            <span>Додати світлину</span>
            <img src="/public/Plus@2x.png" width={20} height={20} alt="Plus" />
          </Button>

          <input className={css.searchInput} placeholder={"🔍"} />

          {menuIsOpen ? (
            <nav className={css.sidebarOpen}>
              <div className={css.sidebarHeader}>
                <Link to="/my-profile" onClick={() => setMenuIsOpen(false)}>
                  <div className={css.userIcon}>👤</div>
                </Link>
                <p className={css.userName}>Ім'я</p>
                <div className={css.settingsIcon}>⚙️</div>
              </div>
              <ul className={css.sidebarList}>
                <li className={css.sidebarItem}>
                  <a href="#" className={css.sidebarLink}>
                    Світлини
                  </a>
                </li>
                <li className={css.sidebarItem}>
                  <a href="#" className={css.sidebarLink}>
                    Мій профіль
                  </a>
                </li>
                <li className={css.sidebarItem}>
                  <a href="#" className={css.sidebarLink}>
                    Про нас
                  </a>
                </li>
                {/* <li className={css.sidebarItem}>
                <a href="#" className={css.sidebarLink}>
                  Користувачі
                </a>
              </li> */}
              </ul>
            </nav>
          ) : (
            <nav className={css.sidebar} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
