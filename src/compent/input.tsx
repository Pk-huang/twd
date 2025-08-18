

const Input = ()=>{

    return (
    <>
             <section className="pt-5 pb-3 section-input" >
                <div className="row justify-content-center align-items-center ">
         
                    <div className="col-5 d-flex justify-content-center align-items-start flex-column p-lg-5 ">
                        <h3>Unit conversion</h3>
                        <select name="" id="" className="form-select my-3">
                            <option value="TWD">TWD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="JPY">JPY</option>
                        </select>

                        <input type="text" name="" id="" className="form-control" placeholder="Enter amount p-lg-5" />
                    </div>

                    <div className="col-5 d-flex justify-content-center align-items-start flex-column ">
                        <h3>Unit conversion</h3>
                        <select name="" id="" className="form-select my-3">
                            <option value="TWD">TWD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="JPY">JPY</option>
                        </select>

                        <input type="text" name="" id="" className="form-control" placeholder="Enter amount " />
                    </div>
                  
                </div>
            </section>
    </>
    )
}

export default Input;