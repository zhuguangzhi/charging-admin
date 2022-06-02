
export const read = (key:string) =>{
    const data:string = localStorage.getItem(key) || ""
    // console.log("data",data)
    if (data!==""){
        return JSON.parse(data)
    }
    else return {}
}

export const write =(key:string, data:any)=>{
    return localStorage.setItem(key, JSON.stringify(data))
}

export const  remove =(key:string)=> {
    return localStorage.removeItem(key)
}

export const clearAll =()=>{
    return localStorage.clear()
}
