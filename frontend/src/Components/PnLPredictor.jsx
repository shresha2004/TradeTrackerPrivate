import React,{useState}  from "react";

const PnLPredictor = ()=>{
    const [symbol, setSymbol] = useState('')
    const [prediction,setPrediction]=useState(null)
    const [error,setError] = useState('')

    const handlePredictor = async()=>{
        setError('');
        setPrediction(null);
        try{
        const response = await fetch("http://127.0.0.1:5000/predict",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({symbol}),
        })
        const data = await response.json();

        if(response.ok){
            setPrediction(data);
        }
        else{
            setError(data.error||'Prediction failed.');
        }
    } catch(err){
        setError('Server not reachable.')
    }

    }
    return(
        <>
        <div className="card =-4 m-4 shadow rounded" style={{maxWidth:'500ox'}}>
            <h3>P&L Predictor</h3>
            <input type="text" 
            className="form-control my-2" 
            placeholder="Enter stock symbol (e.r, RELIANCE.NS)"  
            value={symbol} onChange={(e)=> setSymbol(e.target.value)} />
            <button className="btn btn-primary" onClick={handlePredictor}>
            Predict 5 day return 
            </button>
            {
                prediction && (
                    <div className="alert alert-success mt-3">
                        <strong>{prediction.symbol}:</strong> Predicted return in 5 days is <strong>{prediction.predicted_return_5d}%</strong>
                        </div>
                )
            }
            {error && <div className="alert alert-danger mt-3">{error}</div>
           
        }
        </div>
        </>
    )
}

export  default PnLPredictor;