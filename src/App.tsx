import "./css/twd.css"
import Navbar from './compent/nav.tsx'
import Input from "./compent/input"
// import { useEffect } from "react"
// import { getLatest } from "./services/ratesLatest.ts"
// import { getTimeseries } from "./services/ratesTimeseries.ts"


const App = () => {

  // let container: object = {}

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getLatest('TWD', ['USD', 'JPY', 'CNY']);
  //       console.log('data', data, "typp of data", typeof data);
  //       container = data
  //       console.log('container', container, "typp of container", typeof container);
  //       return data

  //     } catch (error) {
  //       console.error('Error fetching exchange rates:', error);
  //     }
  //   };


  //   fetchData();
  // }, []);







  return (
    <>
      <Navbar />
      < main >
        <div className="container mt-lg-5 mt-md-3 mt-sm-1">
          <Input />
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
