async function login(email, password){
    var params = window.btoa(`${email.value}:${password.value}`);
      try {
        const rawPromise = fetch('http://localhost:8080/api/v1/auth/login',{
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              "authorization" : `Basic ${params}`
            }
        })
        const rawResponse = await rawPromise;
        result = await rawResponse.json();
        
      if(rawResponse.ok){
          window.sessionStorage.setItem('user-details', JSON.stringify(result));
          window.sessionStorage.setItem('token-details', JSON.stringify(rawResponse.headers.get("access-token")));
          window.localStorage.setItem('user-details', JSON.stringify(result));  
          window.location.href = "./boards.html";
      }else{
          const error = new Error();
          error.message = error.message ?  error.message : "something happened";
          throw error;
      }

      } catch (error) {
          
      }
}