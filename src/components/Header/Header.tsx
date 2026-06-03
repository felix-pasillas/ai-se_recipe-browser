import Logo from "../../assets/logo.svg";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <img className="header__logo" src={Logo} alt="Recipe Browser logo" />
      </div>
    </header>
  );
}

export default Header;
