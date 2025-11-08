import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg  border-3">
                    <div className="container">
                        <a className="navbar-brand" href="#">Navbar</a>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <ThemeToggleButton />
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar;