import "./css/twd.css"
import Navbar from './compent/nav.tsx'
import Input from "./compent/input"


const App = () => {
  return (
    <>
      <Navbar/>
      < main >
        <div className="container mt-lg-5 mt-md-3 mt-sm-1">
         <Input/>
          <section>
            <ul className="list-unstyled row flex-wrap justify-content-between">

            </ul>
          </section>

        </div>
      </main >
      <footer>

      </footer>
    </>
  )
}


export default App
