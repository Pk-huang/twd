import { useState,useEffect } from "react";

const Input = () => {




    const [formData, setFormData] = useState({
        fromCur: "TWD",   // value1
        fromAmt: "",      // value2
        toCur: "USD",     // value3
        toAmt: ""         // value4（通常由運算得出）
    });

    // 推薦：把更新封裝成純值的 API，而不是直接操作事件物件
    const update = (field, value) =>
        setFormData(prev => ({ ...prev, [field]: value }));


    useEffect(() => {
        // 只在值真的變時才 set，避免不必要 re-render
        setFormData(prev => (prev.toAmt === computedToAmt ? prev : { ...prev, toAmt: computedToAmt }));
    }, [computedToAmt]);



    return (
        <>
            <section className="pt-5 pb-3 section-input" >
                <div className="row justify-content-center align-items-center ">

                    <div className="col-5 d-flex justify-content-center align-items-start flex-column p-lg-5 ">
                        <h3>Unit conversion</h3>
                        <select name="valueOne" id="" className="form-select my-3" onChange={handleChange} value={inputCurrency.currencyValue}>

                            {/* value 1  */}
                            <option value="TWD">TWD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="JPY">JPY</option>


                        </select>
                        {/* value 2  */}
                        <input type="text" name="" id="" className="form-control" placeholder="Enter amount p-lg-5" />
                    </div>

                    <div className="col-5 d-flex justify-content-center align-items-start flex-column ">
                        <h3>Unit conversion</h3>
                        <select name="" id="" className="form-select my-3">
                            {/* value 3  */}
                            <option value="TWD">TWD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="JPY">JPY</option>
                        </select>

                        {/* value 4  */}
                        <input type="text" name="" id="" className="form-control" placeholder="Enter amount " />
                    </div>

                </div>
            </section>
        </>
    )
}


export default Input;