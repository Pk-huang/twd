const listItem = () => {
    return (
        <li className="my-lg-3 my-md-1">
            <div className="card ">
                <div className="card-body row p-lg-5 p-md-2">
                    <div className="col-3 d-flex justify-content-center align-items-center">
                        <h3 className="card-title">TWD</h3>
                    </div>

                    <div className="col-3 ">
                        <ul className="list-unstyled">
                            <li className="my-2">
                                <span className="fw-bold">USD</span>
                                <span className="float-end">0.032</span>
                            </li>
                            <li className="my-2">
                                <span className="fw-bold">EUR</span>
                                <span className="float-end">0.029</span>
                            </li>
                            <li className="my-2">
                                <span className="fw-bold">JPY</span>
                                <span className="float-end">4.35</span>
                            </li>
                            <li className="my-2">
                                <span className="fw-bold">JPY</span>
                                <span className="float-end">4.35</span>
                            </li>

                        </ul>

                    </div>
                    <div className="col text-center   d-flex flex-column justify-content-center align-items-center">
                        <h2>
                            依照當前匯率計算
                        </h2>
                        <h3>USD 5.5</h3>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default listItem;