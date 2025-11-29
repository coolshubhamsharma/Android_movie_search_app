//Promise<T> It lets the hook return any data type you decide — string, number, array, object, etc.

import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunction:() => Promise<T>, autoFetch = true)=>{

    const [data,setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData =  async ()=>{
        try{
            setLoading(true);
            setError(null);

            const results = await fetchFunction(); //calling the function passed under useFetch() from a component/page

            setData(results);

        }
        catch(err){
            setError(err instanceof Error ? err : new Error('An Error Occured'));  //if an error is instanceof error then i would forward the error else retun this
        }
        finally{
            setLoading(false);
        }
    }

    const reset = ()=>{
        setData(null);
        setLoading(false);
        setError(null);
    }

    useEffect(()=>{
        
        if(autoFetch){
            fetchData();
        }

    },[]);

    return {data, loading, error, refetch: fetchData, reset};
    //returning data to display it 
}

export default useFetch