
export const  parseCookie:any  = async(cookieHeader:string,findCookie:string)=>{
    if(cookieHeader){
        
            // Split the cookie header into individual cookie key-value pairs
            const cookies = cookieHeader.split('; ');
            
            // Initialize a variable to store the desired cookie value
            let getCookie;

            // Iterate through the cookies and find the one with the desired name (e.g., "signInToken")
            for (const cookie of cookies) {
                const [name, value] = cookie.split('=');
                if (name === findCookie) {
                  // SIGNED COOKIES WON'T WORK HERE SINCE IT'S NOT GOING THROUGH COOKIEPARSER MIDDLEWARE
                    getCookie = value;
                    console.log("Cookies set in new request")
                    console.log(getCookie)
                    break; // Exit the loop once the desired cookie is found
                }
            }
    
            // Now you can access the "signInToken" cookie value
            if (getCookie) {
                return getCookie
            } else {
                console.log('signInToken not found');
            }
        } else {
            console.log('No cookies in the request');
        }
        return null;
}

export const  parseCookies = (cookieHeader:string)=>{
  const cookies: { [key: string]: string } = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const key = parts[0].trim();
      const value = parts[1];
      cookies[key] = value;
    });
  }
  return cookies;
}
